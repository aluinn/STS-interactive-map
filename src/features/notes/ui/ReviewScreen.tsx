import { useId, useMemo, useState } from 'react'
import type { Entry, EntryKind } from '../../../types'
import { KIND_LABELS } from '../../../utils/kindLabels'
import { buildGazetteer, lookupPlace } from '../analysis/gazetteer'
import { locationLabel } from '../labels'
import {
  canBulkAccept,
  groupOf,
  parseUserDate,
  reviewHeadline,
  sortedCurated,
  type CommitOptions,
} from '../review'
import type {
  PlaceOption,
  ReviewDecision,
  ReviewItem,
  ReviewRelationship,
  ReviewState,
} from '../types'
import styles from './notes.module.css'

type Tab =
  | 'all'
  | 'confirmed'
  | 'possible'
  | 'new'
  | 'ambiguous'
  | 'nodate'
  | 'nolocation'
  | 'relationships'
  | 'ignored'
  | 'warnings'

const PAGE = 30

function isAmbiguousPlace(i: ReviewItem): boolean {
  const g = i.candidate.place
  return (
    !i.linkedId &&
    !i.place.nonGeographical &&
    i.place.latitude === undefined &&
    g !== null &&
    g.options.length > 1 &&
    g.chosen === null
  )
}

function matchesTab(i: ReviewItem, tab: Tab): boolean {
  if (tab === 'ignored') return i.decision === 'rejected'
  if (i.decision === 'rejected') return false
  switch (tab) {
    case 'all':
      return true
    case 'confirmed':
      return groupOf(i) === 'confirmed'
    case 'possible':
      return groupOf(i) === 'possible'
    case 'new':
      return groupOf(i) === 'new'
    case 'ambiguous':
      return isAmbiguousPlace(i)
    case 'nodate':
      return !i.linkedId && i.date.start === undefined
    case 'nolocation':
      return !i.linkedId && !i.place.nonGeographical && i.place.latitude === undefined
    default:
      return false
  }
}

interface ReviewScreenProps {
  review: ReviewState
  onChange: (next: ReviewState) => void
  curated: Entry[]
  collections: { id: string; name: string }[]
  activeId: string | null
  onFinish: (opts: CommitOptions & { targetId: string | 'new'; newName: string }) => void
  onBack: () => void
  headingRef: React.RefObject<HTMLHeadingElement | null>
  saving: boolean
}

