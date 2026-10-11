import { describe, expect, it } from 'vitest'
import { entries } from '../data'
import {
  UNSPECIFIED_GROUP,
  dateRange,
  groupByCountry,
  primaryPlace,
  uniqueEntries,
} from '../utils/clusterGroups'
import { countryAt } from '../utils/countries'

const byId = (...ids: string[]) => ids.map((id) => entries.find((e) => e.id === id)!)

describe('countryAt', () => {
  it('finds present-day countries for historical locations', () => {
    expect(countryAt(37.53, 27.28)).toBe('Turkey') // Miletus
    expect(countryAt(33.34, 44.4)).toBe('Iraq') // Baghdad
    expect(countryAt(51.5, -0.12)).toBe('United Kingdom')
  })

  it('returns null for open ocean far from any coast', () => {
    expect(countryAt(-40, -30)).toBeNull()
  })
})

describe('groupByCountry', () => {
  it('groups by country, largest first, and flags pre-1900 groups as historical', () => {
    const groups = groupByCountry(
      byId('newton', 'boyle', 'royal-society', 'galileo', 'thales'),
      'alphabetical',
    )
    expect(groups[0].name).toBe('United Kingdom')
    expect(groups[0].entries).toHaveLength(3)
    expect(groups.map((g) => g.name)).toEqual(expect.arrayContaining(['Italy', 'Turkey']))
    expect(groups.every((g) => g.historical)).toBe(true)
  })

  it('puts entries without a position in the unspecified group, last', () => {
    const groups = groupByCountry(byId('natural-philosophy', 'newton'), 'alphabetical')
    expect(groups[groups.length - 1].name).toBe(UNSPECIFIED_GROUP)
    expect(groups[groups.length - 1].entries[0].id).toBe('natural-philosophy')
  })

  it('does not list duplicate entries twice', () => {
    const [newton] = byId('newton')
    expect(uniqueEntries([newton, newton])).toHaveLength(1)
    expect(groupByCountry([newton, newton], 'alphabetical')[0].entries).toHaveLength(1)
  })

  it('sorts alphabetically or chronologically within a group', () => {
    const list = byId('newton', 'boyle', 'royal-society')
    const alpha = groupByCountry(list, 'alphabetical')[0].entries.map((e) => e.id)
    const chrono = groupByCountry(list, 'chronological')[0].entries.map((e) => e.startYear)
    expect(alpha).toEqual(['newton', 'boyle', 'royal-society'])
    expect(chrono).toEqual([...chrono].sort((a, b) => a - b))
  })
})

describe('primaryPlace / dateRange', () => {
  it('uses the listed place that sits at the entry position', () => {
    const [popper] = byId('karl-popper')
    expect(primaryPlace(popper)?.name).toBe('London')
  })

  it('formats BCE and CE ranges', () => {
    expect(dateRange(byId('thales', 'newton'))).toMatch(/BCE – \d+ CE/)
    expect(dateRange([])).toBeNull()
  })
})
