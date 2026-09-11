import { test } from '@playwright/test';
import { TransactionPage } from '../../src/pages/TransactionPage';

test.describe('Create Transaction UI', () => {
  // Happy path: filling out valid data should show a success message
  test('creates a transaction successfully', async ({ page }) => {
    const transactionPage = new TransactionPage(page);
    await transactionPage.goto();

    await transactionPage.createTransaction('1', '150.00', 'deposit', '999');

    await transactionPage.expectResultToContain('Transaction created!');
  });
});
