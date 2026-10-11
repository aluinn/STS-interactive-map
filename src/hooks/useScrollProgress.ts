import { useEffect, useRef, useState } from 'react'

/**
 * Tracks how far the page has scrolled through a tall container, as a
 * normalised 0..1 value: 0 while the container's top is at the top of the
 * viewport, 1 once its bottom has scrolled up to the bottom of the
 * viewport. Reads via requestAnimationFrame-throttled scroll/resize
 * listeners so it never does layout work more than once per frame.
 */
export function useScrollProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  onProgress?: (p: number) => void,
): number {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)
  const onProgressRef = useRef(onProgress)
  useEffect(() => {
    onProgressRef.current = onProgress
  })

  useEffect(() => {
    function measure() {
      frameRef.current = null
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const scrolled = -rect.top
      const p = scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 1
      setProgress(p)
      onProgressRef.current?.(p)
    }

    function requestMeasure() {
      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(measure)
      }
    }

    measure()
    window.addEventListener('scroll', requestMeasure, { passive: true })
    window.addEventListener('resize', requestMeasure)
    return () => {
      window.removeEventListener('scroll', requestMeasure)
      window.removeEventListener('resize', requestMeasure)
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current)
    }
    // containerRef is a stable ref object; re-subscribing on every render is unnecessary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return progress
}
