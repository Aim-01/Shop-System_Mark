// tests/data/registrationTestData.js

export const invalidEmailData = {
  name: 'qazx',
  surname: 'zaqx',
  email: 'zaqxtest.com',
  username: 'qazx',
  phone: '+123456789',
  password: 'qazx123456'
};

export const shortPasswordData = {
  name: 'qazx',
  surname: 'zaqx',
  email: 'zaqx@test.com',
  username: 'qazx',
  phone: '+123456789',
  password: 'qaz123'
};

export const registeredUsernameData = {
  name: 'qazx',
  surname: 'zaqx',
  email: 'zaqx@test.com',
  username: 'user1',
  phone: '+123456789',
  password: 'qazx123456'
};

export const registeredEmailData = {
  name: 'qazx',
  surname: 'zaqx',
  email: 'user1@test.com',
  username: 'qazx',
  phone: '+123456789',
  password: 'qazx123456'
};

export const invalidPhoneData = {
  name: 'qazx',
  surname: 'zaqx',
  email: 'zaqx@test.com',
  username: 'qazx',
  phone: '123456789',
  password: 'qazx123456'
};

export const spacesData = {
  name: '   qazx   ',
  surname: '   zaqx   ',
  email: '   zaqx@test.com',
  username: '  qazx',
  phone: '   +123456789   ',
  password: '   qazx123456   '
};
