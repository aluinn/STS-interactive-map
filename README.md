# STS Interactive Map

**A History and Philosophy of Science**

> "Knowledge has never travelled in a straight line."



https://github.com/user-attachments/assets/20be2ade-4bb6-4c8a-a16b-585e517022f4

Test it here: https://sts-interactive-map.vercel.app/?areas=climate 

An interactive atlas exploring how scientific ideas moved between cultures, cities,
institutions, and historical periods — and how philosophy of science helps us read that
movement critically. Built as a portfolio project alongside a History and Philosophy of
Science course at UCL; designed to grow into a larger digital-humanities resource.

## Concept

STS Interactive Map is not a timeline of "great discoveries." It is an attempt to map the
actual, messier shape of how scientific knowledge has moved: through translation,
argument, observation, trade, empire, craft, experiment, exclusion, and collaboration —
and to keep philosophy of science in the same frame as the history, rather than treating
them as separate subjects.

Four connected views give four ways into the same dataset:

- **Atlas** — an old-world-style interactive map. Entries (people, ideas, discoveries,
  experiments, instruments, texts, institutions, events, debates) are plotted
  geographically where that makes sense, and connected by curved "ink routes"
  representing a documented relationship (influenced, translated, criticised, excluded,
  funded, and so on).
- **Timeline** — the same entries grouped into flexible historical periods, explicitly
  resisting a single linear "march of progress."
- **Debates** — major philosophy-of-science disputes (induction, falsifiability,
  paradigms, realism, objectivity, feminist epistemology, and more) presented as
  explorable positions-and-arguments, each linked back to historical cases that test or
  complicate it.
- **Paths** — curated guided journeys that spotlight one stop at a time, panning the map
  and explaining why each stop connects to the next.

Every suitable historical entry carries a "philosophical lens" — a short prompt tying it
to a live methodological question — and most debates link back to the historical cases
that make them concrete.

## Screenshots

_Add screenshots here before publishing — e.g. the intro screen, the Atlas view with a
route tooltip open, the Timeline, a Debates constellation, and a Paths journey in
progress._

| View     | Screenshot             |
| -------- | ----------------------- |
| Intro    | `docs/screenshots/intro.png` (placeholder) |
| Atlas    | `docs/screenshots/atlas.png` (placeholder) |
| Timeline | `docs/screenshots/timeline.png` (placeholder) |
| Debates  | `docs/screenshots/debates.png` (placeholder) |
| Paths    | `docs/screenshots/paths.png` (placeholder) |

## Technical stack

- **React 19 + TypeScript + Vite**
- **D3** (`d3-geo`, `d3-selection`, `d3-zoom`, `d3-transition`) for the map projection,
  pan/zoom, and curved relationship routes
- **`world-atlas`** (land-110m TopoJSON, via `topojson-client`) for the basemap —
  deliberately just coastlines, with no country-border layer, since modern political
  borders would misrepresent almost every period this atlas covers
- Plain CSS Modules + a small set of CSS custom-property design tokens (no UI framework)
- **Vitest + React Testing Library** for tests
- **ESLint + Prettier** for linting/formatting
- No backend, no database, no API keys — all content lives in typed local data files
  designed so a CMS or database could replace them later without changing rendering code

