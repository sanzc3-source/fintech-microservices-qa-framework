import { test, expect } from '@playwright/test';
import { TransactionClient } from '../../src/api/TransactionClient';
import { buildTransaction } from '../../src/factories/transactionFactory';
import { createTestUser } from '../../src/utils/helpers';
import { assertStatusCode, assertHasValidId, assertErrorMessage } from '../../src/utils/customAssertions';

test.describe('Transaction Service API', () => {
  // Happy path: creating a transaction with valid auth should succeed
  test('creates a transaction successfully', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const user = await createTestUser(request);

    const payload = buildTransaction({ userId: user.id });
    const response = await txnClient.createTransaction(payload);

    await assertStatusCode(response, 201);
    const body = await response.json();
    expect(body.userId).toBe(user.id);
    expect(body.amount).toBe(payload.amount);
    assertHasValidId(body);
  });

  // Happy path: fetching transactions for a user should return an array
  test('gets transactions for a user', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const user = await createTestUser(request);

    await txnClient.createTransaction(buildTransaction({ userId: user.id }));

    const getResponse = await txnClient.getTransactions(user.id);

    await assertStatusCode(getResponse, 200);
    const body = await getResponse.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  // Validation: missing required fields should be rejected
  test('rejects transaction with missing fields', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const incompletePayload = buildTransaction({ userId: undefined });

    const response = await txnClient.createTransaction(incompletePayload as any);

    await assertStatusCode(response, 400);
    await assertErrorMessage(response, 'required');
  });

  // Validation: a zero or negative amount should be rejected
  test('rejects transaction with non-positive amount', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const invalidPayload = buildTransaction({ amount: -50 });

    const response = await txnClient.createTransaction(invalidPayload);

    await assertStatusCode(response, 400);
    await assertErrorMessage(response, 'positive number');
  });

  // Auth: no API key at all should return 401
  test('rejects transaction creation with no API key', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const payload = buildTransaction();

    const response = await txnClient.createTransactionNoAuth(payload);

    await assertStatusCode(response, 401);
    await assertErrorMessage(response, 'Missing API key');
  });

  // Auth: a wrong API key should return 403
  test('rejects transaction creation with invalid API key', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const payload = buildTransaction();

    const response = await txnClient.createTransactionBadAuth(payload);

    await assertStatusCode(response, 403);
    await assertErrorMessage(response, 'Invalid API key');
  });

  // Side-effect: creating a transaction should trigger a notification
  test('creating a transaction triggers a notification', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const user = await createTestUser(request);

    await txnClient.createTransaction(buildTransaction({ userId: user.id, type: 'deposit', amount: 42 }));

    // Notifications endpoint isn't wrapped in a client yet - direct request is fine for this one check
    const notifResponse = await request.get(
      `http://localhost:4000/api/notifications/${user.id}`
    );
    const notifications = await notifResponse.json();

    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].message).toContain('deposit');
  });
});
