// Captures the README screenshots into docs/assets/ (new files only; never overwrites
// anything that is not one of its own `screenshot-*.png` outputs).
// Usage: npm run dev   (in another terminal), then: node scripts/capture-screenshots.mjs [baseUrl]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const base = process.argv[2] ?? 'http://localhost:5173'
const out = fileURLToPath(new URL('../docs/assets/', import.meta.url))
mkdirSync(out, { recursive: true })

// Pre-mark the walkthrough as seen so the tour overlay does not cover the shots.
const seen = () =>
  localStorage.setItem('sts-walkthrough:v1', JSON.stringify({ status: 'completed', at: '2026-01-01' }))

const shots = [
  { name: 'screenshot-atlas', url: '/?era=early-modern', wait: 2000, skipIntro: true },
  { name: 'screenshot-entry', url: '/?entry=copernicus', wait: 1500 },
  { name: 'screenshot-globe', url: '/?era=platform-age', wait: 4000, skipIntro: true },
  { name: 'screenshot-timeline', url: '/?view=timeline', wait: 1000 },
  { name: 'screenshot-debates', url: '/?view=debates&debate=induction-problem', wait: 1000 },
  { name: 'screenshot-paths', url: '/?view=journeys&journey=aristotle-to-newton&stop=1', wait: 2500 },
  { name: 'screenshot-phone', url: '/?era=early-modern', wait: 2000, skipIntro: true, phone: true },
]

const browser = await chromium.launch({ channel: 'chrome' })
for (const s of shots) {
  const ctx = await browser.newContext(
    s.phone
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 },
  )
  await ctx.addInitScript(seen)
  const page = await ctx.newPage()
  await page.goto(base + s.url, { waitUntil: 'networkidle' })
  if (s.skipIntro) await page.getByRole('button', { name: /skip introduction/i }).click()
  await page.waitForTimeout(s.wait)
  await page.screenshot({ path: `${out}${s.name}.png` })
  await ctx.close()
  console.log('wrote', s.name)
}

await browser.close()
