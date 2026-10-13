import { useEffect, useMemo, useRef, useState } from 'react'
import type { Entry } from '../../../types'
import { Modal } from '../../../components/Modal'
import { createCollection } from '../collection'
import { commitReview, type CommitOptions } from '../review'
import type { PersonalCollection } from '../types'
import { useImportSession } from '../useImportSession'
import type { NotesAtlas } from '../useNotesAtlas'
import type { Appearance } from '../useNotesPrefs'
import { ImportPanel } from './ImportPanel'
import { NotesManager } from './NotesManager'
import { ReviewScreen } from './ReviewScreen'
import styles from './notes.module.css'

type Screen = 'home' | 'import'

interface NotesModalProps {
  notes: NotesAtlas
  curated: Entry[]
  appearance: Appearance
  onAppearance: (a: Appearance) => void
  onResetSettings: () => void
  initial: Screen
  /** Files already chosen (dropped on the blank map) to start the import with. */
  initialFiles?: File[]
  /** Called with the collection after a successful import, so the interface can adapt. */
  onImported: (collection: PersonalCollection, summary: string) => void
  onClose: () => void
}

/**
 * The notes dialog. Three stages with focus moved to each stage's heading:
 * manage → import files → review. Closing mid-review asks first, because the
 * review decisions live only in memory until "Add to my atlas".
 */
export function NotesModal({
  notes,
  curated,
  appearance,
  onAppearance,
  onResetSettings,
  initial,
  initialFiles = [],
  onImported,
  onClose,
}: NotesModalProps) {
  const [screen, setScreen] = useState<Screen>(initial)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const knownHashes = useMemo(
    () => new Set(notes.active?.documents.map((d) => d.contentHash) ?? []),
    [notes.active],
  )
  const session = useImportSession(curated, knownHashes)
  const headingRef = useRef<HTMLHeadingElement>(null)
  // Files dropped on the blank map start reading straight away.
  const startedWith = useRef(false)
  useEffect(() => {
    if (startedWith.current || initialFiles.length === 0) return
    startedWith.current = true
    void session.addFiles(initialFiles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const stage = screen === 'home' ? 'home' : session.stage

  // Move focus to the heading of whichever stage is now showing.
  useEffect(() => {
    const t = setTimeout(() => headingRef.current?.focus(), 30)
    return () => clearTimeout(t)
  }, [stage])

  const reviewing = session.stage === 'review' && session.review !== null
  const dirty = reviewing || session.files.some((f) => f.status === 'done')

  function requestClose() {
    if (
      dirty &&
      screen === 'import' &&
      !window.confirm(
        'Close without adding anything? Your files and review choices on this screen will be discarded.',
      )
    ) {
      return
    }
    session.reset()
    onClose()
  }

  async function finish(opts: CommitOptions & { targetId: string | 'new'; newName: string }) {
    if (!session.review) return
    setSaving(true)
    setSaveMessage('')
    const base =
      opts.targetId === 'new'
        ? createCollection(opts.newName)
        : (notes.collections.find((c) => c.id === opts.targetId) ?? createCollection(opts.newName))
    const { collection, summary } = commitReview(base, session.review, {
      keepUndecided: opts.keepUndecided,
    })
    const persisted = await notes.saveCollection(collection)
    setSaving(false)
    const parts = [
      `${summary.itemsAdded} new entr${summary.itemsAdded === 1 ? 'y' : 'ies'}`,
      summary.itemsMerged ? `${summary.itemsMerged} merged with existing ones` : '',
      `${summary.linksAdded} link${summary.linksAdded === 1 ? '' : 's'} to curated entries`,
      `${summary.relationshipsAdded} relationship${summary.relationshipsAdded === 1 ? '' : 's'}`,
    ].filter(Boolean)
    const skipped = summary.skippedDocuments.length
      ? ` Skipped ${summary.skippedDocuments.length} document(s) already in this collection.`
      : ''
    const where = persisted
      ? 'Saved on this device.'
      : 'Not saved: this browser is not keeping data, so it will be lost when you leave.'
    session.reset()
    onImported(collection, `Added ${parts.join(', ')}. ${where}${skipped}`)
  }

  return (
    <Modal title="Your Notes" onClose={requestClose} wide>
      {saveMessage && <p role="status">{saveMessage}</p>}
      {screen === 'home' && (
        <NotesManager
          notes={notes}
          curated={curated}
          appearance={appearance}
          onAppearance={onAppearance}
          onResetSettings={onResetSettings}
          onImport={() => setScreen('import')}
          headingRef={headingRef}
        />
      )}
      {screen === 'import' && session.stage !== 'review' && (
        <>
          <ImportPanel
            files={session.files}
            stage={session.stage}
            message={session.message}
            analysisProgress={session.analysisProgress}
            onAddFiles={session.addFiles}
            onRemoveFile={session.removeFile}
            onCancel={session.cancelAll}
            onReview={session.startReview}
            headingRef={headingRef}
          />
          <p style={{ marginTop: 'var(--space-4)' }}>
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                session.reset()
                setScreen('home')
              }}
            >
              ← Back to Your Notes
            </button>
          </p>
        </>
      )}
      {screen === 'import' && session.stage === 'review' && session.review && (
        <ReviewScreen
          review={session.review}
          onChange={session.setReview}
          curated={curated}
          collections={notes.collections.map((c) => ({ id: c.id, name: c.name }))}
          activeId={notes.active?.id ?? null}
          onFinish={(o) => void finish(o)}
          onBack={session.backToSelect}
          headingRef={headingRef}
          saving={saving}
        />
      )}
    </Modal>
  )
}
