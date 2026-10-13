import { ProvenanceBadge } from '../notes/ui/ProvenanceBadge'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Entry, EntryKind } from '../../types'
import { EntryDetail } from '../../components/EntryDetail'
import { KIND_LABELS } from '../../utils/kindLabels'
import { MarkerIcon } from '../../components/MarkerIcon'
import { normaliseText } from '../../utils/filterEntries'
import {
  UNSPECIFIED_GROUP,
  dateRange,
  groupByCountry,
  primaryPlace,
  uniqueEntries,
  type ClusterSort,
} from '../../utils/clusterGroups'
import styles from './ClusterPanel.module.css'

export interface ClusterPanelProps {
  /** Exactly the entries represented by the clicked bubble. */
  entries: Entry[]
  /** Entries listed only because a search reached outside the selected period. */
  outsideIds?: Set<string>
  onClose: () => void
  onShowOnMap: (entryId: string) => void
  getRelatedEntries: (entry: Entry) => Entry[]
  isSaved: (entryId: string) => boolean
  onToggleSave: (entryId: string) => void
  onOpenDebate?: (debateId: string) => void
  journeysForEntry?: (entryId: string) => { id: string; title: string }[]
  onBeginJourney?: (journeyId: string) => void
}

function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/)
  return (match ? match[0] : text).trim()
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}

/**
 * Sidebar (desktop) / bottom sheet (mobile) listing everything inside one
 * map cluster, grouped by present-day country. Entry text is not duplicated:
 * opening an entry renders the shared EntryDetail component.
 */
