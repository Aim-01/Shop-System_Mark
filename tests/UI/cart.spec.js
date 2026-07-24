// tests/UI/cart.spec.js 
// тесты последовательные

import { expect } from '@playwright/test';
import { test } from '../../fixtures/fixtureCart';
import { CartPage } from '../../pages/CartPage';
import { LoginPage } from '../../pages/LoginPage';
import { users } from '../../testData/users';

const { user1, user2 } = users; //тестовые данные из testData

test.describe('@ui Cart module tests', () => {

test('1. The Cart page is displayed', async ({ page, cartSetup }, testInfo) => {
    console.log(`>>> Тест 1 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    await cart.openCartPage();
    await expect(cart.yourCartTitle).toBeVisible();
  });

  test('2. The User is able to put an item to the cart', async ({ page, cartSetup }, testInfo) => {
    console.log(`>>> Тест 2 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);

   await cart.openCatalogWithItems();
    await cart.addItemToCart();

    await cart.openCartPage();
    await expect(cart.notZeroPrice).toHaveCount(0);
  });

    test('3. The User is able to put 2 same items to the cart', async ({ page, cartSetup }, testInfo) => {
    console.log(`>>> Тест 3 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);

    await cart.openCatalogWithItems();

    await cart.getProductName();
    await cart.selectTwoSameItems();

    await cart.openCartPage();
    const count = await cart.countTwoSameItems();

    expect(count).toBe(2);
  });

 test('4. The User is able to remove an item from the cart', async ({ page, cartSetup }, testInfo) => {
    console.log(`>>> Тест 4 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);

    await cart.openCatalogWithItems();
    await cart.addItemToCart();

    await cart.openCartPage();
    await cart.clearCart();

    await expect(cart.emptyCart).toBeVisible();
  });

  test('5. The [Оформить заказ] button is clickable', async ({ page, cartSetup }, testInfo) => {
    console.log(`>>> Тест 5 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);

    await cart.openCatalogWithItems();
    await cart.addItemToCart();

    await cart.openCartPage();
    await cart.submitButton.click();

    await expect(cart.orderSubmitToast).toBeVisible();
  });
  
  test('6. Total price is calculated correctly', async ({ page, cartSetup }, testInfo) => {
    console.log(`>>> Тест 6 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);

    await cart.twoItemsAddToCart([1, 2]);

    const expectedSum = await cart.sumTwoProductPrices();
    console.log("Сумма двух товаров из каталога = " + expectedSum);

    await cart.openCartPage();
    const total = await cart.getCartTotal();

    console.log("Сумма двух товаров из Cart = " + total);

    expect(total).toBeCloseTo(expectedSum, 2);
  });

  test('7. The User is not able to click the [Оформить заказ] button with an empty cart', async ({ page, cartSetup }, testInfo) => {
    console.log(`>>> Тест 7 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);

    await cart.openCartPage();
    await expect(cart.submitButton).toBeDisabled();
  });

  test('8. Item image is displayed in the Cart', async ({ page, cartSetup }) => {
    const cart = new CartPage(page);

    await cart.imageAddForChecking();
    await cart.checkItemImageIsValid();
  });

  test('9. The Cart is saved after re-login', async ({ page, cartSetup }, testInfo) => {
    console.log(`>>> Тест 9 выполняется под пользователем: ${testInfo.user.email}`);

    const cart = new CartPage(page);
    const login = new LoginPage(page);

    await cart.openCatalogWithItems();
    await cart.twoItemsAddToCart([1, 2]);

    await login.logout();
    await login.login(testInfo.user.email, testInfo.user.password);

    await cart.openCartPage();
    await expect(cart.emptyCart).not.toBeVisible();
  });

});