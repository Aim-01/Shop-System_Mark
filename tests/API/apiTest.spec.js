// tests/API/apiTest.spec.js 

import { test, expect }  from '@playwright/test';
import { randomString, randomEmail } from '../../helpers/dataGeneratorHelper';
import { validUser, invalidUsers } from '../../testData/loginData';

test.describe('@api API tests (no using UI!)', () => {


test('1. Successful login with valid credentials (POST)', async ({ request }) => {
  const start = Date.now(); // для засечения времени обработки запроса

  const response = await request.post('/auth/login', {
    data: validUser
  });

  expect(response.status()).toBe(201); // проверка ответа об успешном логине

  const body = await response.json();

  expect(body).toMatchObject({ // проверка наличия обязательных полей залогиненого юзера
    email: validUser.email,
    username: expect.any(String),
    role: expect.any(String),
    id: expect.any(Number)
  });

  expect(Date.now() - start).toBeLessThan(800); // результат проверки скорости ответа
});


test('2. Login with invalid credentials (wrong password - POST)', async ({ request }) => {
  const start = Date.now();

  const response = await request.post('/auth/login', { //  используем тестовые данные
    data: invalidUsers.wrongPassword
  });

  expect(response.status()).toBe(401); // проверка статуса (Swagger: 401 Invalid credentials)

  const body = await response.json(); // gарсим тело ответа

  expect(body).toMatchObject({
    message: expect.stringContaining('Invalid') // проверяем сообщение об ошибке
  });

  expect(body).not.toMatchObject({ // проверяем, что сервер НЕ возвращает данные пользователя
    id: expect.anything(),
    email: expect.anything(),
    username: expect.anything(),
    role: expect.anything()
  });

  expect(Date.now() - start).toBeLessThan(800); // чек скорости ответа
});



test('3. Successful registration with valid data (POST)', async ({ request }) => {
  const start = Date.now();

  const userData = {
    firstname: randomString(8),
    lastname: randomString(10),
    phoneNumber: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: randomEmail(),
    username: randomString(12),
    password: randomString(10),
    role: 'USER'
  };

  const response = await request.post('/auth/register', { data: userData });

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body).toMatchObject({
    id: expect.any(Number),
    email: userData.email,
    username: userData.username,
    role: userData.role
  });

  expect(Date.now() - start).toBeLessThan(800);
});


test('4. Registration fails when email or username already exists (409 Conflict - POST)', async ({ request }) => {
  const start = Date.now();

  const response = await request.post('/auth/register', {
    data: {
      firstname: 'Ivan',
      lastname: 'Ivanov',
      phoneNumber: '+1234567890',
      email: validUser.email,      // уже существует
      username: 'user1',           // уже существует
      password: 'password123',
      role: 'USER'
    }
  });

  expect(response.status()).toBe(409);   //неуспешная регистрация (Swagger 409)

  const body = await response.json();

  expect(body).toMatchObject({
    message: expect.stringContaining('exists') // проверяем сообщение об ошибке
  });

  expect(body).not.toMatchObject({ // проверяем, что сервер НЕ вернул данные пользователя
    id: expect.anything(),
    username: expect.anything(),
    role: expect.anything()
  });

  expect(Date.now() - start).toBeLessThan(800);
});


test('5. Successful update of user details (PATCH)', async ({ request }) => {

  const newUser = {   // Создаём нового пользователя
    firstname: randomString(6),
    lastname: randomString(8),
    phoneNumber: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: randomEmail(),
    username: randomString(10),
    password: randomString(10),
    role: 'USER'
  };

  const createResponse = await request.post('/auth/register', { data: newUser });
  expect(createResponse.status()).toBe(201);

  const { id: userId } = await createResponse.json();

  const updatedData = {   // данные для обновления рандомом
    username: randomString(12)
  };

  const start = Date.now();

  const updateResponse = await request.patch(`/auth/${userId}`, {
    data: updatedData
  });

  expect(updateResponse.status()).toBe(200); // проверка статуса успешного обновления

  const body = await updateResponse.json();

  expect(body).toMatchObject({
    id: userId,
    username: updatedData.username
  });

  expect(Date.now() - start).toBeLessThan(800);
});



test('6. Update fails when username already exists (409 Conflict - PATCH)', async ({ request }) => {

  const user1 = { // создаём юзера1 для создания конфликта
    firstname: randomString(6),
    lastname: randomString(8),
    phoneNumber: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: randomEmail(),
    username: randomString(10),
    password: randomString(10),
    role: "USER"
  };

  const createUser1 = await request.post('/auth/register', { data: user1 });
  expect(createUser1.status()).toBe(201);

  const createdUser1 = await createUser1.json();
  const existingUsername = createdUser1.username; // этот username уже существует

  const user2 = { //  создаём юзера2 для обновления данных
    firstname: randomString(6),
    lastname: randomString(8),
    phoneNumber: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: randomEmail(),
    username: randomString(10),
    password: randomString(10),
    role: "USER"
  };

  const createUser2 = await request.post('/auth/register', { data: user2 });
  expect(createUser2.status()).toBe(201);

  const createdUser2 = await createUser2.json();
  const userId2 = createdUser2.id; // обновляем именно ВТОРОГО юзера

  const updateData = {
    username: existingUsername // конфликт: username уже существует
  };

  const startTime = Date.now();

  const updateResponse = await request.patch(`/auth/${userId2}`, { // обновляем юзера2
    data: updateData
  });

  const endTime = Date.now();
  const responseTime = endTime - startTime;

  expect(updateResponse.status()).toBe(409); // успешная ошибка обновления Swagger: Conflict 409

  const body = await updateResponse.json();

  expect(body).toHaveProperty('message');
  expect(body.message.toLowerCase()).toContain('exists'); // частичное совпадение текста ошибки 409

  expect(responseTime).toBeLessThan(800);
});


test('7. Successful retrieval of all products (GET)', async ({ request }) => {
  const start = Date.now();

  const response = await request.get('/product');
  expect(response.status()).toBe(200);

  const products = await response.json();

  expect(Array.isArray(products)).toBe(true);
  expect(products.length).toBeGreaterThan(0);

  for (const product of products) {
    expect(product).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.anything(),
      category: expect.any(String),
      urlImage: expect.any(String)
    });
  }

  expect(Date.now() - start).toBeLessThan(800);
});



