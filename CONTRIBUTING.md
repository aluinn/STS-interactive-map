# Contributing

Thanks for considering a contribution to STS Interactive Map. This is a portfolio project
first and foremost, but it's built to be genuinely extensible — the content model is the
main thing worth protecting.

## Before you start

1. Read [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) — it covers tone, sourcing, and the
   historiographical pitfalls this project explicitly tries to avoid. This matters more
   than code style.
2. Read [`DATA_MODEL.md`](./DATA_MODEL.md) if you're adding or editing content, or
   `src/types/index.ts` directly for the exact field definitions.
3. Run `npm install` and `npm run dev` to get a local copy running.

## Setup

You need Node.js `^20.19.0` or `>=22.12.0` (the range Vite requires).

```bash
git clone https://github.com/aluinn/STS-interactive-map.git
cd STS-interactive-map
npm install
npm run dev        # http://localhost:5173
```

| Command                            | What it does                                          |
| ---------------------------------- | ----------------------------------------------------- |
| `npm run dev`                      | Vite dev server                                       |
| `npm run lint`                     | ESLint                                                |
| `npm run typecheck`                | `tsc -b` (app, config and e2e files)                  |
| `npm test`                         | Vitest unit and component tests                       |
| `npm run build`                    | Typecheck, then production build to `dist/`           |
| `npm run test:e2e`                 | Playwright smoke test against the production build    |
| `npm run format`                   | Prettier                                              |
| `npm run screenshots`              | Regenerate `docs/assets/screenshot-*.png` (dev server must be running) |
| `npm run perf`                     | Print the timings quoted in `docs/PERFORMANCE.md`     |

The first end-to-end run needs a browser: `npx playwright install chromium`, or set
`PW_CHANNEL=chrome` to use an installed Google Chrome.

## Branches, commits and pull requests

- Branch from `main`: `feat/short-name`, `fix/short-name`, `docs/short-name`,
  `content/short-name`.
- Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`,
  `docs:`, `test:`, `refactor:`, `perf:`, `chore:`, `ci:`; use `content:` for
  changes that only touch `src/data/**`.
- Keep pull requests small and focused, fill in the template, and make sure CI is green
  (lint, typecheck, unit tests, build and the end-to-end test).
- Content changes are reviewed for sourcing and framing as carefully as code.
- Good places to start: [`docs/issues/`](docs/issues/) holds scoped drafts, several
  labelled "good first issue".

## Workflow

1. Make your change (content, component, or both).
2. Run the full check suite before opening a PR:
   ```bash
   npm run typecheck
   npm run lint
   npm run test
   npm run build
   ```
3. If you changed or added content (`src/data/**`), pay attention to
   `src/tests/data.test.ts` — it validates referential integrity (ids, slugs,
   relationship endpoints, sourcing) and will fail loudly on common mistakes.
4. If you changed visual/interactive behaviour, run the app locally (`npm run dev`) and
   check it at both a desktop and a mobile viewport width, in both the dark and light
   themes, with the keyboard alone (Tab/Enter/Escape) as well as a mouse.

## Content contributions

See the "How to add an entry / relationship / guided journey" sections below for the
mechanical steps. The short version:

- New entries go in the relevant period file under `src/data/`.
- New relationships go in `src/data/relationships.ts` — only add one for a documented
  connection, never because two entries share a topic or period.
- New debates go in `src/data/debates.ts`; new journeys in `src/data/journeys.ts`.
- Never invent a quotation or citation. Mark unsourced claims `contentStatus:
  'sourceNeeded'` instead.

## How to add an entry

1. Open the relevant period file in `src/data/` (e.g. `entries.renaissance.ts`), or
   create a new one and add it to the `entries` array in `src/data/index.ts`.
2. Add an object matching the `Entry` type. At minimum: `id`/`slug` (unique, kebab-case,
   usually identical), `title`, `kind`, `period`, `summary`, `longDescription`,
   `startYear`/`dateDisplay`, `people`/`cultures`/`disciplines`/`themes`,
   `historicalSignificance`, `sources` (or `contentStatus: 'sourceNeeded'` if you
   haven't verified one yet), and `confidence`.
3. If the entry has a single clear location, set `latitude`/`longitude`. If it spans
   multiple places or none, set `transregional: true` and list what you can in `places`.
4. Add at least one `philosophicalQuestions` entry if a genuine methodological question
   applies; don't force it.
5. Run `npm test`: `src/tests/data.test.ts` catches duplicate ids/slugs, missing
   sources, bad years and dangling references.

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

Only add a relationship for a **documented** connection, never because two entries
share a period or theme (shared topics are already expressed through each entry's
`themes`/`relatedEntryIds`, which do not imply causal influence).

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

Every `entryId` must exist in `src/data/entries.*.ts`; `data.test.ts` fails otherwise.

## Academic and citation policy

- **Never invent a citation, a quotation, or a causal/influence relationship.** If you
  can't verify a source, set `contentStatus: 'sourceNeeded'` and omit `sources`.
- Distinguish `primary` and `secondary` sources on the `Source.type` field.
- Use `confidence` (`established` / `likely` / `contested` / `speculative`) honestly,
  especially for historiographically disputed claims.
- `theoryStatus` should resist treating "superseded" as a synonym for "wrong": use
  `theoryStatusNote` to say what survived.
- See [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) for the full policy and the pitfalls it is
  meant to catch (hero-only histories, Eurocentrism, presentism, and so on).

## Code contributions

- Keep rendering code decoupled from content: components should consume the typed
  `Entry`/`Relationship`/`Debate`/`Journey` shapes from `src/types`, not assume anything
  about where the data came from.
- Prefer plain CSS Modules and small, focused components over adding a UI framework
  dependency.
- Keep accessibility in mind for anything interactive: focus management, keyboard
  operation, and `aria-label`s are not an afterthought here — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#accessibility)
  for the standard already in place.
- Match the existing visual language (see `src/styles/tokens.css` for the design
  tokens) rather than introducing new colours or fonts ad hoc.

## Reporting issues

If you spot a factual error, an unsupported claim, a fabricated-looking citation, or an
accessibility problem, please open an issue describing it specifically — these are
exactly the categories of bug this project cares most about getting right.

## Conduct and security

Participation is covered by the [Code of Conduct](./CODE_OF_CONDUCT.md). Report
vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).
