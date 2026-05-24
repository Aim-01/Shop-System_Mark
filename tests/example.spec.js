// @ts-check

import { test, expect } from '@playwright/test';

test('login page opens', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('class="font-semibold leading-none tracking-tight"'));


});
