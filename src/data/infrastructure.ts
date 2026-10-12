/**
 * Schematic subsea-cable corridors for the globe overlay.
 *
 * These are deliberately simplified great-circle links between well-known
 * landing regions, NOT the surveyed paths of any individual cable. They
 * exist to show that "the cloud" runs through physical, unevenly distributed
 * infrastructure. For real routes consult an up-to-date cable map (for
 * example TeleGeography's Submarine Cable Map).
 */
export interface CableCorridor {
  id: string
  label: string
  /** [longitude, latitude] pairs; drawn as great-circle arcs. */
  points: [number, number][]
}

export const CABLE_CORRIDORS_NOTE =
  'Schematic corridors, not the exact paths of individual cables. General picture only; check a current cable map before relying on any route.'

export const cableCorridors: CableCorridor[] = [
  {
    id: 'north-atlantic',
    label: 'North Atlantic',
    points: [
      [-74.0, 40.7],
      [-4.2, 50.2],
    ],
  },
  {
    id: 'iberia-brazil',
    label: 'Europe–South America',
    points: [
      [-9.1, 38.7],
      [-38.5, -3.7],
    ],
  },
  {
    id: 'west-africa',
    label: 'Europe–West Africa–South Africa',
    points: [
      [-9.1, 38.7],
      [3.4, 6.4],
      [18.4, -33.9],
    ],
  },
  {
    id: 'mediterranean-red-sea',
    label: 'Mediterranean–Red Sea–Indian Ocean',
    points: [
      [5.4, 43.3],
      [31.2, 30.0],
      [43.1, 11.6],
      [72.8, 19.1],
    ],
  },
  {
    id: 'south-asia-se-asia',
    label: 'South Asia–Southeast Asia',
    points: [
      [72.8, 19.1],
      [103.8, 1.3],
      [114.2, 22.3],
    ],
  },
  {
    id: 'east-asia-pacific',
    label: 'East Asia–North America (Pacific)',
    points: [
      [139.7, 35.5],
      [-155.5, 19.7],
      [-118.4, 34.0],
    ],
  },
  {
    id: 'australasia-pacific',
    label: 'Australasia–North America (Pacific)',
    points: [
      [151.2, -33.9],
      [174.8, -36.8],
      [-155.5, 19.7],
    ],
  },
  {
    id: 'east-africa',
    label: 'East Africa coast',
    points: [
      [43.1, 11.6],
      [39.7, -4.0],
      [32.6, -25.9],
    ],
  },
]
