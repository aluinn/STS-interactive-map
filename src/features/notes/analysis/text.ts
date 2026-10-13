/**
 * Small text helpers shared by the extraction and analysis code. None of
 * these use backtracking-heavy patterns: tokenising and sentence splitting
 * are single linear passes.
 */

export interface Token {
  /** Text as written. */
  raw: string
  /** Lower-case, accent-free, possessive-free form used for matching. */
  norm: string
  start: number
  end: number
}

const TOKEN_RE = /[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu

function normToken(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]s$/, '')
    .replace(/['’]/g, '')
}

/** Splits text into word tokens, keeping their positions in the original. */
export function tokenize(text: string, limit = 200_000): Token[] {
  const out: Token[] = []
  for (const m of text.matchAll(TOKEN_RE)) {
    out.push({ raw: m[0], norm: normToken(m[0]), start: m.index, end: m.index + m[0].length })
    if (out.length >= limit) break
  }
  return out
}

/** The matching key for a phrase: normalised tokens joined by single spaces. */
export function normalisePhrase(s: string): string {
  return tokenize(s)
    .map((t) => t.norm)
    .join(' ')
}

export interface Sentence {
  text: string
  /** Offset within the paragraph it came from. */
  start: number
}

const ABBREVIATIONS = new Set([
  'c',
  'ca',
  'cf',
  'dr',
  'prof',
  'mr',
  'mrs',
  'ms',
  'st',
  'vs',
  'etc',
  'eg',
  'ie',
  'fig',
  'no',
  'vol',
  'ed',
  'eds',
  'pp',
  'p',
  'jr',
  'sr',
  'ch',
  'op',
  'cit',
  'al',
])

/** Splits a paragraph into sentences without splitting at common abbreviations or initials. */
export function splitSentences(paragraph: string): Sentence[] {
  const out: Sentence[] = []
  let start = 0
  const n = paragraph.length
  for (let i = 0; i < n; i++) {
    const ch = paragraph[i]
    if (ch !== '.' && ch !== '!' && ch !== '?') continue
    // Skip decimal points and the dots inside abbreviations like "e.g.".
    const next = paragraph[i + 1]
    if (next !== undefined && !/\s/.test(next) && !/["”’')\]]/.test(next)) continue
    let j = i + 1
    while (j < n && /["”’')\]]/.test(paragraph[j])) j++
    if (j < n && !/\s/.test(paragraph[j])) continue
    let k = j
    while (k < n && /\s/.test(paragraph[k])) k++
    if (k >= n) break
    if (!/[\p{Lu}\d"“(*_#]/u.test(paragraph[k])) continue
    if (ch === '.') {
      // Look at the word before the full stop.
      let w = i - 1
      while (w >= 0 && /[\p{L}]/u.test(paragraph[w])) w--
      const word = paragraph.slice(w + 1, i)
      if (word.length === 1 && /\p{Lu}/u.test(word)) continue
      if (ABBREVIATIONS.has(word.toLowerCase())) continue
    }
    const text = paragraph.slice(start, j).trim()
    if (text) out.push({ text, start })
    start = k
    i = k - 1
  }
  const tail = paragraph.slice(start).trim()
  if (tail) out.push({ text: tail, start })
  return out
}

/** A short excerpt of `text` around [from, to), trimmed at word boundaries. */
export function excerpt(text: string, from: number, to: number, max = 320): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  // Offsets refer to the original text; approximate after whitespace collapsing.
  const mid = Math.min(clean.length - 1, Math.max(0, Math.floor((from + to) / 2)))
  let a = Math.max(0, mid - Math.floor(max / 2))
  let b = Math.min(clean.length, a + max)
  a = Math.max(0, b - max)
  const spaceA = clean.indexOf(' ', a)
  if (a > 0 && spaceA !== -1 && spaceA < mid) a = spaceA + 1
  const spaceB = clean.lastIndexOf(' ', b)
  if (b < clean.length && spaceB > mid) b = spaceB
  return `${a > 0 ? '… ' : ''}${clean.slice(a, b)}${b < clean.length ? ' …' : ''}`
}

/** Escapes nothing: React renders text as text. This only removes control characters. */
export function stripControl(s: string): string {
  let out = ''
  for (const ch of s) {
    const c = ch.codePointAt(0) as number
    const control = c < 9 || c === 11 || c === 12 || (c > 13 && c < 32) || c === 127
    const invisible =
      (c >= 0x200b && c <= 0x200f) || (c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069)
    if (!control && !invisible) out += ch
  }
  return out
}

/** A filename that is safe to display and to use in an export. */
export function sanitiseFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? ''
  const cleaned = stripControl(base)
    .replace(/[<>:"|?*]/g, '_')
    .replace(/^\.+/, '')
    .trim()
  return (cleaned || 'untitled').slice(0, 120)
}

export function slugify(s: string): string {
  return (
    normalisePhrase(s)
      .replace(/\s+/g, '-')
      .slice(0, 60)
      .replace(/^-+|-+$/g, '') || 'item'
  )
}

/** A short random id; collisions are not a concern at this scale. */
export function newId(prefix: string): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return `${prefix}-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')}`
}

export function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}
