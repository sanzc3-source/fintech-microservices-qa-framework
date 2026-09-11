import { APIRequestContext } from '@playwright/test';
import { UserClient } from '../api/UserClient';
import { buildUser } from '../factories/userFactory';

// Creates a real user via the API and returns the parsed response body.
// Used by tests that need a valid userId but aren't testing user creation itself.
export async function createTestUser(request: APIRequestContext) {
  const client = new UserClient(request);
  const response = await client.createUser(buildUser());
  return response.json();
}

// Generates a random string of the given length, useful for unique test values
export function randomString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
