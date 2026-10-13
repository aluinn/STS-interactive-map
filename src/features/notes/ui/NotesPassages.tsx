import type { SourceMention } from '../../../types'
import { locationLabel } from '../labels'
import styles from './notes.module.css'

/** The passages from the viewer's own notes that support an entry. */
export function NotesPassages({
  mentions,
  heading,
}: {
  mentions: SourceMention[]
  heading: string
}) {
  if (mentions.length === 0) return null
  return (
    <section aria-label={heading} className={styles.stack} style={{ gap: 'var(--space-2)' }}>
      <h3 style={{ margin: 0, fontSize: '1rem' }}>{heading}</h3>
      {mentions.map((m) => (
        <blockquote key={`${m.fileId}-${m.page}-${m.passage}`} className={styles.quote}>
          “{m.passage}”{' '}
          <span className={styles.quoteSource}>
            — {m.docTitle}, {locationLabel(m)}
          </span>
        </blockquote>
      ))}
    </section>
  )
}
