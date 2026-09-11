import http from 'k6/http';
import { check, sleep } from 'k6';

// Scoped bonus: a single, minimal load test against the busiest financial endpoint.
// Not a full performance framework - a proof-of-concept demonstrating awareness
// that this role emphasizes load/stress testing (see PERFORMANCE_NOTES.md).

export const options = {
  vus: 10,          // 10 virtual users hitting the endpoint at once
  duration: '15s',  // for 15 seconds
};

const API_KEY = 'test-api-key-12345';
const BASE_URL = 'http://localhost:4000';

export default function () {
  const payload = JSON.stringify({
    userId: '1',
    amount: Math.floor(Math.random() * 500) + 1,
    type: 'transfer',
    recipientId: '999',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
  };

  const response = http.post(`${BASE_URL}/api/transactions`, payload, params);

  // Basic checks: correct status, and reasonable response time
  check(response, {
    'status is 201': (r) => r.status === 201,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
