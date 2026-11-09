---
title: Add Open Graph and social-preview meta tags
labels: [good first issue]
---

## Context

`index.html` has a `<title>` and a `description` meta tag but no Open Graph or Twitter
card tags, so links shared in chat apps and social feeds show a bare URL. The repo
already has a good preview image: `docs/assets/screenshot-atlas.png`.

## Task

Add `og:title`, `og:description`, `og:type`, `og:url`, `og:image` and
`twitter:card=summary_large_image` to `index.html`. Copy a screenshot (do not move the
original) to `public/` under a new name so it is served from the site root, and
reference it with an absolute URL (`https://sts-interactive-map.vercel.app/...`).

## Acceptance

- Pasting the live URL into an Open Graph debugger shows title, description and image.
- `npm run build` output still passes the e2e smoke test (`npm run test:e2e`), i.e. the
  CSP does not break anything (images are `img-src 'self'`).
- Image is under 1 MB.

## Pointers

- `index.html`
- `vite.config.ts` (the CSP plugin rewrites `<head>`; keep it working)
- `docs/assets/screenshot-atlas.png`
