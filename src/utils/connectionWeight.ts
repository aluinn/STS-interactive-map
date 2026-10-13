import type { Relationship, RelationshipType } from '../types'

/**
 * How close a connection is, from the kind of tie it records:
 * 3 = direct personal or working contact, 2 = a clear intellectual or
 * institutional tie, 1 = a looser, indirect or parallel relation.
 */
const CLOSENESS: Record<RelationshipType, 1 | 2 | 3> = {
  taught: 3,
  collaborated: 3,
  corresponded: 3,
  translated: 3,
  travelled: 3,
  'co-produced': 3,
  influenced: 2,
  supported: 2,
  challenged: 2,
  criticised: 2,
  revised: 2,
  replaced: 2,
  funded: 2,
  preserved: 2,
  institutionalised: 2,
  'materially-enabled': 2,
  'applied-to': 2,
  regulated: 2,
  commercialised: 2,
  'independently-developed': 1,
  contested: 1,
  represented: 1,
  excluded: 1,
  extracted: 1,
  appropriated: 1,
}

/** Line widths (in map pixels at zoom 1): kept thin, just enough to tell apart. */
const WIDTH = { 1: 0.8, 2: 1.2, 3: 1.8 } as const

export function connectionWidth(rel: Pick<Relationship, 'type' | 'confidence'>): number {
  const w = WIDTH[CLOSENESS[rel.type]]
  return rel.confidence === 'speculative' ? w * 0.85 : w
}
