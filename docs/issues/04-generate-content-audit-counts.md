---
title: Generate the counts in CONTENT_AUDIT.md from the data
labels: [good first issue]
---

## Context

`CONTENT_AUDIT.md` says the dataset has 140 entries, 122 relationships, 18 debates and
24 guided paths. The built dataset currently has 226 entries, 164 relationships, 20
debates, 29 paths and 7 knowledge routes, so the audit is stale and will go stale again
with every content change.

## Task

Add a small script (for example `scripts/content-stats.ts`, run through the same Vitest
config trick as `scripts/perf.ts`, or any approach that does not add a dependency) that
prints entry/relationship/debate/path/route counts and entries per `period`, and wire it
up as `npm run stats`. Then update the headline numbers in `CONTENT_AUDIT.md` and point
to the command.

## Acceptance

- `npm run stats` prints the five totals and a per-period table.
- Numbers in `CONTENT_AUDIT.md` match the script output.
- No new dependency.

## Pointers

- `CONTENT_AUDIT.md`
- `src/data/index.ts` (`dataBundle`)
- `scripts/perf.ts` and `scripts/vitest.perf.config.ts` for how to run TypeScript that
  imports app code
