// tests/registration.spec.js

import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';


test.describe('Registration form tests', () => {

test('1.The link "Зарегистрироваться" is clickable', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  // Precondition
    await registrationPage.goto();
    await expect(registrationPage.title).toBeVisible();

  // Steps
  await registrationPage.login_Link.click();
  await registrationPage.registration_Link.click();
  

  // Result: открывается форма Создать аккаунт
  await expect(page.getByText('Создать аккаунт'));
});

// Генераторы случайных данных для регистрации через функцию
function randomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function randomEmail() {
  return `${randomString(6)}@test.com`;
}


test('2. User is able to Register', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.goto();
  await expect(registrationPage.title).toBeVisible();

  // Генерация случайных данных
  const nam_e = randomString();
  const surnam_e = randomString();
  const emai_l = randomEmail();
  const usernam_e = randomString();
  const phon_e = '+1234567890';
  const passwor_d = 'Qaz123456';

  // Steps
  await registrationPage.registration(
    nam_e,
    surnam_e,
    emai_l,
    usernam_e,
    phon_e,
    passwor_d
  );


  await expect(registrationPage.validCredentialsToast).toBeVisible(); //нижний правый угол - тоаст-уведомление об успехе "Регистрация прошла успешно, теперь вы можете войти"

});


test('3. User is trying to register with empty fields', async ({ page }) => {
   const registrationPage = new RegistrationPage(page);

  // Precondition
  await registrationPage.goto();
  await expect(registrationPage.title).toBeVisible();

  // Steps
  await registrationPage.registrationButton.click();

  // Result: появляется предупреждение для обязательных полей
  await expect(registrationPage.name_RequiredError).toBeVisible();
  await expect(registrationPage.surname_RequiredError).toBeVisible();
  await expect(registrationPage.email_RequiredError).toBeVisible();
  await expect(registrationPage.username_RequiredError).toBeVisible();
  await expect(registrationPage.phone_RequiredError).toBeVisible();
  await expect(registrationPage.password_RequiredError).toBeVisible();
});


test('4. User is trying to enter an invalid formatted email', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  // Precondition
  await registrationPage.goto();
  await expect(registrationPage.title).toBeVisible();

  // Test data
  const nameReg = 'qazx';
  const surnameReg = 'zaqx';
  const emailReg = 'zaqxtest.com'; // invalid
  const usernameReg = 'qazx';
  const phoneReg = '+123456789';
  const passwordReg = 'qazx123456';

  // Steps
  await registrationPage.registration(nameReg, surnameReg, emailReg, usernameReg, phoneReg, passwordReg);

  // Result: нижний правый угол - тоаст-уведомление об ошибке
  await expect(registrationPage.invalidEmailToast).toBeVisible();

});


test('5. User is trying to enter invaid (short) password (registration module)', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  //Precondition
  await registrationPage.goto();
  await expect(registrationPage.title).toBeVisible();

  // Test data
  const nameReg = 'qazx';
  const surnameReg = 'zaqx';
  const emailReg = 'zaqx@test.com';
  const usernameReg = 'qazx';
  const phoneReg = '+123456789';
  const passwordReg = 'qaz123';  // invalid

  //Steps
  await registrationPage.registration(nameReg, surnameReg, emailReg, usernameReg, phoneReg, passwordReg);

  //Result: нижний правый угол - тоаст-уведомление об ошибке в пароле
  await expect(registrationPage.invalidPasswordToast).toBeVisible();

});


test('6. User trying to enter registered username (registration module)', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  //Precondition
  await registrationPage.goto();
  await expect(registrationPage.title).toBeVisible();

  // Test data
  const nameReg = 'qazx';
  const surnameReg = 'zaqx';
  const emailReg = 'zaqx@test.com';
  const usernameReg = 'user1'; // invalid
  const phoneReg = '+123456789';
  const passwordReg = 'qazx123456';  

  //Steps
  await registrationPage.registration(nameReg, surnameReg, emailReg, usernameReg, phoneReg, passwordReg);

  //Result: нижний правый угол - тоаст-уведомление c текстом об ошибке в username 
  await expect(registrationPage.invalidUsernameToast).toBeVisible();

});


test('7. User is trying to enter registered Email (registration module)', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  //Precondition
  await registrationPage.goto();
  await expect(registrationPage.title).toBeVisible();

  // Test data
  const nameReg = 'qazx';
  const surnameReg = 'zaqx';
  const emailReg = 'user1@test.com';  // invalid 
  const usernameReg = 'qazx';
  const phoneReg = '+123456789';
  const passwordReg = 'qazx123456';  

  //Steps
  await registrationPage.registration(nameReg, surnameReg, emailReg, usernameReg, phoneReg, passwordReg);

  //Result: нижний правый угол - тоаст-уведомление об ошибке в Email 
  await expect(registrationPage.invalidEmaiRegToast).toBeVisible();

});


test('8. User is trying to enter an invalid formatted Phone number', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  //Precondition
  await registrationPage.goto();
  await expect(registrationPage.title).toBeVisible();

  // Test data
  const nameReg = 'qazx';
  const surnameReg = 'zaqx';
  const emailReg = 'zaqx@test.com'; 
  const usernameReg = 'qazx';
  const phoneReg = '123456789';   // invalid 
  const passwordReg = 'qazx123456';  

  //Steps
  await registrationPage.registration(nameReg, surnameReg, emailReg, usernameReg, phoneReg, passwordReg);

  //Result: нижний правый угол - тоаст-уведомление об ошибке в "Телефон" поле 
  await expect(registrationPage.invalidPhoneToast).toBeVisible();

});


test('9. User trying to enter spaces in fields', async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  //Precondition
  await registrationPage.goto();
  await expect(registrationPage.title).toBeVisible();

  // Test data
  const nameReg = '   qazx   ';
  const surnameReg = '   zaqx   ';
  const emailReg = '   zaqx@test.com'; 
  const usernameReg = '  qazx';
  const phoneReg = '   +123456789   '; 
  const passwordReg = '   qazx123456   ';  

  //Steps
  await registrationPage.registration(nameReg, surnameReg, emailReg, usernameReg, phoneReg, passwordReg);

  //Result: подсвечены красным поля с невалидными данными (все = 12 красных строк (по 2 на 1 поле))
  await expect(registrationPage.redText).toHaveCount(12);

});

});