# My Notes: building an atlas from your own notes

"My Notes" turns a student's own text-based PDFs, `.txt` and `.md` files into a personal atlas that
sits beside the curated one. It is **local-first**: everything happens in the browser, no server is
involved, and **no AI service is called**.

## The promises, and how each is enforced

| Promise                               | How it is kept                                                                                                                                                              | How it is checked                                                                                                                                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Files and text never leave the device | There is no backend. No `fetch`, `XMLHttpRequest`, beacon or socket exists in `src/features/notes`. Files are read with `File.arrayBuffer()` and handed to PDF.js as bytes. | `src/tests/notesPrivacy.test.ts` fails the build if such code appears. `scripts/verify-offline-import.mjs` imports a PDF and a Markdown file with the browser **offline** and fails on any request. |
| No AI calls, no API keys              | The extractor is deterministic rules and dictionaries (below). There is no key, endpoint, or environment variable anywhere in the frontend.                                 | The same unit test scans all frontend source for provider names, key patterns and `import.meta.env` secrets.                                                                                        |
| The browser itself blocks leaks       | The production build ships a Content-Security-Policy with `connect-src 'self'` (see `vite.config.ts`), so even a future mistake could not send text to another origin.      | The verify script tries a cross-origin `fetch` and expects it to be refused.                                                                                                                        |
| Nothing becomes public                | Collections live in this browser's IndexedDB. Export is a file the user saves.                                                                                              | —                                                                                                                                                                                                   |
| Uploaded documents are untrusted      | See "Security" below.                                                                                                                                                       | `src/tests/notesCollection.test.ts`, `NotesUi.test.tsx`                                                                                                                                             |

## What is stored on the device

For every item the user **accepts**: title, kind, date (normalised years _and_ the original wording),
place (name, coordinates the user chose, note), the user's edits, a few short supporting passages (one
sentence each, with file name, document title and page or section), confidence, review status and the
import date. For every document: file name, title, page count, a SHA-256 of the file (to skip a
re-import) and warnings. Relationships and links to curated entries keep their supporting passage.

**Not stored:** the original file, the full extracted text, rejected items, or anything that was never
accepted. (Undecided items are stored only if the user ticks "keep the undecided items", and are then
labelled _needs review_.) This is the minimum needed to rebuild the atlas. Browser storage is **not
encrypted**; the interface says so.

Storage is IndexedDB (`sts-atlas-notes`, store `collections`). Small preferences use `localStorage`:
`atlas-collection-mode`, `atlas-active-collection`, `atlas-notes-appearance`. If IndexedDB is
unavailable (some private windows) an in-memory store is used and the dialog warns that nothing will
survive a reload. Quota errors are caught and explained; corrupted or newer-schema records are skipped
with a message instead of breaking the app.

## Network requests during an import

None are made by the import. The only requests are for the app's own static files:

1. Opening the "My Notes" dialog loads one lazy script chunk (`NotesModal-*.js`).
2. Opening the import panel loads the PDF reader chunk (`pdf-*.js`) and its worker (`pdf.worker.min-*.mjs`).
   This is done _before_ any file is chosen, so a PDF import then works even if the connection drops.
3. Unrelated to notes: the page's web fonts (Google Fonts) and the globe's `/earth/*.jpg` textures.

Nothing is loaded from a CDN for processing, and no request carries any note content.

## Supported files

- Text-based **PDF**, `.txt`, `.md` / `.markdown`. File type is checked by content (PDF header, binary
  sniffing), not only by name.
- **Not supported (yet):** Word `.docx` (a clear message tells the user to export to PDF or text),
  scanned/image-only PDFs (detected and explained; there is **no OCR** in this version).
- Limits (`DEFAULT_LIMITS` in `src/features/notes/types.ts`): 10 files per import, 40 MB per file
  (a warning above 15 MB), 400 pages (more are skipped, with a warning).

## How a PDF is read

PDF.js (bundled, Apache-2.0) parses the file in its own web worker, one page at a time, so the page
stays responsive; the page counter is a real `<progress>` and **Cancel** aborts and destroys the
loading task. Text fragments are grouped into lines by position; lines noticeably larger than the
document's median size become headings; vertical gaps become paragraph breaks; hyphenated line ends
are rejoined. Page numbers are kept for every passage. Title and author come from the PDF metadata
when sensible. Password-protected and damaged files get their own messages. A file averaging fewer than
~25 characters per page is reported as scanned. Multi-column layouts can interleave columns.

## How things are matched

`src/features/notes/analysis/`:

- **`matcher.ts`** builds a phrase index from the curated atlas: titles (and their parts), people's
  names and surnames, hand-written aliases (e.g. "Alhazen", "paradigm shift"), and the people credited
  on other entries. A single curated entry is linked only when the match is _exact and unambiguous_
  (confidence **high**); surname-only or alias matches are **medium/low**; if several entries fit, the
  user chooses ("possible match"). Matches link to the existing entry; nothing is duplicated.
- **`lexicon.ts`** holds about 130 concepts, theories, technologies, instruments and events, plus
  discipline and topic keywords.
- **`analyse.ts`** also finds quoted/italic titles, institutions (University of…, …Society), events
  (…War, …Conference) and **new people** (capitalised names, accepted only with a cue such as "Dr",
  "physicist", "argued", life dates, or at least two mentions).
