import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    browserName: 'chromium',
    headless: false, 
    viewport: { width: 1600, height: 1000 },
    trace: "on-first-retry",
  }
});
