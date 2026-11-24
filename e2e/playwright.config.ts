import { defineConfig, devices } from '@playwright/test';

// The tests drive a browser against servers that are already running: the Vite dev server (or a built copy) and the
// Django API with a Celery worker and Redis. See README.md for how to start them.
export default defineConfig({
  testDir: './tests',
  // .e2e.ts, not .spec.ts, so the app's unit test runner (Vitest) never picks these up.
  testMatch: '**/*.e2e.ts',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'report' }]],
  outputDir: 'results',
  use: {
    baseURL: (process.env.APP_URL || 'http://localhost:4000').replace(/\/$/, ''),
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
});
