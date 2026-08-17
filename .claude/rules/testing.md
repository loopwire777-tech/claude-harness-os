---
paths: ["**/*.test.{ts,tsx}", "tests/**", "e2e/**"]
---

# Testing

- Every new behavior gets a test; every bug fix gets a regression test.
- Unit test logic and schemas; use e2e only for full user flows.
- No mocking the database in e2e tests — drive the real dev servers.
- Tests must be deterministic; no reliance on timing, ordering, or external network state.
- Assert on behavior and output, not implementation detail.
- Never disable, skip, or delete a failing test to make a suite pass.
