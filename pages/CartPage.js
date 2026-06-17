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
    this.itemLinkPage = page.locator('a[href="/product/5"]');
    this.itemLinkPage2 = page.locator('a[href="/product/2"]');
    this.AddButtonOnPage = page.getByRole('button', { name: 'Добавить в корзину' });
    this.priceToSum = page.locator('p.text-3xl.font-bold'); // цена товара на странце этого товара
    this.totalAmountInCart = page.getByText(/Итого:\s*\d+[.,]\d+\s*руб\./);
    this.twoSamsungInCart = page.getByText("Samsung S23 Ultra");

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
    await this.itemLinkPage.click();
  }

  async selectTwoSamsungs(){ // для тк с двумя одинаковыми товарами
    await this.AddButtonOnPage.click();
    await this.page.waitForTimeout(1000);
    await this.AddButtonOnPage.click();
  }

async countTwoSamsungs() { // для тк с двумя одинаковыми товарами
  return await this.twoSamsungInCart.count();
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

async twoItemsAddToCart() {

  await this.page.goto('/'); // на страницу каталога переход
  await this.page.waitForLoadState('networkidle'); // ждём загрузку
  await this.itemLinkPage.click();  // 2. Открываем первый товар
  await this.AddButtonOnPage.waitFor({ state: 'visible', timeout: 7000 });
  await this.AddButtonOnPage.click();
  await this.page.goto('/'); // 3. Возвращаемся в каталог
  await this.page.waitForLoadState('networkidle');
  await this.itemLinkPage2.click();  // 4. Открываем второй товар
  await this.AddButtonOnPage.waitFor({ state: 'visible', timeout: 7000 });
  await this.AddButtonOnPage.click();
}

async sumTwoProductPrices() {

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
