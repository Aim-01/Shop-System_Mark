// tests/cart.spec.js
import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

const email = "user1@test.com";
const password = "user123";

test.describe('Cart module tests', () => {

  test.beforeEach(async ({ page }) => { // действия выполняются перед каждым тестом
    const cart = new CartPage(page);
    await cart.goto();
    await cart.loginCart(email, password);
    await expect(cart.katalogTovarovTitle).toBeVisible();
    await cart.openCartPage();
    await cart.clearCart();
  });

  test('1. The Cart page is displayed', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.openCartPage();
    await page.waitForURL('**/cart'); // ожидание
    await expect(cart.vashaKorzinaTitle).toBeVisible({ timeout: 3000 });
  });
 
  test('2. User is able to put an item to the cart', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.gotoCatalog(); 
    await cart.addItemToCart();
    await cart.openCartPage();

    await expect(cart.vashaKorzinaTitle).toBeVisible({ timeout: 3000 }); // страница Корзины открыта
    await expect(cart.notZeroPrice).toHaveCount(0); // сумма не равна нулю

  });

test('3. User is able to put 2 same items to the cart (Samsung S23 Ultra)', async ({ page }) => { // failed
  const cart = new CartPage(page);

  await cart.gotoCatalog();    
  await cart.goToSamsungPage();
  await cart.selectTwoSamsungs();
  await cart.openCartPage();

await expect(cart.twoSamsungInCart.first()).toBeVisible();
const count = await cart.countTwoSamsungs();
expect(count).toBe(2); // ищет 2 одинаковых товара - найдёт только 1 самсунг в корзине

});

test('4. User is able to remove an item from the cart', async ({ page }) => { 
    const cart = new CartPage(page);

    await cart.gotoCatalog();
    await cart.addItemToCart();
    await cart.openCartPage();
    await page.waitForURL('**/cart'); // ожидание
    await expect(cart.vashaKorzinaTitle).toBeVisible({ timeout: 3000 }); // страница Корзины открыта
    await cart.clearCart();
    await page.pause(); 
    await expect(cart.emptyCart).toBeVisible({ timeout: 3000 }); // Корзина пуста

});

  test('5. The [Оформить заказ] button is clickable', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.gotoCatalog();
    await cart.addItemToCart();
    await cart.openCartPage();
    await page.waitForTimeout(10000); // ждём 10 секунд чтобы другие тоасты закрылись и появился наш один
    await cart.submitButton.click();
    await expect(cart.orderSubmitToast).toBeVisible(); // тоаст в нижнем правом углу
  });


test('6. Total price is calculated correctly', async ({ page }) => {
  const cart = new CartPage(page);
    await cart.openCartPage();
    await page.pause(); 
    await cart.clearCart();
    await expect(cart.emptyCart).toBeVisible({ timeout: 3000 }); // Корзина пуста
    await page.pause();
    await cart.twoItemsAddToCart();  // 1. Добавляем два товара

  const expectedSum = await cart.sumTwoProductPrices();  // 2. Считаем сумму двух товаров (мы всё ещё в каталоге!)
  console.log("Ожидаемая сумма (цены товаров):", expectedSum);
  await cart.openCartPage();  // 3. Переходим в корзину
  await page.waitForURL('**/cart'); // ожидание

  const totalText = await cart.totalAmountInCart.innerText();  // 4. Получаем сумму из блока "Итого" 
  const total = parseFloat(totalText.replace(/[^\d.,]/g, '').replace(',', '.'));

console.log("Сумма 'Итого' после парсинга:", total); // логируем процесс чтобы понимать на каком этапе ошибка
console.log("=== Сравниваем суммы ===");
console.log(`Ожидаемая: ${expectedSum} | В корзине: ${total}`);

  expect(total).toBeCloseTo(expectedSum, 2);  // 5. Сравниваем
});


  test('7. User is not able to click the [Оформить заказ] button with an empty cart', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.clearCart();
    await cart.openCartPage();
    await page.pause();
    await expect(cart.submitButton).toBeDisabled();
  });


  test('8. Item image is displayed in the Cart', async ({ page }) => { // failed
  const cart = new CartPage(page);
 // await cart.clearCart();
  await cart.imageAddForChecking();

  const img = cart.imageInCart.first(); // локатор картинки делаем переменной
  const src = await img.getAttribute('src');  // Получаем src из img src
  const absoluteUrl = new URL(src, page.url()).href; // получаем абсолютный URL из src
  console.log("Абсолютный URL:", absoluteUrl); // логируем URL получившийся

  const response = await page.request.get(absoluteUrl);  // Проверяем статус-код URL картинки
  const status = response.status();
  console.log("Статус-код :", status); // логируем полученный статус-код

  expect(status).toBe(200); // проверка статус-кода URL картинки (404 по данному url)
  
});


  test('9. Cart is saved after re-login', async ({ page }) => {
    const cart = new CartPage(page);

    await cart.gotoCatalog();
    await cart.addItemToCart(); // добавляет 1 товар
    await cart.twoItemsAddToCart(); // ещё 2 добавляет
    await cart.logout();
    await cart.loginCart(email, password);
    await cart.openCartPage();
    await expect(cart.emptyCart).not.toBeVisible();

  });

});
