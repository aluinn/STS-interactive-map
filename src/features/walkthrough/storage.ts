/** Versioned so a substantially redesigned interface can offer the tour again. */
export const WALKTHROUGH_KEY = 'sts-walkthrough:v1'

export type WalkthroughStatus = 'completed' | 'dismissed'

export function readWalkthroughStatus(): WalkthroughStatus | null {
  try {
    const raw = localStorage.getItem(WALKTHROUGH_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as { status?: unknown }
    return v.status === 'completed' || v.status === 'dismissed' ? v.status : null
  } catch {
    return null
  }
}

/**
 * Remembers the outcome. Finishing the tour always counts; skipping it never
 * overwrites an earlier completion (e.g. when it is replayed and closed early).
 */
export function recordWalkthroughStatus(status: WalkthroughStatus): void {
  try {
    if (status === 'dismissed' && readWalkthroughStatus() === 'completed') return
    localStorage.setItem(WALKTHROUGH_KEY, JSON.stringify({ status, at: new Date().toISOString() }))
  } catch {
    // Storage may be blocked; the tour is then simply offered once per visit.
  }
}

export interface EligibilityInput {
  /** The page was opened on the plain landing route (no deep link or filters). */
  landing: boolean
  /** The cinematic introduction is finished, skipped or was never going to play. */
  introDone: boolean
  /** The tour was already offered during this visit. */
  offeredThisVisit: boolean
}

/**
 * Whether the welcome card should appear on its own: on every plain landing
 * visit, as soon as the intro is done, but only once per visit.
 */
export function shouldOfferWalkthrough(i: EligibilityInput): boolean {
  return i.landing && i.introDone && !i.offeredThisVisit
}
