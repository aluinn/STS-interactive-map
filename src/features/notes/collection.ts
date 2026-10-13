import type { EntryKind, Period, RelationshipType, SourceMention } from '../../types'
import {
  PROJECT_FORMAT,
  SCHEMA_VERSION,
  type CuratedLink,
  type DocumentRecord,
  type ItemCategory,
  type ItemStatus,
  type ParsedDate,
  type PersonalCollection,
  type PersonalItem,
  type PersonalRelationship,
  type StoredDate,
  type StoredPlace,
} from './types'
import { newId, sanitiseFileName, stripControl } from './analysis/text'

/**
 * Everything that crosses a trust boundary (project files, and records read
 * back from storage) passes through `sanitiseCollection`. It copies only the
 * fields it knows about into fresh objects, bounds every string and array,
 * and rejects anything structurally wrong. Nothing parsed is ever trusted
 * or merged into an existing object.
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class UnsupportedVersionError extends ValidationError {
  version: number
  constructor(version: number) {
    super(`This file uses schema version ${version}, which this version of the atlas cannot read.`)
    this.name = 'UnsupportedVersionError'
    this.version = version
  }
}

const LIMITS = {
  items: 5000,
  links: 5000,
  relationships: 10000,
  documents: 200,
  mentions: 20,
  str: 4000,
  title: 300,
  list: 30,
  maxProjectBytes: 25 * 1024 * 1024,
}

const KINDS: EntryKind[] = [
  'person',
  'idea',
  'discovery',
  'experiment',
  'instrument',
  'text',
  'institution',
  'event',
  'debate',
]
const PERIODS: Period[] = [
  'ancient',
  'classical',
  'medieval-translation',
  'renaissance',
  'early-modern',
  'enlightenment',
  'industrial-imperial',
  'professional-science',
  'war-and-big-science',
  'cold-war',
  'environmental-contemporary',
  'philosophy-of-science',
]
const REL_TYPES: RelationshipType[] = [
  'influenced',
  'taught',
  'translated',
  'corresponded',
  'travelled',
  'collaborated',
  'criticised',
  'supported',
  'challenged',
  'replaced',
  'preserved',
  'funded',
  'appropriated',
  'excluded',
  'extracted',
  'institutionalised',
  'independently-developed',
  'commercialised',
  'regulated',
  'co-produced',
  'represented',
  'materially-enabled',
  'contested',
  'revised',
  'applied-to',
  'worked-at',
  'published',
  'developed',
]
const CATEGORIES: ItemCategory[] = [
  'person',
  'place',
  'institution',
  'publication',
  'concept',
  'theory',
  'technology',
  'instrument',
  'event',
  'period',
]
const PRECISIONS: ParsedDate['precision'][] = [
  'exact',
  'circa',
  'decade',
  'century',
  'period',
  'uncertain',
]
const STATUSES: ItemStatus[] = ['user-confirmed', 'imported', 'needs-review']

type Json = Record<string, unknown>

const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v)

function str(v: unknown, max = LIMITS.str, fallback = ''): string {
  return typeof v === 'string' ? stripControl(v).slice(0, max) : fallback
}
function optStr(v: unknown, max = LIMITS.str): string | undefined {
  const s = str(v, max)
  return s ? s : undefined
}
function num(v: unknown, min: number, max: number): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : undefined
}
function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : fallback
}
function list<T>(v: unknown, max: number, each: (x: unknown) => T | null): T[] {
  if (!Array.isArray(v)) return []
  const out: T[] = []
  for (const x of v.slice(0, max)) {
    const r = each(x)
    if (r !== null) out.push(r)
  }
  return out
}
function strList(v: unknown, max = LIMITS.list, len = 120): string[] {
  return list(v, max, (x) => (typeof x === 'string' ? str(x, len) : null)).filter(Boolean)
}
function iso(v: unknown, fallback: string): string {
  return typeof v === 'string' && !Number.isNaN(Date.parse(v))
    ? new Date(v).toISOString()
    : fallback
}
/** Ids are used as keys and in URLs: keep them to a plain safe alphabet. */
function id(v: unknown): string | null {
  return typeof v === 'string' && /^[A-Za-z0-9:_.+|-]{1,160}$/.test(v) ? v : null
}

function mention(v: unknown): SourceMention | null {
  if (!isObj(v)) return null
  const fileId = id(v.fileId)
  const passage = str(v.passage, 800)
  if (!fileId || !passage) return null
  return {
    fileId,
    fileName: sanitiseFileName(str(v.fileName, 200, 'untitled')),
    docTitle: str(v.docTitle, LIMITS.title, 'Untitled'),
    page: Math.round(num(v.page, 1, 100000) ?? 1),
    ...(optStr(v.section, 160) ? { section: optStr(v.section, 160) } : {}),
    passage,
    method: str(v.method, 60, 'unknown'),
  }
}

function storedDate(v: unknown): StoredDate {
  const o = isObj(v) ? v : {}
  return {
    start: num(o.start, -10000, 3000),
    end: num(o.end, -10000, 3000),
    display: str(o.display, 160, 'Date not given in notes'),
    original: optStr(o.original, 160),
    precision: oneOf(o.precision, PRECISIONS, 'uncertain'),
    approximate: o.approximate === true,
  }
}

