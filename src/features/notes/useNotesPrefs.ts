import { useCallback, useState } from 'react'

export type Appearance = 'adaptive' | 'manual' | 'consistent'
const KEY = 'atlas-notes-appearance'

function read(): Appearance {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'manual' || v === 'consistent' ? v : 'adaptive'
  } catch {
    return 'adaptive'
  }
}

/** How the interface follows the notes: automatically, by hand, or not at all. */
export function useNotesPrefs(): [Appearance, (a: Appearance) => void] {
  const [appearance, setState] = useState<Appearance>(read)
  const set = useCallback((a: Appearance) => {
    setState(a)
    try {
      if (a === 'adaptive') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, a)
    } catch {
      // The choice then lasts for this visit only.
    }
  }, [])
  return [appearance, set]
}
