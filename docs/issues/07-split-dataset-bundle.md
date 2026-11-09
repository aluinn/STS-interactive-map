---
title: Split the dataset out of the main bundle
labels: [enhancement]
---

## Context

`npm run build` warns that the main chunk is over 500 kB: `index-*.js` is about 993 kB
(310 kB gzipped; see `docs/PERFORMANCE.md`). All 23 `entries.*.ts` files, relationships,
debates and journeys are imported statically through `src/data/index.ts`, so every visitor
downloads the whole dataset before the first paint, even though the first screen shows
only some of it.

## Task

Reduce the first-load JavaScript without changing behaviour. One approach: keep what the
landing view needs eagerly loaded, and load the large per-period entry files with dynamic
`import()` as periods are selected. Another: lazy-load debates and journeys with their
views. Whichever you choose, measure before and after with `npm run build`.

Keep `DataBundle` as the single shape the UI consumes (see `DATA_MODEL.md`) and keep
`validateDataBundle` running over the complete data in tests.

## Acceptance

- Main chunk is measurably smaller; record before/after numbers in the PR and update
  `docs/PERFORMANCE.md`.
- All 525+ unit tests and the e2e smoke test pass; deep links such as `?entry=copernicus`
  still open immediately.
- No new loading flashes in the Timeline or search.

## Pointers

- `src/data/index.ts`, `src/App.tsx` (where `dataBundle` is consumed)
- `vite.config.ts`, `src/tests/data.test.ts`
