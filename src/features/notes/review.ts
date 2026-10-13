import type { Entry, SourceMention } from '../../types'
import { describeDate, formatRange, periodForYear } from './analysis/dates'
import { kindForCategory } from './analysis/lexicon'
import { slugify } from './analysis/text'
import type {
  AnalysisResult,
  Candidate,
  CuratedLink,
  DocumentRecord,
  ItemCategory,
  PersonalCollection,
  PersonalItem,
  PersonalRelationship,
  ReviewItem,
  ReviewRelationship,
  ReviewState,
  StoredDate,
  StoredPlace,
} from './types'

/** Categories that are ideas rather than things at a place: no location by default. */
const NON_GEOGRAPHICAL = new Set<ItemCategory>(['concept', 'theory', 'period'])

export const UNDATED: StoredDate = {
  display: 'Date not given in notes',
  precision: 'uncertain',
  approximate: false,
}

export function storedDateFrom(c: Candidate): StoredDate {
  if (!c.date) return { ...UNDATED }
  return {
    start: c.date.start,
    end: c.date.end,
    display: describeDate(c.date),
    original: c.date.original,
    precision: c.date.precision,
    approximate: c.date.approximate,
  }
}

/** A date the user typed: "1687", "1543–1687", "c. 300 BCE" (kept simple). */
export function parseUserDate(text: string): StoredDate | null {
  const t = text.trim()
  if (!t) return { ...UNDATED }
  const m =
    /^(c\.?\s*)?(\d{1,4})\s*(BCE|BC|CE|AD)?\s*(?:[–—-]\s*(\d{1,4})\s*(BCE|BC|CE|AD)?)?$/i.exec(t)
  if (!m) return null
  const sign = (era?: string) => (era && /^(bce|bc)$/i.test(era) ? -1 : 1)
  const a = parseInt(m[2], 10) * sign(m[3] ?? m[5])
  const b = m[4] ? parseInt(m[4], 10) * sign(m[5] ?? m[3]) : undefined
  if (b !== undefined && b < a) return null
  const approximate = Boolean(m[1])
  return {
    start: a,
    end: b,
    display: formatRange(a, b, approximate),
    original: t,
    precision: approximate ? 'circa' : 'exact',
    approximate,
  }
}

function placeFrom(c: Candidate): { place: StoredPlace; choice: number | null } {
  const g = c.place
  if (NON_GEOGRAPHICAL.has(c.category)) {
    return { place: { nonGeographical: true }, choice: null }
  }
  if (!g) return { place: { nonGeographical: false }, choice: null }
  if (g.chosen === null) return { place: { nonGeographical: false }, choice: null }
  const o = g.options[g.chosen]
  return {
    place: {
      name: o.name,
      latitude: o.latitude,
      longitude: o.longitude,
      note: o.note ?? (g.broad ? 'a whole country or region, shown at its centre' : undefined),
      nonGeographical: false,
    },
    choice: g.chosen,
  }
}

/** Vocabulary terms are stored in lower case; show them as a sentence-case title. */
function displayTitle(c: Candidate): string {
  if (c.curatedIds.length > 0 || c.category === 'person' || /^\p{Lu}/u.test(c.label)) return c.label
  return c.label.charAt(0).toUpperCase() + c.label.slice(1)
}

/** The notes under a heading, trimmed to whole sentences, as a starting description. */
function sectionSummary(text: string | undefined): string {
  if (!text) return ''
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= 600) return t
  const cut = t.slice(0, 600)
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '))
  return `${end > 200 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '')} …`
}

/** Converts raw analysis into the list the user will review. */
export function buildReview(analysis: AnalysisResult, documents: DocumentRecord[]): ReviewState {
  const items: ReviewItem[] = analysis.candidates.map((c, n) => {
    const linkedId = c.curatedIds.length === 1 ? c.curatedIds[0] : null
    const { place, choice } = placeFrom(c)
    return {
      id: `rv-${n}`,
      candidate: c,
      linkedId,
      decision: 'pending',
      touched: false,
      title: displayTitle(c),
      kind: kindForCategory(c.category),
      summary: linkedId ? '' : sectionSummary(c.sectionText),
      date: storedDateFrom(c),
      place,
      placeChoice: choice,
      edits: [],
    }
  })
  const keyToId = new Map(items.map((i) => [i.candidate.key, i.id]))
  const relationships: ReviewRelationship[] = analysis.relationships
    .filter((r) => keyToId.has(r.sourceKey) && keyToId.has(r.targetKey))
    .map((r) => ({ id: r.id, rel: r, decision: 'pending' as const }))
  return { documents, items, relationships, analysis }
}

/** Groups used by the review screen. */
export type ReviewGroup = 'confirmed' | 'possible' | 'new'

export function groupOf(item: ReviewItem): ReviewGroup {
  const c = item.candidate
  if (c.curatedIds.length === 0) return 'new'
  if (c.confidence === 'high' && item.linkedId) return 'confirmed'
  return 'possible'
}

/** Only matches that are exact and unambiguous may be accepted in bulk. */
export function canBulkAccept(item: ReviewItem): boolean {
  return groupOf(item) === 'confirmed' && item.decision === 'pending'
}

function mergeMentions(a: SourceMention[], b: SourceMention[]): SourceMention[] {
  const out = [...a]
  for (const m of b) {
    if (!out.some((x) => x.fileId === m.fileId && x.page === m.page && x.passage === m.passage))
      out.push(m)
  }
  return out.slice(0, 20)
}

function itemId(kind: string, title: string): string {
  return `my-${kind}-${slugify(title)}`
}

