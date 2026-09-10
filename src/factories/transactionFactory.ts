// Generates fake-but-valid transaction data for tests
export function buildTransaction(overrides = {}) {
  // Default valid transaction - individual fields can be overridden per test
  return {
    userId: '1',
    amount: 100.5,
    type: 'transfer',
    recipientId: '456',
    ...overrides,
  };
}
