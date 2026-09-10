// Generates fake-but-valid user data for tests
export function buildUser(overrides = {}) {
  const timestamp = Date.now();

  // Default valid user - individual fields can be overridden per test
  return {
    name: `Test User ${timestamp}`,
    email: `user${timestamp}@example.com`,
    accountType: 'premium',
    ...overrides,
  };
}