test('8. Successful deletion of the product (last-1, DELETE) ', async ({ request }) => {

  const getResponse = await request.get('/product'); // получили список продуктов
  expect(getResponse.status()).toBe(200);

  const products = await getResponse.json();

  expect(products.length).toBeGreaterThan(0); // смотрим что список не пустой

  const lastProduct = products[products.length - 1]; // второй с конца товар выбираем в списке
  console.log(lastProduct.name);

  const productId = lastProduct.id;
  const startTime = Date.now();

  const deleteResponse = await request.delete(`/product/${productId}`); 
  console.log(await deleteResponse.text()); // видим какой именно товар удаляется


  const endTime = Date.now();
  const responseTime = endTime - startTime;

  expect(deleteResponse.status()).toBe(200); // получаем респонс об успешном удалении товара (Swagger 200)

  expect(responseTime).toBeLessThan(800);
});


test('9. Successful addition of a product to user bucket (POST)', async ({ request }) => {

  const loginResponse = await request.post('/auth/login', {   // 1. Логин
    data: validUser
  });
  expect(loginResponse.status()).toBe(201);

  const { id: userId } = await loginResponse.json();
  const productId = 44;   // 2. Добавление продукта

  const addResponse = await request.post(`/bucket/${userId}/addProduct`, {
    data: { productId }
  });

  expect(addResponse.status()).toBe(201);
});

test('10. Successful retrieval of user orders (GET)', async ({ request }) => {

  const loginResponse = await request.post('/auth/login', { data: validUser });   // 1. Логин
  expect(loginResponse.status()).toBe(201);

  const { id: userId } = await loginResponse.json();
  const ordersResponse = await request.get(`/order/${userId}`);   // 2. Получение заказов
  expect(ordersResponse.status()).toBe(200);

  const orders = await ordersResponse.json();

  expect(Array.isArray(orders)).toBe(true);

  if (orders.length === 0) return;   // Если заказов нет — тест завершён

  const order = orders[0];   // 3. Проверка структуры заказа

  expect(order).toMatchObject({
    id: expect.any(Number),
    items: expect.any(Array),
    orderDate: expect.any(String),
    status: expect.any(String),
    user_id: expect.any(Number)
  });

  if (order.items.length === 0) return;   // Если items пустой — дальше не проверяем

  const item = order.items[0];   // 4. Проверка структуры item если не пустой

  expect(item).toMatchObject({
    id: expect.any(Number),
    product_id: expect.any(Number),
    quantity: expect.any(Number),
    totalCost: expect.anything(),
    product: expect.any(Object)
  });
});

});