---
description: Add or fill in test coverage (unit and/or e2e) for a piece of existing logic or a flow, per this repo's testing rules
---

Add or improve test coverage for $ARGUMENTS (if empty, ask the user which logic, schema, route, or flow needs coverage).

1. **Scope the coverage gap**
   - Identify what's untested: a Zod schema or pure-logic function in `packages/shared`, route/service logic in `services/api`, or a full user flow (create/move/complete a card, or similar) that only e2e can exercise.
   - Check `.claude/rules/testing.md`: unit test logic and schemas, use e2e only for full user flows through the real UI. Don't write a component-level or API-level test — this repo has no such layer (`services/api` logic is covered by e2e only).

2. **Unit tests (`packages/shared`, `services/api`)**
   - Colocate as `*.test.ts` next to the source, matching existing Vitest test style in `packages/shared`.
   - Cover valid input, invalid input (schema rejection), and edge cases relevant to the logic.
   - Assert on behavior/output, not implementation detail.

3. **E2E tests (`e2e/tests/*.spec.ts`)**
   - If this is a full-flow gap, use the `playwright` skill / `playwright-expert` agent: one spec per user flow, driven through the real UI against real dev servers, no API mocking.
   - Match selector style in `e2e/tests/task-board.spec.ts` (`getByPlaceholder`, `getByRole`, `getByTestId`). Add a `data-testid` to the component if needed.
   - Make test data unique per run (e.g. suffix titles with `Date.now()`).

4. **Determinism**
   - No reliance on timing, ordering, or external network state.
   - For e2e, re-run the spec at least twice locally to confirm it's not flaky.

5. **Run and confirm**
   - `npm run test` for unit tests; `npm run test:e2e` for e2e.
   - Never disable, skip, or delete an existing test to make the suite pass — if an existing test now fails, that's a signal to investigate, not silence.
