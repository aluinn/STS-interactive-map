import { describe, expect, it } from 'vitest'
import { entries, relationships } from '../data'
import { filterEntries, filterRelationships, entryMatchesFilters } from '../utils/filterEntries'
import { defaultFilters } from '../hooks/useUrlState'

describe('filterEntries', () => {
  it('returns all entries when filters are default', () => {
    expect(filterEntries(entries, defaultFilters)).toHaveLength(entries.length)
  })

  it('search matches title case-insensitively', () => {
    const result = filterEntries(entries, { ...defaultFilters, q: 'darwin' })
    expect(result.some((e) => e.id === 'darwin')).toBe(true)
    expect(result.every((e) => entryMatchesFilters(e, { ...defaultFilters, q: 'darwin' }))).toBe(
      true,
    )
  })

  it('search with no matches returns an empty list', () => {
    const result = filterEntries(entries, { ...defaultFilters, q: 'zzzzznonexistent' })
    expect(result).toHaveLength(0)
  })

  it('filters by entry kind', () => {
    const result = filterEntries(entries, { ...defaultFilters, kinds: ['instrument'] })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((e) => e.kind === 'instrument')).toBe(true)
  })

  it('filters by period', () => {
    const result = filterEntries(entries, { ...defaultFilters, periods: ['ancient'] })
    expect(result.every((e) => e.period === 'ancient')).toBe(true)
  })

  it('onlyPhilosophy keeps only entries with a philosophical lens', () => {
    const result = filterEntries(entries, { ...defaultFilters, onlyPhilosophy: true })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((e) => e.philosophicalQuestions.length > 0)).toBe(true)
  })

  it('onlyJourney keeps only journey-stop entries', () => {
    const result = filterEntries(entries, { ...defaultFilters, onlyJourney: true })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((e) => e.isJourneyStop)).toBe(true)
  })

  it('year range excludes entries entirely outside the window', () => {
    // Newton (1642-1727) should be excluded by a range entirely in antiquity
    const result = filterEntries(entries, { ...defaultFilters, yearMin: -2000, yearMax: -1000 })
    expect(result.some((e) => e.id === 'newton')).toBe(false)
  })

  it('year range includes entries that overlap the window', () => {
    const result = filterEntries(entries, { ...defaultFilters, yearMin: 1600, yearMax: 1700 })
    expect(result.some((e) => e.id === 'newton')).toBe(true)
  })

  it('combines multiple active filters with AND semantics', () => {
    const result = filterEntries(entries, {
      ...defaultFilters,
      kinds: ['person'],
      periods: ['ancient'],
    })
    expect(result.every((e) => e.kind === 'person' && e.period === 'ancient')).toBe(true)
  })
})

describe('filterRelationships', () => {
  it('only keeps relationships whose both endpoints are visible', () => {
    const visible = new Set(['newton', 'kepler'])
    const result = filterRelationships(relationships, visible, defaultFilters)
    expect(result.every((r) => visible.has(r.sourceId) && visible.has(r.targetId))).toBe(true)
  })

  it('filters by relationship type', () => {
    const visible = new Set(entries.map((e) => e.id))
    const result = filterRelationships(relationships, visible, {
      ...defaultFilters,
      relationTypes: ['taught'],
    })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((r) => r.type === 'taught')).toBe(true)
  })

  it('returns nothing when no relationships match the visible set', () => {
    const result = filterRelationships(relationships, new Set(['nonexistent-id']), defaultFilters)
    expect(result).toHaveLength(0)
  })
})

describe('search normalisation', () => {
  it('ignores accents, so "Rene Descartes" finds "René Descartes"', () => {
    const result = filterEntries(entries, { ...defaultFilters, q: 'rene descartes' })
    expect(result.some((e) => e.id === 'descartes')).toBe(true)
  })

  it('matches place names listed on an entry', () => {
    const result = filterEntries(entries, { ...defaultFilters, q: 'miletus' })
    expect(result.some((e) => e.id === 'thales')).toBe(true)
  })

  it('treats whitespace-only queries as no query', () => {
    expect(filterEntries(entries, { ...defaultFilters, q: '   ' })).toHaveLength(entries.length)
  })
})
