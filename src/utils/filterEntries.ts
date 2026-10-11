import type { Entry, Relationship } from '../types'
import type { Filters } from '../hooks/useUrlState'

/** Lower-cases and strips accents/hyphens so "Poincare" finds "Poincaré". */
export function normaliseText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/-/g, ' ')
    .toLowerCase()
}

export function entryMatchesFilters(entry: Entry, filters: Filters): boolean {
  const query = filters.q.trim()
  if (query) {
    const q = normaliseText(query)
    const haystack = normaliseText(
      [
        entry.title,
        entry.subtitle ?? '',
        entry.summary,
        entry.longDescription,
        ...entry.people,
        ...entry.cultures,
        ...entry.disciplines,
        ...entry.themes,
        ...entry.places.map((p) => p.name),
      ].join(' '),
    )
    if (!haystack.includes(q)) return false
  }

  if (filters.kinds.length && !filters.kinds.includes(entry.kind)) return false
  if (filters.periods.length && !filters.periods.includes(entry.period)) return false
  if (filters.themes.length && !entry.themes.some((t) => filters.themes.includes(t))) return false

  if (filters.onlyPhilosophy && entry.philosophicalQuestions.length === 0) return false
  if (filters.onlyContested) {
    const contestedStatuses = new Set(['superseded', 'rejected', 'still-contested', 'debated'])
    const isContested =
      (entry.theoryStatus && contestedStatuses.has(entry.theoryStatus)) ||
      entry.confidence === 'contested'
    if (!isContested) return false
  }
  if (filters.onlyJourney && !entry.isJourneyStop) return false
  if (filters.onlyOverturned) {
    const overturnedStatuses = new Set(['rejected', 'superseded'])
    if (!entry.theoryStatus || !overturnedStatuses.has(entry.theoryStatus)) return false
  }

  if (filters.yearMin !== null && (entry.endYear ?? entry.startYear) < filters.yearMin) return false
  if (filters.yearMax !== null && entry.startYear > filters.yearMax) return false

  return true
}

export function filterEntries(entries: Entry[], filters: Filters): Entry[] {
  return entries.filter((e) => entryMatchesFilters(e, filters))
}

export function filterRelationships(
  relationships: Relationship[],
  visibleEntryIds: Set<string>,
  filters: Filters,
): Relationship[] {
  return relationships.filter((r) => {
    if (filters.relationTypes.length && !filters.relationTypes.includes(r.type)) return false
    return visibleEntryIds.has(r.sourceId) && visibleEntryIds.has(r.targetId)
  })
}

export const ALL_THEMES = [
  'instruments-and-method',
  'non-western-origins',
  'prediction',
  'naturalism',
  'mathematical-order',
  'matter-theory',
  'teleology',
  'method',
  'cosmology',
  'translation-and-transmission',
  'institutions-and-funding',
  'exclusion-and-access',
  'observation',
  'overturning-authority',
  'simplicity-and-truth',
  'texts-and-circulation',
  'religion-and-science',
  'determinism',
  'gender',
  'empire-and-trade',
  'craft-and-instruments',
  'profession-and-identity',
  'myth-of-the-lone-genius',
  'laboratory-to-industry',
  'evidence-and-action',
  'ethics',
  'war-and-science',
  'big-science',
  'scientific-change',
  'objectivity',
  'scientific-images',
  'demarcation',
  'realism',
  'underdetermination',
  'empirical-adequacy',
  'experiment',
  'models-and-idealisation',
  'verification',
  'induction',
  'expertise-and-policy',
  'pluralism',
  'independent-development',
  'society-and-power',
  'scientific-practice',
  'assetisation',
  'open-science',
  'innovation-policy',
  'global-knowledge-networks',
  'technology-and-politics',
  'relationality',
  'gender-and-representation',
  'expertise-and-activism',
  'discourse-and-identity',
]
