import type { Period } from '../../../types'
import type { ParsedDate } from '../types'

/**
 * Finds dates in plain text. Everything here is a linear scan with simple,
 * bounded patterns (no nested quantifiers), so hostile input cannot make it
 * run away. The original wording is always kept next to the normalised years
 * and the precision says how exact the dating really is.
 */

export interface FoundDate extends ParsedDate {
  /** Offset of the match in the text it was found in. */
  index: number
  length: number
}

const ORDINALS: Record<string, number> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
  eleventh: 11,
  twelfth: 12,
  thirteenth: 13,
  fourteenth: 14,
  fifteenth: 15,
  sixteenth: 16,
  seventeenth: 17,
  eighteenth: 18,
  nineteenth: 19,
  twentieth: 20,
  'twenty-first': 21,
}

const ORD = `(\\d{1,2}(?:st|nd|rd|th)|${Object.keys(ORDINALS).join('|')})`
const ERA = '(BCE|BC|CE|AD)'

const CENTURY_RE = new RegExp(
  `\\b(?:(early|mid|late)[- ])?${ORD}[- ]centur(?:y|ies)(?:\\s+${ERA}\\b)?`,
  'gi',
)
const RANGE_RE = new RegExp(
  `\\b(?:(c\\.|ca\\.|circa)\\s*)?(\\d{1,4})\\s*(?:–|—|-|to)\\s*(\\d{1,4})(?:\\s*${ERA}\\b)?`,
  'gi',
)
const CIRCA_RE = new RegExp(
  `\\b(c\\.|ca\\.|circa|about|around|approximately)\\s*(\\d{1,4})(?:\\s*${ERA}\\b)?`,
  'gi',
)
const MARKED_RE = new RegExp(`\\b(\\d{1,4})\\s*${ERA}\\b|\\b(AD|CE)\\s*(\\d{1,4})\\b`, 'gi')
const DECADE_RE = /\b(1[0-9]{2}0|20[0-2]0)s\b/g
const BARE_RE = /(?<![\d,.])\b(1[0-9]{3}|20[0-3][0-9])\b(?![\d]|,\d)/g

/** Named periods with the rough years they cover. Boundaries are conventions. */
const PERIODS: { name: string; start: number; end: number }[] = [
  { name: 'ancient world', start: -3000, end: 500 },
  { name: 'antiquity', start: -800, end: 500 },
  { name: 'classical antiquity', start: -800, end: 500 },
  { name: 'ancient', start: -3000, end: 500 },
  { name: 'middle ages', start: 500, end: 1500 },
  { name: 'medieval', start: 500, end: 1500 },
  { name: 'islamic golden age', start: 750, end: 1258 },
  { name: 'renaissance', start: 1400, end: 1600 },
  { name: 'scientific revolution', start: 1543, end: 1687 },
  { name: 'early modern', start: 1500, end: 1800 },
  { name: 'enlightenment', start: 1685, end: 1815 },
  { name: 'industrial revolution', start: 1760, end: 1840 },
  { name: 'victorian', start: 1837, end: 1901 },
  { name: 'first world war', start: 1914, end: 1918 },
  { name: 'world war i', start: 1914, end: 1918 },
  { name: 'interwar', start: 1918, end: 1939 },
  { name: 'second world war', start: 1939, end: 1945 },
  { name: 'world war ii', start: 1939, end: 1945 },
  { name: 'cold war', start: 1947, end: 1991 },
  { name: 'space race', start: 1957, end: 1975 },
  { name: 'postwar', start: 1945, end: 1970 },
  { name: 'information age', start: 1970, end: 2026 },
  { name: 'digital age', start: 1990, end: 2026 },
  { name: 'platform age', start: 2010, end: 2026 },
]
const PERIOD_RE = new RegExp(
  `\\b(${PERIODS.map((p) => p.name.replace(/ /g, '\\s+'))
    .sort((a, b) => b.length - a.length)
    .join('|')})\\b`,
  'gi',
)
const PERIOD_LOOKUP = new Map(PERIODS.map((p) => [p.name, p]))

const CURRENT_YEAR = new Date().getFullYear()

export function formatYear(y: number): string {
  if (y < 0) return `${-y} BCE`
  if (y < 1000) return `${y} CE`
  return String(y)
}

export function formatRange(start: number, end?: number, approximate = false): string {
  const prefix = approximate ? 'c. ' : ''
  if (end === undefined || end === start) return `${prefix}${formatYear(start)}`
  // Share "BCE" when both ends are BCE: "500–400 BCE".
  if (start < 0 && end < 0) return `${prefix}${-start}–${-end} BCE`
  return `${prefix}${formatYear(start)}–${formatYear(end)}`
}

function eraSign(marker: string | undefined): 1 | -1 | 0 {
  if (!marker) return 0
  return /^(bce|bc)$/i.test(marker) ? -1 : 1
}

function signedYear(n: number, marker: string | undefined): number {
  return eraSign(marker) === -1 ? -n : n
}

function plausible(y: number): boolean {
  return y >= -6000 && y <= CURRENT_YEAR + 1
}

