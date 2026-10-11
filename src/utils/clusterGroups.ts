import type { Entry, PlaceRef } from '../types'
import { countryAt } from './countries'

export const UNSPECIFIED_GROUP = 'Unspecified or transregional'

export interface CountryGroup {
  /** Present-day country name, or UNSPECIFIED_GROUP. */
  name: string
  entries: Entry[]
  /** True if any entry predates modern borders, so the heading needs a caveat. */
  historical: boolean
}

export type ClusterSort = 'alphabetical' | 'chronological'

/** Entries older than this are described with present-day borders as a caveat. */
const MODERN_BORDERS_YEAR = 1900

/**
 * The listed place that sits at the entry's map position — an entry's map
 * pin is not always its first listed place (e.g. a thinker born in one city
 * but pinned where they worked).
 */
export function primaryPlace(entry: Entry): PlaceRef | undefined {
  if (entry.latitude === undefined || entry.longitude === undefined) return entry.places[0]
  let best: PlaceRef | undefined
  let bestDistance = Infinity
  for (const place of entry.places) {
    if (place.latitude === undefined || place.longitude === undefined) continue
    const d = Math.hypot(place.latitude - entry.latitude, place.longitude - entry.longitude)
    if (d < bestDistance) {
      bestDistance = d
      best = place
    }
  }
  return best ?? entry.places[0]
}

export function countryOfEntry(entry: Entry): string {
  if (entry.latitude === undefined || entry.longitude === undefined) return UNSPECIFIED_GROUP
  return countryAt(entry.latitude, entry.longitude) ?? UNSPECIFIED_GROUP
}

export function sortEntries(entries: Entry[], sort: ClusterSort): Entry[] {
  const copy = [...entries]
  if (sort === 'alphabetical') {
    copy.sort((a, b) => a.title.localeCompare(b.title))
  } else {
    copy.sort((a, b) => a.startYear - b.startYear || a.title.localeCompare(b.title))
  }
  return copy
}

/** Removes repeated ids so a duplicated entry is never listed twice. */
export function uniqueEntries(entries: Entry[]): Entry[] {
  const seen = new Set<string>()
  return entries.filter((e) => (seen.has(e.id) ? false : (seen.add(e.id), true)))
}

/**
 * Groups entries by the present-day country at their map position. Largest
 * groups first; the unspecified group always last.
 */
export function groupByCountry(entries: Entry[], sort: ClusterSort): CountryGroup[] {
  const byCountry = new Map<string, Entry[]>()
  for (const entry of uniqueEntries(entries)) {
    const country = countryOfEntry(entry)
    byCountry.set(country, [...(byCountry.get(country) ?? []), entry])
  }
  return [...byCountry.entries()]
    .map(([name, list]) => ({
      name,
      entries: sortEntries(list, sort),
      historical: list.some((e) => e.startYear < MODERN_BORDERS_YEAR),
    }))
    .sort((a, b) => {
      if (a.name === UNSPECIFIED_GROUP) return 1
      if (b.name === UNSPECIFIED_GROUP) return -1
      return b.entries.length - a.entries.length || a.name.localeCompare(b.name)
    })
}

export function formatYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`
}

export function dateRange(entries: Entry[]): string | null {
  if (entries.length === 0) return null
  const min = Math.min(...entries.map((e) => e.startYear))
  const max = Math.max(...entries.map((e) => e.endYear ?? e.startYear))
  return min === max ? formatYear(min) : `${formatYear(min)} – ${formatYear(max)}`
}