## Local setup

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173 by default)
```

## Development commands

| Command              | What it does                                   |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Start the Vite dev server                        |
| `npm run build`      | Type-check and build for production (`dist/`)    |
| `npm run preview`    | Preview the production build locally             |
| `npm run typecheck`  | Type-check only (`tsc -b`)                       |
| `npm run lint`       | Run ESLint                                       |
| `npm run format`     | Format the repo with Prettier                    |
| `npm run test`       | Run the test suite once                          |
| `npm run test:watch` | Run tests in watch mode                          |

## Content model

See [`DATA_MODEL.md`](./DATA_MODEL.md) for the full typed content model. In short:

- An **Entry** (`src/types/index.ts`) is anything plottable: a person, idea, discovery,
  experiment, instrument, text, institution, event, or debate. Entries carry dates
  (numeric, BCE as negative years), places (plural — an entry can have an origin, an
  institution, a publication place, or none at all if it's genuinely `transregional`),
  philosophical lenses, myth-vs-complication notes, a theory-status lifecycle, and
  sources.
- A **Relationship** connects two entries with a typed, directional edge (`influenced`,
  `taught`, `translated`, `corresponded`, `travelled`, `collaborated`, `criticised`,
  `supported`, `challenged`, `replaced`, `preserved`, `funded`, `appropriated`,
  `excluded`, `extracted`, `institutionalised`, or `independently-developed`), each with
  a one-sentence justification.
- A **Debate** is a philosophical question with multiple named positions, each carrying
  arguments-for and objections, plus links back to historical cases.
- A **Journey** is an ordered list of entry stops with a caption explaining each
  transition, used by the Paths view.

All content lives in `src/data/`, split into period-based files for entries plus
`relationships.ts`, `debates.ts`, and `journeys.ts`, combined in `src/data/index.ts`.
`src/utils/validateData.ts` checks referential integrity (unique ids/slugs, valid
relationship endpoints, no dangling debate/journey references, sensible years and
coordinates, every non-`sourceNeeded` entry has a source) and is exercised by
`src/tests/data.test.ts`.

## How to add an entry

1. Open the relevant period file in `src/data/` (e.g. `entries.renaissance.ts`) — or
   create a new one and add it to the `entries` array in `src/data/index.ts` if it's a
   new period.
2. Add an object matching the `Entry` type. At minimum: `id`/`slug` (unique, kebab-case,
   usually identical), `title`, `kind`, `period`, `summary`, `longDescription`,
   `startYear`/`dateDisplay`, `people`/`cultures`/`disciplines`/`themes`,
   `historicalSignificance`, `sources` (or `contentStatus: 'sourceNeeded'` if you
   haven't verified one yet), and `confidence`.
3. If the entry has a single clear location, set `latitude`/`longitude`. If it spans
   multiple places or none, set `transregional: true` and list what you can in `places`.
4. Add at least one `philosophicalQuestions` entry if a genuine methodological question
   applies — don't force it if it doesn't fit.
5. Run `npm test` — `src/tests/data.test.ts` will catch duplicate ids/slugs, missing
   sources, bad years, and dangling references.

See [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) for tone, sourcing, and framing guidance
before writing new entries.

## How to add a relationship

Add an object to the `relationships` array in `src/data/relationships.ts`:

```ts
{
  id: 'r78',
  sourceId: 'some-entry-id',
  targetId: 'other-entry-id',
  type: 'influenced', // see RelationshipType in src/types
  summary: 'One sentence explaining *why* this connection matters.',
  confidence: 'established', // 'established' | 'likely' | 'contested' | 'speculative'
}
```

Only add a relationship for a **documented** connection — never because two entries
happen to share a period or theme. (Shared topics are already expressed through each
entry's `themes`/`relatedEntryIds`, which don't imply causal influence.)

## How to add a guided journey

Add an object to the `journeys` array in `src/data/journeys.ts`:

```ts
{
  id: 'my-journey',
  slug: 'my-journey',
  title: 'A Short, Evocative Title',
  summary: 'One or two sentences framing the journey.',
  themes: ['theme-slug'],
  stops: [
    { entryId: 'first-entry-id', caption: 'Why this is the starting point.' },
    { entryId: 'second-entry-id', caption: 'Why this follows from the last stop.' },
    // 4–7 stops tends to read best
  ],
}
```

Every `entryId` must exist in `src/data/entries.*.ts` — `data.test.ts` will fail
otherwise.

## Academic and citation policy

- **Never invent a citation, a quotation, or a causal/influence relationship.** If you
  can't verify a source, set `contentStatus: 'sourceNeeded'` and omit `sources` rather
  than guessing at a plausible-looking reference.
- Distinguish `primary` and `secondary` sources on the `Source.type` field.
- Use `confidence` (`established` / `likely` / `contested` / `speculative`) honestly,
  especially for historiographically disputed claims.
- `theoryStatus` (on ideas/discoveries) should resist treating "superseded" as a
  synonym for "wrong" or "stupid" — use `theoryStatusNote` to say what survived.
- See [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) for the full policy and the pitfalls it's
  meant to catch (hero-only histories, Eurocentrism, presentism, and so on).

## Accessibility notes

- The Atlas map exposes a **list-view toggle** (the ☰ control) giving every filtered
  entry as a keyboard- and screen-reader-navigable list, as an alternative to the SVG
  map.
- All markers, routes, and clusters are focusable (`tabIndex=0`, `role="button"`) with
  descriptive `aria-label`s, and respond to Enter/Space as well as click.
- The detail panel and all modals are proper dialogs (`role="dialog"`,
  `aria-modal="true"`), trap focus on open, close on <kbd>Escape</kbd>, and restore
  focus to the triggering element on close.
- Theming respects `prefers-reduced-motion` (disables the spinning compass on the intro
  screen and swaps animated zoom transitions for instant jumps) and ships a
  high-contrast light mode alongside the default dark ink-on-parchment theme.
- Filters, the current view, and the current selection all live in the URL (`?view=…`),
  so any state is shareable via "Copy link."

## Deployment

The app is a static build with no backend. From the project root:

```bash
npm run build   # outputs to dist/
```

`dist/` can be deployed to any static host (Netlify, Vercel, GitHub Pages, Cloudflare
Pages, etc.) — no environment variables or server configuration are required.

## Future ideas

- Expand the seed dataset — the content model already supports far more entries than are
  currently included; see `CONTENT_GUIDE.md` for what to prioritise.
- Swap the local data files for a CMS or lightweight database without touching rendering
  code (the whole app only depends on the `DataBundle` shape in `src/types`).
- Add a proper label-collision layout algorithm to the Atlas view instead of the current
  hover/zoom-threshold approach.
- Add non-geographic "debate constellation" visual layouts (the Debates view is
  currently card-based, not yet a force-directed graph).
- Localise place names/period labels for non-English audiences.
- Add a lightweight CMS-style admin form for contributing new entries without hand-editing TypeScript.

---

This atlas is an interpretive, educational project — not a neutral or exhaustive
account. See the in-app **About** page for more on its limits and editorial choices.
