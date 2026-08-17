---
description: Use when something is broken and the cause is unknown - a bug report, failing test, unexpected behavior, or error. Strict no-guessing procedure from reproduction to a minimal verified fix. Not for known-cause implementation work (use feature-development) or behavior-preserving cleanup (use refactoring).
---

# Debugging

No-guessing procedure. Do not skip a step or jump to a fix before completing evidence collection.

1. **Reproduce**
   - Get the exact steps, input, or request that triggers the bug.
   - Reproduce it locally (`npm run dev`, a failing test, or a curl against `services/api`) before touching any code.
   - If it doesn't reproduce, stop — you don't have enough information to fix it yet. Gather more detail from the user or logs.

2. **Collect evidence**
   - Read the actual error: full stack trace, HTTP status/body, or failing assertion output — not a paraphrase.
   - Check `build/qa-report.json`-style structured output where applicable, or the terminal output of the failing command directly.
   - Note the exact input values and state involved (card id, columnId, request payload).

3. **Identify the failing layer**
   - Trace the path: web UI -> `apps/web/src/api.ts` -> HTTP -> `services/api/src/index.ts` route -> Prisma -> SQLite, or the equivalent for shared schema logic.
   - Narrow to one layer by checking each boundary: does the request leaving the browser match what `api.ts` sends? Does what the API receives match what Zod expects? Does what Prisma returns match what the route sends back?

4. **Trace to root cause**
   - Within the failing layer, find the specific line or condition that produces the wrong behavior.
   - Confirm causation, not correlation: change the suspected input/condition and confirm the output changes as predicted, before editing source.

5. **Root cause, not symptom**
   - State the root cause in one sentence before writing a fix.
   - If the fix would only mask the symptom (e.g., catching an error without addressing why it's thrown), go back to step 4.

6. **Smallest fix**
   - Change only what's needed to correct the root cause. Don't refactor surrounding code in the same change.

7. **Regression test**
   - Add a test that fails without the fix and passes with it, in the workspace matching the failing layer (unit in `packages/shared`/`services/api`, e2e in `e2e/tests/` for a full-flow bug).

8. **Verify**
   - Re-run the original reproduction steps and confirm the bug is gone.
   - Run `npm run typecheck` and `npm run test` (plus `npm run test:e2e` if the bug was flow-level) to confirm nothing else broke.
