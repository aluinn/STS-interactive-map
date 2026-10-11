import { useMemo } from 'react'
import { geoOrthographic, geoPath, geoGraticule } from 'd3-geo'
import { feature, mesh } from 'topojson-client'
import landTopology from 'world-atlas/land-50m.json'
import countriesTopology from 'world-atlas/countries-50m.json'
import styles from './IntroGlobe.module.css'

interface IntroGlobeProps {
  /** Degrees the globe has turned about its axis (drives longitude). */
  rotation: number
}

const R = 46
const land = feature(
  landTopology as never,
  (landTopology as never as { objects: { land: never } }).objects.land,
)
const borders = mesh(
  countriesTopology as never,
  (countriesTopology as never as { objects: { countries: never } }).objects.countries,
  (a, b) => a !== b,
)
const fineGraticule = geoGraticule().step([10, 10])()
const majorGraticule = geoGraticule().step([30, 30])()
const equator = {
  type: 'LineString',
  coordinates: [
    [-180, 0],
    [-90, 0],
    [0, 0],
    [90, 0],
    [180, 0],
  ],
} as const
const sphere = { type: 'Sphere' } as const

/**
 * Antique-style globe drawn from real Natural Earth geometry (orthographic
 * projection) with coastlines, borders and a graticule, turning slowly as
 * `rotation` increases.
 */
export function IntroGlobe({ rotation }: IntroGlobeProps) {
  const paths = useMemo(() => {
    const projection = geoOrthographic()
      .translate([50, 50])
      .scale(R)
      .rotate([-(rotation * 2 + 10), -22, 0])
      .clipAngle(90)
      .precision(0.3)
    const path = geoPath(projection)
    return {
      land: path(land as never) ?? '',
      borders: path(borders) ?? '',
      fine: path(fineGraticule) ?? '',
      major: path(majorGraticule) ?? '',
      equator: path(equator as never) ?? '',
      sphere: path(sphere as never) ?? '',
    }
  }, [rotation])

  return (
    <div className={styles.sphere}>
      <div className={styles.shading} />
      <svg className={styles.surface} viewBox="0 0 100 100" aria-hidden>
        <path className={styles.ocean} d={paths.sphere} />
        <path className={styles.graticule} d={paths.fine} />
        <path className={styles.land} d={paths.land} />
        <path className={styles.border} d={paths.borders} />
        <path className={styles.graticuleStrong} d={paths.major} />
        <path className={styles.graticuleStrong} d={paths.equator} />
        <path className={styles.rim} d={paths.sphere} />
        <circle className={styles.rim} cx="50" cy="50" r={R + 1.6} style={{ opacity: 0.3 }} />
      </svg>
      <div className={styles.shine} />
    </div>
  )
}
