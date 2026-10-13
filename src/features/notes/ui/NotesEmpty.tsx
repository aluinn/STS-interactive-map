import { useRef, useState } from 'react'
import styles from './notes.module.css'

interface NotesEmptyProps {
  reason: 'no-collection' | 'no-entries-in-view'
  onImport: () => void
  /** Files dropped on (or chosen from) the blank map. */
  onFiles: (files: File[]) => void
  onShowCurated: () => void
  loading: boolean
}

/** The blank "Your Notes" map: drop files here to build it. */
export function NotesEmpty({ reason, onImport, onFiles, onShowCurated, loading }: NotesEmptyProps) {
  const [over, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const blank = reason === 'no-collection'
  return (
    <div
      className={`${styles.empty} ${over ? styles.dropzoneActive : ''}`}
      role="status"
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        if (e.dataTransfer.files.length) onFiles(Array.from(e.dataTransfer.files))
      }}
    >
      <h2 className={styles.heading}>
        {loading
          ? 'Looking for your notes…'
          : blank
            ? 'Drop your notes here to build your own map'
            : 'Nothing from your notes in this view'}
      </h2>
      <p className={styles.sub} style={{ maxWidth: 520 }}>
        {loading
          ? 'Checking this device for saved collections.'
          : blank
            ? 'Drag in text-based PDFs, .txt or .md files. The people, places and ideas in them are found on your device, you review them, and they appear on this map. Nothing is uploaded and nothing is shared; the General Notes atlas is not changed.'
            : 'Your filters or the selected period leave no entries from your notes. Try a different period (or All Time), or clear the filters. Entries with no date appear in every period.'}
      </p>
      <div className={styles.row}>
        {blank ? (
          <>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => input.current?.click()}
            >
              Choose files…
            </button>
            <input
              ref={input}
              type="file"
              multiple
              accept=".pdf,.txt,.md,.markdown,application/pdf,text/plain,text/markdown"
              className={styles.srOnly}
              tabIndex={-1}
              aria-label="Choose note files to add"
              onChange={(e) => {
                if (e.target.files?.length) onFiles(Array.from(e.target.files))
                e.target.value = ''
              }}
            />
          </>
        ) : (
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onImport}>
            Add your notes…
          </button>
        )}
        <button type="button" className={styles.btn} onClick={onShowCurated}>
          Show General Notes
        </button>
      </div>
    </div>
  )
}
