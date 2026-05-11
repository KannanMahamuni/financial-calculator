import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://your-app-url.com/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('#login-button');
  }

  async isLoggedIn() {
    return this.page.isVisible('#logout-button');
  }
}