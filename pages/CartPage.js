// pages/CartPage.js

import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;

    // Логин
    this.emailInput = page.getByPlaceholder("user@example.com");
    this.passwordInput = page.getByPlaceholder("••••••••");
    this.loginButton = page.getByRole('button', { name: 'Войти' });

    this.cartIcon = page.locator('a:has(svg.lucide-shopping-cart)');
    this.catalogOfItemsTitle = page.getByRole('heading', { name: 'Каталог товаров' });
    this.yourCartTitle = page.getByRole('heading', { name: 'Ваша Корзина' });
    this.itemLinkPage = page.locator('a.group.flex').first(); // находим первый товар на странице
    this.productTitle = page.locator('h1.text-3xl.font-bold'); // локатор названия товара на странице товара (h1)
     this.cartItemTitle = page.locator('h4.font-semibold'); // локатор названия товара в корзине (h4)

    this.itemLinkPage2 = page.locator('a[href="/product/2"]');
    this.AddButtonOnPage = page.getByRole('button', { name: 'Добавить в корзину' });
    this.priceToSum = page.locator('p.text-3xl.font-bold'); // цена товара на странце этого товара
    this.totalAmountInCart = page.getByText(/Итого:\s*\d+[.,]\d+\s*руб\./);

    // Элементы корзины
    this.emptyCart = page.getByText('Ваша корзина пуста.');
    this.toCartButton = page.getByRole('button', { name: 'В корзину' });
    this.submitButton = page.getByRole('button', { name: 'Оформить заказ' });
    this.anyPrice = page.locator('.flex.items-center.gap-4');
    this.notZeroPrice = page.getByText('0.00 руб.');
    this.imageInCart = page.locator('.flex.items-center img');

    this.orderSubmitToast = page.getByText('Заказ успешно создан!');

  }

  async goto() {
    await this.page.goto('/login'); // baseURL подставится автоматически
  }
  async gotoCatalog() {
    await this.page.goto('/'); // на страницу каталога переход
}
 async openCartPage() { // переход на страницу Корзины через иконку корзины в хэдере
    await this.cartIcon.click();
  }

  async loginCart(email, password) { // логинимся
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

 async addItemToCart() {
    await this.toCartButton.first().click();
  }

  async goToProductPage(){
    await this.itemLinkPage.click(); // должно быть открытие страницы товара (для тк с 2мя одинаковыми в корзину)
  }

async getProductName() {
    this.productName = await this.productTitle.innerText();
    return this.productName;
  }


 async selectTwoSameItems() {
    await this.AddButtonOnPage.click();
    await this.page.waitForTimeout(500);
    await this.AddButtonOnPage.click();
  }

async countTwoSameItems() {
    const locator = this.page.locator('h4.font-semibold', { hasText: this.productName });
     await locator.first().waitFor({ state: 'visible', timeout: 3000 });
    return await locator.count();
  }


async clearCart() {
  await this.cartIcon.click();

  const deleteButtons = this.page.getByRole('button', { name: 'Удалить' });

  while (await deleteButtons.count() > 0) {
    const before = await deleteButtons.count();
    console.log("До удаления:", before);

    await deleteButtons.first().click();
    await expect(deleteButtons).toHaveCount(before - 1);   // Ждём, пока количество кнопок уменьшится

    const after = await deleteButtons.count();
    console.log("После удаления осталось:", after);
  }
}

async getCartTotal() { // находим сумму в корзине
  const totalText = await this.totalAmountInCart.innerText();
  return this.parsePrice(totalText);
}

parsePrice(text) {  // находим сумму в корзине и распарсим эту сумму
  return parseFloat(text.replace(/[^\d.,]/g, '').replace(',', '.'));
}


async twoItemsAddToCart() {

  await this.page.goto('/'); // на страницу каталога переход
  await this.page.waitForLoadState('networkidle'); // ждём загрузку
  await this.itemLinkPage.click();  // Открываем первый товар
  await this.AddButtonOnPage.waitFor({ state: 'visible', timeout: 7000 });
  await this.AddButtonOnPage.click();
  await this.page.goto('/'); // Возвращаемся в каталог
  await this.page.waitForLoadState('networkidle');
  await this.itemLinkPage2.click();  // Открываем второй товар
  await this.AddButtonOnPage.waitFor({ state: 'visible', timeout: 7000 });
  await this.AddButtonOnPage.click();
}

async sumTwoProductPrices() { // складываем цены из каталога по товарам

  const getPrice = async () => {
    await this.priceToSum.waitFor({ state: 'visible', timeout: 7000 });
    const text = await this.priceToSum.innerText();
    return parseFloat(text.replace(/[^\d.,]/g, '').replace(',', '.'));
  };
  await this.page.goto('/');  // --- 1. Первый товар ---
  await this.itemLinkPage.waitFor({ state: 'visible', timeout: 7000 });
  await this.itemLinkPage.click();

  const price1 = await getPrice();

  await this.page.goto('/');  // --- 2. Второй товар ---
  await this.itemLinkPage2.waitFor({ state: 'visible', timeout: 7000 });
  await this.itemLinkPage2.click();

  const price2 = await getPrice();

  return price1 + price2;  // --- 3. Складываем ---
}

 async imageAddForChecking() {
    await this.page.goto('/'); // на страницу каталога переход
    await this.itemLinkPage2.click();
    await this.AddButtonOnPage.click();
    await this.cartIcon.click();

  }

async getImageSrc() { // работаем со ссылкой на картинку с src
  const src = await this.imageInCart.first().getAttribute('src');
  console.log("SRC картинки:", src);
  return src;
}

async checkImageNot404(src) { // работаем со ссылкой на картинку 
  const response = await this.page.request.get(src);
  console.log("Статус ответа картинки:", response.status());
  expect(response.status()).toBe(200);
}

  async logout() {
    await this.page.getByRole('button', { name: 'user1' }).click();
    await this.page.getByText('Выйти').click();
  }
}