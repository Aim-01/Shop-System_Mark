// tests/login.spec.js

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginUser } from './helpers/loginHelper';

test.describe('Login form tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('1. The User is able to Log in', async ({ page }) => {
    const loginPage = await loginUser(page, 'user1@test.com', 'user123');
    await expect(loginPage.katalogTovarovTitle).toBeVisible();
  });

  test('2. The link "Войти" is clickable', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.registrationLink.click();
    await loginPage.loginLink.click();
    await expect(loginPage.title).toBeVisible();
  });

  test('3. The User trying to log in without entering email and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginButton.click();
    await expect(loginPage.emailRequiredError).toBeVisible();
    await expect(loginPage.passwordRequiredError).toBeVisible();
  });

  test('4. The User is trying to log in with invalid formatted email', async ({ page }) => {
    const loginPage = await loginUser(page, 'user1test.com', 'user123');
    await expect(loginPage.invalidCredentialsToast).toBeVisible();
  });

  test('5. The User is trying to log in with invalid password', async ({ page }) => {
    const loginPage = await loginUser(page, 'user1@test.com', 'qwe123');
    await expect(loginPage.invalidCredentialsToast).toBeVisible();
  });

  test("6. The User is trying to log in with an unregistered email", async ({ page }) => {
    const loginPage = await loginUser(page, 'qwert@test.com', 'qwert123');
    await expect(loginPage.invalidCredentialsToast).toBeVisible();
  });

  test('7. The User is trying to enter spaces in fields', async ({ page }) => {
    const loginPage = await loginUser(page, '   user1@test.com', '   user123   ');
    await expect(loginPage.invalidCredentialsToast).toBeVisible();
  });

});
