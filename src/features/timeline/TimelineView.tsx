import { ProvenanceBadge } from '../notes/ui/ProvenanceBadge'
import { useRef } from 'react'
import type { Entry, Period } from '../../types'
import { MarkerIcon } from '../../components/MarkerIcon'
import styles from './TimelineView.module.css'

interface TimelineViewProps {
  entries: Entry[]
  onSelectEntry: (id: string) => void
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'ancient', label: 'Ancient knowledge traditions' },
  { value: 'classical', label: 'Classical natural philosophy' },
  { value: 'medieval-translation', label: 'Medieval translation & scholarship' },
  { value: 'renaissance', label: 'Renaissance' },
  { value: 'early-modern', label: 'Early modern transformations' },
  { value: 'enlightenment', label: 'Enlightenment' },
  { value: 'industrial-imperial', label: 'Industrial & imperial science' },
  { value: 'professional-science', label: 'Professional science' },
  { value: 'war-and-big-science', label: 'Twentieth-century war & Big Science' },
  { value: 'cold-war', label: 'Cold War' },
  { value: 'environmental-contemporary', label: 'Environmental & contemporary science' },
  { value: 'philosophy-of-science', label: 'Modern philosophy & science studies' },
]

function formatYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`
}

export function TimelineView({ entries, onSelectEntry }: TimelineViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  // Entries whose notes gave no date are listed apart, never placed at a
  // made-up position on the timeline.
  const dated = entries.filter((e) => !e.undated)
  const grouped: { value: string; label: string; items: Entry[] }[] = PERIODS.map((p) => ({
    ...p,
    items: dated.filter((e) => e.period === p.value).sort((a, b) => a.startYear - b.startYear),
  })).filter((g) => g.items.length > 0)
  const undated = entries.filter((e) => e.undated)
  if (undated.length > 0) {
    grouped.push({ value: 'undated', label: 'No date in your notes', items: undated })
  }

  if (grouped.length === 0) {
    return (
      <div className={styles.wrap}>
        <p className={styles.empty}>
          No entries match the current filters. Use “Reset atlas” in the filters panel to clear
          them.
        </p>
      </div>
    )
  }

  function scrollTo(value: string) {
    const el = wrapRef.current?.querySelector(`#period-${value}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <nav className={styles.jumpNav} aria-label="Jump to period">
        {grouped.map((g) => (
          <button
            key={g.value}
            type="button"
            className={styles.jumpLink}
            onClick={() => scrollTo(g.value)}
          >
            {g.label}
          </button>
        ))}
      </nav>

      {grouped.map((g) => (
        <section
          key={g.value}
          id={`period-${g.value}`}
          className={styles.section}
          aria-label={g.label}
        >
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{g.label}</h2>
            <span className={styles.sectionRange}>
              {g.value === 'undated'
                ? 'no date found in your notes'
                : `${formatYear(g.items[0].startYear)} – ${formatYear(Math.max(...g.items.map((e) => e.endYear ?? e.startYear)))}`}
            </span>
          </header>
          <div className={styles.spine}>
            {g.items.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={styles.card}
                onClick={() => onSelectEntry(entry.id)}
              >
                <span className={styles.dot} aria-hidden />
                <div className={styles.cardDate}>
                  <MarkerIcon kind={entry.kind} size={11} /> {entry.dateDisplay}
                </div>
                <h3 className={styles.cardTitle}>
                  {entry.title}
                  {entry.origin === 'personal' && (
                    <>
                      {' '}
                      <ProvenanceBadge entry={entry} short />
                    </>
                  )}
                </h3>
                <p className={styles.cardSummary}>{entry.summary}</p>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
