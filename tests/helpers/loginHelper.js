// tests/helpers/loginHelper.js
import { LoginPage } from '../../pages/LoginPage';


export async function loginUser(page, email, password) {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(email, password);

  return loginPage;
}