export function ReviewScreen({
  review,
  onChange,
  curated,
  collections,
  activeId,
  onFinish,
  onBack,
  headingRef,
  saving,
}: ReviewScreenProps) {
  const [tab, setTab] = useState<Tab>('all')
  const [shown, setShown] = useState(PAGE)
  const [keepUndecided, setKeepUndecided] = useState(false)
  const [targetId, setTargetId] = useState<string>(activeId ?? 'new')
  const [newName, setNewName] = useState('My notes')
  const [announce, setAnnounce] = useState('')
  const curatedSorted = useMemo(() => sortedCurated(curated), [curated])
  const gazetteer = useMemo(() => buildGazetteer(curated), [curated])
  const idBase = useId()

  const counts = useMemo(() => {
    const c: Record<Tab, number> = {
      all: 0,
      confirmed: 0,
      possible: 0,
      new: 0,
      ambiguous: 0,
      nodate: 0,
      nolocation: 0,
      relationships: review.relationships.filter((r) => r.decision !== 'rejected').length,
      ignored: 0,
      warnings: review.analysis.warnings.length,
    }
    for (const i of review.items) {
      for (const t of [
        'all',
        'confirmed',
        'possible',
        'new',
        'ambiguous',
        'nodate',
        'nolocation',
        'ignored',
      ] as const) {
        if (matchesTab(i, t)) c[t]++
      }
    }
    return c
  }, [review])

  const accepted = review.items.filter((i) => i.decision === 'accepted').length
  const undecided = review.items.filter((i) => i.decision === 'pending').length
  const bulkable = review.items.filter(canBulkAccept)

  function setItem(id: string, patch: Partial<ReviewItem>, edited?: string) {
    onChange({
      ...review,
      items: review.items.map((i) =>
        i.id === id
          ? {
              ...i,
              ...patch,
              touched: true,
              edits: edited && !i.edits.includes(edited) ? [...i.edits, edited] : i.edits,
            }
          : i,
      ),
    })
  }
  function decide(id: string, decision: ReviewDecision, title: string) {
    setItem(id, { decision })
    setAnnounce(
      `${title}: ${decision === 'accepted' ? 'accepted' : decision === 'rejected' ? 'rejected' : 'moved back to undecided'}.`,
    )
  }
  function setRel(id: string, decision: ReviewDecision) {
    onChange({
      ...review,
      relationships: review.relationships.map((r) => (r.id === id ? { ...r, decision } : r)),
    })
  }
  function bulkAccept() {
    const ids = new Set(bulkable.map((i) => i.id))
    onChange({
      ...review,
      items: review.items.map((i) => (ids.has(i.id) ? { ...i, decision: 'accepted' as const } : i)),
    })
    setAnnounce(`Accepted ${ids.size} high-confidence matches to the curated atlas.`)
  }

  const list = review.items.filter((i) => matchesTab(i, tab))
  const TABS: [Tab, string][] = [
    ['all', 'All'],
    ['confirmed', 'Confirmed matches'],
    ['possible', 'Possible matches'],
    ['new', 'New personal entries'],
    ['ambiguous', 'Ambiguous places'],
    ['nodate', 'Missing dates'],
    ['nolocation', 'Missing locations'],
    ['relationships', 'Proposed relationships'],
    ['ignored', 'Ignored'],
    ['warnings', 'Warnings'],
  ]

  return (
    <div className={styles.stack}>
      <h3 className={styles.heading} tabIndex={-1} ref={headingRef}>
        Review what was found
      </h3>
      <p className={styles.sub}>{reviewHeadline(review)}</p>
      <p className={`${styles.callout} ${styles.calloutInfo}`}>
        Everything below was found by simple local rules (known names, dates and phrases), not by an
        AI that understands your notes. Nothing is added to the map until you accept it. Check the
        passage under each item.
      </p>

      <div className={styles.tabs} role="group" aria-label="Review sections">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`${styles.tab} ${tab === id ? styles.tabActive : ''}`}
            aria-pressed={tab === id}
            onClick={() => {
              setTab(id)
              setShown(PAGE)
            }}
          >
            {label} ({counts[id]})
          </button>
        ))}
      </div>

      <div role="status" aria-live="polite" className={styles.srOnly}>
        {announce}
      </div>

      {tab === 'confirmed' && bulkable.length > 0 && (
        <div className={styles.row}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={bulkAccept}
          >
            Accept all {bulkable.length} exact matches
          </button>
          <span className={styles.small}>
            Only exact, unambiguous matches to the curated atlas can be accepted together. Possible
            matches and new entries need individual review.
          </span>
        </div>
      )}

      {tab === 'relationships' ? (
        review.relationships.length === 0 ? (
          <p className={styles.sub}>
            No relationships were proposed. They are suggested only when two known things appear in
            one sentence with a clear cue such as “influenced”, “criticised” or “worked at”.
          </p>
        ) : (
          <ul className={styles.cards}>
            {review.relationships.map((r) => (
              <RelationCard key={r.id} r={r} review={review} onSet={(d) => setRel(r.id, d)} />
            ))}
          </ul>
        )
      ) : tab === 'warnings' ? (
        <WarningsPanel review={review} />
      ) : list.length === 0 ? (
        <p className={styles.sub}>
          {tab === 'all'
            ? 'Nothing was recognised in these notes. Try notes that name people, dates and ideas, or add entries by hand later.'
            : 'Nothing in this section.'}
        </p>
      ) : (
        <>
          <ul className={styles.cards}>
            {list.slice(0, shown).map((i) => (
              <ItemCard
                key={i.id}
                item={i}
                idBase={`${idBase}-${i.id}`}
                curated={curatedSorted}
                gazetteer={gazetteer}
                autoOpen={tab === 'ambiguous' || tab === 'nodate' || tab === 'nolocation'}
                onDecide={(d) => decide(i.id, d, i.title)}
                onPatch={setItem}
              />
            ))}
          </ul>
          {list.length > shown && (
            <button type="button" className={styles.btn} onClick={() => setShown((n) => n + PAGE)}>
              Show {Math.min(PAGE, list.length - shown)} more ({list.length - shown} left)
            </button>
          )}
        </>
      )}

      <div className={styles.finish}>
        <div className={styles.finishCount}>
          <strong>
            {accepted} accepted · {undecided} undecided
          </strong>
          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={keepUndecided}
              onChange={(e) => setKeepUndecided(e.target.checked)}
            />
            <span>Also keep the undecided items, marked as unreviewed suggestions</span>
          </label>
        </div>
        <label className={styles.label}>
          Add to
          <select
            className={styles.select}
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="new">A new collection…</option>
          </select>
        </label>
        {targetId === 'new' && (
          <label className={styles.label}>
            Name
            <input
              className={styles.input}
              value={newName}
              maxLength={120}
              onChange={(e) => setNewName(e.target.value)}
            />
          </label>
        )}
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={saving || (accepted === 0 && !(keepUndecided && undecided > 0))}
          onClick={() => onFinish({ keepUndecided, targetId, newName })}
        >
          {saving ? 'Saving on this device…' : 'Add to my atlas'}
        </button>
        <button type="button" className={styles.btn} onClick={onBack}>
          Back to files
        </button>
      </div>
    </div>
  )
}

