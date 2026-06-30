// tests/fixtures.js
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    // Precondition
    await loginPage.goto();
    await expect(loginPage.title).toBeVisible();

    await use(loginPage);
  },
});

export const expect = base.expect;