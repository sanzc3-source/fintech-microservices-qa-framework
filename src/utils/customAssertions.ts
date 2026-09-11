import { APIResponse, expect } from '@playwright/test';

// Asserts an API response has the expected status code, with a clear failure message
export async function assertStatusCode(response: APIResponse, expectedStatus: number) {
  const actualStatus = response.status();
  expect(actualStatus, `Expected status ${expectedStatus} but got ${actualStatus}`).toBe(expectedStatus);
}

// Asserts a created record (user or transaction) has a real, non-empty id
export function assertHasValidId(record: { id?: string }) {
  expect(record.id, 'Expected record to have a valid id').toBeTruthy();
  expect(typeof record.id, 'Expected id to be a string').toBe('string');
}

// Asserts an error response body contains the expected error message substring
export async function assertErrorMessage(response: APIResponse, expectedSubstring: string) {
  const body = await response.json();
  expect(body.error, 'Expected response to have an error field').toBeTruthy();
  expect(body.error).toContain(expectedSubstring);
}

// Asserts a transaction amount is a valid positive number (business rule, not just a type check)
export function assertValidAmount(amount: number) {
  expect(amount, 'Amount must be a number').toEqual(expect.any(Number));
  expect(amount, 'Amount must be positive').toBeGreaterThan(0);
}
