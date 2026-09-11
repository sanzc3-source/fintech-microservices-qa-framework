import { APIResponse } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const LOG_FILE = path.join(process.cwd(), 'test-results', 'api-responses.log');

// Ensures the test-results folder exists before we try writing to it
function ensureLogDirExists() {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Logs an API call's method, URL, status, and response body to a persistent log file
export async function logApiResponse(method: string, url: string, response: APIResponse) {
  ensureLogDirExists();

  const status = response.status();
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = '(non-JSON response body)';
  }

  const entry = {
    timestamp: new Date().toISOString(),
    method,
    url,
    status,
    body,
  };

  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
}
