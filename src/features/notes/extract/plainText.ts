import { stripControl } from '../analysis/text'
import type { PageText } from '../types'

/**
 * Turns .txt and .md notes into the same "pseudo-Markdown" the PDF extractor
 * produces: paragraphs separated by blank lines, headings prefixed with `# `.
 * Markup is flattened to text, never interpreted: links lose their URL, HTML
 * tags are removed and nothing is ever rendered as HTML.
 */

const NUMBERED_HEADING = /^(?:\d{1,2}(?:\.\d{1,2}){0,3}|[IVX]{1,5})[.)]?\s+\p{Lu}/u

function looksLikeHeading(line: string, prevBlank: boolean, nextBlank: boolean): boolean {
  const t = line.trim()
  if (t.length < 3 || t.length > 90) return false
  if (!prevBlank || !nextBlank) return false
  if (/[.!?,;]$/.test(t)) return false
  const words = t.split(/\s+/)
  if (NUMBERED_HEADING.test(t)) return true
  const letters = t.replace(/[^\p{L}]/gu, '')
  if (letters.length >= 4 && letters === letters.toUpperCase()) return true
  const capital = words.filter((w) => /^\p{Lu}/u.test(w) || w.length <= 3).length
  return words.length <= 10 && capital === words.length && words.length >= 2
}

/** Removes Markdown/HTML syntax but keeps `*italic*` and headings for title detection. */
function flattenMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>\n]{1,200}>/g, '')
    .replace(/!\[([^\]\n]*)\]\([^)\n]*\)/g, '$1')
    .replace(/\[([^\]\n]+)\]\([^)\n]*\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '')
    .replace(/\*\*([^*\n]+)\*\*/g, '$1')
}

export function plainTextToPages(
  raw: string,
  kind: 'txt' | 'md',
  maxCharsPerPage: number,
): { pages: PageText[]; firstHeading?: string } {
  let text = stripControl(raw.replace(/\r\n?/g, '\n').replace(/\t/g, ' ')).normalize('NFC')
  if (kind === 'md') text = flattenMarkdown(text)
  const lines = text.split('\n')
  const paragraphs: string[] = []
  let buf: string[] = []
  let firstHeading: string | undefined
  const flush = () => {
    if (buf.length) {
      paragraphs.push(buf.join(' ').replace(/\s+/g, ' ').trim())
      buf = []
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) {
      flush()
      continue
    }
    // Each list item is its own paragraph, so bullets never run together.
    const bullet = /^(?:[-*+•–]|\d{1,3}[.)])\s+(.+)$/.exec(trimmed)
    if (bullet && !NUMBERED_HEADING.test(trimmed)) {
      flush()
      paragraphs.push(bullet[1])
      continue
    }
    const md = /^(#{1,6})\s+(.+?)\s*#*$/.exec(trimmed)
    if (md) {
      flush()
      firstHeading ??= md[2]
      paragraphs.push(`# ${md[2]}`)
      continue
    }
    // Setext headings: a line underlined with === or ---.
    const next = lines[i + 1]?.trim() ?? ''
    if (/^(=+|-+)$/.test(next) && next.length >= 3 && trimmed.length <= 90) {
      flush()
      firstHeading ??= trimmed
      paragraphs.push(`# ${trimmed}`)
      i++
      continue
    }
    const prevBlank = i === 0 || !lines[i - 1].trim()
    const nextBlank = !lines[i + 1]?.trim()
    if (kind === 'txt' && looksLikeHeading(trimmed, prevBlank, nextBlank)) {
      flush()
      firstHeading ??= trimmed
      paragraphs.push(`# ${trimmed}`)
      continue
    }
    buf.push(trimmed)
  }
  flush()

  // Split very long text into chunks at paragraph boundaries.
  const pages: PageText[] = []
  let chunk: string[] = []
  let size = 0
  for (const p of paragraphs) {
    const piece = p.length > maxCharsPerPage ? p.slice(0, maxCharsPerPage) : p
    if (size + piece.length > maxCharsPerPage && chunk.length) {
      pages.push({ page: 1, text: chunk.join('\n\n') })
      chunk = []
      size = 0
    }
    chunk.push(piece)
    size += piece.length + 2
  }
  if (chunk.length) pages.push({ page: 1, text: chunk.join('\n\n') })
  return { pages, firstHeading }
}
