# Roadmap

Direction, not a promise: this is a portfolio project built alongside a History and
Philosophy of Science course at UCL, so priorities follow what makes the atlas more
useful and more honest. Concrete, scoped tasks live in [`docs/issues/`](docs/issues/).

## Now

- **Keep the content trustworthy.** Every claim sourced or marked `sourceNeeded`;
  `CONTENT_AUDIT.md` kept in step with the data (see
  [`docs/issues/04-generate-content-audit-counts.md`](docs/issues/04-generate-content-audit-counts.md)).
- **Quality gates.** Unit tests, an end-to-end smoke test and CI are in place; widen
  end-to-end coverage to Paths and Your Notes.

## Next

- **Show the knowledge routes.** The dataset already holds 7 validated
  `KnowledgeRoute`s (waypoints plus "what changed along the way") that no view renders.
- **Smaller first load.** The main JavaScript chunk is about 1 MB (about 310 kB gzipped);
  split the dataset and heavy views so the first paint ships less.
- **Self-host the fonts**, so the only third-party request is no longer needed.
- **Accessibility checks in CI**, alongside the keyboard-and-screen-reader work already
  done.

## Later

- Label-collision layout for the Atlas, replacing the hover/zoom-threshold approach.
- A force-directed "constellation" layout for Debates (currently cards).
- Localised place names and period labels.
- A contribution form for new entries instead of hand-editing TypeScript, or a CMS/
  database behind the existing `DataBundle` shape.

## Not planned

- Accounts, a backend, or any AI service. "Your Notes" is deliberately local and
  deterministic (see [`docs/MY_NOTES.md`](docs/MY_NOTES.md)).
