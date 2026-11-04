import { useCallback, useState } from 'react'
import type { WalkthroughStep } from './types'

/** The single source of truth for which step is showing. */
export function useWalkthrough(steps: WalkthroughStep[]) {
  const [index, setIndex] = useState(0)
  const last = steps.length - 1
  const next = useCallback(() => setIndex((i) => Math.min(i + 1, last)), [last])
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])
  return {
    index,
    step: steps[Math.min(index, last)],
    count: steps.length,
    isFirst: index === 0,
    isLast: index >= last,
    next,
    prev,
  }
}
