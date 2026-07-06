import { test as base, expect } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage';

export const test = base.extend({
  registrationSetup: async ({ page }, use) => {

    const registrationPage = new RegistrationPage(page);

    await registrationPage.gotoRegPage();
    await expect(registrationPage.title).toBeVisible();

    await use(registrationPage); // передаём в тесты эту фикстуру
  }
});
