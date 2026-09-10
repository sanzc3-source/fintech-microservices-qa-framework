import { APIRequestContext } from '@playwright/test';
import { config } from '../config/env';

// Shape of the data needed to create a user
export interface CreateUserPayload {
  name: string;
  email: string;
  accountType: string;
}

// Wraps all User Service API calls in one reusable class
export class UserClient {
  // Playwright passes in its request context; we don't create our own
  constructor(private request: APIRequestContext) {}

  // POST /api/users - registration is public, no auth header needed
  async createUser(payload: CreateUserPayload) {
    return this.request.post(`${config.baseURL}/api/users`, {
      data: payload,
    });
  }

  // GET /api/users/:id - protected, must send the API key
  async getUser(id: string) {
    return this.request.get(`${config.baseURL}/api/users/${id}`, {
      headers: { 'x-api-key': config.apiKey },
    });
  }
}