function periodFor(date: StoredDate, topics: string[], category: ItemCategory) {
  if (date.start === undefined) {
    return topics.includes('philosophy') && NON_GEOGRAPHICAL.has(category)
      ? ('philosophy-of-science' as const)
      : periodForYear(2000)
  }
  if (topics.includes('philosophy') && NON_GEOGRAPHICAL.has(category) && date.start > 1500) {
    return 'philosophy-of-science' as const
  }
  return periodForYear(date.start)
}

export interface CommitOptions {
  /** Keep items the user did not decide on, as clearly marked unreviewed suggestions. */
  keepUndecided: boolean
}

export interface CommitSummary {
  itemsAdded: number
  itemsMerged: number
  linksAdded: number
  relationshipsAdded: number
  skippedDocuments: string[]
}

/** Applies the user's decisions to a collection. Pure: returns a new collection. */
export function commitReview(
  collection: PersonalCollection,
  review: ReviewState,
  opts: CommitOptions,
  now = new Date(),
): { collection: PersonalCollection; summary: CommitSummary } {
  const stamp = now.toISOString()
  const items = [...collection.items]
  const links = [...collection.links]
  const rels = [...collection.relationships]
  const summary: CommitSummary = {
    itemsAdded: 0,
    itemsMerged: 0,
    linksAdded: 0,
    relationshipsAdded: 0,
    skippedDocuments: [],
  }

  const existingHashes = new Set(collection.documents.map((d) => d.contentHash))
  const docs = [...collection.documents]
  for (const d of review.documents) {
    if (existingHashes.has(d.contentHash)) summary.skippedDocuments.push(d.fileName)
    else docs.push(d)
  }

  const refOf = new Map<string, string>()
  const keep = (it: ReviewItem) =>
    it.decision === 'accepted' || (opts.keepUndecided && it.decision === 'pending')

  for (const it of review.items) {
    if (!keep(it)) continue
    const accepted = it.decision === 'accepted'
    const c = it.candidate
    if (it.linkedId) {
      const status: CuratedLink['status'] = accepted && it.touched ? 'user-confirmed' : 'imported'
      // An undecided match is kept only when it is exact and unambiguous.
      if (!accepted && c.confidence !== 'high') continue
      const existing = links.find((l) => l.curatedId === it.linkedId)
      if (existing) {
        existing.mentions = mergeMentions(existing.mentions, c.mentions)
        if (status === 'user-confirmed') existing.status = status
      } else {
        links.push({ curatedId: it.linkedId, mentions: c.mentions, status })
        summary.linksAdded++
      }
      refOf.set(c.key, `curated:${it.linkedId}`)
      continue
    }
    const title = it.title.trim() || c.label
    const id = itemId(it.kind, title)
    const topics = c.topics
    const status = accepted ? (it.touched ? 'user-confirmed' : 'imported') : 'needs-review'
    const base: PersonalItem = {
      id,
      title,
      kind: it.kind,
      category: c.category,
      summary: it.summary.trim(),
      date: it.date,
      place: it.place,
      disciplines: c.disciplines,
      topics,
      period: periodFor(it.date, topics, c.category),
      confidence: c.confidence,
      status,
      edits: it.edits,
      mentions: c.mentions,
      extraction: 'rule-based (local)',
      createdAt: stamp,
    }
    const at = items.findIndex((x) => x.id === id)
    if (at >= 0) {
      const prev = items[at]
      items[at] = {
        ...prev,
        mentions: mergeMentions(prev.mentions, base.mentions),
        // Keep the user's own wording and corrections where they exist.
        summary: prev.summary || base.summary,
        status:
          prev.status === 'user-confirmed' || status === 'user-confirmed'
            ? 'user-confirmed'
            : prev.status,
      }
      summary.itemsMerged++
    } else {
      items.push(base)
      summary.itemsAdded++
    }
    refOf.set(c.key, `item:${id}`)
  }

  const seen = new Set(rels.map((r) => `${r.sourceRef}|${r.type}|${r.targetRef}`))
  for (const r of review.relationships) {
    const accepted = r.decision === 'accepted'
    if (!accepted && !(opts.keepUndecided && r.decision === 'pending')) continue
    const sourceRef = refOf.get(r.rel.sourceKey)
    const targetRef = refOf.get(r.rel.targetKey)
    if (!sourceRef || !targetRef || sourceRef === targetRef) continue
    const sig = `${sourceRef}|${r.rel.type}|${targetRef}`
    if (seen.has(sig)) continue
    seen.add(sig)
    const rel: PersonalRelationship = {
      id: `${r.rel.id}`,
      sourceRef,
      targetRef,
      type: r.rel.type,
      mention: r.rel.mention,
      status: accepted ? 'user-confirmed' : 'proposed',
    }
    rels.push(rel)
    summary.relationshipsAdded++
  }

  return {
    collection: {
      ...collection,
      documents: docs,
      items,
      links,
      relationships: rels,
      updatedAt: stamp,
    },
    summary,
  }
}

/** A short text for the review screen's headline. */
export function reviewHeadline(review: ReviewState): string {
  const count = (cats: ItemCategory[]) =>
    review.items.filter((i) => cats.includes(i.candidate.category)).length
  const parts = [
    [count(['person']), 'people'],
    [review.analysis.placesFound, 'places'],
    [count(['event']), 'events'],
    [
      count(['concept', 'theory', 'technology', 'instrument', 'publication', 'institution']),
      'concepts and things',
    ],
    [review.relationships.length, 'possible relationships'],
  ] as const
  return `Found ${parts.map(([n, label]) => `${n} ${label}`).join(', ')}.`
}

/** Entries that are not in the curated atlas, for the "merge with existing" picker. */
export function sortedCurated(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => a.title.localeCompare(b.title))
}
