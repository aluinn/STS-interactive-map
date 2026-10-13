import { newId, sanitiseFileName, stripControl } from '../analysis/text'
import {
  DEFAULT_LIMITS,
  ImportError,
  type ExtractedDocument,
  type FileKind,
  type ImportLimits,
} from '../types'
import { extractPdf } from './pdf'
import { plainTextToPages } from './plainText'

/** Reads the first bytes of a file so its type can be checked by content. */
async function head(file: File, n = 4096): Promise<Uint8Array> {
  return new Uint8Array(await file.slice(0, n).arrayBuffer())
}

function startsWithPdfHeader(bytes: Uint8Array): boolean {
  // The header may follow a few bytes of junk, but must be near the start.
  const text = new TextDecoder('latin1').decode(bytes.slice(0, 1024))
  return text.includes('%PDF-')
}

function looksBinary(bytes: Uint8Array): boolean {
  let odd = 0
  for (const b of bytes) {
    if (b === 0) return true
    if (b < 9 || (b > 13 && b < 32)) odd++
  }
  return odd / Math.max(1, bytes.length) > 0.05
}

export interface FileCheck {
  kind: FileKind
  /** A reason to warn the user before starting (not a failure). */
  warning?: string
}

/** Checks extension, size and actual content. Throws ImportError if unusable. */
export async function checkFile(
  file: File,
  limits: ImportLimits = DEFAULT_LIMITS,
): Promise<FileCheck> {
  const name = sanitiseFileName(file.name)
  const ext = /\.([A-Za-z0-9]+)$/.exec(name)?.[1].toLowerCase() ?? ''
  if (ext === 'docx' || ext === 'doc') {
    throw new ImportError(
      'unsupported',
      `“${name}” is a Word document. Word files are not supported yet. Export it as PDF or paste the text into a .txt or .md file.`,
    )
  }
  if (!['pdf', 'txt', 'md', 'markdown'].includes(ext)) {
    throw new ImportError(
      'unsupported',
      `“${name}” is not a supported file type. Use a text-based PDF, .txt or .md file.`,
    )
  }
  if (file.size === 0) throw new ImportError('empty', `“${name}” is empty.`)
  if (file.size > limits.maxFileBytes) {
    throw new ImportError(
      'too-large',
      `“${name}” is ${(file.size / 1048576).toFixed(1)} MB, above the ${Math.round(limits.maxFileBytes / 1048576)} MB limit. Split it or import only the chapters you need.`,
    )
  }
  const bytes = await head(file)
  const isPdf = startsWithPdfHeader(bytes)
  if (ext === 'pdf' && !isPdf) {
    throw new ImportError('damaged', `“${name}” has a .pdf name but is not a PDF file.`)
  }
  if (ext !== 'pdf' && isPdf) {
    throw new ImportError(
      'unsupported',
      `“${name}” is a PDF with the wrong file extension. Rename it to .pdf and try again.`,
    )
  }
  if (ext !== 'pdf' && looksBinary(bytes)) {
    throw new ImportError('unsupported', `“${name}” does not look like a plain-text file.`)
  }
  return {
    kind: ext === 'pdf' ? 'pdf' : ext === 'txt' ? 'txt' : 'md',
    warning:
      file.size > limits.warnFileBytes
        ? `“${name}” is large (${(file.size / 1048576).toFixed(1)} MB). Processing may take a while; you can cancel at any time.`
        : undefined,
  }
}

async function sha256(buffer: ArrayBuffer): Promise<string> {
  try {
    const digest = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    // Non-secure contexts have no crypto.subtle: fall back to a cheap checksum.
    const view = new Uint8Array(buffer)
    let h = 2166136261
    for (let i = 0; i < view.length; i++) h = Math.imul(h ^ view[i], 16777619)
    return `fnv-${(h >>> 0).toString(16)}-${view.length}`
  }
}

function baseName(name: string): string {
  return (
    name
      .replace(/\.[A-Za-z0-9]+$/, '')
      .replace(/[_-]+/g, ' ')
      .trim() || name
  )
}

/** Reads one file in the browser and returns its text as numbered pages. */
export async function extractFile(
  file: File,
  onProgress: (done: number, total: number) => void,
  signal: AbortSignal,
  limits: ImportLimits = DEFAULT_LIMITS,
): Promise<ExtractedDocument> {
  const { kind } = await checkFile(file, limits)
  if (signal.aborted) throw new ImportError('cancelled', 'Cancelled.')
  const fileName = sanitiseFileName(file.name)
  const buffer = await file.arrayBuffer()
  const contentHash = await sha256(buffer)
  const fileId = newId('doc')
  const warnings: string[] = []

  if (kind === 'pdf') {
    const result = await extractPdf(new Uint8Array(buffer), fileName, limits, onProgress, signal)
    const totalChars = result.pages.reduce((n, p) => n + p.text.length, 0)
    // Fewer than ~25 characters a page on average means the pages are images, not text.
    const scanned = totalChars / Math.max(1, result.pages.length) < 25
    if (result.truncated) {
      warnings.push(`Only the first ${limits.maxPages} of ${result.pageCount} pages were read.`)
    }
    if (!scanned && result.emptyPages.length > 0) {
      warnings.push(
        `${result.emptyPages.length} page${result.emptyPages.length === 1 ? '' : 's'} had no readable text (possibly images or scans) and were skipped.`,
      )
    }
    const firstHeading = result.pages
      .flatMap((p) => p.text.split('\n\n'))
      .find((p) => p.startsWith('# '))
      ?.slice(2)
    return {
      fileId,
      fileName,
      title: stripControl(result.title ?? firstHeading ?? baseName(fileName)).slice(0, 200),
      kind,
      pageCount: result.pageCount,
      pages: result.pages,
      author: result.author,
      contentHash,
      method: 'pdf-text',
      warnings,
      scanned,
      truncated: result.truncated,
    }
  }

  const text = new TextDecoder('utf-8').decode(buffer)
  if (text.includes('�') && (text.match(/�/g)?.length ?? 0) > text.length * 0.01) {
    warnings.push('Some characters could not be read; the file may not be UTF-8 text.')
  }
  const { pages, firstHeading } = plainTextToPages(text, kind, limits.maxCharsPerPage)
  onProgress(1, 1)
  const totalChars = pages.reduce((n, p) => n + p.text.length, 0)
  if (totalChars === 0) throw new ImportError('empty', `“${fileName}” has no text in it.`)
  return {
    fileId,
    fileName,
    title: stripControl(firstHeading ?? baseName(fileName)).slice(0, 200),
    kind,
    pageCount: 1,
    pages,
    contentHash,
    method: kind === 'md' ? 'markdown' : 'plain-text',
    warnings,
    scanned: false,
    truncated: false,
  }
}
