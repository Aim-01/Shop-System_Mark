// tests/registration.spec.js

import { test } from './fixtures/fixtureRegistration';
import { expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { randomString, randomEmail } from './helpers/dataGeneratorHelper';

import {                                   // статические тестовые данные
  invalidEmailData,
  shortPasswordData,
  registeredUsernameData,
  registeredEmailData,
  invalidPhoneData,
  spacesData
} from '../tests/testData/registrationTestData';

test.describe('Registration form tests', () => {

test('1.The link "Зарегистрироваться" is clickable', async ({ registrationSetup }) => {
  const registrationPage = registrationSetup;
  const login = new LoginPage(registrationPage.page);

  await login.loginLink.click();
  await login.registrationLink.click();
  
  await expect(registrationPage.title).toBeVisible();
});

test('2. User is able to Register', async ({ registrationSetup }) => {
  const registrationPage = registrationSetup;

const data = {
  nam_e: randomString(),
  surnam_e: randomString(),
  emai_l: randomEmail(),
  usernam_e: randomString(),
  phon_e: '+1234567890',
  passwor_d: 'Qaz123456'
};

 await registrationPage.registration(
  data.nam_e,
  data.surnam_e,
  data.emai_l,
  data.usernam_e,
  data.phon_e,
  data.passwor_d
);

  await expect(registrationPage.validCredentialsToast).toBeVisible(); //нижний правый угол - тоаст-уведомление об успехе "Регистрация прошла успешно, теперь вы можете войти"

});


test('3. User is trying to register with empty fields', async ({ registrationSetup }) => {
 const registrationPage = registrationSetup;

  await registrationPage.registrationButton.click();

  for (const error of registrationPage.requiredErrors) {
    await expect(error).toBeVisible();
  }
});


test('4. User is trying to enter an invalid formatted email', async ({ registrationSetup }) => {
  const registrationPage = registrationSetup;

 await registrationPage.registration(
    invalidEmailData.name,
    invalidEmailData.surname,
    invalidEmailData.email,
    invalidEmailData.username,
    invalidEmailData.phone,
    invalidEmailData.password
  );

  await expect(registrationPage.invalidEmailToast).toBeVisible();
});


test('5. User is trying to enter invalid (short) password', async ({ registrationSetup }) => { //Failed
  const registrationPage = registrationSetup;

  await registrationPage.registration(
    shortPasswordData.name,
    shortPasswordData.surname,
    shortPasswordData.email,
    shortPasswordData.username,
    shortPasswordData.phone,
    shortPasswordData.password
  );

  await expect(registrationPage.invalidPasswordToast).toBeVisible();

});


test('6. User trying to enter registered username', async ({ registrationSetup }) => { //Failed
  const registrationPage = registrationSetup;

 await registrationPage.registration(
    registeredUsernameData.name,
    registeredUsernameData.surname,
    registeredUsernameData.email,
    registeredUsernameData.username,
    registeredUsernameData.phone,
    registeredUsernameData.password
  );

  await expect(registrationPage.invalidUsernameToast).toBeVisible();

});


test('7. User is trying to enter registered Email', async ({ registrationSetup }) => {
  const registrationPage = registrationSetup;

  await registrationPage.registration(
    registeredEmailData.name,
    registeredEmailData.surname,
    registeredEmailData.email,
    registeredEmailData.username,
    registeredEmailData.phone,
    registeredEmailData.password
  );

  await expect(registrationPage.invalidEmaiRegToast).toBeVisible();

});


test('8. User is trying to enter invalid formatted Phone number', async ({ registrationSetup }) => {
  const registrationPage = registrationSetup;

  await registrationPage.registration(
    invalidPhoneData.name,
    invalidPhoneData.surname,
    invalidPhoneData.email,
    invalidPhoneData.username,
    invalidPhoneData.phone,
    invalidPhoneData.password
  );

  await expect(registrationPage.invalidPhoneToast).toBeVisible();

});


test('9. User trying to enter spaces in fields', async ({ registrationSetup }) => { //Failed
  const registrationPage = registrationSetup;

  await registrationPage.registration(
    spacesData.name,
    spacesData.surname,
    spacesData.email,
    spacesData.username,
    spacesData.phone,
    spacesData.password
  );

  await expect(registrationPage.redText).toHaveCount(12);

});

});