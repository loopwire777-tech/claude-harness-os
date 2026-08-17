---
paths: ["services/api/**"]
---

# API

- Validate every request body, param, and query with a Zod schema from `@task-board/shared` before it reaches the service layer.
- Reject invalid input with a consistent error shape; never let a validation failure fall through silently.
- Keep endpoint routes and payload shapes consistent with the schemas in `packages/shared` — never drift.
- Return consistent status codes: 2xx success, 400 validation error, 404 not found, 500 unexpected.
- Never leak internal error details (stack traces, SQL, file paths) in an API response.
