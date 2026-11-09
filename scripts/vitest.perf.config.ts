import { defineConfig } from 'vitest/config'

// Used only by `npm run perf` (see scripts/perf.ts and docs/PERFORMANCE.md).
export default defineConfig({
  test: { environment: 'node', include: ['scripts/perf.ts'], testTimeout: 300_000 },
})
