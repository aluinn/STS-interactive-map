---
title: Unit-test the easing helpers
labels: [good first issue]
---

## Context

`src/utils/easing.ts` (`clamp01`, `smoothstep`, `lerp`, `lerpKeyframes`) drives the
scroll-linked cinematic intro, but no test imports it.

## Task

Add `src/tests/easing.test.ts` covering:

- `clamp01` below, inside and above range.
- `smoothstep` at both edges, at the midpoint, and outside the edges.
- `lerp` at `t = 0`, `0.5`, `1`.
- `lerpKeyframes` before the first frame, between frames, exactly on a frame, past the
  last frame, and with two frames at the same progress (the `p1 === p0` branch).

## Acceptance

- `npm test` passes and every branch in `easing.ts` is exercised.
- No change to `easing.ts` behaviour.

## Pointers

- `src/utils/easing.ts`
- `src/tests/geo.test.ts` for the test style used in this repo
