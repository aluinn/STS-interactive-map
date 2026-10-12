import type { Entry, EvidenceStatus } from '../types'

/** Subject areas offered as quick filters. Derived from existing fields so
 * old and new entries are classified by one rule and no second copy of the
 * data is kept. An entry may belong to several areas. */
export interface Area {
  id: string
  label: string
  test: (entry: Entry) => boolean
}

const hasTheme = (entry: Entry, ...themes: string[]) => entry.themes.some((t) => themes.includes(t))

export const AREAS: Area[] = [
  { id: 'history', label: 'History', test: (e) => e.period !== 'philosophy-of-science' },
  {
    id: 'philosophy',
    label: 'Philosophy',
    test: (e) =>
      e.period === 'philosophy-of-science' || e.philosophicalQuestions.some((q) => q.debateId),
  },
  {
    id: 'society',
    label: 'Society and power',
    test: (e) => hasTheme(e, 'society-and-power', 'exclusion-and-access', 'empire-and-trade'),
  },
  {
    id: 'policy',
    label: 'Policy',
    test: (e) =>
      hasTheme(
        e,
        'expertise-and-policy',
        'innovation-policy',
        'evidence-and-action',
        'policy-and-participation',
      ),
  },
  {
    id: 'communication',
    label: 'Communication and publics',
    test: (e) => hasTheme(e, 'communication-and-publics'),
  },
  { id: 'media', label: 'Media', test: (e) => hasTheme(e, 'media-and-meaning') },
  { id: 'digital', label: 'Digital technology', test: (e) => hasTheme(e, 'digital-technology') },
  { id: 'biotech', label: 'Biotechnology', test: (e) => hasTheme(e, 'biotechnology') },
  {
    id: 'ai',
    label: 'Artificial intelligence',
    test: (e) => hasTheme(e, 'artificial-intelligence'),
  },
  { id: 'climate', label: 'Climate', test: (e) => hasTheme(e, 'climate') },
]

export const AREA_BY_ID = new Map(AREAS.map((a) => [a.id, a]))

export function entryInAnyArea(entry: Entry, areaIds: string[]): boolean {
  return areaIds.some((id) => AREA_BY_ID.get(id)?.test(entry))
}

/** Presentable regions. Assigned from the map coordinate with coarse
 * bounding rules — an orientation aid, not a political geography. */
export const REGIONS = [
  'Europe',
  'Middle East',
  'Africa',
  'South and Central Asia',
  'East and Southeast Asia',
  'Oceania',
  'North America',
  'Latin America and Caribbean',
  'No single place',
] as const
export type Region = (typeof REGIONS)[number]

export function regionOf(entry: Entry): Region {
  const lat = entry.latitude
  const lon = entry.longitude
  if (lat === undefined || lon === undefined) return 'No single place'
  if (lon < -30) return lat >= 15 ? 'North America' : 'Latin America and Caribbean'
  if (lon >= 110) return lat < -10 ? 'Oceania' : 'East and Southeast Asia'
  if (lon >= 95) return lat < -10 ? 'Oceania' : 'East and Southeast Asia'
  if (lon >= 60) return 'South and Central Asia'
  if (lon >= 34 && lat >= 12 && lat < 42) return 'Middle East'
  if (lat >= 36.5 && lon < 60) return 'Europe'
  return 'Africa'
}

export const EVIDENCE_LABELS: Record<EvidenceStatus, string> = {
  'well-established': 'Well established',
  'interpretation-debated': 'Interpretation debated',
  'historical-details-contested': 'Historical details contested',
  'evidence-incomplete': 'Evidence incomplete',
  'contemporary-developing': 'Contemporary, still developing',
}
