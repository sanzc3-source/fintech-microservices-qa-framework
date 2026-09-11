import { Page, Locator, expect } from '@playwright/test';

// Wraps all interactions with the registration form
export class RegistrationPage {
  private page: Page;
  private nameInput: Locator;
  private emailInput: Locator;
  private accountTypeSelect: Locator;
  private submitButton: Locator;
  private resultText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#reg-name');
    this.emailInput = page.locator('#reg-email');
    this.accountTypeSelect = page.locator('#reg-account-type');
    this.submitButton = page.locator('#registration-form button[type="submit"]');
    this.resultText = page.locator('#registration-result');
  }

  async goto() {
    await this.page.goto('http://localhost:4000');
  }

  async register(name: string, email: string, accountType: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.accountTypeSelect.selectOption(accountType);
    await this.submitButton.click();
  }

  // Waits (with auto-retry) until the result text contains the expected substring,
  // instead of reading it once immediately - avoids a race with the async fetch call
  async expectResultToContain(expectedText: string) {
    await expect(this.resultText).toContainText(expectedText);
  }
}
