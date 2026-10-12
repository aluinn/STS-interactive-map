import type { EarthTexture, EarthTextures } from './earthTextures'

export interface EarthView {
  /** Longitude / latitude (degrees) at the centre of the disc. */
  lon: number
  lat: number
  /** Show lights on the night side instead of a plain shaded day side. */
  cityLights: boolean
}

// Fixed "sun" in view space (right, up, towards the viewer). It stays put
// while the globe turns, as if the camera were moving rather than the sun.
const SUN = (() => {
  const x = -0.55
  const y = 0.42
  const z = 0.72
  const n = Math.hypot(x, y, z)
  return [x / n, y / n, z / n] as const
})()

const DEG = Math.PI / 180

function smoothstep(a: number, b: number, v: number): number {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function sample(tex: EarthTexture, lonDeg: number, latDeg: number): number {
  let u = (lonDeg + 180) / 360
  u -= Math.floor(u)
  const v = Math.min(0.9999, Math.max(0, (90 - latDeg) / 180))
  const x = Math.min(tex.width - 1, Math.floor(u * tex.width))
  const y = Math.min(tex.height - 1, Math.floor(v * tex.height))
  return tex.pixels[y * tex.width + x]
}

/**
 * Paints an orthographic Earth disc, centred at (cx, cy) with radius R (all
 * in canvas pixels), into an RGBA buffer. The maths is the standard inverse
 * orthographic projection: for each pixel inside the disc, find the
 * longitude/latitude beneath it and sample the equirectangular texture
 * there. Only pixels inside the canvas are visited, so zooming in on a
 * large globe costs no more than the visible area.
 */
export function renderEarth(
  out: ImageData,
  textures: EarthTextures,
  view: EarthView,
  cx: number,
  cy: number,
  R: number,
): void {
  const size = out.width
  const buf = new Uint32Array(out.data.buffer)
  buf.fill(0)
  const level = R * 2 < 700 ? 1 : 0
  const day = textures.day[level]
  const night = textures.night[level]

  const lat0 = view.lat * DEG
  const sinLat0 = Math.sin(lat0)
  const cosLat0 = Math.cos(lat0)

  const y0 = Math.max(0, Math.floor(cy - R))
  const y1 = Math.min(out.height - 1, Math.ceil(cy + R))
  for (let py = y0; py <= y1; py++) {
    const y = (cy - (py + 0.5)) / R
    const x0 = Math.max(0, Math.floor(cx - R))
    const x1 = Math.min(size - 1, Math.ceil(cx + R))
    for (let px = x0; px <= x1; px++) {
      const x = (px + 0.5 - cx) / R
      const r2 = x * x + y * y
      if (r2 >= 1) continue
      const z = Math.sqrt(1 - r2)

      const sinLat = y * cosLat0 + z * sinLat0
      const lat = Math.asin(sinLat) / DEG
      const lon = view.lon + Math.atan2(x, z * cosLat0 - y * sinLat0) / DEG

      const d = sample(day, lon, lat)
      let r = d & 255
      let g = (d >> 8) & 255
      let b = (d >> 16) & 255

      const light = x * SUN[0] + y * SUN[1] + z * SUN[2]
      const dayFactor = smoothstep(-0.1, 0.25, light)
      let shade: number
      if (view.cityLights) {
        const n = sample(night, lon, lat)
        const nr = n & 255
        const ng = (n >> 8) & 255
        const nb = (n >> 16) & 255
        shade = 0.2 + 0.8 * dayFactor
        const nightWeight = 1 - dayFactor
        r = r * shade + nr * 1.35 * nightWeight
        g = g * shade + ng * 1.3 * nightWeight
        b = b * shade + nb * 1.05 * nightWeight
      } else {
        shade = 0.5 + 0.5 * dayFactor
        r *= shade
        g *= shade
        b *= shade
      }

      // Limb: slight darkening and a thin blue atmospheric haze at the edge.
      const limb = Math.pow(1 - z, 3)
      const haze = limb * 0.55
      r = r * (1 - haze) + 110 * haze
      g = g * (1 - haze) + 165 * haze
      b = b * (1 - haze) + 255 * haze

      buf[py * size + px] =
        (255 << 24) | (Math.min(255, b) << 16) | (Math.min(255, g) << 8) | Math.min(255, r)
    }
  }
}