export function ClusterPanel({
  entries: rawEntries,
  outsideIds,
  onClose,
  onShowOnMap,
  getRelatedEntries,
  isSaved,
  onToggleSave,
  onOpenDebate,
  journeysForEntry,
  onBeginJourney,
}: ClusterPanelProps) {
  const headingId = useId()
  const panelRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  const entries = useMemo(() => uniqueEntries(rawEntries), [rawEntries])
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<ClusterSort>('alphabetical')
  const [kindFilter, setKindFilter] = useState<EntryKind | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [full, setFull] = useState(false)
  const [manualExpanded, setManualExpanded] = useState<Record<string, boolean>>({})
  const returnFocusTo = useRef<string | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const kinds = useMemo(() => {
    const counts = new Map<EntryKind, number>()
    for (const e of entries) counts.set(e.kind, (counts.get(e.kind) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [entries])

  const filtered = useMemo(() => {
    const q = normaliseText(query.trim())
    return entries.filter((e) => {
      if (kindFilter && e.kind !== kindFilter) return false
      if (!q) return true
      const haystack = normaliseText(
        [e.title, e.summary, ...e.people, ...e.places.map((p) => p.name)].join(' '),
      )
      return haystack.includes(q)
    })
  }, [entries, query, kindFilter])

  // Grouping is computed on the unfiltered cluster for the heading and on the
  // filtered list for display.
  const allGroups = useMemo(() => groupByCountry(entries, sort), [entries, sort])
  const groups = useMemo(() => groupByCountry(filtered, sort), [filtered, sort])
  const countryCount = allGroups.filter((g) => g.name !== UNSPECIFIED_GROUP).length
  const unspecifiedCount = allGroups.find((g) => g.name === UNSPECIFIED_GROUP)?.entries.length ?? 0
  const filtersActive = query.trim() !== '' || kindFilter !== null

  const heading =
    countryCount > 0
      ? `${plural(entries.length, 'entry', 'entries')} across ${plural(countryCount, 'country', 'countries')}`
      : plural(entries.length, 'entry', 'entries')
  const range = dateRange(entries)

  function isExpanded(name: string, index: number): boolean {
    if (filtersActive) return manualExpanded[name] ?? true
    return manualExpanded[name] ?? (groups.length <= 2 || index === 0)
  }

  const detailEntry = detailId ? (entries.find((e) => e.id === detailId) ?? null) : null

  // Move focus into the panel when it opens.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  // Start each entry at its top rather than wherever the list was scrolled.
  useEffect(() => {
    if (detailId && bodyRef.current) bodyRef.current.scrollTop = 0
  }, [detailId])

  // After returning from an entry, put focus back on that entry's row.
  useEffect(() => {
    if (!detailId && returnFocusTo.current) {
      const id = returnFocusTo.current
      returnFocusTo.current = null
      panelRef.current?.querySelector<HTMLElement>(`[data-entry-id="${CSS.escape(id)}"]`)?.focus()
    }
  }, [detailId])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const announcement = filtersActive
    ? `Showing ${filtered.length} of ${entries.length} entries`
    : `${entries.length} entries`

  function clearFilters() {
    setQuery('')
    setKindFilter(null)
  }

  const dragStart = useRef<number | null>(null)

  return (
    <aside
      ref={panelRef}
      className={`${styles.panel} ${full ? styles.full : ''}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
    >
      <button
        type="button"
        className={styles.handle}
        aria-label={full ? 'Shrink panel' : 'Expand panel'}
        aria-expanded={full}
        onClick={() => setFull((f) => !f)}
        onPointerDown={(e) => {
          dragStart.current = e.clientY
        }}
        onPointerUp={(e) => {
          if (dragStart.current === null) return
          const delta = e.clientY - dragStart.current
          dragStart.current = null
          if (delta < -40) setFull(true)
          else if (delta > 40) setFull(false)
        }}
      >
        <span aria-hidden className={styles.handleBar} />
      </button>

      <header className={styles.header}>
        <span className={styles.swatch} aria-hidden />
        <div className={styles.headerText}>
          <h2 id={headingId} className={styles.heading} ref={headingRef} tabIndex={-1}>
            {heading}
          </h2>
          <p className={styles.sub}>
            {range && <span>{range}</span>}
            {unspecifiedCount > 0 && countryCount > 0 && (
              <span> · includes {unspecifiedCount} with no single country</span>
            )}
          </p>
          <p className={styles.sub}>
            {kinds.map(([k, n]) => `${n} ${KIND_LABELS[k].toLowerCase()}`).join(' · ')}
          </p>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close panel"
        >
          ✕
        </button>
      </header>

      <div className={styles.body} ref={bodyRef}>
        {detailEntry ? (
          <div className={styles.detail}>
            <button
              type="button"
              className={styles.backBtn}
              onClick={() => {
                returnFocusTo.current = detailEntry.id
                setDetailId(null)
              }}
            >
              ← Back to list
            </button>
            <EntryDetail
              entry={detailEntry}
              relatedEntries={getRelatedEntries(detailEntry)}
              onSelectRelated={(id) => setDetailId(id)}
              onOpenDebate={onOpenDebate}
              isSaved={isSaved(detailEntry.id)}
              onToggleSave={() => onToggleSave(detailEntry.id)}
              titleId={`${headingId}-entry`}
              extraActions={
                <>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => onShowOnMap(detailEntry.id)}
                    disabled={detailEntry.latitude === undefined}
                    title={
                      detailEntry.latitude === undefined
                        ? 'This entry has no single place on the map'
                        : undefined
                    }
                  >
                    ⌖ Show on map
                  </button>
                  {onBeginJourney &&
                    (journeysForEntry?.(detailEntry.id) ?? []).map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => onBeginJourney(j.id)}
                      >
                        Begin journey: {j.title}
                      </button>
                    ))}
                </>
              }
            />
          </div>
        ) : (
          <>
            <div className={styles.controls}>
              <input
                type="search"
                className={styles.search}
                placeholder="Search within this cluster…"
                aria-label="Search within this cluster"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className={styles.controlRow}>
                <label className={styles.sortLabel}>
                  Sort
                  <select
                    className={styles.select}
                    value={sort}
                    onChange={(e) => setSort(e.target.value as ClusterSort)}
                  >
                    <option value="alphabetical">Alphabetical</option>
                    <option value="chronological">Chronological</option>
                  </select>
                </label>
                {kinds.length > 1 && (
                  <label className={styles.sortLabel}>
                    Category
                    <select
                      className={styles.select}
                      value={kindFilter ?? ''}
                      onChange={(e) => setKindFilter((e.target.value || null) as EntryKind | null)}
                    >
                      <option value="">All categories</option>
                      {kinds.map(([k, n]) => (
                        <option key={k} value={k}>
                          {KIND_LABELS[k]} ({n})
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {filtersActive && (
                  <button type="button" className={styles.clearBtn} onClick={clearFilters}>
                    Clear
                  </button>
                )}
              </div>
              {groups.length > 1 && (
                <div className={styles.controlRow}>
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() =>
                      setManualExpanded(Object.fromEntries(groups.map((g) => [g.name, true])))
                    }
                  >
                    Expand all
                  </button>
                  <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() =>
                      setManualExpanded(Object.fromEntries(groups.map((g) => [g.name, false])))
                    }
                  >
                    Collapse all
                  </button>
                </div>
              )}
            </div>

            <p className={styles.srOnly} role="status" aria-live="polite">
              {announcement}
            </p>

            {filtered.length === 0 ? (
              <p className={styles.empty}>
                No entries in this cluster match your search.{' '}
                <button type="button" className={styles.linkBtn} onClick={clearFilters}>
                  Clear search
                </button>
              </p>
            ) : (
              <div className={styles.groups}>
                {groups.map((group, index) => {
                  const open = isExpanded(group.name, index)
                  const regionId = `${headingId}-group-${index}`
                  const unspecified = group.name === UNSPECIFIED_GROUP
                  return (
                    <section key={group.name} className={styles.group}>
                      <h3 className={styles.groupHeading}>
                        <button
                          type="button"
                          className={styles.groupToggle}
                          aria-expanded={open}
                          aria-controls={regionId}
                          onClick={() => setManualExpanded((m) => ({ ...m, [group.name]: !open }))}
                        >
                          <span aria-hidden className={styles.pin}>
                            {unspecified ? '◌' : '⌖'}
                          </span>
                          <span className={styles.groupName}>
                            {group.name}
                            {group.historical && !unspecified && (
                              <span className={styles.groupNote}>present-day borders</span>
                            )}
                          </span>
                          <span className={styles.groupCount}>
                            {plural(group.entries.length, 'entry', 'entries')}
                          </span>
                          <span aria-hidden className={styles.chevron}>
                            {open ? '▾' : '▸'}
                          </span>
                        </button>
                      </h3>
                      {open && (
                        <ul id={regionId} className={styles.list}>
                          {group.entries.map((entry) => (
                            <EntryRow
                              key={entry.id}
                              entry={entry}
                              onOpen={setDetailId}
                              outside={outsideIds?.has(entry.id)}
                            />
                          ))}
                        </ul>
                      )}
                    </section>
                  )
                })}
              </div>
            )}
            <p className={styles.footnote}>
              Countries are present-day: historical places are grouped by where they lie today, not
              by the states that existed at the time.
            </p>
          </>
        )}
      </div>
    </aside>
  )
}

function EntryRow({
  entry,
  onOpen,
  outside,
}: {
  entry: Entry
  onOpen: (id: string) => void
  outside?: boolean
}) {
  const place = primaryPlace(entry)
  const flags: string[] = []
  if (outside) flags.push('◌ outside the selected period')
  if (entry.confidence === 'contested') flags.push('⚠ contested')
  else if (entry.confidence === 'speculative') flags.push('⚠ speculative')
  if (entry.theoryStatus === 'superseded' || entry.theoryStatus === 'rejected') {
    flags.push(`⚠ ${entry.theoryStatus}`)
  }
  if (entry.evidenceStatus === 'interpretation-debated') flags.push('⚠ interpretation debated')
  return (
    <li>
      <button
        type="button"
        className={styles.entry}
        data-entry-id={entry.id}
        onClick={() => onOpen(entry.id)}
      >
        <span className={styles.entryTitle}>{entry.title}</span>
        {entry.origin === 'personal' && (
          <span className={styles.entryMeta}>
            <ProvenanceBadge entry={entry} short />
          </span>
        )}
        <span className={styles.entryMeta}>
          <MarkerIcon kind={entry.kind} size={12} /> {KIND_LABELS[entry.kind]}
          {' · '}
          {entry.dateDisplay || 'Date unknown'}
          {place ? ` · ${place.name}` : ''}
        </span>
        <span className={styles.entrySummary}>{firstSentence(entry.summary)}</span>
        {flags.length > 0 && <span className={styles.badges}>{flags.join(' · ')}</span>}
      </button>
    </li>
  )
}
