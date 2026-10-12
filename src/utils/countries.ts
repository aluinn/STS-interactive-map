import { geoBounds, geoContains, geoDistance } from 'd3-geo'
import { feature } from 'topojson-client'
import countriesTopology from 'world-atlas/countries-50m.json'

interface CountryShape {
  name: string
  geometry: GeoJSON.Feature
  /** [[west, south], [east, north]]; west > east when the shape crosses the antimeridian. */
  bounds: [[number, number], [number, number]]
}

/** Natural Earth abbreviations expanded to the names people expect to read. */
const DISPLAY_NAMES: Record<string, string> = {
  'United States of America': 'United States',
  'Dem. Rep. Congo': 'Democratic Republic of the Congo',
  Congo: 'Republic of the Congo',
  'Central African Rep.': 'Central African Republic',
  'S. Sudan': 'South Sudan',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  Czechia: 'Czech Republic',
  'Dominican Rep.': 'Dominican Republic',
  'Eq. Guinea': 'Equatorial Guinea',
  'W. Sahara': 'Western Sahara',
  'Falkland Is.': 'Falkland Islands',
  "Côte d'Ivoire": "Côte d'Ivoire",
}

/** Nearest-country fallback for points that land just offshore (~320 km). */
const MAX_FALLBACK_RADIANS = 0.05

let shapes: CountryShape[] | null = null
const cache = new Map<string, string | null>()

function loadShapes(): CountryShape[] {
  if (shapes) return shapes
  const topology = countriesTopology as never as { objects: { countries: never } }
  const collection = feature(countriesTopology as never, topology.objects.countries) as unknown as {
    features: GeoJSON.Feature[]
  }
  shapes = collection.features.map((f) => {
    const raw = String((f.properties as { name?: string } | null)?.name ?? '')
    return {
      name: DISPLAY_NAMES[raw] ?? raw,
      geometry: f,
      bounds: geoBounds(f as never) as [[number, number], [number, number]],
    }
  })
  return shapes
}

function inBounds(b: CountryShape['bounds'], lon: number, lat: number): boolean {
  const [[w, s], [e, n]] = b
  if (lat < s || lat > n) return false
  return w <= e ? lon >= w && lon <= e : lon >= w || lon <= e
}

function distanceToShape(f: GeoJSON.Feature, lon: number, lat: number): number {
  let best = Infinity
  const visit = (coords: unknown): void => {
    if (!Array.isArray(coords)) return
    if (typeof coords[0] === 'number') {
      best = Math.min(best, geoDistance([lon, lat], coords as [number, number]))
      return
    }
    for (const c of coords) visit(c)
  }
  visit((f.geometry as { coordinates?: unknown } | null)?.coordinates)
  return best
}

/**
 * Present-day country containing a point, or null if it can't be placed
 * (open sea, or too far from any coastline). Memoised per coordinate.
 */
export function countryAt(latitude: number, longitude: number): string | null {
  const key = `${latitude},${longitude}`
  if (cache.has(key)) return cache.get(key) ?? null
  const all = loadShapes()
  let found: string | null = null
  for (const s of all) {
    if (
      inBounds(s.bounds, longitude, latitude) &&
      geoContains(s.geometry as never, [longitude, latitude])
    ) {
      found = s.name
      break
    }
  }
  if (!found) {
    let best = MAX_FALLBACK_RADIANS
    for (const s of all) {
      const d = distanceToShape(s.geometry, longitude, latitude)
      if (d < best) {
        best = d
        found = s.name
      }
    }
  }
  cache.set(key, found)
  return found
}
