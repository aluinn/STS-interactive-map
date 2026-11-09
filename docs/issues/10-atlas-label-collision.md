---
title: Label-collision layout for Atlas markers
labels: [enhancement]
---

## Context

On the Atlas, entry labels appear by hover and zoom threshold, which can still overlap in
dense regions such as Western Europe (in the "Renaissance and Early Modern" screenshot,
clusters of 14 and 5 sit almost on top of each other). The README's former
"future ideas" listed a proper label-collision algorithm.

## Task

Prototype a greedy collision pass for visible labels in `AtlasView.tsx`: sort candidate
labels by priority (selected, most-connected via `utils/connectionWeight.ts`, then
alphabetical), place each at a preferred offset, and hide a label if its bounding box
overlaps one already placed. Recompute on zoom end, not per frame, and keep the work off
the hot path (zoom updates are already requestAnimation-coalesced).

## Acceptance

- No overlapping labels at the default zoom for the "All time" and "Early modern" views.
- The selected entry's label is never hidden.
- Zoom and pan stay smooth (describe how you checked; the repo has no frame-rate
  benchmark yet).
- Labels remain available to screen readers via the existing `aria-label`s.

## Pointers

- `src/features/atlas/AtlasView.tsx`, `MapGlyphs.tsx`
- `src/utils/connectionWeight.ts`, `src/utils/geo.ts` (clustering)
