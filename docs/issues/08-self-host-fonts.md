---
title: Self-host the fonts and tighten the CSP
labels: [enhancement]
---

## Context

`index.html` loads Cormorant Garamond and EB Garamond from Google Fonts, and the
production Content-Security-Policy in `vite.config.ts` allows `fonts.googleapis.com` and
`fonts.gstatic.com` for that reason. It is the app's only third-party request, which
sits awkwardly next to the local-first promise of "Your Notes" and means each visit
contacts Google.

## Task

Serve the two font families from the app's own origin (subset to Latin if you can), update
the `@font-face` rules or CSS, remove the Google `<link>` tags, and remove the two Google
hosts from the CSP so `style-src`/`font-src` are `'self'` only (keep `data:`/`blob:` only
if still needed). Check the licences (both are SIL Open Font Licence) and add the notice
to the About credits.

## Acceptance

- With the network blocked to Google, the site renders identically.
- The built `index.html` CSP contains no external host.
- Font files are cached with the other hashed assets; total added size is reported in the PR.
- `docs/DATA_SOURCES.md` and `SECURITY.md` no longer mention the Google Fonts request.

## Pointers

- `index.html`, `vite.config.ts` (`contentSecurityPolicy`)
- `src/styles/global.css`, `src/styles/tokens.css`
- `src/components/AboutContent.tsx` (credits)
