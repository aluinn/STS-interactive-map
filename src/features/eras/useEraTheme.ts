import { useLayoutEffect, useRef } from 'react'
import { applyEraTheme } from './eraTheme'

/** Whether translucent, blurred panels are a good idea on this device. */
function canUseTranslucency(): boolean {
  try {
    if (
      !CSS.supports('backdrop-filter', 'blur(1px)') &&
      !CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
    ) {
      return false
    }
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return false
    const nav = navigator as Navigator & { deviceMemory?: number }
    if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return false
    if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) return false
    return true
  } catch {
    return false
  }
}

/**
 * Applies the visual theme of the selected period to the whole document.
 * Runs only when the period (or the immersive preference) changes, never on
 * slider drags or data changes, and does nothing but write CSS variables.
 */
export function useEraTheme(
  eraId: string | null,
  immersive: boolean,
  reducedMotion: boolean,
  mode: 'light' | 'dark' = 'dark',
): void {
  const first = useRef(true)
  useLayoutEffect(() => {
    applyEraTheme(document.documentElement, {
      eraId: immersive ? eraId : null,
      mode,
      translucent: canUseTranslucency(),
      instant: first.current,
      reducedMotion,
    })
    first.current = false
  }, [eraId, immersive, reducedMotion, mode])
}
