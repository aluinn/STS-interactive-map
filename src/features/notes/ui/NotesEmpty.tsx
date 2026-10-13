import styles from './notes.module.css'

interface NotesEmptyProps {
  reason: 'no-collection' | 'no-entries-in-view'
  onImport: () => void
  onShowCurated: () => void
  loading: boolean
}

/** Shown instead of a blank map when "My Notes" has nothing to draw. */
export function NotesEmpty({ reason, onImport, onShowCurated, loading }: NotesEmptyProps) {
  return (
    <div className={styles.empty} role="status">
      <h2 className={styles.heading}>
        {loading
          ? 'Looking for your notes…'
          : reason === 'no-collection'
            ? 'Your notes atlas is empty'
            : 'Nothing from your notes in this view'}
      </h2>
      <p className={styles.sub} style={{ maxWidth: 520 }}>
        {loading
          ? 'Checking this device for saved collections.'
          : reason === 'no-collection'
            ? 'Import text-based PDFs, .txt or .md notes and this map will show the people, places and ideas in them. Your notes are processed on this device and never uploaded.'
            : 'Your filters or the selected period leave no entries from your notes. Try a different period (or All Time), or clear the filters. Entries with no date appear in every period.'}
      </p>
      <div className={styles.row}>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onImport}>
          Import My Notes…
        </button>
        <button type="button" className={styles.btn} onClick={onShowCurated}>
          Show the curated atlas
        </button>
      </div>
    </div>
  )
}
