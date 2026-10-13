import { describe, expect, it } from 'vitest'
import { entries as curated } from '../data'
import { analyseDocuments } from '../features/notes/analysis/analyse'
import {
  buildProjectFile,
  createCollection,
  describeDocumentRemoval,
  parseProjectFile,
  removeDocument,
  safeJsonParse,
  sanitiseCollection,
  UnsupportedVersionError,
  ValidationError,
} from '../features/notes/collection'
import { markdownReadingList, unresolvedReport } from '../features/notes/exports'
import { buildReview, canBulkAccept, commitReview, parseUserDate } from '../features/notes/review'
import { createMemoryStore } from '../features/notes/storage/store'
import { personalAtlas } from '../features/notes/toEntries'
import { profileEntries } from '../features/notes/adapt'
import type { ExtractedDocument, PersonalCollection } from '../features/notes/types'
import { SAMPLE_NOTES } from './fixtures/sampleNotes'

function doc(id: string, text: string, name = 'a.md'): ExtractedDocument {
  return {
    fileId: id,
    fileName: name,
    title: name,
    kind: 'md',
    pageCount: 1,
    pages: [{ page: 1, text }],
    contentHash: id,
    method: 'markdown',
    warnings: [],
    scanned: false,
    truncated: false,
  }
}

async function imported(text = SAMPLE_NOTES, id = 'd1'): Promise<PersonalCollection> {
  const d = doc(id, text)
  const analysis = await analyseDocuments([d], { curated })
  const review = buildReview(analysis, [
    {
      id: d.fileId,
      fileName: d.fileName,
      title: d.title,
      kind: 'md',
      pageCount: 1,
      contentHash: d.contentHash,
      importedAt: new Date().toISOString(),
      method: 'markdown',
      warnings: [],
    },
  ])
  review.items.forEach((i) => (i.decision = 'accepted'))
  review.relationships.forEach((r) => (r.decision = 'accepted'))
  return commitReview(createCollection('Test'), review, { keepUndecided: false }).collection
}

describe('review and commit', () => {
  it('only allows bulk acceptance of exact, unambiguous curated matches', async () => {
    const d = doc('d1', SAMPLE_NOTES)
    const review = buildReview(await analyseDocuments([d], { curated }), [])
    const bulk = review.items.filter(canBulkAccept)
    expect(bulk.length).toBeGreaterThan(0)
    for (const i of bulk) {
      expect(i.candidate.confidence).toBe('high')
      expect(i.linkedId).not.toBeNull()
    }
  })
  it('adds nothing until items are accepted', async () => {
    const d = doc('d1', SAMPLE_NOTES)
    const review = buildReview(await analyseDocuments([d], { curated }), [])
    const { collection } = commitReview(createCollection('x'), review, { keepUndecided: false })
    expect(collection.items).toHaveLength(0)
    expect(collection.links).toHaveLength(0)
  })
  it('keeps undecided items only when asked, marked as needing review', async () => {
    const d = doc(
      'd1',
      'Maria Voss, a historian, studied the Berlin Conference. Maria Voss wrote in 1850.',
    )
    const review = buildReview(await analyseDocuments([d], { curated }), [])
    const kept = commitReview(createCollection('x'), review, { keepUndecided: true }).collection
    expect(kept.items.length).toBeGreaterThan(0)
    expect(kept.items.every((i) => i.status === 'needs-review')).toBe(true)
  })
  it('marks bulk-accepted items as imported and edited ones as user-confirmed', async () => {
    const c = await imported()
    expect(c.items.length).toBeGreaterThan(0)
    expect(c.items.every((i) => i.status === 'imported')).toBe(true)
  })
  it('merges the same entity from two documents instead of duplicating it', async () => {
    const first = await imported(
      'Maria Voss, a historian, studied at the University of Leeds. Maria Voss wrote in 1850.',
      'd1',
    )
    const d2 = doc(
      'd2',
      'Maria Voss, a historian, taught in 1860. Maria Voss argued that history matters.',
    )
    const review = buildReview(await analyseDocuments([d2], { curated }), [])
    review.items.forEach((i) => (i.decision = 'accepted'))
    const { collection } = commitReview(first, review, { keepUndecided: false })
    const voss = collection.items.filter((i) => i.title === 'Maria Voss')
    expect(voss).toHaveLength(1)
    expect(new Set(voss[0].mentions.map((m) => m.fileId))).toEqual(new Set(['d1', 'd2']))
  })
  it('skips a document whose contents were already imported', async () => {
    const c = await imported()
    const d = doc('d9', SAMPLE_NOTES)
    d.contentHash = 'd1'
    const analysis = await analyseDocuments([d], { curated })
    const review = buildReview(analysis, [
      {
        id: 'd9',
        fileName: 'again.md',
        title: 't',
        kind: 'md',
        pageCount: 1,
        contentHash: 'd1',
        importedAt: new Date().toISOString(),
        method: 'markdown',
        warnings: [],
      },
    ])
    const { summary } = commitReview(c, review, { keepUndecided: false })
    expect(summary.skippedDocuments).toEqual(['again.md'])
  })
  it('parses user-typed dates strictly', () => {
    expect(parseUserDate('1687')).toMatchObject({ start: 1687, precision: 'exact' })
    expect(parseUserDate('c. 300 BCE')).toMatchObject({ start: -300, approximate: true })
    expect(parseUserDate('1543–1687')).toMatchObject({ start: 1543, end: 1687 })
    expect(parseUserDate('next tuesday')).toBeNull()
    expect(parseUserDate('')?.start).toBeUndefined()
  })
})