- **Dates** (`dates.ts`): years, ranges (`1945–91`), decades, `c.`/circa, BCE/CE, centuries
  (`fifth century BCE` → −500…−401, with early/mid/late) and named periods. The original wording is
  kept, the precision recorded, and ranges are honest: a century is never shown as a single year. An
  item with no date is **undated**: it has no timeline position (it gets its own "No date in your
  notes" group) and shows in every period of the slider.
- **Places** (`gazetteer.ts`): a bundled list of countries, regions, historical names ("Persia",
  shown as "historical name; present-day Iran") and the cities that recur in the history of science,
  plus every place named in the curated atlas. Shared names (Cambridge, Georgia, Alexandria,
  Córdoba) are kept as options; nearby words ("Massachusetts", "Harvard") can support one reading,
  otherwise the review screen asks. Weak names ("Georgia", "Chile") count only after a preposition.
  Coordinates are never invented: no place, no pin. Ideas default to "not tied to a place".
- **Relationships** (`relationships.ts`): proposed only when two recognised items are in **one
  sentence** with a cue phrase between them (influenced, criticised, challenged, replaced, supported,
  funded, regulated, translated, taught, corresponded with, collaborated with, worked at, published,
  developed). Passive voice swaps the direction. Each keeps its sentence and page, is marked
  _proposed_ until confirmed, and shows as a dashed line.

These rules recognise vocabulary; they do not understand arguments.

## The review step

Nothing reaches the map until it is accepted. Sections: all, confirmed matches, possible matches, new
personal entries, ambiguous places, missing dates, missing locations, proposed relationships, ignored,
warnings. Each item shows its supporting passage and can be accepted, rejected, edited (title,
category, date, location, merge with a curated entry, short description) or restored. Only exact,
unambiguous curated matches can be accepted in bulk; bulk-accepted items are labelled _imported_,
individually accepted or edited ones _confirmed by you_.

## Provenance in the interface

Words, not colour alone: **Curated atlas**, **Your notes · confirmed by you**, **Your notes · imported**,
**Your notes · needs review**. On the map, personal markers sit in a diamond outline (dotted if
unreviewed). Unverified personal entries never show "established" confidence. The entry panel lists the
user's own passages and says no AI was used.

## Collections and adaptation

The sidebar selector chooses **Curated Atlas**, **My Notes** (personal entries plus the curated entries
the notes mention, clearly marked) or **Combined**; the choice is remembered. Debates and the curated
Paths remain curated; one extra path, "Your notes, in date order", is generated when three or more
entries are dated and located.

After an import, or when switching to My Notes, `adapt.ts` counts the entries and (when the user's
appearance setting is **Adaptive**) may: select the period holding ≥60% of dated entries (otherwise All
Time) which applies that period's existing theme; frame the map around the located entries without
zooming past ×4; open the concept network when ≥70% of entries have no place; suggest the leading
subject areas in the filters (★); and show per-period counts on the slider, dimming empty periods.
The user can switch to **Manual** or the **Consistent accessible theme** at any time (My Notes →
Appearance).

## Export, restore, delete

- **Export project** (JSON, `format: "sts-atlas-project"`, `schemaVersion: 1`): metadata, accepted
  items, links, relationships, provenance. **Restore** validates strictly (see below) and always adds a
  _new_ collection. Also: Markdown reading list, source list, entry summary (TSV), unresolved-items
  report. Original files are never included.
- **Delete** one document (entries only it supports go; entries other documents support keep their
  other passages), one collection, or everything (also deletes the IndexedDB database). Each shows
  what will be removed first. "Reset appearance and collection choices" restores the defaults.

## Security notes

- Everything extracted is rendered as React text; there is no `innerHTML`, `dangerouslySetInnerHTML`,
  `eval` or `new Function` in the feature. Markdown and HTML are flattened to text, never rendered.
- File names are sanitised; object URLs created for downloads are revoked immediately.
- Project files and stored records pass `sanitiseCollection`: only known fields are copied into new
  objects, strings and arrays are bounded, ids are restricted to a safe alphabet, enums fall back to
  safe values, `__proto__`/`constructor`/`prototype` keys are dropped, files over 25 MB or from a newer
  schema are refused.
- All regular expressions are linear (no nested quantifiers); input per page is capped; sentences and
  tokens are bounded. Imported text is data and is never treated as instructions.

## Known limitations

Accuracy: rule-based matching misses unfamiliar names and ideas, cannot tell a person from a
capitalised phrase without a cue, and may attach a nearby date or place to the wrong item. The
gazetteer is small. Dates found "near" an item are context, not that item's own date. Multi-column
PDFs, tables and non-Latin scripts are unreliable. No OCR, no `.docx`, no merging two _personal_ items,
no editing of an entry after it was added (remove and re-import instead).

## Testing

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm run preview -- --port 4173          # in one terminal
npm i -D playwright-core && npx playwright-core install chromium
npm run verify:import                   # in another: offline import check
```

Manual: open the app, **My Notes → Import notes…**, choose a text PDF or `.md` file, open DevTools →
Network, and confirm no request is made after the panel opens. Then switch DevTools to **Offline** and
import again.
