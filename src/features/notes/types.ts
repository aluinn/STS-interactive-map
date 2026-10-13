import type { EntryKind, Period, RelationshipType, SourceMention } from '../../types'

/** Bump when the stored/exported shape changes; add a step to `migrate`. */
export const SCHEMA_VERSION = 1
export const PROJECT_FORMAT = 'sts-atlas-project'

/* ------------------------------------------------------------------ */
/* Extraction                                                          */
/* ------------------------------------------------------------------ */

export type FileKind = 'pdf' | 'txt' | 'md'

export interface PageText {
  /** 1-based. */
  page: number
  /** Paragraphs separated by blank lines. Headings are prefixed with `# `. */
  text: string
}

export interface ExtractedDocument {
  fileId: string
  fileName: string
  title: string
  kind: FileKind
  pageCount: number
  pages: PageText[]
  author?: string
  /** SHA-256 of the file bytes, used to skip re-processing unchanged files. */
  contentHash: string
  method: 'pdf-text' | 'plain-text' | 'markdown'
  warnings: string[]
  /** True when a PDF had so little extractable text that it is probably scanned. */
  scanned: boolean
  /** True when there were more pages than the page limit allowed. */
  truncated: boolean
}

export type ImportErrorCode =
  | 'unsupported'
  | 'too-large'
  | 'empty'
  | 'password'
  | 'damaged'
  | 'scanned'
  | 'cancelled'
  | 'too-many-pages'
  | 'unknown'

export class ImportError extends Error {
  code: ImportErrorCode
  constructor(code: ImportErrorCode, message: string) {
    super(message)
    this.name = 'ImportError'
    this.code = code
  }
}

export interface ImportLimits {
  maxFileBytes: number
  /** Above this, the user is warned before processing starts. */
  warnFileBytes: number
  maxPages: number
  maxFiles: number
  maxCharsPerPage: number
}

export const DEFAULT_LIMITS: ImportLimits = {
  maxFileBytes: 40 * 1024 * 1024,
  warnFileBytes: 15 * 1024 * 1024,
  maxPages: 400,
  maxFiles: 10,
  maxCharsPerPage: 60_000,
}

/* ------------------------------------------------------------------ */
/* Analysis                                                            */
/* ------------------------------------------------------------------ */

export type Confidence3 = 'high' | 'medium' | 'low'

export type ItemCategory =
  | 'person'
  | 'place'
  | 'institution'
  | 'publication'
  | 'concept'
  | 'theory'
  | 'technology'
  | 'instrument'
  | 'event'
  | 'period'

export interface ParsedDate {
  /** Negative for BCE. */
  start: number
  end?: number
  /** The wording in the notes, kept alongside the normalised years. */
  original: string
  precision: 'exact' | 'circa' | 'decade' | 'century' | 'period' | 'uncertain'
  approximate: boolean
}

export interface PlaceOption {
  id: string
  name: string
  latitude: number
  longitude: number
  /** e.g. "present-day Italy" or "Massachusetts, USA". */
  note?: string
  /** True when the notes' context supports this reading. */
  supported: boolean
}

export interface PlaceGuess {
  /** The wording that was matched. */
  text: string
  options: PlaceOption[]
  /** Index into options chosen by context, or null when it is ambiguous. */
  chosen: number | null
  /** Whether the place is a country/region rather than a specific site. */
  broad: boolean
}

export interface CandidateRelationship {
  id: string
  sourceKey: string
  targetKey: string
  type: RelationshipType
  mention: SourceMention
}

/** An entity found in the notes, before the user has seen it. */
export interface Candidate {
  /** Stable key within one analysis (normalised label + category). */
  key: string
  label: string
  category: ItemCategory
  /** Present when the notes mention something already in the curated atlas. */
  curatedIds: string[]
  confidence: Confidence3
  count: number
  mentions: SourceMention[]
  date: ParsedDate | null
  place: PlaceGuess | null
  disciplines: string[]
  topics: string[]
  /** What the notes say under this item's heading (used as its description). */
  sectionText?: string
}

export interface AnalysisWarning {
  code: string
  message: string
}

export interface AnalysisResult {
  candidates: Candidate[]
  relationships: CandidateRelationship[]
  /** Counts of every kind of thing noticed, including places/dates. */
  tally: Record<string, number>
  topics: TopicProfile
  datesFound: number
  placesFound: number
  warnings: AnalysisWarning[]
  ignoredSections: string[]
}

export interface TopicProfile {
  /** Share (0–1) of keyword hits per subject area id (see utils/areas). */
  shares: Record<string, number>
  top: string[]
  totalHits: number
}

/* ------------------------------------------------------------------ */
/* Personal collection (what is stored and exported)                   */
/* ------------------------------------------------------------------ */

export interface DocumentRecord {
  id: string
  fileName: string
  title: string
  kind: FileKind
  pageCount: number
  contentHash: string
  importedAt: string
  method: string
  warnings: string[]
}

export type ItemStatus = 'user-confirmed' | 'imported' | 'needs-review'

export interface StoredDate {
  start?: number
  end?: number
  display: string
  original?: string
  precision: ParsedDate['precision']
  approximate: boolean
}

export interface StoredPlace {
  name?: string
  latitude?: number
  longitude?: number
  note?: string
  /** The user said this item has no meaningful location. */
  nonGeographical: boolean
}

export interface PersonalItem {
  id: string
  title: string
  kind: EntryKind
  category: ItemCategory
  summary: string
  date: StoredDate
  place: StoredPlace
  disciplines: string[]
  topics: string[]
  period: Period
  confidence: Confidence3
  status: ItemStatus
  edits: string[]
  mentions: SourceMention[]
  extraction: string
  createdAt: string
}

/** A curated entry the notes mention (no copy is made). */
export interface CuratedLink {
  curatedId: string
  mentions: SourceMention[]
  status: 'user-confirmed' | 'imported'
}

export interface PersonalRelationship {
  id: string
  sourceRef: string
  targetRef: string
  type: RelationshipType
  mention: SourceMention
  status: 'proposed' | 'user-confirmed'
}

export interface CollectionSettings {
  /** Collections are drawn on the map using the viewer's chosen appearance. */
  note?: string
}

export interface PersonalCollection {
  schemaVersion: number
  id: string
  name: string
  createdAt: string
  updatedAt: string
  documents: DocumentRecord[]
  items: PersonalItem[]
  links: CuratedLink[]
  relationships: PersonalRelationship[]
  settings: CollectionSettings
}

/* ------------------------------------------------------------------ */
/* Review                                                              */
/* ------------------------------------------------------------------ */

export type ReviewDecision = 'pending' | 'accepted' | 'rejected'

export interface ReviewItem {
  id: string
  candidate: Candidate
  /** Linked curated entry (chosen from candidate.curatedIds) or null for a new item. */
  linkedId: string | null
  decision: ReviewDecision
  /** True once the user has looked at or changed this item. */
  touched: boolean
  title: string
  kind: EntryKind
  summary: string
  date: StoredDate
  place: StoredPlace
  placeChoice: number | null
  edits: string[]
}

export interface ReviewRelationship {
  id: string
  rel: CandidateRelationship
  decision: ReviewDecision
}

export interface ReviewState {
  documents: DocumentRecord[]
  items: ReviewItem[]
  relationships: ReviewRelationship[]
  analysis: AnalysisResult
}
