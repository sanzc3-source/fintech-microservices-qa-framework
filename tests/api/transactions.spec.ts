import { test, expect } from '@playwright/test';
import { TransactionClient } from '../../src/api/TransactionClient';
import { UserClient } from '../../src/api/UserClient';
import { buildTransaction } from '../../src/factories/transactionFactory';
import { buildUser } from '../../src/factories/userFactory';

test.describe('Transaction Service API', () => {
  // Happy path: creating a transaction with valid auth should succeed
  test('creates a transaction successfully', async ({ request }) => {
    const userClient = new UserClient(request);
    const txnClient = new TransactionClient(request);

    // Create a real user first so the transaction has a valid userId
    const userResponse = await userClient.createUser(buildUser());
    const user = await userResponse.json();

    const payload = buildTransaction({ userId: user.id });
    const response = await txnClient.createTransaction(payload);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.userId).toBe(user.id);
    expect(body.amount).toBe(payload.amount);
    expect(body.id).toBeTruthy();
  });

  // Happy path: fetching transactions for a user should return an array
  test('gets transactions for a user', async ({ request }) => {
    const userClient = new UserClient(request);
    const txnClient = new TransactionClient(request);

    const userResponse = await userClient.createUser(buildUser());
    const user = await userResponse.json();

    await txnClient.createTransaction(buildTransaction({ userId: user.id }));

    const getResponse = await txnClient.getTransactions(user.id);

    expect(getResponse.status()).toBe(200);
    const body = await getResponse.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  // Validation: missing required fields should be rejected
  test('rejects transaction with missing fields', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const incompletePayload = buildTransaction({ userId: undefined });

    const response = await txnClient.createTransaction(incompletePayload as any);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('required');
  });

  // Validation: a zero or negative amount should be rejected
  test('rejects transaction with non-positive amount', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const invalidPayload = buildTransaction({ amount: -50 });

    const response = await txnClient.createTransaction(invalidPayload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('positive number');
  });

  // Auth: no API key at all should return 401
  test('rejects transaction creation with no API key', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const payload = buildTransaction();

    const response = await txnClient.createTransactionNoAuth(payload);

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Missing API key');
  });

  // Auth: a wrong API key should return 403
  test('rejects transaction creation with invalid API key', async ({ request }) => {
    const txnClient = new TransactionClient(request);
    const payload = buildTransaction();

    const response = await txnClient.createTransactionBadAuth(payload);

    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toBe('Invalid API key');
  });

  // Side-effect: creating a transaction should trigger a notification
  test('creating a transaction triggers a notification', async ({ request }) => {
    const userClient = new UserClient(request);
    const txnClient = new TransactionClient(request);

    const userResponse = await userClient.createUser(buildUser());
    const user = await userResponse.json();

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
