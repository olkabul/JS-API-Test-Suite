import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    browserName: 'chromium',
    headless: false, 
    viewport: { width: 1600, height: 1000 }
  }
});
