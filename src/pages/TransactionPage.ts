import { Page, Locator, expect } from '@playwright/test';

// Wraps all interactions with the create-transaction form
export class TransactionPage {
  private page: Page;
  private userIdInput: Locator;
  private amountInput: Locator;
  private typeSelect: Locator;
  private recipientIdInput: Locator;
  private submitButton: Locator;
  resultText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userIdInput = page.locator('#txn-user-id');
    this.amountInput = page.locator('#txn-amount');
    this.typeSelect = page.locator('#txn-type');
    this.recipientIdInput = page.locator('#txn-recipient-id');
    this.submitButton = page.locator('#transaction-form button[type="submit"]');
    this.resultText = page.locator('#transaction-result');
  }

  async goto() {
    await this.page.goto('http://localhost:4000');
  }

  async createTransaction(userId: string, amount: string, type: string, recipientId: string) {
    await this.userIdInput.fill(userId);
    await this.amountInput.fill(amount);
    await this.typeSelect.selectOption(type);
    await this.recipientIdInput.fill(recipientId);
    await this.submitButton.click();
  }

  // Waits (with auto-retry) until the result text contains the expected substring,
  // instead of reading it once immediately - avoids a race with the async fetch call
  async expectResultToContain(expectedText: string) {
    await expect(this.resultText).toContainText(expectedText);
  }
}
