import type { CollectionMode } from '../useNotesAtlas'
import styles from './notes.module.css'

interface CollectionSelectorProps {
  mode: CollectionMode
  onMode: (m: CollectionMode) => void
  curatedCount: number
  mineCount: number
  collectionName: string | null
  onImport: () => void
  onManage: () => void
}

const OPTIONS: { value: CollectionMode; label: string; help: string }[] = [
  { value: 'curated', label: 'General Notes', help: 'The shared atlas, the same for everyone.' },
  {
    value: 'mine',
    label: 'Your Notes',
    help: 'A separate map built only from the notes you add. It stays on this device.',
  },
]

/** The three-way collection choice, plus the way into importing notes. */
export function CollectionSelector({
  mode,
  onMode,
  curatedCount,
  mineCount,
  collectionName,
  onImport,
  onManage,
}: CollectionSelectorProps) {
  const current = OPTIONS.find((o) => o.value === mode)
  return (
    <section className={styles.selector} aria-labelledby="collection-selector-title">
      <h2 id="collection-selector-title" className={styles.selectorTitle}>
        Collection
      </h2>
      <div className={styles.segment} role="radiogroup" aria-label="Which collection to show">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={mode === o.value}
            className={`${styles.segBtn} ${mode === o.value ? styles.segActive : ''}`}
            onClick={() => onMode(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className={styles.small}>
        {current?.help}{' '}
        {mode === 'curated'
          ? `${curatedCount} entries.`
          : mineCount === 0
            ? 'Nothing added yet.'
            : `${mineCount} entr${mineCount === 1 ? 'y' : 'ies'} from ${collectionName ? `“${collectionName}”` : 'your notes'}, including any General Notes entries they mention.`}
      </p>
      <div className={styles.row}>
        <button type="button" className={styles.btn} onClick={onImport}>
          Add your notes…
        </button>
        <button type="button" className={styles.btn} onClick={onManage}>
          Manage
        </button>
      </div>
    </section>
  )
}