function WarningsPanel({ review }: { review: ReviewState }) {
  const docWarnings = review.documents.flatMap((d) => d.warnings.map((w) => `${d.fileName}: ${w}`))
  const all = [...review.analysis.warnings.map((w) => w.message), ...docWarnings]
  return all.length === 0 ? (
    <p className={styles.sub}>No extraction warnings.</p>
  ) : (
    <ul>
      {all.map((w) => (
        <li key={w}>{w}</li>
      ))}
    </ul>
  )
}

function endpointName(review: ReviewState, key: string): string {
  return review.items.find((i) => i.candidate.key === key)?.title ?? key
}

function RelationCard({
  r,
  review,
  onSet,
}: {
  r: ReviewRelationship
  review: ReviewState
  onSet: (d: ReviewDecision) => void
}) {
  const m = r.rel.mention
  return (
    <li
      className={`${styles.card} ${r.decision === 'accepted' ? styles.cardAccepted : ''} ${r.decision === 'rejected' ? styles.cardRejected : ''}`}
    >
      <div className={styles.cardHead}>
        <p className={styles.cardTitle}>
          {endpointName(review, r.rel.sourceKey)} → {r.rel.type.replace(/-/g, ' ')} →{' '}
          {endpointName(review, r.rel.targetKey)}
        </p>
        <span className={`${styles.badge} ${styles.badgeUnreviewed}`}>Proposed</span>
      </div>
      <blockquote className={styles.quote}>
        “{m.passage}”{' '}
        <span className={styles.quoteSource}>
          — {m.docTitle}, {locationLabel(m)}
        </span>
      </blockquote>
      <div className={styles.row}>
        <button
          type="button"
          className={`${styles.btn} ${r.decision === 'accepted' ? styles.btnPrimary : ''}`}
          aria-pressed={r.decision === 'accepted'}
          onClick={() => onSet(r.decision === 'accepted' ? 'pending' : 'accepted')}
        >
          {r.decision === 'accepted' ? 'Accepted' : 'Accept'}
        </button>
        <button
          type="button"
          className={styles.btn}
          aria-pressed={r.decision === 'rejected'}
          onClick={() => onSet(r.decision === 'rejected' ? 'pending' : 'rejected')}
        >
          {r.decision === 'rejected' ? 'Rejected (undo)' : 'Reject'}
        </button>
      </div>
    </li>
  )
}

interface ItemCardProps {
  item: ReviewItem
  idBase: string
  curated: Entry[]
  gazetteer: ReturnType<typeof buildGazetteer>
  autoOpen: boolean
  onDecide: (d: ReviewDecision) => void
  onPatch: (id: string, patch: Partial<ReviewItem>, edited?: string) => void
}

const KIND_ORDER = Object.keys(KIND_LABELS) as EntryKind[]

