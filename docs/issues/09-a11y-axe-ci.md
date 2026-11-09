---
title: Automated accessibility checks in CI
labels: [enhancement]
---

## Context

Accessibility is a stated priority (list-view alternative to the map, focus trapping,
reduced motion, contrast-checked period themes), but it is verified only by unit tests
of specific helpers and by manual checking. Nothing scans rendered pages for regressions.

## Task

Add `@axe-core/playwright` (a new devDependency, so call it out in the PR) and an e2e test
that runs axe on the Atlas, Timeline, Debates and Paths views and the open entry dialog,
in both dark and light themes. Fix violations that are quick; for the rest, disable the
specific rule with a comment linking a follow-up issue rather than ignoring the whole
page.

## Acceptance

- `npm run test:e2e` runs the scans and passes in CI.
- Any excluded rule is named, justified and tracked.
- Colour-contrast results are reported for the period themes at least once.

## Pointers

- `e2e/smoke.spec.ts`, `playwright.config.ts`
- `src/features/eras/eraTheme.ts`, `src/utils/contrast.ts`
- `src/components/NavShell.tsx` (theme toggle)
