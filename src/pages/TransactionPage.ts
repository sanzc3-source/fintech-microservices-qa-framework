import { Page, Locator } from '@playwright/test';

// Wraps all interactions with the create-transaction form
export class TransactionPage {
  private page: Page;
  private userIdInput: Locator;
  private amountInput: Locator;
  private typeSelect: Locator;
  private recipientIdInput: Locator;
  private submitButton: Locator;
  private resultText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userIdInput = page.locator('#txn-user-id');
    this.amountInput = page.locator('#txn-amount');
    this.typeSelect = page.locator('#txn-type');
    this.recipientIdInput = page.locator('#txn-recipient-id');
    this.submitButton = page.locator('#transaction-form button[type="submit"]');
    this.resultText = page.locator('#transaction-result');
  }

  // Navigate to the app's home page, where both forms live
  async goto() {
    await this.page.goto('http://localhost:4000');
  }

  // Fill out and submit the transaction form with the given values
  async createTransaction(userId: string, amount: string, type: string, recipientId: string) {
    await this.userIdInput.fill(userId);
    await this.amountInput.fill(amount);
    await this.typeSelect.selectOption(type);
    await this.recipientIdInput.fill(recipientId);
    await this.submitButton.click();
  }

  // Read whatever success/error message the form displayed after submit
  async getResultText(): Promise<string> {
    return this.resultText.textContent().then((text) => text ?? '');
  }
}
