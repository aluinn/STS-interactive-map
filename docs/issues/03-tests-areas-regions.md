---
title: Unit-test areas.ts region and area logic
labels: [good first issue]
---

## Context

`regionOf` in `src/utils/areas.ts` assigns each entry to a presentable region from its
coordinates using coarse longitude/latitude rules, and `entryInAnyArea` applies the
subject-area filters. Neither has direct tests; they are only exercised indirectly
through filtering.

While reading it you may notice the `lon >= 110` and `lon >= 95` branches return the same
result; decide whether that is intentional and either simplify it or leave a comment.

## Task

Add `src/tests/areas.test.ts`:

- `regionOf` returns `'No single place'` when latitude or longitude is missing, and one
  representative city per region (for example London, Cairo, Beijing, Boston, Sydney,
  Mexico City).
- `entryInAnyArea` returns false for an empty list, true when any listed area matches.
- Every id in `AREAS` is unique and appears in `AREA_BY_ID`.

Build entries with an existing fixture or by picking real entries from `src/data`.

## Acceptance

- `npm test` passes; failures name the entry that was misclassified.
- If you change `regionOf`, existing `filterEntries.test.ts` still passes.

## Pointers

- `src/utils/areas.ts`
- `src/tests/filterEntries.test.ts`