function ItemCard({
  item,
  idBase,
  curated,
  gazetteer,
  autoOpen,
  onDecide,
  onPatch,
}: ItemCardProps) {
  const [open, setOpen] = useState(autoOpen)
  const [dateText, setDateText] = useState(
    item.date.start === undefined ? '' : (item.date.original ?? item.date.display),
  )
  const [dateError, setDateError] = useState('')
  const [placeText, setPlaceText] = useState('')
  const [lookup, setLookup] = useState<PlaceOption[]>([])
  const [lookupMsg, setLookupMsg] = useState('')
  const c = item.candidate
  const g = c.place
  const first = c.mentions[0]
  const group = groupOf(item)
  const linked = item.linkedId ? curated.find((e) => e.id === item.linkedId) : undefined
  const options: PlaceOption[] = [...(g?.options ?? []), ...lookup]
  const placeIndex = options.findIndex(
    (o) => o.latitude === item.place.latitude && o.longitude === item.place.longitude,
  )
  const selectedPlace = item.place.nonGeographical
    ? 'nongeo'
    : item.place.latitude === undefined || placeIndex < 0
      ? 'none'
      : `opt:${placeIndex}`

  function choosePlace(value: string) {
    if (value === 'nongeo')
      onPatch(item.id, { place: { nonGeographical: true }, placeChoice: null }, 'location')
    else if (value === 'none')
      onPatch(item.id, { place: { nonGeographical: false }, placeChoice: null }, 'location')
    else {
      const o = options[Number(value.slice(4))]
      if (o)
        onPatch(
          item.id,
          {
            place: {
              name: o.name,
              latitude: o.latitude,
              longitude: o.longitude,
              note: o.note,
              nonGeographical: false,
            },
          },
          'location',
        )
    }
  }

  return (
    <li
      className={`${styles.card} ${item.decision === 'accepted' ? styles.cardAccepted : ''} ${item.decision === 'rejected' ? styles.cardRejected : ''}`}
    >
      <div className={styles.cardHead}>
        <p className={styles.cardTitle}>{item.title}</p>
        <span className={styles.badge}>{KIND_LABELS[item.kind]}</span>
        <span className={styles.badge}>
          {group === 'confirmed'
            ? 'Exact match to curated atlas'
            : group === 'possible'
              ? 'Possible match'
              : 'New · unverified'}
        </span>
        <span className={styles.badge}>Confidence: {c.confidence}</span>
        {item.decision === 'accepted' && (
          <span className={`${styles.badge} ${styles.badgeConfirmed}`}>Accepted</span>
        )}
      </div>

      {linked && (
        <p className={styles.small}>
          Links to the curated entry “{linked.title}” (no duplicate is created).
        </p>
      )}
      {!linked && c.curatedIds.length > 1 && (
        <p className={styles.small}>
          This could be several curated entries. Open “Edit” and choose one, or keep it as a new
          personal entry.
        </p>
      )}

      {first && (
        <blockquote className={styles.quote}>
          “{first.passage}”{' '}
          <span className={styles.quoteSource}>
            — {first.docTitle}, {locationLabel(first)}
            {c.count > 1 ? ` · ${c.count} mentions` : ''}
          </span>
        </blockquote>
      )}
      {!linked && (
        <p className={styles.small}>
          {item.date.start === undefined ? 'No date found' : `Date: ${item.date.display}`}
          {' · '}
          {item.place.nonGeographical
            ? 'Not tied to a place'
            : item.place.name
              ? `Place: ${item.place.name}${item.place.note ? ` (${item.place.note})` : ''}`
              : isAmbiguousPlace(item)
                ? 'Place is ambiguous: choose one'
                : 'No location'}
        </p>
      )}

      <div className={styles.row}>
        <button
          type="button"
          className={`${styles.btn} ${item.decision === 'accepted' ? styles.btnPrimary : ''}`}
          aria-pressed={item.decision === 'accepted'}
          onClick={() => onDecide(item.decision === 'accepted' ? 'pending' : 'accepted')}
        >
          {item.decision === 'accepted' ? 'Accepted' : 'Accept'}
        </button>
        <button
          type="button"
          className={styles.btn}
          aria-pressed={item.decision === 'rejected'}
          onClick={() => onDecide(item.decision === 'rejected' ? 'pending' : 'rejected')}
        >
          {item.decision === 'rejected' ? 'Rejected (undo)' : 'Reject'}
        </button>
        <button
          type="button"
          className={styles.btn}
          aria-expanded={open}
          aria-controls={`${idBase}-edit`}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close editor' : 'Edit'}
        </button>
      </div>

      {open && (
        <div id={`${idBase}-edit`} className={styles.editGrid}>
          <label className={styles.label}>
            Title
            <input
              className={styles.input}
              value={item.title}
              maxLength={200}
              onChange={(e) => onPatch(item.id, { title: e.target.value }, 'title')}
            />
          </label>
          <label className={styles.label}>
            Category
            <select
              className={styles.select}
              value={item.kind}
              onChange={(e) => onPatch(item.id, { kind: e.target.value as EntryKind }, 'category')}
            >
              {KIND_ORDER.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Merge with a curated entry
            <select
              className={styles.select}
              value={item.linkedId ?? ''}
              onChange={(e) => onPatch(item.id, { linkedId: e.target.value || null }, 'merge')}
            >
              <option value="">Keep as a new personal entry</option>
              {c.curatedIds.map((id) => {
                const e = curated.find((x) => x.id === id)
                return e ? (
                  <option key={`s-${id}`} value={id}>
                    Suggested: {e.title}
                  </option>
                ) : null
              })}
              {curated.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.label}>
            Date (e.g. 1687, 1543–1687, c. 300 BCE)
            <input
              className={styles.input}
              value={dateText}
              aria-invalid={dateError ? true : undefined}
              aria-describedby={dateError ? `${idBase}-derr` : undefined}
              onChange={(e) => {
                const text = e.target.value
                setDateText(text)
                const parsed = parseUserDate(text)
                if (parsed) {
                  setDateError('')
                  onPatch(item.id, { date: parsed }, 'date')
                } else setDateError('Use a year or range like 1687, 1543–1687 or c. 300 BCE.')
              }}
            />
            {dateError && (
              <span id={`${idBase}-derr`} className={styles.errorText} role="alert">
                {dateError}
              </span>
            )}
          </label>
          <label className={styles.label}>
            Location
            <select
              className={styles.select}
              value={selectedPlace}
              onChange={(e) => choosePlace(e.target.value)}
            >
              <option value="none">No location yet</option>
              <option value="nongeo">Not tied to a place (non-geographical)</option>
              {options.map((o, n) => (
                <option key={`${o.id}-${n}`} value={`opt:${n}`}>
                  {o.name}
                  {o.note ? ` — ${o.note}` : ''}
                  {o.supported ? ' (matches the surrounding words)' : ''}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.label}>
            <label>
              Look up another place
              <input
                className={styles.input}
                value={placeText}
                maxLength={80}
                onChange={(e) => setPlaceText(e.target.value)}
              />
            </label>
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                const found = lookupPlace(placeText, gazetteer)
                setLookup(found)
                setLookupMsg(
                  found.length
                    ? `${found.length} match${found.length === 1 ? '' : 'es'} added to the Location list.`
                    : 'No such place in the built-in list. Choose “Not tied to a place” if it has no clear location.',
                )
                if (found.length === 1) {
                  const o = found[0]
                  onPatch(
                    item.id,
                    {
                      place: {
                        name: o.name,
                        latitude: o.latitude,
                        longitude: o.longitude,
                        note: o.note,
                        nonGeographical: false,
                      },
                    },
                    'location',
                  )
                }
              }}
              disabled={!placeText.trim()}
            >
              Look up
            </button>
            <span className={styles.small} role="status">
              {lookupMsg}
            </span>
          </div>
          <label className={styles.label} style={{ gridColumn: '1 / -1' }}>
            Short description (optional, your own words)
            <textarea
              className={styles.textarea}
              value={item.summary}
              maxLength={600}
              onChange={(e) => onPatch(item.id, { summary: e.target.value }, 'description')}
            />
          </label>
          {c.mentions.length > 1 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <p className={styles.small}>More supporting passages</p>
              {c.mentions.slice(1).map((m) => (
                <blockquote key={m.passage} className={styles.quote}>
                  “{m.passage}”{' '}
                  <span className={styles.quoteSource}>
                    — {m.docTitle}, {locationLabel(m)}
                  </span>
                </blockquote>
              ))}
            </div>
          )}
        </div>
      )}
    </li>
  )
}
