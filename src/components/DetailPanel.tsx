import { useEffect, useRef } from 'react'
import type { Entry } from '../types'
import { EntryDetail, type JourneyNav } from './EntryDetail'
import styles from './DetailPanel.module.css'

interface DetailPanelProps {
  entry: Entry
  relatedEntries: Entry[]
  onClose: () => void
  onSelectRelated: (id: string) => void
  onOpenDebate?: (debateId: string) => void
  journeyNav?: JourneyNav
  isSaved?: boolean
  onToggleSave?: () => void
}

export function DetailPanel({
  entry,
  relatedEntries,
  onClose,
  onSelectRelated,
  onOpenDebate,
  journeyNav,
  isSaved,
  onToggleSave,
}: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<Element | null>(null)

  useEffect(() => {
    previouslyFocused.current = document.activeElement
    panelRef.current?.focus()
    return () => {
      if (previouslyFocused.current instanceof HTMLElement) previouslyFocused.current.focus()
    }
  }, [entry.id])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-panel-title"
        tabIndex={-1}
        ref={panelRef}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close detail panel"
        >
          ✕
        </button>

        <EntryDetail
          entry={entry}
          relatedEntries={relatedEntries}
          onSelectRelated={onSelectRelated}
          onOpenDebate={onOpenDebate}
          journeyNav={journeyNav}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          titleId="detail-panel-title"
        />
      </div>
    </div>
  )
}
