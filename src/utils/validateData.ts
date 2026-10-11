import type { DataBundle } from '../types'

export interface ValidationIssue {
  level: 'error' | 'warning'
  message: string
}

/**
 * Validates the content model's internal consistency. Run in tests and,
 * optionally, at dev-time startup. Never throws — callers decide how to
 * treat errors vs warnings.
 */
export function validateDataBundle(bundle: DataBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const idSet = new Set<string>()
  const slugSet = new Set<string>()

  for (const entry of bundle.entries) {
    if (idSet.has(entry.id)) {
      issues.push({ level: 'error', message: `Duplicate entry id: ${entry.id}` })
    }
    idSet.add(entry.id)

    if (slugSet.has(entry.slug)) {
      issues.push({ level: 'error', message: `Duplicate entry slug: ${entry.slug}` })
    }
    slugSet.add(entry.slug)

    if (entry.endYear !== undefined && entry.endYear < entry.startYear) {
      issues.push({ level: 'error', message: `Entry ${entry.id} has endYear before startYear` })
    }

    const hasCoord = entry.latitude !== undefined && entry.longitude !== undefined
    if (!hasCoord && !entry.transregional && entry.places.length === 0) {
      issues.push({
        level: 'warning',
        message: `Entry ${entry.id} has no coordinate, is not marked transregional, and has no places listed`,
      })
    }

    if (hasCoord) {
      const lat = entry.latitude as number
      const lon = entry.longitude as number
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        issues.push({
          level: 'error',
          message: `Entry ${entry.id} has out-of-range coordinates (${lat}, ${lon})`,
        })
      }
    }

    if (entry.contentStatus === 'sourceNeeded' && entry.sources.length > 0) {
      issues.push({
        level: 'warning',
        message: `Entry ${entry.id} is marked sourceNeeded but already lists sources`,
      })
    }
    if (entry.contentStatus !== 'sourceNeeded' && entry.sources.length === 0) {
      issues.push({
        level: 'error',
        message: `Entry ${entry.id} has no sources and is not marked sourceNeeded`,
      })
    }

    for (const relatedId of entry.relatedEntryIds) {
      if (!bundle.entries.some((e) => e.id === relatedId)) {
        issues.push({
          level: 'warning',
          message: `Entry ${entry.id} references missing related entry id: ${relatedId}`,
        })
      }
    }
  }

  const relIdSet = new Set<string>()
  for (const rel of bundle.relationships) {
    if (relIdSet.has(rel.id)) {
      issues.push({ level: 'error', message: `Duplicate relationship id: ${rel.id}` })
    }
    relIdSet.add(rel.id)

    if (!idSet.has(rel.sourceId)) {
      issues.push({
        level: 'error',
        message: `Relationship ${rel.id} has missing sourceId: ${rel.sourceId}`,
      })
    }
    if (!idSet.has(rel.targetId)) {
      issues.push({
        level: 'error',
        message: `Relationship ${rel.id} has missing targetId: ${rel.targetId}`,
      })
    }
    if (rel.sourceId === rel.targetId) {
      issues.push({
        level: 'error',
        message: `Relationship ${rel.id} points from an entry to itself`,
      })
    }
  }

  const debateIdSet = new Set<string>()
  for (const debate of bundle.debates) {
    if (debateIdSet.has(debate.id)) {
      issues.push({ level: 'error', message: `Duplicate debate id: ${debate.id}` })
    }
    debateIdSet.add(debate.id)

    for (const caseId of debate.historicalCaseIds) {
      if (!idSet.has(caseId)) {
        issues.push({
          level: 'warning',
          message: `Debate ${debate.id} references missing historical case id: ${caseId}`,
        })
      }
    }
  }

  const journeyIdSet = new Set<string>()
  for (const journey of bundle.journeys) {
    if (journeyIdSet.has(journey.id)) {
      issues.push({ level: 'error', message: `Duplicate journey id: ${journey.id}` })
    }
    journeyIdSet.add(journey.id)

    if (journey.stops.length === 0) {
      issues.push({ level: 'error', message: `Journey ${journey.id} has no stops` })
    }

    for (const stop of journey.stops) {
      if (!idSet.has(stop.entryId)) {
        issues.push({
          level: 'error',
          message: `Journey ${journey.id} references missing entry id: ${stop.entryId}`,
        })
      }
    }
  }

  const routeIdSet = new Set<string>()
  const routeSlugSet = new Set<string>()
  for (const route of bundle.routes) {
    if (routeIdSet.has(route.id)) {
      issues.push({ level: 'error', message: `Duplicate route id: ${route.id}` })
    }
    routeIdSet.add(route.id)

    if (routeSlugSet.has(route.slug)) {
      issues.push({ level: 'error', message: `Duplicate route slug: ${route.slug}` })
    }
    routeSlugSet.add(route.slug)

    if (route.waypoints.length < 2) {
      issues.push({
        level: 'error',
        message: `Route ${route.id} has fewer than two waypoints`,
      })
    }

    for (const wp of route.waypoints) {
      if (wp.latitude < -90 || wp.latitude > 90 || wp.longitude < -180 || wp.longitude > 180) {
        issues.push({
          level: 'error',
          message: `Route ${route.id} has an out-of-range waypoint coordinate (${wp.latitude}, ${wp.longitude})`,
        })
      }
    }

    if (route.relatedEntryIds.length === 0) {
      issues.push({
        level: 'warning',
        message: `Route ${route.id} has no related entry ids`,
      })
    }
    for (const relatedId of route.relatedEntryIds) {
      if (!idSet.has(relatedId)) {
        issues.push({
          level: 'warning',
          message: `Route ${route.id} references missing related entry id: ${relatedId}`,
        })
      }
    }

    if (route.sources.length === 0) {
      issues.push({
        level: 'warning',
        message: `Route ${route.id} has no sources`,
      })
    }
  }

  // Entries that reference a debate via philosophicalQuestions.debateId must point somewhere real.
  for (const entry of bundle.entries) {
    for (const lens of entry.philosophicalQuestions) {
      if (lens.debateId && !debateIdSet.has(lens.debateId)) {
        issues.push({
          level: 'warning',
          message: `Entry ${entry.id} references missing debate id: ${lens.debateId}`,
        })
      }
    }
  }

  return issues
}

export function hasErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.level === 'error')
}
