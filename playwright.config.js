// @ts-check

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Все тесты идут последовательно
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium_Docker_project',
      use: { baseURL: 'http://localhost:5173' },
    }
  ]
});
