import type { Entry, Relationship, Source, SourceMention } from '../../types'
import { AREA_TO_THEME, TOPIC_TO_AREA } from './analysis/lexicon'
import type { PersonalCollection, PersonalItem } from './types'

/**
 * Adapters from a personal collection to the atlas's shared display model
 * (`Entry` / `Relationship`). The map, timeline, filters and detail panel
 * only ever see these, so personal material needs no separate map code.
 */

export const PERSONAL_ID_PREFIX = 'my-'

export function isPersonalId(id: string): boolean {
  return id.startsWith(PERSONAL_ID_PREFIX)
}

function precisionOf(p: PersonalItem['date']['precision']): Entry['datePrecision'] {
  return p === 'period' ? 'century' : p
}

function sourcesFrom(mentions: SourceMention[]): Source[] {
  const seen = new Map<string, Source>()
  for (const m of mentions) {
    const key = m.fileId
    const pages = mentions.filter((x) => x.fileId === key).map((x) => x.page)
    if (!seen.has(key)) {
      seen.set(key, {
        title: `${m.docTitle} (your notes)`,
        type: 'secondary',
        note: `Your own document “${m.fileName}”, ${pages.length > 1 ? 'pages' : 'page'} ${[...new Set(pages)].sort((a, b) => a - b).join(', ')}. Not checked against any published source.`,
      })
    }
  }
  return [...seen.values()]
}

export function itemToEntry(item: PersonalItem, collectionId: string): Entry {
  const hasPoint =
    !item.place.nonGeographical &&
    item.place.latitude !== undefined &&
    item.place.longitude !== undefined
  const undated = item.date.start === undefined
  const first = item.mentions[0]
  const themes = item.topics
    .map((t) => AREA_TO_THEME[TOPIC_TO_AREA[t] ?? ''])
    .filter((t): t is string => Boolean(t))
  const summary =
    item.summary ||
    (first
      ? `Mentioned in your notes (${first.docTitle}, page ${first.page}). Not verified.`
      : 'From your notes. Not verified.')
  return {
    id: item.id,
    slug: item.id,
    title: item.title,
    kind: item.kind,
    period: item.period,
    summary,
    longDescription: summary,
    startYear: item.date.start ?? 0,
    endYear: item.date.end,
    dateDisplay: item.date.display,
    approximateDate: item.date.approximate,
    latitude: hasPoint ? item.place.latitude : undefined,
    longitude: hasPoint ? item.place.longitude : undefined,
    places: hasPoint
      ? [
          {
            name: item.place.name ?? 'Place in your notes',
            latitude: item.place.latitude,
            longitude: item.place.longitude,
            ...(item.place.note ? { borderNote: item.place.note } : {}),
          },
        ]
      : [],
    transregional: !hasPoint,
    people: [],
    cultures: [],
    disciplines: item.disciplines,
    themes,
    philosophicalQuestions: [],
    historicalSignificance: '',
    sources: sourcesFrom(item.mentions),
    relatedEntryIds: [],
    confidence: 'speculative',
    contentStatus: 'draft',
    datePrecision: precisionOf(item.date.precision),
    transhistorical: undated || undefined,
    undated: undated || undefined,
    origin: 'personal',
    personal: {
      collectionId,
      status: item.status,
      confidence: item.confidence,
      extraction: item.extraction,
      importedAt: item.createdAt,
      edits: item.edits,
      mentions: item.mentions,
    },
  }
}

export interface PersonalAtlas {
  entries: Entry[]
  relationships: Relationship[]
  /** Curated entries the notes mention, with the passages that mention them. */
  linkedCurated: Map<string, SourceMention[]>
}

export function personalAtlas(collection: PersonalCollection | null): PersonalAtlas {
  if (!collection) return { entries: [], relationships: [], linkedCurated: new Map() }
  const entries = collection.items.map((i) => itemToEntry(i, collection.id))
  const linkedCurated = new Map(collection.links.map((l) => [l.curatedId, l.mentions]))
  const toId = (ref: string) => (ref.startsWith('item:') ? ref.slice(5) : ref.slice(8))
  const relationships: Relationship[] = collection.relationships.map((r) => ({
    id: `my-rel-${r.id}`,
    sourceId: toId(r.sourceRef),
    targetId: toId(r.targetRef),
    type: r.type,
    summary:
      r.status === 'proposed'
        ? `Proposed from your notes, not yet confirmed: “${r.mention.passage}”`
        : `From your notes: “${r.mention.passage}”`,
    confidence: 'speculative',
    origin: 'personal',
    proposed: r.status === 'proposed',
    passage: r.mention,
  }))
  const byId = new Map(entries.map((e) => [e.id, e]))
  for (const r of relationships) {
    const a = byId.get(r.sourceId)
    const b = byId.get(r.targetId)
    if (a && !a.relatedEntryIds.includes(r.targetId)) a.relatedEntryIds.push(r.targetId)
    if (b && !a && !b.relatedEntryIds.includes(r.sourceId)) b.relatedEntryIds.push(r.sourceId)
  }
  return { entries, relationships, linkedCurated }
}

/** Marks a curated entry with where the viewer's own notes mention it. */
export function withNotesMentions(entry: Entry, mentions: SourceMention[] | undefined): Entry {
  return mentions && mentions.length > 0 ? { ...entry, notesMentions: mentions } : entry
}
