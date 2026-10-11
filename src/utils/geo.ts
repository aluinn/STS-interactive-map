import { geoNaturalEarth1, geoPath, geoGraticule, type GeoProjection } from 'd3-geo'
import type { Entry } from '../types'

export interface ProjectedEntry {
  entry: Entry
  x: number
  y: number
}

export interface MarkerCluster {
  id: string
  x: number
  y: number
  items: ProjectedEntry[]
}

export function createProjection(
  width: number,
  height: number,
  landFeature: object,
): GeoProjection {
  return geoNaturalEarth1().fitSize([width, height], landFeature as never)
}

export { geoPath, geoGraticule }

export function projectEntries(entries: Entry[], projection: GeoProjection): ProjectedEntry[] {
  const out: ProjectedEntry[] = []
  for (const entry of entries) {
    if (entry.latitude === undefined || entry.longitude === undefined) continue
    const point = projection([entry.longitude, entry.latitude])
    if (!point) continue
    out.push({ entry, x: point[0], y: point[1] })
  }
  return out
}

/**
 * Greedy centroid-based clustering in screen space: starting from each
 * unclaimed marker, absorb any other unclaimed marker within `thresholdPx`
 * (at the current zoom scale) of the cluster's running centroid, which is
 * recomputed as markers join.
 *
 * Deliberately NOT single-link/union-find: measuring distance against each
 * new member's immediate neighbour (rather than the cluster's centroid)
 * lets a cluster "chain" arbitrarily far across the map — a dense run of
 * closely-spaced cities can bridge two otherwise-distant regions into one
 * misleadingly huge cluster. Re-centering on every absorption keeps a
 * cluster's effective radius bounded to roughly `thresholdPx`.
 */
export function clusterProjected(
  projected: ProjectedEntry[],
  scale: number,
  thresholdPx: number,
): MarkerCluster[] {
  const threshold = thresholdPx / scale
  const n = projected.length
  const used = new Array<boolean>(n).fill(false)
  const clusters: MarkerCluster[] = []

  for (let i = 0; i < n; i++) {
    if (used[i]) continue
    used[i] = true
    const group: ProjectedEntry[] = [projected[i]]
    let cx = projected[i].x
    let cy = projected[i].y

    let absorbedSomething = true
    while (absorbedSomething) {
      absorbedSomething = false
      for (let j = 0; j < n; j++) {
        if (used[j]) continue
        if (Math.hypot(projected[j].x - cx, projected[j].y - cy) < threshold) {
          used[j] = true
          group.push(projected[j])
          cx = group.reduce((s, p) => s + p.x, 0) / group.length
          cy = group.reduce((s, p) => s + p.y, 0) / group.length
          absorbedSomething = true
        }
      }
    }

    clusters.push({ id: `cluster-${i}`, x: cx, y: cy, items: group })
  }
  return clusters
}

/** Deterministic small spiral offsets for entries sharing (near-)identical coordinates. */
export function spiralOffset(index: number, total: number): { dx: number; dy: number } {
  if (total <= 1) return { dx: 0, dy: 0 }
  const radius = 9 + total * 1.1
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return { dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius }
}
