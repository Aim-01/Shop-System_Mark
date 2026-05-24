// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;

    // Локаторы страницы логина
    this.title = page.getByText('Вход в систему');
    this.emailInput = page.getByPlaceholder("user@example.com"); 
    this.passwordInput = page.getByPlaceholder("••••••••");
    this.loginButton = page.getByRole('button', { name: 'Войти' });
    this.registrationLink = page.getByRole('link', { name: 'Зарегистрироваться' });
    this.loginLink = page.getByRole('link', { name: 'Войти' });
    this.emailRequiredError = page.getByText('Email обязателен');
    this.passwordRequiredError = page.getByText('Пароль обязателен');
    this.invalidCredentialsToast = page.getByText('Неверный email или пароль');


  }

  async goto() {
    await this.page.goto('/login'); // baseURL подставится автоматически
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.registrationLink.click();
  }

  async goToRegistration() {
    await this.registrationLink.click();
    await this.loginLink.click();
  }
}

