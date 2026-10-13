#!/usr/bin/env node
/**
 * Browser check for "Your Notes": importing must work with the network switched
 * off and must make no request to anything but the app's own origin.
 *
 * It opens the app, switches the browser fully offline, imports a generated
 * text PDF and a Markdown file, reviews and accepts the results, builds the
 * personal atlas, then reloads (back online) to confirm it was saved locally.
 * It fails if any request leaves the page's own origin, if any request at all
 * happens while offline, or if no API key / AI provider host is ever contacted.
 *
 * Usage (in one terminal):  npm run build && npm run preview -- --port 4173
 *           (in another):   npm run verify:import            # or pass a URL
 *
 * Needs Playwright's browser driver, which is not a dependency of the app:
 *   npm i -D playwright-core && npx playwright-core install chromium
 */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

let chromium
try {
  ;({ chromium } = await import('playwright-core'))
} catch {
  console.error(
    'playwright-core is not installed. Run: npm i -D playwright-core && npx playwright-core install chromium',
  )
  process.exit(2)
}

const url = process.argv[2] ?? 'http://localhost:4173/'
const origin = new URL(url).origin
const dir = mkdtempSync(join(tmpdir(), 'sts-import-'))
const failures = []
const check = (ok, what) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`)
  if (!ok) failures.push(what)
}

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1300, height: 900 } })
const page = await context.newPage()
const requests = []
page.on('request', (r) => requests.push({ url: r.url(), at: Date.now() }))

// A small text-based PDF and a Markdown file, made on the spot.
await page.setContent(`<html><body style="font-family:serif"><h1>Week 3</h1>
<p>Nicolaus Copernicus (1473–1543) proposed a heliocentric model. Isaac Newton worked at Cambridge, England, and published the Principia in 1687. Kepler corresponded with Galileo. Maria Voss, a historian, worked at the University of Leeds in 1850.</p></body></html>`)
const pdf = join(dir, 'notes.pdf')
await page.pdf({ path: pdf, format: 'A4' })
const md = join(dir, 'notes.md')
writeFileSync(
  md,
  '# Notes\n\nGalileo Galilei used the telescope in Padua in 1609.\n\n- Descartes influenced Isaac Newton.\n',
)

await page.goto(url)
await page
  .getByText('Skip introduction')
  .click()
  .catch(() => undefined)
await page.getByRole('button', { name: 'Add your notes…' }).click()
await page.waitForTimeout(1500) // let the PDF reader load while still online

const cut = requests.length
await context.setOffline(true)
await page.locator('input[type=file]').setInputFiles([pdf, md])
await page.waitForFunction(
  () => {
    const b = [...document.querySelectorAll('button')].find((x) =>
      x.textContent?.includes('Review extracted material'),
    )
    return b && !b.disabled
  },
  null,
  { timeout: 30000 },
)
await page.getByRole('button', { name: 'Review extracted material' }).click()
await page.getByText('Review what was found').waitFor()
await page.getByRole('button', { name: /^Confirmed matches/ }).click()
await page.getByRole('button', { name: /Accept all \d+ exact matches/ }).click()
await page.getByRole('button', { name: 'Add to my atlas' }).click()
await page.waitForTimeout(1500)
const offlineRequests = requests.slice(cut)
await context.setOffline(false)

check(
  offlineRequests.length === 0,
  `no requests at all while importing offline (saw ${offlineRequests.length})`,
)
const foreign = requests.filter(
  (r) => !r.url.startsWith(origin) && !r.url.startsWith('data:') && !r.url.startsWith('blob:'),
)
const nonFont = foreign.filter((r) => !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(r.url))
check(
  nonFont.length === 0,
  `no request to any other origin (the page's web fonts aside); saw: ${nonFont.map((r) => r.url).join(', ') || 'none'}`,
)
check(
  !requests.some((r) => /anthropic|openai|api\.claude|generativelanguage/i.test(r.url)),
  'no AI provider host contacted',
)

await page.reload()
await page.waitForTimeout(2000)
const mode = await page.locator('[role=radio][aria-checked=true]').textContent()
check(
  mode?.includes('Your Notes') === true,
  'the personal atlas survived a reload (saved on this device)',
)

const blocked = await page.evaluate(() =>
  fetch('https://example.com/', { mode: 'no-cors' }).then(
    () => false,
    () => true,
  ),
)
check(
  blocked,
  'the browser refuses a fetch to another origin (Content-Security-Policy connect-src); only applies to a production build',
)

await browser.close()
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`)
  process.exit(1)
}
console.log('\nAll checks passed.')
