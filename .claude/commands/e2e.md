---
description: Write or extend a Playwright end-to-end spec for a full user flow, per this repo's playwright skill
---

Write or extend an end-to-end test for the flow described in $ARGUMENTS (if empty, ask the user which user flow needs e2e coverage). Follow the `playwright` skill; delegate the actual test writing to the `playwright-expert` agent if the change is non-trivial.

1. **Locate where the test belongs**
   - One spec file per user flow under `e2e/tests/*.spec.ts`, following the naming/style of `e2e/tests/task-board.spec.ts`.
   - Decide: does this extend an existing flow spec (add a step to `task-board.spec.ts`) or is it a genuinely new flow (new spec file)?

2. **Write the test against real UI, no mocking**
   - Drive the page exactly as a user would: `page.getByPlaceholder(...)`, `page.getByRole(...)`, `page.getByTestId(...)` — match the selector style already used in `task-board.spec.ts`.
   - Use `data-testid` attributes already present in `App.tsx`; if the flow needs a new one, add it to the component in the same change (coordinate with the `react` skill/`react-expert` agent).
   - Make test data unique per run, following the existing pattern of suffixing titles with `Date.now()`.
   - Assert on visible behavior (text, visibility, CSS state) — not internal state or implementation detail.

3. **Respect the webServer setup**
   - Don't hardcode ports or start servers manually — `e2e/playwright.config.ts` already spins up `services/api` (3001) and `apps/web` (5173) via `webServer`, `baseURL` set to the web app.
   - Use relative `page.goto("/")` paths, relying on `baseURL`.

4. **Run it**
   - `npm run test:e2e` from root. It reuses already-running dev servers if present, or starts fresh ones.
   - If a run leaves stray dev servers or a locked `dev.db` behind, don't force-kill or reset the DB without checking first — this needs explicit confirmation per `.claude/rules/guardrails/database.md`.

5. **Verify determinism**
   - Re-run the spec at least twice locally to confirm it doesn't depend on timing or prior test ordering.
