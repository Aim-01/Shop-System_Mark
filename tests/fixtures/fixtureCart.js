// tests/fixtures/fixtureCart.js

// import { test as base } from '@playwright/test';
// import { CartPage } from '../../pages/CartPage';
// import { LoginPage } from '../../pages/LoginPage';

// export const test = base.extend({
//   user: async ({}, use, testInfo) => {
//     const title = testInfo.title;

//     const user =
//       title.startsWith('6.') ||
//       title.startsWith('7.')
//         ? { email: "user2@test.com", password: "user123" }
//         : { email: "user1@test.com", password: "user123" };

//     await use(user);
//   },

// cart: async ({ page, user }, use) => {
//   console.log(`>>> beforeEach: тест выполняется под пользователем ${user.email}`);

//   const login = new LoginPage(page);
//   const cart = new CartPage(page);

//   await login.goto();
//   await login.login(user.email, user.password);

//   console.log(">>> beforeEach: открываем корзину");
//   await cart.openCartPage();

//   const deleteButtons = page.locator('button:has-text("Удалить")'); // логирование товаров ДО очистки
//   const before = await deleteButtons.count();
//   console.log(`>>> beforeEach: товаров в корзине ДО очистки = ${before}`);
//   console.log(">>> beforeEach: начинаем очистку корзины");
//   await cart.clearCart();

//   const after = await deleteButtons.count(); // логирование товаров ПОСЛЕ очистки
//   console.log(`>>> beforeEach: товаров в корзине ПОСЛЕ очистки = ${after}`);
//   console.log(">>> beforeEach: корзина очищена");

//   await use(cart);
// }

// });