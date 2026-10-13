import type { SourceMention } from '../../types'

/** "p. 3" for a PDF, or the section name (or "text") for plain-text notes. */
export function locationLabel(
  m: Pick<SourceMention, 'fileName' | 'page'> & { section?: string },
): string {
  if (/\.pdf$/i.test(m.fileName)) return `p. ${m.page}`
  return m.section ? `section “${m.section}”` : 'text'
}
