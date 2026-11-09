import { defineConfig, devices } from '@playwright/test'

// Runs the end-to-end smoke test against the production build served by `vite preview`,
// so it exercises the same bundle (and Content-Security-Policy) that gets deployed.
// Locally, set PW_CHANNEL=chrome to reuse an installed Google Chrome instead of
// downloading Playwright's Chromium.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4399',
    trace: 'retain-on-failure',
    channel: process.env.PW_CHANNEL || undefined,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4399 --strictPort',
    url: 'http://localhost:4399',
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
