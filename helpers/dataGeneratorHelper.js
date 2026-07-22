// helpers/dataGeneratorHelper.js

 // Генераторы случайных данных для регистрации через функцию
export function randomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function randomEmail() {
  return `${randomString(6)}@test.com`;
}
