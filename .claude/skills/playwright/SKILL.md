---
description: Use when writing or modifying end-to-end tests in e2e/tests for task-board - full user flows through the real UI against real dev servers. HOW-TO procedure specific to this repo's Playwright setup; for what must be e2e-tested vs unit-tested see .claude/rules/testing.md.
---

# Playwright (e2e)

1. **Locate where the test belongs**
   - One spec file per user flow under `e2e/tests/*.spec.ts`, following the naming/style of `e2e/tests/task-board.spec.ts`.
   - Decide if the change extends an existing flow spec (add a step to `task-board.spec.ts`) or is a genuinely new flow (new spec file).

2. **Write the test against real UI, no mocking**
   - Drive the page exactly as a user would: `page.getByPlaceholder(...)`, `page.getByRole(...)`, `page.getByTestId(...)` — match the selector style already used in `task-board.spec.ts`.
   - Use `data-testid` attributes already present in `App.tsx` (e.g. `data-testid="card"`); if the flow needs a new one, add it to the component in the same change (see the react skill).
   - Make test data unique and non-colliding across runs, following the existing pattern of suffixing titles with `Date.now()`.
   - Assert on visible behavior (text, visibility, CSS state like `text-decoration-line`) — not on internal state or implementation detail.

3. **Respect the webServer setup**
   - Don't hardcode ports or start servers manually in the test — `e2e/playwright.config.ts` already spins up `services/api` (3001) and `apps/web` (5173) via `webServer`, with `baseURL` set to the web app.
   - Use relative `page.goto("/")` paths, relying on `baseURL`.

4. **Run it**
   - `npm run test:e2e` from root (equivalent to `npm run test --workspace e2e`), which reuses already-running dev servers if present (`reuseExistingServer: true`) or starts fresh ones.
   - If a run leaves stray dev servers or a locked `dev.db` behind, don't force-kill or reset the DB without checking first — investigate what's holding it (see the guardrails on destructive database operations).

5. **Verify determinism**
   - Re-run the spec at least twice locally to confirm it doesn't depend on timing or prior test ordering, per the testing rules.
