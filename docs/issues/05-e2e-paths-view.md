---
title: "E2E test: step through a guided path"
labels: [good first issue]
---

## Context

The end-to-end suite (`e2e/smoke.spec.ts`) covers loading, switching views and opening an
entry. It does not cover Paths, where each stop has a caption and the URL carries the
journey and stop (`?view=journeys&journey=aristotle-to-newton&stop=1`).

## Task

Add a test to `e2e/` that opens that URL, then:

1. Checks the stepper group "Guided journey controls" is visible and shows "2 / 5".
2. Clicks "Next stop" and checks the URL now has `stop=2`.
3. Clicks "Previous stop" twice and checks `stop` is back to 0 (or absent).

Reuse the `beforeEach` that marks the walkthrough as seen.

## Acceptance

- `npm run test:e2e` passes locally (`PW_CHANNEL=chrome` if you have Chrome installed).
- The test uses roles and accessible names, not CSS classes.

## Pointers

- `e2e/smoke.spec.ts`
- `src/features/journeys/JourneyStepper.tsx` (labels "Previous stop", "Next stop")
- `src/hooks/useUrlState.ts` (how `stop` is serialised)
