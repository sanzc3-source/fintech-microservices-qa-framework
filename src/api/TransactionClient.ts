import { APIRequestContext } from '@playwright/test';
import { config } from '../config/env';

// Shape of the data needed to create a transaction
export interface CreateTransactionPayload {
  userId: string;
  amount: number;
  type: string;
  recipientId: string;
}

// Wraps all Transaction Service API calls in one reusable class
export class TransactionClient {
  // Playwright passes in its request context; we don't create our own
  constructor(private request: APIRequestContext) {}

  // POST /api/transactions - protected, must send the API key
  async createTransaction(payload: CreateTransactionPayload) {
    return this.request.post(`${config.baseURL}/api/transactions`, {
      headers: { 'x-api-key': config.apiKey },
      data: payload,
    });
  }

  // GET /api/transactions/:userId - protected, must send the API key
  async getTransactions(userId: string) {
    return this.request.get(`${config.baseURL}/api/transactions/${userId}`, {
      headers: { 'x-api-key': config.apiKey },
    });
  }

  // Helper for auth tests: call the endpoint with NO api key header at all
  async createTransactionNoAuth(payload: CreateTransactionPayload) {
    return this.request.post(`${config.baseURL}/api/transactions`, {
      data: payload,
    });
  }

  // Helper for auth tests: call the endpoint with a deliberately wrong api key
  async createTransactionBadAuth(payload: CreateTransactionPayload) {
    return this.request.post(`${config.baseURL}/api/transactions`, {
      headers: { 'x-api-key': 'wrong-key' },
      data: payload,
    });
  }
}
