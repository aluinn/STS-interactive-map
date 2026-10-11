import { describe, expect, it } from 'vitest'
import { dataBundle } from '../data'
import { validateDataBundle, hasErrors } from '../utils/validateData'
import type { RelationshipType } from '../types'

describe('data integrity', () => {
  const issues = validateDataBundle(dataBundle)
  const errors = issues.filter((i) => i.level === 'error')
  const warnings = issues.filter((i) => i.level === 'warning')

  it('has no validation errors', () => {
    if (errors.length > 0) {
      console.error(errors.map((e) => e.message).join('\n'))
    }
    expect(errors).toHaveLength(0)
  })

  it('reports warnings for visibility (not a failure)', () => {
    if (warnings.length > 0) {
      console.warn(warnings.map((w) => w.message).join('\n'))
    }
    expect(hasErrors(issues)).toBe(false)
  })

  it('has a substantial dataset, not a tiny demo', () => {
    expect(dataBundle.entries.length).toBeGreaterThanOrEqual(50)
    expect(dataBundle.relationships.length).toBeGreaterThanOrEqual(40)
    expect(dataBundle.debates.length).toBeGreaterThanOrEqual(10)
    expect(dataBundle.journeys.length).toBeGreaterThanOrEqual(8)
  })

  it('covers every relationship type at least once', () => {
    const types = new Set(dataBundle.relationships.map((r) => r.type))
    const expected: RelationshipType[] = [
      'influenced',
      'taught',
      'translated',
      'corresponded',
      'travelled',
      'collaborated',
      'criticised',
      'supported',
      'challenged',
      'replaced',
      'preserved',
      'funded',
      'appropriated',
      'excluded',
      'extracted',
      'institutionalised',
      'independently-developed',
      'commercialised',
      'regulated',
      'co-produced',
      'represented',
      'materially-enabled',
      'contested',
      'revised',
      'applied-to',
    ]
    for (const t of expected) {
      expect(types.has(t)).toBe(true)
    }
  })
})
