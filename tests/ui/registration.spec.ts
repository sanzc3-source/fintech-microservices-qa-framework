import { test } from '@playwright/test';
import { RegistrationPage } from '../../src/pages/RegistrationPage';

test.describe('User Registration UI', () => {
  // Happy path: filling out valid data should show a success message
  test('registers a new user successfully', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.goto();

    const uniqueEmail = `ui-test-${Date.now()}@example.com`;
    await registrationPage.register('UI Test User', uniqueEmail, 'premium');

    await registrationPage.expectResultToContain('User created!');
  });
});
