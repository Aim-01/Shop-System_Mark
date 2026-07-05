// tests/fixtures/fixtureCart.js

import { test as base, expect } from '@playwright/test';

import { CartPage } from '../../pages/CartPage';
import { LoginPage } from '../../pages/LoginPage';
import { users } from '../testData/users';

const { user1, user2 } = users;

export const test = base.extend({
  cartSetup: async ({ page }, use, testInfo) => {

    const cart = new CartPage(page);
    const login = new LoginPage(page);
    const title = testInfo.title;  // выбор пользователя по номеру теста
    const user =
      title.startsWith('6.') ||
      title.startsWith('7.')
        ? user2
        : user1;

    testInfo.user = user;

    await login.goto();  // логин
    await login.login(user.email, user.password);

    await expect(cart.catalogOfItemsTitle).toBeVisible();  // проверка каталога

    console.log(">>> beforeEach: проверяем товары в корзине"); // очистка корзины
    await cart.openCartPage();
    await cart.clearCart();
    console.log(">>> beforeEach: корзина пуста");
    await use(); // фикстура ничего не возвращает — просто выполняет подготовку
  }
});