import type { Entry } from '../../types'
import { ERAS, eraOfYear, type EraId } from '../../utils/eras'
import { TOPIC_TO_AREA } from './analysis/lexicon'
import { AREAS } from '../../utils/areas'

/**
 * How the interface may react to a personal collection. Everything here is a
 * plain count over the entries, so the same notes always give the same
 * suggestion and the user can see (and override) why.
 */

export interface AdaptProfile {
  /** Entries per navigational period (dated entries only). */
  perEra: Record<EraId, number>
  dated: number
  undated: number
  /** A period holding at least `DOMINANT_SHARE` of dated entries, else null. */
  dominantEra: EraId | null
  /** Points (lon, lat) of entries with a trusted location. */
  points: [number, number][]
  located: number
  /** Share of entries with no location at all. */
  nonGeographicalShare: number
  /** Subject-area ids, most prominent first. */
  areas: string[]
  total: number
}

export const DOMINANT_SHARE = 0.6
export const CONCEPT_VIEW_SHARE = 0.7

export function profileEntries(entries: Entry[]): AdaptProfile {
  const perEra = Object.fromEntries(ERAS.map((e) => [e.id, 0])) as Record<EraId, number>
  let dated = 0
  let undated = 0
  const points: [number, number][] = []
  const areaCounts = new Map<string, number>()
  for (const e of entries) {
    if (e.undated) undated++
    else {
      dated++
      perEra[eraOfYear(e.startYear).id]++
    }
    if (e.latitude !== undefined && e.longitude !== undefined)
      points.push([e.longitude, e.latitude])
    for (const a of AREAS) {
      if (a.test(e) && a.id !== 'history') areaCounts.set(a.id, (areaCounts.get(a.id) ?? 0) + 1)
    }
  }
  let dominantEra: EraId | null = null
  if (dated >= 3) {
    for (const era of ERAS) {
      if (perEra[era.id] / dated >= DOMINANT_SHARE) dominantEra = era.id
    }
  }
  const areas = [...areaCounts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)
  return {
    perEra,
    dated,
    undated,
    dominantEra,
    points,
    located: points.length,
    nonGeographicalShare: entries.length ? 1 - points.length / entries.length : 0,
    areas,
    total: entries.length,
  }
}

/** Topic buckets from the extractor, translated to the atlas's subject-area ids. */
export function areasForTopics(top: string[]): string[] {
  return top.map((t) => TOPIC_TO_AREA[t]).filter(Boolean)
}

/** Whether the notes are mostly ideas without places, so a concept view suits them better. */
export function prefersConceptView(p: AdaptProfile): boolean {
  return p.total >= 3 && p.nonGeographicalShare >= CONCEPT_VIEW_SHARE
}
