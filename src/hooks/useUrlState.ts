import { useCallback, useEffect, useRef, useState } from 'react'

export type ViewName = 'atlas' | 'timeline' | 'debates' | 'journeys'

export interface Filters {
  q: string
  kinds: string[]
  periods: string[]
  themes: string[]
  relationTypes: string[]
  onlyPhilosophy: boolean
  onlyContested: boolean
  onlyJourney: boolean
  onlyOverturned: boolean
  yearMin: number | null
  yearMax: number | null
  /** Topic-area ids (see utils/areas). */
  areas: string[]
  regions: string[]
  evidence: string[]
}

export interface AppState {
  view: ViewName
  entry: string | null
  debate: string | null
  journey: string | null
  stop: number
  /** Selected navigational period id; null means "All Time". */
  era: string | null
  filters: Filters
}

export const defaultFilters: Filters = {
  q: '',
  kinds: [],
  periods: [],
  themes: [],
  relationTypes: [],
  onlyPhilosophy: false,
  onlyContested: false,
  onlyJourney: false,
  onlyOverturned: false,
  yearMin: null,
  yearMax: null,
  areas: [],
  regions: [],
  evidence: [],
}

const defaultState: AppState = {
  view: 'atlas',
  entry: null,
  debate: null,
  journey: null,
  stop: 0,
  era: null,
  filters: defaultFilters,
}

function parseList(v: string | null): string[] {
  return v ? v.split(',').filter(Boolean) : []
}

function parseYear(v: string | null): number | null {
  if (!v) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function parseState(search: string): AppState {
  const params = new URLSearchParams(search)
  const view = params.get('view')
  return {
    view: view === 'timeline' || view === 'debates' || view === 'journeys' ? view : 'atlas',
    entry: params.get('entry'),
    debate: params.get('debate'),
    journey: params.get('journey'),
    stop: Math.max(0, Math.floor(Number(params.get('stop') ?? 0)) || 0),
    era: params.get('era'),
    filters: {
      q: params.get('q') ?? '',
      kinds: parseList(params.get('kinds')),
      periods: parseList(params.get('periods')),
      themes: parseList(params.get('themes')),
      relationTypes: parseList(params.get('rel')),
      onlyPhilosophy: params.get('philosophy') === '1',
      onlyContested: params.get('contested') === '1',
      onlyJourney: params.get('journeyOnly') === '1',
      onlyOverturned: params.get('overturned') === '1',
      yearMin: parseYear(params.get('y0')),
      yearMax: parseYear(params.get('y1')),
      areas: parseList(params.get('areas')),
      regions: parseList(params.get('regions')),
      evidence: parseList(params.get('evidence')),
    },
  }
}

function serializeState(state: AppState): string {
  const params = new URLSearchParams()
  if (state.view !== 'atlas') params.set('view', state.view)
  if (state.entry) params.set('entry', state.entry)
  if (state.debate) params.set('debate', state.debate)
  if (state.journey) params.set('journey', state.journey)
  if (state.journey && state.stop) params.set('stop', String(state.stop))
  if (state.era) params.set('era', state.era)
  const f = state.filters
  if (f.q) params.set('q', f.q)
  if (f.kinds.length) params.set('kinds', f.kinds.join(','))
  if (f.periods.length) params.set('periods', f.periods.join(','))
  if (f.themes.length) params.set('themes', f.themes.join(','))
  if (f.relationTypes.length) params.set('rel', f.relationTypes.join(','))
  if (f.onlyPhilosophy) params.set('philosophy', '1')
  if (f.onlyContested) params.set('contested', '1')
  if (f.onlyJourney) params.set('journeyOnly', '1')
  if (f.onlyOverturned) params.set('overturned', '1')
  if (f.yearMin !== null) params.set('y0', String(f.yearMin))
  if (f.yearMax !== null) params.set('y1', String(f.yearMax))
  if (f.areas.length) params.set('areas', f.areas.join(','))
  if (f.regions.length) params.set('regions', f.regions.join(','))
  if (f.evidence.length) params.set('evidence', f.evidence.join(','))
  const s = params.toString()
  return s ? `?${s}` : ''
}

/**
 * URL-backed application state. All filters and the current selection live
 * in the query string so any view can be shared via copy-link.
 *
 * Navigation changes (view, entry, debate, journey) push a history entry so
 * the browser back/forward buttons step through them; filter-only changes
 * replace the current entry so typing in the search box doesn't flood the
 * history.
 */
export function useUrlState(): [AppState, (updates: Partial<AppState>) => void] {
  const [state, setState] = useState<AppState>(() =>
    typeof window !== 'undefined' ? parseState(window.location.search) : defaultState,
  )
  const stateRef = useRef(state)

  useEffect(() => {
    const onPopState = () => {
      const next = parseState(window.location.search)
      stateRef.current = next
      setState(next)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const update = useCallback((updates: Partial<AppState>) => {
    const prev = stateRef.current
    const next: AppState = { ...prev, ...updates }
    const url = `${window.location.pathname}${serializeState(next)}${window.location.hash}`
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    const filtersOnly = Object.keys(updates).every((k) => k === 'filters' || k === 'era')
    if (url !== currentUrl) {
      if (filtersOnly) window.history.replaceState(null, '', url)
      else window.history.pushState(null, '', url)
    }
    stateRef.current = next
    setState(next)
  }, [])

  return [state, update]
}
