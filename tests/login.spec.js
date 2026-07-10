// tests/login.spec.js

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginUser } from './helpers/loginHelper';
import { validUser, invalidUsers } from './testData/loginData';

// import { validUser, invalidUsers } from './data/loginData';

test.describe('Login form tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

 test('1. The User is able to Log in', async ({ page }) => {
    const loginPage = await loginUser(page, validUser.email, validUser.password);
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

  test('4. Invalid formatted email', async ({ page }) => {
    const loginPage = await loginUser(page, invalidUsers.invalidEmailFormat.email, invalidUsers.invalidEmailFormat.password);
    await expect(loginPage.invalidCredentialsToast).toBeVisible();
  });

  test('5. Invalid password', async ({ page }) => {
    const loginPage = await loginUser(page, invalidUsers.wrongPassword.email, invalidUsers.wrongPassword.password);
    await expect(loginPage.invalidCredentialsToast).toBeVisible();
  });

  test('6. Unregistered email', async ({ page }) => {
    const loginPage = await loginUser(page, invalidUsers.unregisteredUser.email, invalidUsers.unregisteredUser.password);
    await expect(loginPage.invalidCredentialsToast).toBeVisible();
  });

  test('7. Spaces in fields', async ({ page }) => {
    const loginPage = await loginUser(page, invalidUsers.withSpaces.email, invalidUsers.withSpaces.password);
    await expect(loginPage.invalidCredentialsToast).toBeVisible();
  });
  
});
