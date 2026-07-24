// @ts-check

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    // UI tests
    {
      name: 'chromium_Docker_project',
      testDir: './tests/UI',
      use: { baseURL: 'http://localhost:5173' },
    },

    // API tests
    {
      name: 'api',
      testDir: './tests/API',
      use: { baseURL: 'http://localhost:3000' },
    }
  ]
});