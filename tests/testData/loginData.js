// tests/testData/loginData.js

export const validUser = {
  email: 'user1@test.com',
  password: 'user123'
};

export const invalidUsers = {
  invalidEmailFormat: {
    email: 'user1test.com',
    password: 'user123'
  },
  wrongPassword: {
    email: 'user1@test.com',
    password: 'qwe123'
  },
  unregisteredUser: {
    email: 'qwert@test.com',
    password: 'qwert123'
  },
  withSpaces: {
    email: '   user1@test.com',
    password: '   user123   '
  }
};
