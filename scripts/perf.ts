// Reproducible timings for docs/PERFORMANCE.md. Run with: npm run perf
// Each measurement is the median of several runs after a warm-up.
import { it } from 'vitest'
import os from 'node:os'
import { dataBundle, entries as curated } from '../src/data'
import { defaultFilters } from '../src/hooks/useUrlState'
import { filterEntries } from '../src/utils/filterEntries'
import { validateDataBundle } from '../src/utils/validateData'
import { analyseDocuments } from '../src/features/notes/analysis/analyse'
import { SAMPLE_NOTES } from '../src/tests/fixtures/sampleNotes'
import type { ExtractedDocument } from '../src/features/notes/types'

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

async function time(runs: number, fn: () => unknown | Promise<unknown>): Promise<number> {
  await fn()
  const t: number[] = []
  for (let i = 0; i < runs; i++) {
    const a = performance.now()
    await fn()
    t.push(performance.now() - a)
  }
  return median(t)
}

function doc(text: string, pages: number): ExtractedDocument {
  return {
    fileId: 'perf',
    fileName: 'perf.md',
    title: 'perf',
    kind: 'md',
    pageCount: pages,
    pages: Array.from({ length: pages }, (_, i) => ({ page: i + 1, text })),
    contentHash: 'perf',
    method: 'markdown',
    warnings: [],
    scanned: false,
    truncated: false,
  }
}

it('prints timings', async () => {
  const out: string[] = []
  const log = (s: string) => out.push(s)
  log(
    `machine: ${os.cpus()[0].model}, ${Math.round(os.totalmem() / 2 ** 30)} GB RAM, node ${process.version}`,
  )
  log(
    `dataset: ${dataBundle.entries.length} entries, ${dataBundle.relationships.length} relationships`,
  )

  log(`validateDataBundle: ${(await time(20, () => validateDataBundle(dataBundle))).toFixed(2)} ms`)
  log(
    `filterEntries (text search "newton"): ${(
      await time(50, () => filterEntries(curated, { ...defaultFilters, q: 'newton' }))
    ).toFixed(3)} ms`,
  )
  const wordsPer = SAMPLE_NOTES.split(/\s+/).length
  for (const pages of [1, 10, 50]) {
    const d = doc(SAMPLE_NOTES, pages)
    const ms = await time(5, () => analyseDocuments([d], { curated }))
    log(
      `analyseDocuments (${pages} page(s) x ${wordsPer} words = ${pages * wordsPer} words): ${ms.toFixed(1)} ms`,
    )
  }
  process.stderr.write('\n' + out.join('\n') + '\n\n')
})
