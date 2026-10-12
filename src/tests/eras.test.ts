import { describe, expect, it } from 'vitest'
import { dataBundle } from '../data'
import { ERAS, eraOfYear, entryEraVisibility, splitByEra } from '../utils/eras'

const byId = (id: string) => dataBundle.entries.find((e) => e.id === id)!

describe('periods', () => {
  it('are contiguous and cover all of history', () => {
    expect(ERAS[0].from).toBe(-Infinity)
    expect(ERAS[ERAS.length - 1].to).toBe(Infinity)
    for (let i = 1; i < ERAS.length; i++) expect(ERAS[i].from).toBe(ERAS[i - 1].to)
  })

  it('place boundary years in the later period', () => {
    expect(eraOfYear(1750).id).toBe('industry-empire')
    expect(eraOfYear(1749).id).toBe('early-modern')
    expect(eraOfYear(-3000).id).toBe('ancient')
  })

  it('give every entry at least one period, so nothing is unreachable', () => {
    const orphans = dataBundle.entries.filter(
      (e) => !ERAS.some((era) => entryEraVisibility(e, era, false) === 'active'),
    )
    expect(orphans.map((e) => e.id)).toEqual([])
  })

  it('show an entry in the period of its start year', () => {
    for (const e of dataBundle.entries) {
      const era = eraOfYear(e.startYear)
      expect(entryEraVisibility(e, era, false), e.id).toBe('active')
    }
  })

  it('keep institutions with no end date visible from founding onward', () => {
    const royalSociety = byId('royal-society')
    const platform = ERAS[ERAS.length - 1]
    expect(entryEraVisibility(royalSociety, platform, false)).toBe('active')
    expect(entryEraVisibility(royalSociety, ERAS[0], false)).toBe('hidden')
  })

  it('does not show a closed institution after it ended', () => {
    const library = byId('alexandria-library')
    const medieval = ERAS.find((e) => e.id === 'early-modern')!
    expect(entryEraVisibility(library, medieval, true)).toBe('hidden')
  })

  it('shows only the preceding period as faint echoes, and only when enabled', () => {
    const principia = byId('principia')
    const industry = ERAS.find((e) => e.id === 'industry-empire')!
    expect(entryEraVisibility(principia, industry, false)).toBe('hidden')
    expect(entryEraVisibility(principia, industry, true)).toBe('echo')
    const modern = ERAS.find((e) => e.id === 'modern-conflict')!
    expect(entryEraVisibility(principia, modern, true)).toBe('hidden')
  })
})

describe('splitByEra', () => {
  const opts = { echoes: true, searchAllTime: false, hasQuery: false }

  it('returns everything in All Time', () => {
    const r = splitByEra(dataBundle.entries, null, opts)
    expect(r.active).toHaveLength(dataBundle.entries.length)
    expect(r.echoes).toHaveLength(0)
  })

  it('never lists an echo as active', () => {
    for (const era of ERAS) {
      const r = splitByEra(dataBundle.entries, era, opts)
      const active = new Set(r.active.map((e) => e.id))
      expect(r.echoes.filter((e) => active.has(e.id))).toEqual([])
    }
  })

  it('includes out-of-period search hits only when searching all time, and flags them', () => {
    const era = ERAS[0]
    const narrow = splitByEra(dataBundle.entries, era, { ...opts, hasQuery: true })
    const wide = splitByEra(dataBundle.entries, era, {
      ...opts,
      hasQuery: true,
      searchAllTime: true,
    })
    expect(wide.active.length).toBeGreaterThan(narrow.active.length)
    expect(wide.outside.size).toBe(wide.active.length - narrow.active.length)
  })
})