function storedPlace(v: unknown): StoredPlace {
  const o = isObj(v) ? v : {}
  const lat = num(o.latitude, -90, 90)
  const lon = num(o.longitude, -180, 180)
  const hasCoords = lat !== undefined && lon !== undefined
  return {
    name: optStr(o.name, 200),
    latitude: hasCoords ? lat : undefined,
    longitude: hasCoords ? lon : undefined,
    note: optStr(o.note, 300),
    nonGeographical: o.nonGeographical === true,
  }
}

function documentRecord(v: unknown): DocumentRecord | null {
  if (!isObj(v)) return null
  const docId = id(v.id)
  if (!docId) return null
  return {
    id: docId,
    fileName: sanitiseFileName(str(v.fileName, 200, 'untitled')),
    title: str(v.title, LIMITS.title, 'Untitled'),
    kind: oneOf(v.kind, ['pdf', 'txt', 'md'] as const, 'txt'),
    pageCount: Math.round(num(v.pageCount, 0, 100000) ?? 0),
    contentHash: str(v.contentHash, 80),
    importedAt: iso(v.importedAt, new Date(0).toISOString()),
    method: str(v.method, 60),
    warnings: strList(v.warnings, 10, 300),
  }
}

function personalItem(v: unknown): PersonalItem | null {
  if (!isObj(v)) return null
  const itemId = id(v.id)
  const title = str(v.title, LIMITS.title)
  if (!itemId || !title) return null
  return {
    id: itemId,
    title,
    kind: oneOf(v.kind, KINDS, 'idea'),
    category: oneOf(v.category, CATEGORIES, 'concept'),
    summary: str(v.summary, 1200),
    date: storedDate(v.date),
    place: storedPlace(v.place),
    disciplines: strList(v.disciplines, 8, 60),
    topics: strList(v.topics, 6, 30),
    period: oneOf(v.period, PERIODS, 'environmental-contemporary'),
    confidence: oneOf(v.confidence, ['high', 'medium', 'low'] as const, 'low'),
    status: oneOf(v.status, STATUSES, 'needs-review'),
    edits: strList(v.edits, 12, 30),
    mentions: list(v.mentions, LIMITS.mentions, mention),
    extraction: str(v.extraction, 60, 'rule-based'),
    createdAt: iso(v.createdAt, new Date(0).toISOString()),
  }
}

function curatedLink(v: unknown): CuratedLink | null {
  if (!isObj(v)) return null
  const curatedId = id(v.curatedId)
  if (!curatedId) return null
  return {
    curatedId,
    mentions: list(v.mentions, LIMITS.mentions, mention),
    status: oneOf(v.status, ['user-confirmed', 'imported'] as const, 'imported'),
  }
}

function relationship(v: unknown): PersonalRelationship | null {
  if (!isObj(v)) return null
  const relId = id(v.id)
  const sourceRef = id(v.sourceRef)
  const targetRef = id(v.targetRef)
  const m = mention(v.mention)
  if (!relId || !sourceRef || !targetRef || !m) return null
  return {
    id: relId,
    sourceRef,
    targetRef,
    type: oneOf(v.type, REL_TYPES, 'influenced'),
    mention: m,
    status: oneOf(v.status, ['proposed', 'user-confirmed'] as const, 'proposed'),
  }
}

/** Validates one collection, upgrading older versions. Throws on anything unusable. */
export function sanitiseCollection(raw: unknown): PersonalCollection {
  if (!isObj(raw)) throw new ValidationError('The collection is not an object.')
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 0
  if (version > SCHEMA_VERSION) throw new UnsupportedVersionError(version)
  const migrated = migrate(raw, version)
  const collectionId = id(migrated.id)
  if (!collectionId) throw new ValidationError('The collection has no valid id.')
  const now = new Date().toISOString()
  const items = list(migrated.items, LIMITS.items, personalItem)
  const itemIds = new Set(items.map((i) => i.id))
  return {
    schemaVersion: SCHEMA_VERSION,
    id: collectionId,
    name: str(migrated.name, 120, 'Your notes'),
    createdAt: iso(migrated.createdAt, now),
    updatedAt: iso(migrated.updatedAt, now),
    documents: list(migrated.documents, LIMITS.documents, documentRecord),
    items: items.filter((i, n) => items.findIndex((j) => j.id === i.id) === n),
    links: list(migrated.links, LIMITS.links, curatedLink),
    relationships: list(migrated.relationships, LIMITS.relationships, relationship).filter(
      (r) =>
        (!r.sourceRef.startsWith('item:') || itemIds.has(r.sourceRef.slice(5))) &&
        (!r.targetRef.startsWith('item:') || itemIds.has(r.targetRef.slice(5))),
    ),
    settings: { note: optStr(isObj(migrated.settings) ? migrated.settings.note : undefined, 300) },
  }
}

/**
 * Brings an older record up to the current shape. Version 0 means "no
 * version recorded" and is treated as the first release.
 */
