// tests/login.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('1. The User is able to Log in', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Precondition
  await loginPage.goto();
  await expect(loginPage.title).toBeVisible();

  // Test data
  const email = 'user1@test.com';
  const password = 'user123';

  // Steps
  await loginPage.login(email, password);

  // Result: открывается страница Каталога товаров
  await expect(page.locator('h1')).toHaveText('Каталог товаров');
});



// test('2. The link "Войти" is clickable', async ({ page }) => {
//   const loginPage = new LoginPage(page);

//   // Precondition
//   await loginPage.goto();
//   await expect(loginPage.title).toBeVisible();

//   // Steps
//   await loginPage.registrationLink.click();
//   await loginPage.loginLink.click();

//   // Result: открывается форма Входа
//   await expect(page.getByText('Вход в систему'));
// });



// test('3. User trying to log in without entering email and password', async ({ page }) => {
//   const loginPage = new LoginPage(page);

//   // Precondition
//   await loginPage.goto();
//   await expect(loginPage.title).toBeVisible();

//   // Steps
//   await loginPage.loginButton.click();

//   // Result: появляется предупреждение для обязательных полей
//   await expect(loginPage.emailRequiredError).toBeVisible();
//   await expect(loginPage.passwordRequiredError).toBeVisible();
// });



// test('4. User trying to log in with invalid formatted email (true password)', async ({ page }) => {
//   const loginPage = new LoginPage(page);

//   // Precondition
//   await loginPage.goto();
//   await expect(loginPage.title).toBeVisible();

//   // Test data
//   const email = 'user1test.com';
//   const password = 'user123';

//   // Steps
//   await loginPage.login(email, password);

//   // Result: нижний правый угол - тоаст-уведомление об ошибке
//   await expect(loginPage.invalidCredentialsToast).toBeVisible();

// });



// test('5. User trying to log in with invalid password (true login)', async ({ page }) => {
//   const loginPage = new LoginPage(page);

//   Precondition
//   await loginPage.goto();
//   await expect(loginPage.title).toBeVisible();

//   Test data
//   const email = 'user1@test.com';
//   const password = 'qwe123';

//   Steps
//   await loginPage.login(email, password);

//   Result: нижний правый угол - тоаст-уведомление об ошибке
//   await expect(loginPage.invalidCredentialsToast).toBeVisible();

// });




// test("6. User trying to log in with an email that wasn't registered  in the system (unregistered email)", async ({ page }) => {
//   const loginPage = new LoginPage(page);

//   // Precondition
//   await loginPage.goto();
//   await expect(loginPage.title).toBeVisible();

//   // Test data
//   const email = 'qwert@test.com';
//   const password = 'qwert123';

//   // Steps
//   await loginPage.login(email, password);

//   // Result: нижний правый угол - тоаст-уведомление об ошибке
//   await expect(loginPage.invalidCredentialsToast).toBeVisible();

// });



test("7. User trying to enter spaces in fields", async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Precondition
  await loginPage.goto();
  await expect(loginPage.title).toBeVisible();

  // Test data
  const email = '   user1@test.com';
  const password = '   user123   ';

  // Steps
  await loginPage.login(email, password);

  // Result: нижний правый угол - тоаст-уведомление об ошибке
  await expect(loginPage.invalidCredentialsToast).toBeVisible();

});