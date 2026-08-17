---
description: Use when improving the structure, readability, or organization of existing task-board code without changing its behavior - splitting App.tsx or index.ts as they grow, extracting a service/repository layer, renaming, deduplication. Not for adding capability (use feature-development) or fixing a bug (use debugging).
---

# Refactoring

1. **Confirm behavior-preserving scope**
   - State explicitly what will NOT change: API responses, UI behavior, DB schema, public exports consumed elsewhere.
   - If the change requires a schema or route shape change, it's a feature change, not a refactor — stop and use feature-development instead.

2. **Establish a safety net before editing**
   - Confirm `npm run test` and `npm run typecheck` pass on the current code first.
   - If the code path lacks test coverage, add a characterization test that captures current behavior before refactoring it (still following the testing rules — real e2e flow or real unit logic, no new mocking of the DB).

3. **Make the smallest structural change that achieves the goal**
   - Prefer extraction over rewriting: pull logic into a new function/module rather than restating it differently.
   - When splitting a layer (e.g., extracting a service or repository out of `services/api/src/index.ts`, or a hook out of `apps/web/src/App.tsx`), move code as-is first, then clean up within the new location — don't combine the move with logic changes in one step.
   - Keep the diff reviewable: one structural change per commit-sized unit of work.

4. **Re-verify after each structural change**
   - Run `npm run typecheck` and `npm run test` after every extraction/move, not just at the end.
   - Run `npm run test:e2e` if the refactor touches anything on the create/move/complete flow.

5. **Check for now-unreachable code**
   - After moving logic, confirm nothing was left behind duplicated in the old location.
   - Remove now-unused exports, imports, and variables — don't leave dead code as a "just in case."

6. **Final diff check**
   - Re-read the full diff and confirm every hunk is structural, not behavioral — no changed conditionals, no changed defaults, no changed validation.
