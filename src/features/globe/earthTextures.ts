/**
 * Loads the two NASA Earth Observatory textures (day surface and night
 * lights; see CREDITS in the About dialog) into plain pixel arrays that the
 * canvas renderer samples directly. No WebGL or 3D library is involved.
 *
 * Loading is lazy and memoised: nothing is fetched until the globe is
 * needed, and `preloadEarthTextures` lets the app start the downloads one
 * period early so the globe appears without a wait.
 */

export interface EarthTexture {
  width: number
  height: number
  /** RGBA, one 32-bit word per pixel in little-endian byte order. */
  pixels: Uint32Array
}

export interface EarthTextures {
  day: EarthTexture[] // [full resolution, half resolution]
  night: EarthTexture[]
}

export const EARTH_DAY_URL = `${import.meta.env.BASE_URL}earth/earth-day.jpg`
export const EARTH_NIGHT_URL = `${import.meta.env.BASE_URL}earth/earth-night.jpg`

let cached: Promise<EarthTextures> | null = null

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Could not load ${url}`))
    img.src = url
  })
}

function toTexture(source: CanvasImageSource, width: number, height: number): EarthTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas 2D is unavailable')
  ctx.drawImage(source, 0, 0, width, height)
  const data = ctx.getImageData(0, 0, width, height)
  return { width, height, pixels: new Uint32Array(data.data.buffer) }
}

async function decode(url: string): Promise<EarthTexture[]> {
  const img = await loadImage(url)
  return [
    toTexture(img, 2048, 1024),
    // A half-size copy avoids shimmering when the globe is drawn small.
    toTexture(img, 1024, 512),
  ]
}

export function loadEarthTextures(): Promise<EarthTextures> {
  if (!cached) {
    cached = Promise.all([decode(EARTH_DAY_URL), decode(EARTH_NIGHT_URL)]).then(([day, night]) => ({
      day,
      night,
    }))
    // Let a later attempt retry after a failure (e.g. a dropped connection).
    cached.catch(() => {
      cached = null
    })
  }
  return cached
}

/** Starts fetching the image files so they are in the browser cache. */
export function preloadEarthTextures(): void {
  for (const url of [EARTH_DAY_URL, EARTH_NIGHT_URL]) {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  }
}
