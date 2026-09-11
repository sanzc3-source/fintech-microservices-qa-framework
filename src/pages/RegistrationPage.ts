import { Page, Locator } from '@playwright/test';

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

  // Navigate to the app's home page, where both forms live
  async goto() {
    await this.page.goto('http://localhost:4000');
  }

  // Fill out and submit the registration form with the given values
  async register(name: string, email: string, accountType: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.accountTypeSelect.selectOption(accountType);
    await this.submitButton.click();
  }

  // Read whatever success/error message the form displayed after submit
  async getResultText(): Promise<string> {
    return this.resultText.textContent().then((text) => text ?? '');
  }
}
