export interface Box {
  top: number
  left: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

export type PlacementMode = 'center' | 'sheet-top' | 'sheet-bottom' | 'anchored'
export type Side = 'top' | 'bottom' | 'left' | 'right' | 'corner'

export interface Placement {
  mode: PlacementMode
  top: number
  left: number
  side?: Side
  /** Distance of the pointer from the card's near edge, along that edge. */
  arrow?: number
}

interface PlacementInput {
  /** The spotlit box (already padded), or null when nothing is highlighted. */
  target: Box | null
  card: Size
  viewport: Size
  /** Use a full-width bottom/top sheet instead of a floating card. */
  sheet: boolean
  margin?: number
  gap?: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi))

/**
 * Chooses where the explanatory card goes so that it stays inside the
 * viewport and, wherever there is room, does not cover the highlighted area.
 */
export function computePlacement({
  target,
  card,
  viewport,
  sheet,
  margin = 16,
  gap = 14,
}: PlacementInput): Placement {
  if (!target) return { mode: 'center', top: 0, left: 0 }

  const cx = target.left + target.width / 2
  const cy = target.top + target.height / 2

  if (sheet) {
    // Keep the sheet on the side of the screen away from the target.
    return { mode: cy > viewport.height / 2 ? 'sheet-top' : 'sheet-bottom', top: 0, left: 0 }
  }

  const maxLeft = viewport.width - margin - card.width
  const maxTop = viewport.height - margin - card.height
  const below = target.top + target.height + gap
  const above = target.top - gap - card.height
  const right = target.left + target.width + gap
  const left = target.left - gap - card.width

  if (below <= maxTop) {
    const l = clamp(cx - card.width / 2, margin, maxLeft)
    return { mode: 'anchored', side: 'bottom', top: below, left: l, arrow: cx - l }
  }
  if (above >= margin) {
    const l = clamp(cx - card.width / 2, margin, maxLeft)
    return { mode: 'anchored', side: 'top', top: above, left: l, arrow: cx - l }
  }
  if (right <= maxLeft) {
    const t = clamp(cy - card.height / 2, margin, maxTop)
    return { mode: 'anchored', side: 'right', top: t, left: right, arrow: cy - t }
  }
  if (left >= margin) {
    const t = clamp(cy - card.height / 2, margin, maxTop)
    return { mode: 'anchored', side: 'left', top: t, left, arrow: cy - t }
  }
  // The target is too large to sit beside: tuck the card into a corner.
  return {
    mode: 'anchored',
    side: 'corner',
    top: Math.max(margin, maxTop),
    left: Math.max(margin, maxLeft),
  }
}
