import { beforeEach, describe, expect, it } from 'vitest'
import { readNotebook } from '../hooks/useNotebook'

describe('readNotebook', () => {
  beforeEach(() => localStorage.clear())

  it('returns [] when nothing is stored', () => {
    expect(readNotebook()).toEqual([])
  })

  it('returns [] for corrupt JSON or a non-array value', () => {
    localStorage.setItem('atlas-notebook', '{not json')
    expect(readNotebook()).toEqual([])
    localStorage.setItem('atlas-notebook', '{"entryId":"x"}')
    expect(readNotebook()).toEqual([])
  })

  it('drops malformed and duplicate items and fills missing fields', () => {
    localStorage.setItem(
      'atlas-notebook',
      JSON.stringify([
        { entryId: 'a' },
        null,
        7,
        { note: 'x' },
        { entryId: 'a', note: 'dup' },
        { entryId: 'b', note: 'hi', savedAt: 'now' },
      ]),
    )
    const items = readNotebook()
    expect(items.map((i) => i.entryId)).toEqual(['a', 'b'])
    expect(items[0].note).toBe('')
    expect(items[1].note).toBe('hi')
  })
})
