import { expect, test } from '@playwright/test'

// Mark the first-visit walkthrough as already seen so its overlay never covers the page.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'sts-walkthrough:v1',
      JSON.stringify({ status: 'completed', at: '2026-01-01' }),
    ),
  )
})

test('loads the atlas without console errors and renders the map', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto('/?era=early-modern')
  await page.getByRole('button', { name: /skip introduction/i }).click()

  await expect(page.getByRole('heading', { name: 'STS Interactive Map' })).toBeVisible()
  await expect(page.getByRole('application', { name: /interactive map/i })).toBeVisible()
  expect(errors).toEqual([])
})

test('switching views updates the URL and content', async ({ page }) => {
  await page.goto('/?era=early-modern')
  await page.getByRole('button', { name: /skip introduction/i }).click()

  await page.getByRole('button', { name: 'Debates' }).click()
  await expect(page).toHaveURL(/view=debates/)

  await page.getByRole('button', { name: 'Timeline' }).click()
  await expect(page).toHaveURL(/view=timeline/)
})

test('a deep link opens an entry in an accessible dialog and Escape closes it', async ({
  page,
}) => {
  await page.goto('/?entry=copernicus')

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'Nicolaus Copernicus' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page).not.toHaveURL(/entry=/)
})