function century(n: number, marker: string | undefined, part: string | undefined) {
  const bce = eraSign(marker) === -1
  let start: number
  let end: number
  if (bce) {
    start = -n * 100
    end = -(n - 1) * 100 - 1
  } else {
    start = (n - 1) * 100 + 1
    end = n * 100
  }
  if (part) {
    const third = Math.round((end - start) / 3)
    const p = part.toLowerCase()
    // For BCE the "early" part has the more negative years.
    if (p === 'early') end = start + third
    else if (p === 'late') start = end - third
    else {
      start += third
      end -= third
    }
  }
  return { start, end }
}

function ordinalValue(token: string): number {
  const lower = token.toLowerCase()
  if (lower in ORDINALS) return ORDINALS[lower]
  return parseInt(lower, 10)
}

/** Finds every date expression in `text`, earliest first, without overlaps. */
export function findDates(text: string): FoundDate[] {
  const found: FoundDate[] = []
  const taken: [number, number][] = []
  const overlaps = (a: number, b: number) => taken.some(([x, y]) => a < y && b > x)
  const claim = (d: FoundDate) => {
    if (overlaps(d.index, d.index + d.length)) return
    taken.push([d.index, d.index + d.length])
    found.push(d)
  }

  for (const m of text.matchAll(CENTURY_RE)) {
    const n = ordinalValue(m[2])
    if (!(n >= 1 && n <= 21)) continue
    const { start, end } = century(n, m[3], m[1])
    claim({
      start,
      end,
      original: m[0],
      precision: 'century',
      approximate: true,
      index: m.index,
      length: m[0].length,
    })
  }

  for (const m of text.matchAll(RANGE_RE)) {
    const a = parseInt(m[2], 10)
    let b = parseInt(m[3], 10)
    const marker = m[4]
    const hasEra = eraSign(marker) !== 0
    const aDigits = m[2].length
    // Without an era marker only four-digit years are trusted, so that page
    // ranges ("pp. 45–67") and similar numbers are not read as dates.
    if (!hasEra && aDigits < 4) continue
    if (!hasEra && a < 1000) continue
    if (!hasEra && m[3].length === 2) b = Math.floor(a / 100) * 100 + b
    else if (!hasEra && m[3].length === 3) continue
    const bce = eraSign(marker) === -1
    const start = bce ? -a : a
    const end = bce ? -b : b
    if (!plausible(start) || !plausible(end) || end < start || end - start > 3000) continue
    claim({
      start,
      end,
      original: m[0],
      precision: m[1] ? 'circa' : 'exact',
      approximate: Boolean(m[1]),
      index: m.index,
      length: m[0].length,
    })
  }

  for (const m of text.matchAll(CIRCA_RE)) {
    const n = parseInt(m[2], 10)
    const marker = m[3]
    if (eraSign(marker) === 0 && (m[2].length < 4 || n < 1000)) continue
    const y = signedYear(n, marker)
    if (!plausible(y)) continue
    claim({
      start: y,
      original: m[0],
      precision: 'circa',
      approximate: true,
      index: m.index,
      length: m[0].length,
    })
  }

  for (const m of text.matchAll(MARKED_RE)) {
    const n = parseInt(m[1] ?? m[4], 10)
    const marker = m[2] ?? m[3]
    const y = signedYear(n, marker)
    if (n < 1 || !plausible(y)) continue
    claim({
      start: y,
      original: m[0],
      precision: 'exact',
      approximate: false,
      index: m.index,
      length: m[0].length,
    })
  }

  for (const m of text.matchAll(DECADE_RE)) {
    const y = parseInt(m[1], 10)
    claim({
      start: y,
      end: y + 9,
      original: m[0],
      precision: 'decade',
      approximate: true,
      index: m.index,
      length: m[0].length,
    })
  }

  for (const m of text.matchAll(BARE_RE)) {
    const before = text.slice(Math.max(0, m.index - 6), m.index)
    if (/\b(?:pp?\.?|pages?|fig\.?|table)\s*$/i.test(before)) continue
    const y = parseInt(m[1], 10)
    if (!plausible(y)) continue
    claim({
      start: y,
      original: m[0],
      precision: 'exact',
      approximate: false,
      index: m.index,
      length: m[0].length,
    })
  }

  for (const m of text.matchAll(PERIOD_RE)) {
    const p = PERIOD_LOOKUP.get(m[1].toLowerCase().replace(/\s+/g, ' '))
    if (!p) continue
    claim({
      start: p.start,
      end: p.end,
      original: m[0],
      precision: 'period',
      approximate: true,
      index: m.index,
      length: m[0].length,
    })
  }

  return found.sort((x, y) => x.index - y.index)
}

/** The display text for a parsed date: normalised years plus the precision. */
export function describeDate(d: ParsedDate): string {
  if (d.precision === 'period') return `${d.original} (${formatRange(d.start, d.end, true)})`
  if (d.precision === 'century') return `${d.original} (${formatRange(d.start, d.end, true)})`
  return formatRange(d.start, d.end, d.approximate)
}

/** Maps a year onto the atlas's own grouping of historical periods. */
export function periodForYear(y: number): Period {
  if (y < -500) return 'ancient'
  if (y < 300) return 'classical'
  if (y < 1400) return 'medieval-translation'
  if (y < 1600) return 'renaissance'
  if (y < 1700) return 'early-modern'
  if (y < 1800) return 'enlightenment'
  if (y < 1870) return 'industrial-imperial'
  if (y < 1914) return 'professional-science'
  if (y < 1945) return 'war-and-big-science'
  if (y < 1991) return 'cold-war'
  return 'environmental-contemporary'
}
