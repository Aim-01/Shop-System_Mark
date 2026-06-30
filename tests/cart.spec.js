// tests/cart.spec.js

import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

const user1 = { email: "user1@test.com", password: "user123" }; // тестовые данные юзеров
const user2 = { email: "user2@test.com", password: "user123" };

test.describe('Cart module tests', () => {

  test.beforeEach(async ({ page }, testInfo) => {
    const cart = new CartPage(page);

    // Определяем пользователя по номеру теста (юзер 2 используется в тех что чаще падают)
    const title = testInfo.title;

    const user =
     // title.startsWith('4.') ||
      title.startsWith('6.') ||
      title.startsWith('7.')
        ? user2
        : user1;

    testInfo.user = user; // Сохраняем юзера в testInfo для логирования

    await cart.goto();
    await cart.loginCart(user.email, user.password);
    await expect(cart.catalogOfItemsTitle).toBeVisible();
    await cart.openCartPage({ timeout: 3000 }); // подождём прогрузку
    await cart.clearCart({ timeout: 3000 });
  });

  test('1. The Cart page is displayed', async ({ page }, testInfo) => {
    console.log(`>>> Тест 1 выполняется под пользователем: ${testInfo.user.email}`); // логируем какой юзер используется при прохождении теста

    const cart = new CartPage(page);
    await cart.openCartPage();
    await expect(cart.yourCartTitle).toBeVisible();
  });

  test('2. The User is able to put an item to the cart', async ({ page }, testInfo) => {
    console.log(`>>> Тест 2 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    await cart.gotoCatalog();
    await cart.addItemToCart();
    await cart.openCartPage();
    await expect(cart.notZeroPrice).toHaveCount(0);
  });

  test('3. The User is able to put 2 same items to the cart (1st in the Catalog)', async ({ page }, testInfo) => {  // Failed
    console.log(`>>> Тест 3 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    await cart.gotoCatalog({ timeout: 500 });
    await cart.goToProductPage();
    await cart.getProductName(); 
    await cart.selectTwoSameItems();
    await cart.openCartPage({ timeout: 3000 });
    const count = await cart.countTwoSameItems({ timeout: 3000 });

    expect(count).toBe(2);
  });

  test('4. The User is able to remove an item from the cart', async ({ page }, testInfo) => {
    console.log(`>>> Тест 4 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    await cart.gotoCatalog();
    await cart.addItemToCart();
    await cart.openCartPage();
    await cart.clearCart();

    await expect(cart.emptyCart).toBeVisible();
  });

  test('5. The [Оформить заказ] button is clickable', async ({ page }, testInfo) => {
    console.log(`>>> Тест 5 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    await cart.gotoCatalog();
    await cart.addItemToCart();
    await cart.openCartPage();
    await cart.submitButton.click();

    await expect(cart.orderSubmitToast).toBeVisible({ timeout: 3000 });
  });


test('6. Total price is calculated correctly', async ({ page }, testInfo) => {
  console.log(`>>> Тест 6 выполняется под пользователем: ${testInfo.user.email}`);

  const cart = new CartPage(page);

  await cart.openCartPage();
  await cart.twoItemsAddToCart();

  const expectedSum = await cart.sumTwoProductPrices();
  console.log("Сумма двух товаров из каталога = " + expectedSum);

  await cart.openCartPage();
  const total = await cart.getCartTotal();
  console.log("Сумма двух товаров из Cart = " + total);

  expect(total).toBeCloseTo(expectedSum, 2);
});


  test('7. The User is not able to click the [Оформить заказ] button with an empty cart', async ({ page }, testInfo) => {
    console.log(`>>> Тест 7 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    await cart.clearCart();
    await cart.openCartPage();
    await expect(cart.submitButton).toBeDisabled({ timeout: 3000 });
  });


  test('8. Item image is displayed in the Cart', async ({ page }, testInfo) => { // Failed
    console.log(`>>> Тест 8 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    await cart.imageAddForChecking();
    const img = cart.imageInCart.first({ timeout: 500 });
    const src = await img.getAttribute('src');
    const absoluteUrl = new URL(src, page.url()).href;
    const response = await page.request.get(absoluteUrl);
    expect(response.status()).toBe(200);
  });

  test('9. The Cart is saved after re-login', async ({ page }, testInfo) => {
    console.log(`>>> Тест 9 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    await cart.gotoCatalog();
    await cart.addItemToCart();
    await cart.twoItemsAddToCart();
    await cart.logout();

    // повторный вход тем же юзером
    await cart.loginCart(testInfo.user.email, testInfo.user.password);

    await cart.openCartPage();
    await expect(cart.emptyCart).not.toBeVisible();
  });

});
