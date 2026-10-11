import { useCallback, useEffect, useState } from 'react'

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
}

export interface AppState {
  view: ViewName
  entry: string | null
  debate: string | null
  journey: string | null
  stop: number
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
}

const defaultState: AppState = {
  view: 'atlas',
  entry: null,
  debate: null,
  journey: null,
  stop: 0,
  filters: defaultFilters,
}

function parseList(v: string | null): string[] {
  return v ? v.split(',').filter(Boolean) : []
}

function parseState(search: string): AppState {
  const params = new URLSearchParams(search)
  const view = params.get('view')
  return {
    view: view === 'timeline' || view === 'debates' || view === 'journeys' ? view : 'atlas',
    entry: params.get('entry'),
    debate: params.get('debate'),
    journey: params.get('journey'),
    stop: Number(params.get('stop') ?? 0) || 0,
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
      yearMin: params.get('y0') ? Number(params.get('y0')) : null,
      yearMax: params.get('y1') ? Number(params.get('y1')) : null,
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
  const s = params.toString()
  return s ? `?${s}` : ''
}

/**
 * URL-backed application state. All filters and the current selection live
 * in the query string so any view can be shared via copy-link.
 */
export function useUrlState(): [AppState, (updates: Partial<AppState>) => void] {
  const [state, setState] = useState<AppState>(() =>
    typeof window !== 'undefined' ? parseState(window.location.search) : defaultState,
  )

  useEffect(() => {
    const onPopState = () => setState(parseState(window.location.search))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const update = useCallback((updates: Partial<AppState>) => {
    setState((prev) => {
      const next: AppState = { ...prev, ...updates }
      const qs = serializeState(next)
      const url = `${window.location.pathname}${qs}${window.location.hash}`
      window.history.replaceState(null, '', url)
      return next
    })
  }, [])

  return [state, update]
}
