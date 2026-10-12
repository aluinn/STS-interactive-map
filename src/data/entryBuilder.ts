import type {
  Confidence,
  ContentStatus,
  Entry,
  EntryKind,
  EntryScale,
  EvidenceStatus,
  MissingVoice,
  Period,
  PlaceRef,
  Source,
  TheoryStatus,
} from '../types'

/**
 * A compact way to write entries: fills the repetitive structural fields
 * (slug, place list, flags) so the data files can concentrate on the
 * prose. Every field that is written is still checked by the `Entry` type.
 */
export interface EntrySeed {
  id: string
  title: string
  subtitle?: string
  kind: EntryKind
  period: Period
  summary: string
  long: string
  start: number
  end?: number
  date: string
  approx?: boolean
  /** Primary map position as [latitude, longitude, place name]; omit for ideas with no single place. */
  at?: [number, number, string]
  /** Further places the entry touches. */
  also?: PlaceRef[]
  people?: string[]
  cultures?: string[]
  disciplines?: string[]
  themes: string[]
  /** A reflective question, optionally tied to a debate id. */
  ask: string | [string, string]
  significance: string
  myth?: string
  complication?: string
  status?: TheoryStatus
  statusNote?: string
  evidence?: EvidenceStatus
  evidenceNote?: string
  voices?: MissingVoice[]
  scale?: EntryScale
  sources: Source[]
  related?: string[]
  confidence?: Confidence
  content?: ContentStatus
  precision?: Entry['datePrecision']
  transhistorical?: boolean
  closedYear?: number
  overturnedYear?: number
  /** ISO date a contemporary claim was last checked against a live source. */
  verified?: string
  explorer?: Entry['explorer']
  journey?: boolean
}

export function entry(seed: EntrySeed): Entry {
  const [latitude, longitude, placeName] = seed.at ?? [undefined, undefined, undefined]
  const places: PlaceRef[] = [
    ...(placeName !== undefined ? [{ name: placeName, latitude, longitude }] : []),
    ...(seed.also ?? []),
  ]
  const [prompt, debateId] = Array.isArray(seed.ask) ? seed.ask : [seed.ask, undefined]
  return {
    id: seed.id,
    slug: seed.id,
    title: seed.title,
    subtitle: seed.subtitle,
    kind: seed.kind,
    period: seed.period,
    summary: seed.summary,
    longDescription: seed.long,
    startYear: seed.start,
    endYear: seed.end,
    dateDisplay: seed.date,
    approximateDate: seed.approx ?? false,
    latitude,
    longitude,
    places,
    transregional: seed.at === undefined,
    people: seed.people ?? [],
    cultures: seed.cultures ?? [],
    disciplines: seed.disciplines ?? [],
    themes: seed.themes,
    philosophicalQuestions: [{ prompt, ...(debateId ? { debateId } : {}) }],
    historicalSignificance: seed.significance,
    commonMyth: seed.myth,
    historicalComplication: seed.complication,
    theoryStatus: seed.status,
    theoryStatusNote: seed.statusNote,
    scale: seed.scale,
    evidenceStatus: seed.evidence,
    evidenceStatusNote: seed.evidenceNote,
    missingVoices: seed.voices,
    sources: seed.sources,
    relatedEntryIds: seed.related ?? [],
    confidence: seed.confidence ?? 'likely',
    contentStatus: seed.content ?? 'complete',
    isJourneyStop: seed.journey,
    datePrecision: seed.precision,
    transhistorical: seed.transhistorical,
    closedYear: seed.closedYear,
    overturnedYear: seed.overturnedYear,
    lastVerified: seed.verified,
    explorer: seed.explorer,
  }
}

/** Shorthand for a source citation. */
export function src(
  author: string,
  title: string,
  year: string,
  type: Source['type'] = 'secondary',
  note?: string,
): Source {
  return { author, title, year, type, ...(note ? { note } : {}) }
}