function migrate(raw: Json, from: number): Json {
  const out: Json = { ...raw }
  if (from < 1) {
    out.links ??= []
    out.relationships ??= []
    out.settings ??= {}
  }
  return out
}

/** Parses JSON, refusing the keys that are used for prototype pollution. */
export function safeJsonParse(text: string): unknown {
  return JSON.parse(text, (key, value) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') return undefined
    return value
  })
}

export interface ProjectFile {
  format: typeof PROJECT_FORMAT
  schemaVersion: number
  exportedAt: string
  collection: PersonalCollection
}

export function buildProjectFile(collection: PersonalCollection): ProjectFile {
  return {
    format: PROJECT_FORMAT,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    collection,
  }
}

/** Reads a project file the user chose. Always treat the result as the only trusted copy. */
export function parseProjectFile(text: string): PersonalCollection {
  if (text.length > LIMITS.maxProjectBytes)
    throw new ValidationError('The project file is too large.')
  let raw: unknown
  try {
    raw = safeJsonParse(text)
  } catch {
    throw new ValidationError('The file is not valid JSON.')
  }
  if (!isObj(raw) || raw.format !== PROJECT_FORMAT) {
    throw new ValidationError('This is not an STS atlas project file.')
  }
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 0
  if (version > SCHEMA_VERSION) throw new UnsupportedVersionError(version)
  const collection = sanitiseCollection(raw.collection)
  // An imported project is a new collection on this device, never an overwrite.
  return { ...collection, id: newId('col'), updatedAt: new Date().toISOString() }
}

export function createCollection(name: string): PersonalCollection {
  const now = new Date().toISOString()
  return {
    schemaVersion: SCHEMA_VERSION,
    id: newId('col'),
    name: str(name, 120, 'Your notes') || 'Your notes',
    createdAt: now,
    updatedAt: now,
    documents: [],
    items: [],
    links: [],
    relationships: [],
    settings: {},
  }
}

/** What deleting one document would remove, for the confirmation message. */
export function describeDocumentRemoval(c: PersonalCollection, docId: string) {
  const items = c.items.filter(
    (i) => i.mentions.length > 0 && i.mentions.every((m) => m.fileId === docId),
  )
  const links = c.links.filter(
    (l) => l.mentions.length > 0 && l.mentions.every((m) => m.fileId === docId),
  )
  const trimmed =
    c.items.filter((i) => i.mentions.some((m) => m.fileId === docId)).length - items.length
  const itemIds = new Set(items.map((i) => `item:${i.id}`))
  const rels = c.relationships.filter(
    (r) => r.mention.fileId === docId || itemIds.has(r.sourceRef) || itemIds.has(r.targetRef),
  )
  return {
    items: items.length,
    links: links.length,
    relationships: rels.length,
    sharedItems: trimmed,
  }
}

/**
 * Removes one document. Entries that came only from it disappear; entries
 * that other documents also support keep those other passages.
 */
export function removeDocument(c: PersonalCollection, docId: string): PersonalCollection {
  const items = c.items
    .map((i) => ({ ...i, mentions: i.mentions.filter((m) => m.fileId !== docId) }))
    .filter((i) => i.mentions.length > 0)
  const links = c.links
    .map((l) => ({ ...l, mentions: l.mentions.filter((m) => m.fileId !== docId) }))
    .filter((l) => l.mentions.length > 0)
  const keptItems = new Set(items.map((i) => `item:${i.id}`))
  const keptLinks = new Set(links.map((l) => `curated:${l.curatedId}`))
  const alive = (ref: string) => keptItems.has(ref) || keptLinks.has(ref)
  return {
    ...c,
    documents: c.documents.filter((d) => d.id !== docId),
    items,
    links,
    relationships: c.relationships.filter(
      (r) => r.mention.fileId !== docId && alive(r.sourceRef) && alive(r.targetRef),
    ),
    updatedAt: new Date().toISOString(),
  }
}

export function removeItem(c: PersonalCollection, itemId: string): PersonalCollection {
  const ref = `item:${itemId}`
  return {
    ...c,
    items: c.items.filter((i) => i.id !== itemId),
    relationships: c.relationships.filter((r) => r.sourceRef !== ref && r.targetRef !== ref),
    updatedAt: new Date().toISOString(),
  }
}

/** Marks an unreviewed suggestion as confirmed by the user. */
export function confirmItem(c: PersonalCollection, itemId: string): PersonalCollection {
  return {
    ...c,
    items: c.items.map((i) => (i.id === itemId ? { ...i, status: 'user-confirmed' as const } : i)),
    updatedAt: new Date().toISOString(),
  }
}

export function confirmRelationship(c: PersonalCollection, relId: string): PersonalCollection {
  return {
    ...c,
    relationships: c.relationships.map((r) =>
      r.id === relId ? { ...r, status: 'user-confirmed' as const } : r,
    ),
    updatedAt: new Date().toISOString(),
  }
}

export function removeRelationship(c: PersonalCollection, relId: string): PersonalCollection {
  return {
    ...c,
    relationships: c.relationships.filter((r) => r.id !== relId),
    updatedAt: new Date().toISOString(),
  }
}
