# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project aims to follow
[Semantic Versioning](https://semver.org/) once it tags a first release.

## [Unreleased]

### Added

- Playwright end-to-end smoke test, run in CI against the production build.
- GitHub Actions workflows for CI (lint, typecheck, unit tests, build, e2e) and CodeQL,
  plus grouped weekly Dependabot updates.
- Real screenshots in `docs/assets/` and `npm run screenshots` to regenerate them.
- `npm run perf`, a reproducible benchmark (see `docs/PERFORMANCE.md`).
- Community files: LICENSE (MIT), Code of Conduct, Security policy, Roadmap, issue and
  pull-request templates, `CITATION.cff`, `.editorconfig`.
- Architecture and data-source documentation, and issue drafts in `docs/issues/`.

### Changed

- README rewritten to match what the app does today.

## Earlier history (before the first changelog)

Reconstructed from the git log, newest first.

- **2026-11-04** — First-time interactive walkthrough with a Guide button and quick
  reference; the cinematic intro always plays on the landing route and the guide starts
  straight after it.
- **2026-10-13** — "Your Notes": a local-first personal atlas built from imported PDF,
  text and Markdown notes, kept separate from the curated "General Notes" atlas.
  Light-mode period themes and a light globe; connection-weighted route lines.
- **2026-10-12** — Period "time travel", a satellite-style globe for the latest period,
  period-aware interface themes, and new science-communication and digital-power content.
- **2026-10-11** — Cinematic intro with a detailed globe, 50m map with borders, parchment
  light mode, a cluster sidebar grouped by country, and a stabilisation pass (history
  navigation, modal focus, storage safety, lazy globe, search fixes, content audit).
- **2026-10-05** — Major content expansion (sociology, policy, global STS cases, ethics,
  expertise); atlas declutter and palette work; project renamed to STS Interactive Map.
- **2026-10-05** — Initial commit ("Atlas of Ideas").

[Unreleased]: https://github.com/aluinn/STS-interactive-map/commits/main
