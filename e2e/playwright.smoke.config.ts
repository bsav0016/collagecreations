import { defineConfig, devices } from '@playwright/test';

// The post-deploy smoke check: a read-only look at the LIVE site. See smoke/production.smoke.ts. No servers are started;
// it needs the internet and nothing else.
export default defineConfig({
  testDir: './smoke',
  testMatch: '**/*.smoke.ts',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  // One more try: a site that has only just been deployed can be served stale for a moment.
  retries: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'report' }]],
  outputDir: 'results',
  use: {
    baseURL: (process.env.SMOKE_URL || 'https://collagecreations.org').replace(/\/$/, ''),
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
});
