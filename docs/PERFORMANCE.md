# Performance

Numbers here were measured, not estimated. Reproduce them with the commands below.

## Environment

- Apple M1 Pro, 16 GB RAM, macOS (Darwin 24.6.0), Node v24.20.0
- Measured on 2026-11-09 at the commit that introduced `scripts/perf.ts`
- Dataset: 226 entries, 164 relationships

## Data and analysis timings

`npm run perf` (see [`scripts/perf.ts`](../scripts/perf.ts)) reports the median of several
runs after a warm-up, in Node (no browser, so no rendering cost). Two consecutive runs gave
the same figures within noise:

| Operation | Median |
| --- | --- |
| `validateDataBundle` over the whole dataset | 0.7 ms |
| `filterEntries` with the text search "newton" over all 226 entries | 1.0 ms |
| `analyseDocuments` on 1 page (171 words) | 1.2 ms |
| `analyseDocuments` on 10 pages (1,710 words) | 12.5–13.0 ms |
| `analyseDocuments` on 50 pages (8,550 words) | 56.5–57.0 ms |

Reading of these numbers: filtering and validation are far too cheap to need indexing or
memoisation beyond what React already does. Notes analysis scales roughly linearly with
text (about 6.5 ms per thousand words here).

**Caveat:** the analysis benchmark repeats one sample page, so entity de-duplication
across pages probably flatters the larger sizes. Treat it as a rough scaling check, not
as a guarantee for arbitrary real documents. PDF text extraction (PDF.js, in a web
worker) is not included.

## Bundle size

From `npm run build` on the same commit:

| Asset | Size | gzip |
| --- | --- | --- |
| Main JavaScript chunk (`index-*.js`, includes the dataset) | 992.93 kB | 309.50 kB |
| PDF.js (`pdf-*.js`, loaded when Your Notes is opened) | 430.86 kB | 129.35 kB |
| PDF.js worker | 1,264.34 kB | not reported by the build |
| Main CSS | 48.14 kB | 9.42 kB |
| Atlas view chunk | 14.35 kB | 5.44 kB |
| Globe view chunk | 15.40 kB | 6.22 kB |

`public/earth/` holds two textures (about 456 kB together) fetched only when the globe is
needed; the build output (`dist/`) totals 4.8 MB on disk.

Vite warns that the main chunk exceeds 500 kB. The dataset is bundled into it, which is a
deliberate simplicity-over-first-load trade-off (see
[`ARCHITECTURE.md`](ARCHITECTURE.md#decisions-and-trade-offs)); splitting it is on the
[roadmap](../ROADMAP.md).

## What was not measured

Frame rate and interaction latency in a real browser (map zoom, globe dragging). The code
contains specific mitigations (coalesced zoom updates, outline level-of-detail, reduced
globe quality while dragging, lazy-loaded views), but no benchmark backs numbers for them.

## Reproduce

```bash
npm install
npm run perf     # timings table
npm run build    # bundle sizes in the output
```
