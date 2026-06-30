// tests/login.spec.js

import { test, expect } from './fixturesLogin';

test.describe('Login form tests', () => {

test('1. The User is able to Log in', async ({ loginPage }) => {
  await loginPage.login('user1@test.com', 'user123');
  await expect(loginPage.katalogTovarovTitle).toBeVisible();
});

test('2. The link "Войти" is clickable', async ({ loginPage }) => {
  await loginPage.registrationLink.click();
  await loginPage.loginLink.click();
  await expect(loginPage.title).toBeVisible();
});

test('3. The User trying to log in without entering email and password', async ({ loginPage }) => {
  await loginPage.loginButton.click();
  await expect(loginPage.emailRequiredError).toBeVisible();
  await expect(loginPage.passwordRequiredError).toBeVisible();
});

test('4. The User is trying to log in with invalid formatted email (true password)', async ({ loginPage }) => {
  await loginPage.login('user1test.com', 'user123');
  await expect(loginPage.invalidCredentialsToast).toBeVisible();
});

test('5. The User is trying to log in with invalid password (true login)', async ({ loginPage }) => {
  await loginPage.login('user1@test.com', 'qwe123');
  await expect(loginPage.invalidCredentialsToast).toBeVisible();
});

test("6. The User is trying to log in with an email that wasn't registered in the system", async ({ loginPage }) => {
  await loginPage.login('qwert@test.com', 'qwert123');
  await expect(loginPage.invalidCredentialsToast).toBeVisible();
});

test('7. The User is trying to enter spaces in fields', async ({ loginPage }) => {
  await loginPage.login('   user1@test.com', '   user123   ');
  await expect(loginPage.invalidCredentialsToast).toBeVisible();
});

});