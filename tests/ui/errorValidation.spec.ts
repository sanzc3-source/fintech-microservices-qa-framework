import { test } from '@playwright/test';
import { TransactionPage } from '../../src/pages/TransactionPage';

test.describe('UI Error Message Validation', () => {
  // Error scenario: a zero amount should show the backend's validation error on screen
  test('shows an error for a zero amount', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    await transactionPage.goto();

    await transactionPage.createTransaction('1', '0', 'deposit', '999');

    await transactionPage.expectResultToContain('amount must be a positive number');
  });

  // Error scenario: a negative amount should show the same validation error
  test('shows an error for a negative amount', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    await transactionPage.goto();

    await transactionPage.createTransaction('1', '-25', 'deposit', '999');

    await transactionPage.expectResultToContain('amount must be a positive number');
  });
});
