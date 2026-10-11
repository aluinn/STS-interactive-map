import { describe, expect, it } from 'vitest'
import { clusterProjected, type ProjectedEntry } from '../utils/geo'
import { entries } from '../data'

const at = (id: string, x: number, y: number): ProjectedEntry => ({
  entry: { ...entries[0], id },
  x,
  y,
})

describe('clusterProjected', () => {
  it('merges nearby markers and keeps distant ones separate', () => {
    const clusters = clusterProjected([at('a', 0, 0), at('b', 5, 0), at('c', 500, 500)], 1, 20)
    expect(clusters).toHaveLength(2)
    expect(clusters[0].items.map((i) => i.entry.id)).toEqual(['a', 'b'])
  })

  it('splits clusters apart as the map is zoomed in', () => {
    const points = [at('a', 0, 0), at('b', 5, 0)]
    expect(clusterProjected(points, 1, 20)).toHaveLength(1)
    expect(clusterProjected(points, 8, 20)).toHaveLength(2)
  })

  it('does not chain far-apart markers through intermediaries', () => {
    const chain = Array.from({ length: 10 }, (_, i) => at(`m${i}`, i * 15, 0))
    const clusters = clusterProjected(chain, 1, 20)
    expect(Math.max(...clusters.map((c) => c.items.length))).toBeLessThan(10)
  })
})
