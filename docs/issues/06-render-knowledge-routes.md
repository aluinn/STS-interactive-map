---
title: Show knowledge routes in the Atlas
labels: [enhancement]
---

## Context

The dataset contains 7 `KnowledgeRoute`s (`src/data/knowledgeRoutes.ts`): longer paths
that knowledge travelled along, with dated waypoints, `intermediaries` and a
`whatChanged` field that deliberately resists "moved unchanged from hero to hero". They
are validated (`validateData.ts`) and part of `DataBundle.routes`, but no view renders
them; the Atlas draws only entry-to-entry relationship arcs.

## Task

Add an optional "Routes" layer to the Atlas:

- A toggle in the Atlas controls that draws each route as a polyline through its
  waypoints (reuse the projection and zoom transform in `AtlasView.tsx`).
- Selecting a route opens a panel with its summary, dated waypoints, intermediaries and
  `whatChanged`, and links to `relatedEntryIds`.
- State is in the URL (`?route=<slug>`), following the existing pattern in
  `useUrlState.ts`.
- Keyboard-operable and labelled, matching the existing marker accessibility.

## Acceptance

- Routes can be shown/hidden; each is focusable and opens the detail panel.
- `?route=` round-trips through `parseState`/`serializeState` (add tests next to
  `src/tests/useUrlState.test.ts`).
- No change to the relationship arcs; reduced-motion respected.

## Pointers

- `src/data/knowledgeRoutes.ts`, `src/types/index.ts` (`KnowledgeRoute`, `RouteWaypoint`)
- `src/features/atlas/AtlasView.tsx`, `MapGlyphs.tsx`
- `src/hooks/useUrlState.ts`, `src/components/DetailPanel.tsx`