describe('deleting a document', () => {
  it('removes only what came from that document and keeps other provenance', async () => {
    const withBoth = await (async () => {
      const first = await imported(
        'Maria Voss, a historian, studied at the University of Leeds. Maria Voss wrote in 1850.',
        'd1',
      )
      const d2 = doc(
        'd2',
        'Maria Voss, a historian, taught in 1860. Maria Voss argued that history matters. The Berlin Conference was held in 1884. Berlin Conference was long.',
      )
      const review = buildReview(await analyseDocuments([d2], { curated }), [
        {
          id: 'd2',
          fileName: 'b.md',
          title: 'b',
          kind: 'md',
          pageCount: 1,
          contentHash: 'd2',
          importedAt: new Date().toISOString(),
          method: 'markdown',
          warnings: [],
        },
      ])
      review.items.forEach((i) => (i.decision = 'accepted'))
      return commitReview(first, review, { keepUndecided: false }).collection
    })()
    const preview = describeDocumentRemoval(withBoth, 'd1')
    const after = removeDocument(withBoth, 'd1')
    const voss = after.items.find((i) => i.title === 'Maria Voss')
    expect(voss?.mentions.every((m) => m.fileId === 'd2')).toBe(true)
    expect(after.documents.map((d) => d.id)).not.toContain('d1')
    expect(preview.sharedItems).toBeGreaterThan(0)
    expect(after.items.find((i) => i.title.includes('Leeds'))).toBeUndefined()
  })
})

describe('project files', () => {
  it('round-trips a collection', async () => {
    const c = await imported()
    const text = JSON.stringify(buildProjectFile(c))
    const back = parseProjectFile(text)
    expect(back.items).toEqual(c.items)
    expect(back.id).not.toBe(c.id) // restored as a new collection, never an overwrite
  })
  it('rejects malformed, foreign and newer files', () => {
    expect(() => parseProjectFile('not json')).toThrow(ValidationError)
    expect(() => parseProjectFile('{"format":"other"}')).toThrow(ValidationError)
    expect(() =>
      parseProjectFile(
        JSON.stringify({ format: 'sts-atlas-project', schemaVersion: 99, collection: {} }),
      ),
    ).toThrow(UnsupportedVersionError)
    expect(() =>
      parseProjectFile(
        JSON.stringify({
          format: 'sts-atlas-project',
          schemaVersion: 1,
          collection: { id: '../../x' },
        }),
      ),
    ).toThrow(ValidationError)
  })
  it('drops prototype-pollution keys and unknown fields, and bounds strings', () => {
    const evil =
      '{"id":"col-1","name":"x","schemaVersion":1,"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},"items":[{"id":"my-1","title":"' +
      'A'.repeat(5000) +
      '","kind":"bogus","extra":"<img src=x onerror=alert(1)>"}]}'
    const parsed = safeJsonParse(evil) as Record<string, unknown>
    expect(Object.prototype.hasOwnProperty.call(parsed, '__proto__')).toBe(false)
    const c = sanitiseCollection(parsed)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect(c.items[0].title.length).toBeLessThanOrEqual(300)
    expect(c.items[0].kind).toBe('idea')
    expect(JSON.stringify(c)).not.toContain('onerror')
  })
  it('refuses oversized files', () => {
    expect(() => parseProjectFile('x'.repeat(26 * 1024 * 1024))).toThrow(ValidationError)
  })
})

describe('personal atlas adapter', () => {
  it('produces entries in the shared display model, marked as personal and unverified', async () => {
    const c = await imported()
    const atlas = personalAtlas(c)
    expect(atlas.entries.length).toBe(c.items.length)
    for (const e of atlas.entries) {
      expect(e.origin).toBe('personal')
      expect(e.confidence).not.toBe('established')
      expect(e.personal?.mentions.length).toBeGreaterThan(0)
      if (e.latitude === undefined) expect(e.transregional).toBe(true)
    }
    expect(atlas.linkedCurated.size).toBeGreaterThan(0)
  })
  it('never invents a date or coordinates', async () => {
    const c = await imported('Maria Voss, a historian, studied somewhere. Maria Voss wrote a lot.')
    const e = personalAtlas(c).entries.find((x) => x.title === 'Maria Voss')
    expect(e?.undated).toBe(true)
    expect(e?.latitude).toBeUndefined()
  })
  it('summarises where the notes concentrate', async () => {
    const c = await imported(
      'Isaac Newton (1642–1727) wrote the Principia in 1687. Galileo Galilei used a telescope in 1609 at Padua. Johannes Kepler wrote in 1619.',
    )
    const p = profileEntries(personalAtlas(c).entries)
    expect(p.total).toBe(c.items.length)
  })
})

describe('exports and storage', () => {
  it('exports only accepted material, never original files', async () => {
    const c = await imported()
    const md = markdownReadingList(c, curated)
    expect(md).toContain('# Test')
    expect(unresolvedReport(c)).toContain('Not individually reviewed')
  })
  it('keeps collections in a store and can clear it', async () => {
    const store = createMemoryStore()
    const c = await imported()
    await store.save(c)
    expect((await store.load()).collections).toHaveLength(1)
    await store.clearAll()
    expect((await store.load()).collections).toHaveLength(0)
  })
})
