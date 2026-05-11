import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/results.xml' }]
  ],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] }
    }
  ]
});