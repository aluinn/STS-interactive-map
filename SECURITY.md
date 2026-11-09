# Security policy

## Reporting a vulnerability

Please **do not open a public issue** for a security problem. Use GitHub's private
reporting instead:

1. Go to the repository's **Security** tab.
2. Choose **Report a vulnerability**.
3. Describe what you found and how to reproduce it.

This is a small, single-maintainer project. Expect an acknowledgement within a few days;
there is no bug bounty.

## Scope and design notes

STS Interactive Map is a **static front-end app**: there is no server, database,
account system or API key. That shapes what is, and is not, in scope.

**In scope**

- Anything that makes the app send a user's imported notes (PDF, `.txt`, `.md`) off the
  device. The "Your Notes" feature is designed to be local-only; see
  [`docs/MY_NOTES.md`](docs/MY_NOTES.md).
- Cross-site scripting through imported documents, entry content or URL parameters.
- Weaknesses in the production Content-Security-Policy set in `vite.config.ts`
  (it includes `connect-src 'self'` so the page cannot talk to other origins).
- Vulnerable dependencies that are actually reachable from the shipped bundle.

**Design notes you should know before reporting**

- Imported files are treated as untrusted. PDFs are parsed with PDF.js in a web worker;
  extracted text is rendered as text, never as HTML.
- Personal collections are stored unencrypted in the browser's IndexedDB, and the
  interface says so. That is a documented limitation, not a vulnerability.
- Search, filters and selection live in the URL query string, so they are visible to
  anyone you share the link with.
- The page loads two Google Fonts stylesheets, so those requests reveal a visit to
  Google's font servers (allowed by the CSP `style-src` and `font-src` directives).

**Out of scope**: findings that need a compromised browser or device, and issues in
third-party hosting (for example Vercel) rather than this code.

## Supported versions

Only the latest commit on `main` (the version deployed at the live site) is supported.
