import { useState, type ReactNode } from 'react'
import type { Entry, EvidenceStatus } from '../types'
import { CommunicationModels } from './CommunicationModels'
import styles from './DetailPanel.module.css'

const EVIDENCE_STATUS_LABELS: Record<EvidenceStatus, string> = {
  'well-established': 'Evidence: well established',
  'interpretation-debated': 'Evidence: interpretation debated',
  'historical-details-contested': 'Evidence: historical details contested',
  'evidence-incomplete': 'Evidence: incomplete',
  'contemporary-developing': 'Evidence: still developing',
}

function formatVerified(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export interface JourneyNav {
  title: string
  stopIndex: number
  totalStops: number
  caption: string
  onPrev?: () => void
  onNext?: () => void
}

export interface EntryDetailProps {
  entry: Entry
  relatedEntries: Entry[]
  onSelectRelated: (id: string) => void
  onOpenDebate?: (debateId: string) => void
  journeyNav?: JourneyNav
  isSaved?: boolean
  onToggleSave?: () => void
  /** DOM id for the entry's heading, so a surrounding dialog can label itself with it. */
  titleId?: string
  /** Extra action buttons (e.g. "Show on map") rendered with the built-in ones. */
  extraActions?: ReactNode
}

/**
 * The full text of an entry: description, context, lenses, sources and
 * actions. Shared by the modal DetailPanel and the map's cluster sidebar so
 * both always show the same information.
 */
export function EntryDetail({
  entry,
  relatedEntries,
  onSelectRelated,
  onOpenDebate,
  journeyNav,
  isSaved,
  onToggleSave,
  titleId = 'entry-detail-title',
  extraActions,
}: EntryDetailProps) {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    const url = new URL(window.location.href)
    url.search = `?entry=${encodeURIComponent(entry.id)}`
    navigator.clipboard
      ?.writeText(url.toString())
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
      .catch(() => undefined)
  }

  return (
    <>
      <p className={styles.kicker}>
        {entry.kind} · {entry.period.replace(/-/g, ' ')}
      </p>
      <h2 className={styles.title} id={titleId}>
        {entry.title}
      </h2>
      {entry.subtitle && <p className={styles.subtitle}>{entry.subtitle}</p>}

      <div className={styles.meta}>
        <span className={styles.chip}>{entry.dateDisplay}</span>
        {entry.places[0] && <span className={styles.chip}>{entry.places[0].name}</span>}
        {entry.confidence !== 'established' && (
          <span className={styles.chip}>confidence: {entry.confidence}</span>
        )}
        {entry.theoryStatus && (
          <span className={styles.chip}>status: {entry.theoryStatus.replace(/-/g, ' ')}</span>
        )}
        {entry.scale && <span className={styles.chip}>scale: {entry.scale}</span>}
        {entry.lastVerified && (
          <span className={styles.chip}>last checked {formatVerified(entry.lastVerified)}</span>
        )}
        {entry.evidenceStatus && (
          <span
            className={styles.chip}
            title={entry.evidenceStatusNote}
            tabIndex={entry.evidenceStatusNote ? 0 : undefined}
          >
            {EVIDENCE_STATUS_LABELS[entry.evidenceStatus]}
          </span>
        )}
      </div>

      {entry.evidenceStatusNote && <p className={styles.statusNote}>{entry.evidenceStatusNote}</p>}

      {entry.contentStatus === 'sourceNeeded' && (
        <p className={styles.statusNote}>
          This entry is flagged as needing additional sourcing before it should be treated as fully
          verified.
        </p>
      )}

      {entry.contentStatus === 'draft' && (
        <p className={styles.statusNote}>
          Draft entry: dates and descriptions come from general scholarship rather than a full
          source check. Please verify current claims before relying on them.
        </p>
      )}

      <section className={styles.section}>
        <p>{entry.longDescription}</p>
      </section>

      {entry.explorer === 'communication-models' && <CommunicationModels initial={entry.id} />}

      <section className={styles.section}>
        <h3 className={styles.sectionHeading}>Why it matters</h3>
        <p>{entry.historicalSignificance}</p>
      </section>

      {entry.theoryStatusNote && (
        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>What survived</h3>
          <p>{entry.theoryStatusNote}</p>
        </section>
      )}

      {(entry.commonMyth || entry.historicalComplication) && (
        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>Myth vs. complication</h3>
          <div className={styles.mythBox}>
            {entry.commonMyth && (
              <div>
                <strong>Common myth:</strong> {entry.commonMyth}
              </div>
            )}
            {entry.historicalComplication && (
              <div>
                <strong>Historical complication:</strong> {entry.historicalComplication}
              </div>
            )}
          </div>
        </section>
      )}

      {entry.philosophicalQuestions.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>Philosophical lens</h3>
          {entry.philosophicalQuestions.map((q, i) => (
            <div className={styles.lens} key={i}>
              {q.prompt}
              {q.debateId && onOpenDebate && (
                <div>
                  <button
                    type="button"
                    className={styles.lensLink}
                    onClick={() => onOpenDebate(q.debateId!)}
                  >
                    Explore this debate →
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {entry.missingVoices && entry.missingVoices.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>Whose voice is missing?</h3>
          <div className={styles.mythBox}>
            {entry.missingVoices.map((v, i) => (
              <div key={i}>
                <strong>{v.role}:</strong> {v.note}
              </div>
            ))}
          </div>
        </section>
      )}

      {relatedEntries.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionHeading}>Connected entries</h3>
          <ul className={styles.relatedList}>
            {relatedEntries.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className={styles.relatedBtn}
                  onClick={() => onSelectRelated(r.id)}
                >
                  {r.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <details className={styles.sourcesDetails}>
          <summary className={styles.sectionHeading}>
            Sources &amp; further reading ({entry.sources.length})
          </summary>
          {entry.sources.length === 0 ? (
            <p className={styles.statusNote}>
              No sources listed yet for this entry — treat its claims as provisional.
            </p>
          ) : (
            entry.sources.map((s, i) => (
              <p className={styles.sourceItem} key={i}>
                <span className={styles.sourceBadge}>{s.type}</span>
                {s.author ? `${s.author}, ` : ''}
                <em>{s.title}</em>
                {s.year ? `, ${s.year}` : ''}
                {s.url ? (
                  <>
                    {' — '}
                    <a href={s.url} target="_blank" rel="noreferrer">
                      link
                    </a>
                  </>
                ) : null}
              </p>
            ))
          )}
        </details>
      </section>

      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <button type="button" className={styles.copyBtn} onClick={copyLink}>
          {copied ? 'Link copied ✓' : 'Copy link to this entry'}
        </button>
        {extraActions}
        {onToggleSave && (
          <button
            type="button"
            className={styles.copyBtn}
            onClick={onToggleSave}
            aria-pressed={isSaved}
          >
            {isSaved ? '★ Saved to notebook' : '☆ Save to notebook'}
          </button>
        )}
      </div>

      {journeyNav && (
        <nav className={styles.journeyNav} aria-label="Journey navigation">
          <button
            type="button"
            className={styles.navBtn}
            onClick={journeyNav.onPrev}
            disabled={!journeyNav.onPrev}
          >
            ← Previous
          </button>
          <span
            style={{ fontSize: '0.8rem', color: 'var(--color-ink-faint)', alignSelf: 'center' }}
          >
            Stop {journeyNav.stopIndex + 1} of {journeyNav.totalStops}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={journeyNav.onNext}
            disabled={!journeyNav.onNext}
          >
            Next →
          </button>
        </nav>
      )}
    </>
  )
}
