// pages/RegistrationPage.js
export class RegistrationPage {
  constructor(page) {
    this.page = page;

    // Локаторы формы регистрации
    this.title = page.getByText('Создать аккаунт');
    this.nameInput = page.getByLabel('Имя');
    this.surnameInput = page.getByLabel('Фамилия');
    this.email_Input = page.getByPlaceholder("user@example.com");
    this.usernameInput = page.getByPlaceholder("ivan_ivanov");
    this.phoneInput = page.getByPlaceholder("+1234567890");
    this.password_Input = page.getByPlaceholder("••••••••");

    this.registrationButton = page.getByRole('button', { name: 'Зарегистрироваться' });
    
    this.login_Link = page.getByRole('link', { name: 'Войти' });
    this.registration_Link = page.getByRole('link', { name: 'Зарегистрироваться' });

    this.name_RequiredError = page.getByText('Имя обязательно');   
    this.surname_RequiredError = page.getByText('Фамилия обязательна');
    this.email_RequiredError = page.getByText('Email обязателен');
    this.username_RequiredError = page.getByText('Username обязателен');
    this.phone_RequiredError = page.getByText('Телефон обязателен');
    this.password_RequiredError = page.getByText('Пароль обязателен');

    this.invalidEmailToast = page.getByText('email must be an email');
    this.invalidPasswordToast = page.getByText('Пароль должен состоять из не менее 8ми символов, содержать в себе буквы и цифры '); // баг - не реализовано на сайте
    this.invalidUsernameToast = page.getByText('This username already exists');
    this.invalidEmaiRegToast = page.getByText('Email "user1@test.com" already exists.');
    this.invalidPhoneToast = page.getByText('phoneNumber must be in international format (starting with +)');
    this.validCredentialsToast = page.getByText(/Регистрация прошла успешно/i);

    this.redText = page.locator('.text-destructive');

  }

  async goto() {
    await this.page.goto('/register'); // baseURL подставится автоматически часть c register
  }

  async registration(nam_e, surnam_e, emai_l, usernam_e, phon_e, passwor_d) {
  await this.nameInput.fill(nam_e);
  await this.surnameInput.fill(surnam_e);
  await this.email_Input.fill(emai_l);
  await this.usernameInput.fill(usernam_e);
  await this.phoneInput.fill(phon_e);
  await this.password_Input.fill(passwor_d);

  await this.registrationButton.click();
}

}
