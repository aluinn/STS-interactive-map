import type { PageText } from '../types'

/** Digits stand for any number, so "Lecture 3" and "Lecture 12" look alike. */
function shape(line: string): string {
  return line.toLowerCase().replace(/\d+/g, '#').replace(/\s+/g, ' ').trim()
}

/**
 * Removes running headers and footers ("Science and War lecture 3", page
 * numbers) that repeat on many pages, so they are not mistaken for content.
 * Only short lines that recur on at least 40% of pages (and at least three)
 * are removed; a real sentence that happens to repeat is left alone.
 */
export function stripRepeatedLines(pages: PageText[]): PageText[] {
  if (pages.length < 3) return pages.map((p) => ({ ...p, text: tidy(p.text) }))
  const seen = new Map<string, Set<number>>()
  for (const p of pages) {
    for (const para of p.text.split('\n\n')) {
      const t = para.replace(/^#+\s*/, '').trim()
      if (t.length === 0 || t.length > 80) continue
      const key = shape(t)
      const set = seen.get(key) ?? new Set<number>()
      set.add(p.page)
      seen.set(key, set)
    }
  }
  const threshold = Math.max(3, Math.ceil(pages.length * 0.4))
  const repeated = new Set([...seen].filter(([, set]) => set.size >= threshold).map(([k]) => k))
  return pages.map((p) => ({
    ...p,
    text: tidy(
      p.text
        .split('\n\n')
        .filter((para) => !repeated.has(shape(para.replace(/^#+\s*/, ''))))
        .join('\n\n'),
    ),
  }))
}

/** Drops the stray control characters some PDF fonts produce. */
function tidy(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
}
