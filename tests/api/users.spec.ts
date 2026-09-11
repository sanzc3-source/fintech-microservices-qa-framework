import { test, expect } from '@playwright/test';
import { UserClient } from '../../src/api/UserClient';
import { buildUser } from '../../src/factories/userFactory';
import { assertStatusCode, assertHasValidId, assertErrorMessage } from '../../src/utils/customAssertions';

test.describe('User Service API', () => {
  // Happy path: creating a user should succeed and return the created data
  test('creates a user successfully', async ({ request }) => {
    const client = new UserClient(request);
    const payload = buildUser();

    const response = await client.createUser(payload);

    await assertStatusCode(response, 201);
    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.email).toBe(payload.email);
    assertHasValidId(body);
  });

  // Validation: missing required fields should be rejected
  test('rejects user creation with missing fields', async ({ request }) => {
    const client = new UserClient(request);
    const incompletePayload = buildUser({ name: undefined });

    const response = await client.createUser(incompletePayload as any);

    await assertStatusCode(response, 400);
    await assertErrorMessage(response, 'required');
  });

  // Happy path: fetching an existing user with a valid API key should succeed
  test('gets an existing user with valid auth', async ({ request }) => {
    const client = new UserClient(request);
    const payload = buildUser();

    const createResponse = await client.createUser(payload);
    const created = await createResponse.json();

    const getResponse = await client.getUser(created.id);

    await assertStatusCode(getResponse, 200);
    const body = await getResponse.json();
    expect(body.id).toBe(created.id);
    expect(body.email).toBe(payload.email);
  });

  // Error scenario: fetching a user that doesn't exist should 404
  test('returns 404 for a non-existent user', async ({ request }) => {
    const client = new UserClient(request);

    const response = await client.getUser('nonexistent-id-999');

    await assertStatusCode(response, 404);
  });
});
