import { useCallback, useState } from 'react'

export interface EraPrefs {
  /** Faintly show the previous period's entries and routes. */
  echoes: boolean
  /** Era-specific colours and textures; off gives one consistent, high-contrast theme. */
  immersive: boolean
  /** Let a text search reach outside the selected period. */
  searchAllTime: boolean
}

const KEY = 'atlas-era-prefs'
const defaults: EraPrefs = { echoes: true, immersive: true, searchAllTime: false }

function read(): EraPrefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaults
    const v = JSON.parse(raw) as Partial<EraPrefs>
    return {
      echoes: typeof v.echoes === 'boolean' ? v.echoes : defaults.echoes,
      immersive: typeof v.immersive === 'boolean' ? v.immersive : defaults.immersive,
      searchAllTime:
        typeof v.searchAllTime === 'boolean' ? v.searchAllTime : defaults.searchAllTime,
    }
  } catch {
    return defaults
  }
}

/** Per-viewer period preferences, remembered locally. */
export function useEraPrefs(): [EraPrefs, (patch: Partial<EraPrefs>) => void] {
  const [prefs, setPrefs] = useState<EraPrefs>(read)
  const update = useCallback((patch: Partial<EraPrefs>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        // ignore (private browsing / blocked storage)
      }
      return next
    })
  }, [])
  return [prefs, update]
}
