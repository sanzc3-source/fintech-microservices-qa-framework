# Performance Testing — Scope Note

## Why this exists

This project's primary focus is functional test automation (API + UI), but
performance and load testing are a natural extension of quality engineering
for a financial transaction system — so a small, real performance test is
included to demonstrate that skill set alongside the functional suite.

## What's included

One k6 script (`performance/transactions-load-test.js`) load-testing the most
transaction-critical endpoint, `POST /api/transactions`:

- 10 virtual users, 15 seconds
- Validates both correctness (status 201) and a basic performance SLA
  (response time under 200ms) on every single request
- Result: 150 requests, 0 failures, ~4ms average response time,
  ~32ms p95 response time

## What this is NOT

This is a small, scoped proof-of-concept — not a full performance testing
framework. It does not include:

- Stress, soak, or scalability testing across multiple scenarios
- Database performance profiling (this project uses an in-memory store by
  design, documented in the main README/architecture notes)
- CI/CD-integrated performance gates or SLA enforcement
- System resource monitoring (CPU/memory/disk) or observability tooling
  (Prometheus, Grafana, etc.)

## What I'd build next

- Load tests for all core endpoints, plus a stress test ramping well past
  expected load to find the actual breaking point
- A soak test running for an extended duration to catch memory leaks or
  performance degradation over time
- Integrating k6's JSON output into CI, with a pass/fail gate based on a
  defined SLA (e.g., p95 under 200ms, error rate under 1%)
- Swapping the in-memory store for a real database and profiling query
  performance under load
