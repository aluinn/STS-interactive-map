import type { TextItem } from 'pdfjs-dist/types/src/display/api'
import { stripControl } from '../analysis/text'
import { ImportError, type ImportLimits, type PageText } from '../types'

/**
 * Local PDF text extraction with PDF.js.
 *
 * The library and its worker are bundled with the app (nothing comes from a
 * CDN) and loaded only when a PDF is actually imported. PDF.js parses in its
 * own web worker, so large files do not freeze the interface. The document is
 * handed to PDF.js as bytes already in memory; no URL is ever fetched.
 */

export interface PdfResult {
  pages: PageText[]
  pageCount: number
  title?: string
  author?: string
  /** Pages (1-based) that contained no extractable text. */
  emptyPages: number[]
  truncated: boolean
}

let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null

/** Loads PDF.js on first use. Safe to call early to warm the cache. */
export function loadPdfjs(): Promise<typeof import('pdfjs-dist')> {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString()
      return lib
    })
    pdfjsPromise.catch(() => {
      pdfjsPromise = null
    })
  }
  return pdfjsPromise
}

type PdfWorker = InstanceType<(typeof import('pdfjs-dist'))['PDFWorker']>
let sharedWorker: PdfWorker | null = null

/**
 * Loads PDF.js and starts its worker. Called when the import panel opens, so
 * that everything a PDF import needs is already in the page before a file is
 * chosen (and the import then works even if the connection drops).
 */
export async function warmPdf(): Promise<PdfWorker> {
  const lib = await loadPdfjs()
  if (!sharedWorker || sharedWorker.destroyed) sharedWorker = lib.PDFWorker.create({ verbosity: 0 })
  await sharedWorker.promise
  return sharedWorker
}

interface Line {
  y: number
  x: number
  size: number
  text: string
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

/** Groups positioned text fragments into lines, top to bottom. */
function toLines(items: TextItem[]): Line[] {
  const lines: Line[] = []
  for (const it of items) {
    if (!it.str) continue
    const x = it.transform[4] as number
    const y = it.transform[5] as number
    const size = Math.abs(it.height || (it.transform[3] as number) || 0)
    const last = lines[lines.length - 1]
    const tolerance = Math.max(2, (last?.size ?? size) * 0.4)
    if (last && Math.abs(last.y - y) <= tolerance) {
      const needsSpace = !/\s$/.test(last.text) && !/^\s/.test(it.str)
      // A visible gap between fragments is a space; PDF.js often omits it.
      last.text += (needsSpace && x - last.x > Math.max(0.5, size * 0.12) ? ' ' : '') + it.str
      last.size = Math.max(last.size, size)
      last.x = x + (it.width || 0)
    } else {
      lines.push({ y, x: x + (it.width || 0), size, text: it.str })
    }
    if (it.hasEOL && lines.length) lines[lines.length - 1].x = Number.POSITIVE_INFINITY
  }
  return lines
    .map((l) => ({ ...l, text: l.text.replace(/\s+/g, ' ').trim() }))
    .filter((l) => l.text.length > 0)
}

/** Builds paragraphs, joining wrapped lines and marking headings by size. */
function linesToText(lines: Line[], bodySize: number): string {
  const out: string[] = []
  let para = ''
  let prev: Line | null = null
  const flush = () => {
    if (para.trim()) out.push(para.trim())
    para = ''
  }
  for (const line of lines) {
    const isHeading =
      bodySize > 0 &&
      line.size >= bodySize * 1.2 &&
      line.text.length <= 110 &&
      !/[.,;]$/.test(line.text)
    if (isHeading) {
      flush()
      out.push(`# ${line.text}`)
      prev = line
      continue
    }
    if (prev) {
      const gap = Math.abs(prev.y - line.y)
      const lineHeight = Math.max(prev.size, line.size, 1)
      if (gap > lineHeight * 1.7) flush()
    }
    if (para) {
      // Rejoin words split by a line-end hyphen.
      if (/[a-z]-$/.test(para) && /^[a-z]/.test(line.text)) para = para.slice(0, -1) + line.text
      else para += ` ${line.text}`
    } else para = line.text
    prev = line
  }
  flush()
  return out.join('\n\n')
}

function cleanMetaTitle(raw: unknown, fileName: string): string | undefined {
  if (typeof raw !== 'string') return undefined
  const t = stripControl(raw).trim().slice(0, 200)
  if (t.length < 3) return undefined
  if (/microsoft word|untitled|\.(docx?|pdf|tex|indd)$/i.test(t)) return undefined
  if (t.toLowerCase() === fileName.toLowerCase()) return undefined
  return t
}

export async function extractPdf(
  bytes: Uint8Array,
  fileName: string,
  limits: ImportLimits,
  onProgress: (done: number, total: number) => void,
  signal: AbortSignal,
): Promise<PdfResult> {
  const pdfjs = await loadPdfjs()
  const worker = await warmPdf().catch(() => undefined)
  if (signal.aborted) throw new ImportError('cancelled', 'Cancelled.')

  // PDF.js transfers the buffer to its worker, so give it a copy.
  const task = pdfjs.getDocument({
    data: bytes.slice(),
    ...(worker ? { worker } : {}),
    enableXfa: false,
    disableAutoFetch: true,
    disableStream: true,
    stopAtErrors: false,
    verbosity: 0,
  })
  const onAbort = () => void task.destroy()
  signal.addEventListener('abort', onAbort)

  try {
    let doc
    try {
      doc = await task.promise
    } catch (e) {
      if (signal.aborted) throw new ImportError('cancelled', 'Cancelled.')
      const name = (e as { name?: string })?.name ?? ''
      if (name === 'PasswordException') {
        throw new ImportError(
          'password',
          'This PDF is password-protected. Remove the password in your PDF viewer, save a copy, and import that.',
        )
      }
      throw new ImportError(
        'damaged',
        'This PDF could not be read. It may be damaged or in an unsupported format. Try opening and re-saving it in a PDF viewer.',
      )
    }

    const pageCount = doc.numPages
    const total = Math.min(pageCount, limits.maxPages)
    const truncated = pageCount > limits.maxPages
    const meta = await doc.getMetadata().catch(() => null)
    const info = (meta?.info ?? {}) as Record<string, unknown>

    const pageLines: Line[][] = []
    const sizes: number[] = []
    const emptyPages: number[] = []
    for (let n = 1; n <= total; n++) {
      if (signal.aborted) throw new ImportError('cancelled', 'Cancelled.')
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      const items = content.items.filter((i): i is TextItem => 'str' in i)
      const lines = toLines(items)
      const chars = lines.reduce((c, l) => c + l.text.length, 0)
      if (chars < 5) emptyPages.push(n)
      for (const l of lines) if (l.size > 0) sizes.push(l.size)
      pageLines.push(lines)
      page.cleanup()
      onProgress(n, total)
      // Give the interface a turn between pages.
      if (n % 4 === 0) await new Promise((r) => setTimeout(r, 0))
    }
    const bodySize = median(sizes)
    const pages: PageText[] = pageLines.map((lines, i) => ({
      page: i + 1,
      text: linesToText(lines, bodySize).slice(0, limits.maxCharsPerPage),
    }))
    return {
      pages,
      pageCount,
      title: cleanMetaTitle(info.Title, fileName),
      author:
        typeof info.Author === 'string'
          ? stripControl(info.Author).slice(0, 120) || undefined
          : undefined,
      emptyPages,
      truncated,
    }
  } finally {
    signal.removeEventListener('abort', onAbort)
    void task.destroy().catch(() => undefined)
  }
}
