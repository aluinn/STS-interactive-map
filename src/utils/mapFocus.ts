/** Where the viewer is looking, shared between the flat map and the globe. */
export interface MapFocus {
  lon: number
  lat: number
  /** Flat-map zoom factor, or the equivalent for the globe. */
  k: number
  /** True when this focus was written by the globe (consumed once by the map). */
  fromGlobe?: boolean
}
