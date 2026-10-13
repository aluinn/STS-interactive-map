import { describe, expect, it } from 'vitest'
import { connectionWidth } from '../utils/connectionWeight'

describe('connectionWidth', () => {
  it('draws closer ties thicker, within a modest range', () => {
    const close = connectionWidth({ type: 'taught', confidence: 'established' })
    const mid = connectionWidth({ type: 'influenced', confidence: 'established' })
    const loose = connectionWidth({ type: 'contested', confidence: 'established' })
    expect(close).toBeGreaterThan(mid)
    expect(mid).toBeGreaterThan(loose)
    expect(close).toBeLessThanOrEqual(2)
  })
  it('thins speculative links', () => {
    expect(connectionWidth({ type: 'taught', confidence: 'speculative' })).toBeLessThan(
      connectionWidth({ type: 'taught', confidence: 'established' }),
    )
  })
})
