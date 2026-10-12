import { useEffect, useId, useRef, useState } from 'react'
import { ERAS, type Era } from '../../utils/eras'
import type { EraPrefs } from '../../hooks/useEraPrefs'
import styles from './EraSlider.module.css'

interface EraSliderProps {
  era: Era | null
  onChange: (id: string | null) => void
  prefs: EraPrefs
  onPrefsChange: (patch: Partial<EraPrefs>) => void
  /** Entries drawn as part of the selected period (or all of them). */
  entryCount: number
  echoCount: number
  hasQuery: boolean
}

/** Stops on the track: index 0 is "All Time", then one per period. */
const STOPS: { id: string | null; label: string; short: string; range: string }[] = [
  { id: null, label: 'All Time', short: 'All', range: 'every period' },
  ...ERAS.map((e) => ({
    id: e.id as string | null,
    label: e.label,
    short: e.shortLabel,
    range: e.range,
  })),
]

const PLAY_INTERVAL_MS = 5200

export function EraSlider({
  era,
  onChange,
  prefs,
  onPrefsChange,
  entryCount,
  echoCount,
  hasQuery,
}: EraSliderProps) {
  const index = era ? STOPS.findIndex((s) => s.id === era.id) : 0
  const [playing, setPlaying] = useState(false)
  const [compactOpen, setCompactOpen] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(index)
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    indexRef.current = index
    onChangeRef.current = onChange
  })
  const headingId = useId()

  const go = (i: number) => {
    const clamped = Math.max(0, Math.min(STOPS.length - 1, i))
    onChange(STOPS[clamped].id)
  }

  // Walk the periods in order, stopping at the last one.
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      const next = indexRef.current + 1
      if (next >= STOPS.length) {
        setPlaying(false)
        return
      }
      onChangeRef.current(STOPS[next].id)
    }, PLAY_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [playing])

  function togglePlay() {
    if (playing) {
      setPlaying(false)
      return
    }
    // Replaying from the end (or from All Time) starts at the first period.
    if (index === 0 || index === STOPS.length - 1) onChange(STOPS[1].id)
    setPlaying(true)
  }

  function manual(i: number) {
    setPlaying(false)
    go(i)
  }

  function indexFromPointer(clientX: number): number {
    const el = trackRef.current
    if (!el) return index
    const rect = el.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return Math.round(ratio * (STOPS.length - 1))
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const map: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowUp: index + 1,
      ArrowLeft: index - 1,
      ArrowDown: index - 1,
      PageUp: index + 2,
      PageDown: index - 2,
      Home: 0,
      End: STOPS.length - 1,
    }
    if (e.key in map) {
      e.preventDefault()
      manual(map[e.key])
    }
  }

  const stop = STOPS[index]
  const valueText = era
    ? `${era.label}, approximately ${era.range}. ${entryCount} entries.`
    : `All Time, every period. ${entryCount} entries.`

  return (
    <section className={styles.dock} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.srOnly}>
        Time travel
      </h2>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.step}
          onClick={() => manual(index - 1)}
          disabled={index === 0}
          aria-label="Previous period"
        >
          ‹
        </button>

        <div className={styles.trackArea}>
          <div
            ref={trackRef}
            className={styles.track}
            role="slider"
            tabIndex={0}
            aria-label="Historical period"
            aria-valuemin={0}
            aria-valuemax={STOPS.length - 1}
            aria-valuenow={index}
            aria-valuetext={valueText}
            onKeyDown={onKeyDown}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              manual(indexFromPointer(e.clientX))
            }}
            onPointerMove={(e) => {
              if (e.buttons === 0 && e.pointerType === 'mouse') return
              const i = indexFromPointer(e.clientX)
              if (i !== indexRef.current) manual(i)
            }}
          >
            <div className={styles.rail} aria-hidden />
            <div
              className={styles.fill}
              style={{ width: `${(index / (STOPS.length - 1)) * 100}%` }}
              aria-hidden
            />
            {STOPS.map((s, i) => (
              <span
                key={s.id ?? 'all'}
                className={`${styles.stop} ${i === index ? styles.stopActive : ''} ${i < index ? styles.stopPast : ''}`}
                style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}
                aria-hidden
              />
            ))}
          </div>
          <ol className={styles.labels} aria-hidden>
            {STOPS.map((s, i) => (
              <li
                key={s.id ?? 'all'}
                className={i === index ? styles.labelActive : undefined}
                style={{ left: `${(i / (STOPS.length - 1)) * 100}%` }}
              >
                {s.short}
              </li>
            ))}
          </ol>
        </div>

        <button
          type="button"
          className={styles.step}
          onClick={() => manual(index + 1)}
          disabled={index === STOPS.length - 1}
          aria-label="Next period"
        >
          ›
        </button>
        <button
          type="button"
          className={styles.play}
          onClick={togglePlay}
          aria-pressed={playing}
          aria-label={
            playing ? 'Pause the journey through periods' : 'Play a journey through periods'
          }
        >
          {playing ? '❚❚' : '▶'}
        </button>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryText}>
          <strong className={styles.eraName}>{stop.label}</strong>
          <span className={styles.eraRange}>
            {era ? `approx. ${stop.range}` : 'entries from every century'}
          </span>
          <span className={styles.count} role="status">
            {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
            {era && prefs.echoes && echoCount > 0 ? ` · ${echoCount} faint echoes` : ''}
          </span>
        </div>
        <button
          type="button"
          className={styles.more}
          aria-expanded={compactOpen}
          onClick={() => setCompactOpen((o) => !o)}
        >
          {compactOpen ? 'Hide details' : 'Details'}
        </button>
      </div>

      {compactOpen && (
        <div className={styles.details}>
          <p className={styles.description}>
            {era
              ? era.description
              : 'The whole collection at once. Entries come from many centuries, so neighbours on the map are often separated by hundreds or thousands of years.'}
          </p>
          <p className={styles.caveat}>
            Period boundaries are approximate navigation conventions, not claims that change
            happened everywhere at the same time; entries can belong to more than one period.
          </p>

          {era && (
            <details className={styles.changed}>
              <summary>What changed?</summary>
              <dl>
                <dt>New institutions</dt>
                <dd>{era.whatChanged.institutions}</dd>
                <dt>Major developments</dt>
                <dd>{era.whatChanged.developments}</dd>
                <dt>Centres of knowledge</dt>
                <dd>{era.whatChanged.centres}</dd>
                <dt>Instruments and media</dt>
                <dd>{era.whatChanged.instruments}</dd>
                <dt>Philosophical questions</dt>
                <dd>{era.whatChanged.questions}</dd>
                <dt>Shifts in communication</dt>
                <dd>{era.whatChanged.communication}</dd>
                <dt>Political and economic context</dt>
                <dd>{era.whatChanged.context}</dd>
                <dt>What continued</dt>
                <dd>{era.whatChanged.continued}</dd>
                <dt>What stayed contested</dt>
                <dd>{era.whatChanged.contested}</dd>
              </dl>
            </details>
          )}

          <fieldset className={styles.settings}>
            <legend>Time-travel settings</legend>
            <label>
              <input
                type="checkbox"
                checked={prefs.echoes}
                onChange={(e) => onPrefsChange({ echoes: e.target.checked })}
              />
              Historical echoes <span>(faint entries from the period before)</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={prefs.immersive}
                onChange={(e) => onPrefsChange({ immersive: e.target.checked })}
              />
              Immersive period themes{' '}
              <span>(off = one consistent theme and the flat chart in every period)</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={prefs.searchAllTime}
                onChange={(e) => onPrefsChange({ searchAllTime: e.target.checked })}
              />
              Search all time{' '}
              <span>
                {hasQuery
                  ? '(results outside this period are labelled)'
                  : '(applies when you type a search)'}
              </span>
            </label>
          </fieldset>
        </div>
      )}
    </section>
  )
}
