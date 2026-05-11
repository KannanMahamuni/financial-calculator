import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('User can log in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('testuser', 'password');
  expect(await loginPage.isLoggedIn()).toBeTruthy();
});