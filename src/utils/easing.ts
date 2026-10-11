export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x))
}

/** Smooth 0..1 ease between two progress breakpoints (Hermite interpolation). */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Piecewise-linear interpolation across an arbitrary number of (progress, value) keyframes. */
export function lerpKeyframes(p: number, frames: Array<[number, number]>): number {
  if (p <= frames[0][0]) return frames[0][1]
  for (let i = 1; i < frames.length; i++) {
    const [p0, v0] = frames[i - 1]
    const [p1, v1] = frames[i]
    if (p <= p1) {
      const t = p1 === p0 ? 0 : (p - p0) / (p1 - p0)
      return lerp(v0, v1, t)
    }
  }
  return frames[frames.length - 1][1]
}
