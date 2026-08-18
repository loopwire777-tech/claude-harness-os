---
description: Strict no-guessing reproduce -> evidence -> root-cause -> fix -> regression-test procedure for an unknown-cause bug
---

Debug the issue described in $ARGUMENTS (if empty, ask the user for the bug report, failing test, or error). Follow the `debugging` skill exactly — do not skip a step or jump to a fix before completing evidence collection.

1. **Reproduce**
   - Get the exact steps, input, or request that triggers it.
   - Reproduce it locally (`npm run dev`, a failing test, or a curl against `services/api`) before touching any code.
   - If it doesn't reproduce, STOP. Ask the user for more detail or check logs — do not proceed on a guess.

2. **Collect evidence**
   - Read the actual error: full stack trace, HTTP status/body, or failing assertion output — never a paraphrase.
   - Check `build/qa-report.json`-style structured output where applicable, or raw terminal output of the failing command.
   - Record the exact input values and state involved (card id, columnId, request payload).

3. **Identify the failing layer**
   - Trace: web UI -> `apps/web/src/api.ts` -> HTTP -> `services/api/src/index.ts` route -> Prisma -> SQLite (or the shared-schema equivalent).
   - Narrow to one layer by checking each boundary: does what leaves the browser match what `api.ts` sends? Does what the API receives match what Zod expects? Does what Prisma returns match what the route sends back?

4. **Trace to root cause**
   - Within the failing layer, find the specific line/condition producing the wrong behavior.
   - Confirm causation, not correlation: change the suspected input/condition and confirm the output changes as predicted, before editing source.

5. **State root cause before fixing**
   - Write the root cause in one sentence. If the fix would only mask the symptom (e.g. catching an error without addressing why it's thrown), go back to step 4.

6. **Smallest fix**
   - Change only what's needed. Don't refactor surrounding code in the same change.

7. **Regression test**
   - Add a test that fails without the fix and passes with it, in the workspace matching the failing layer (unit in `packages/shared`/`services/api`, e2e in `e2e/tests/` for a full-flow bug). Never delete or weaken an existing test to make something pass.

8. **Verify**
   - Re-run the original reproduction and confirm the bug is gone.
   - Run `npm run typecheck` and `npm run test` (plus `npm run test:e2e` if flow-level).

Report back with: the root cause, the evidence that proved it, the fix, and the regression test added.
