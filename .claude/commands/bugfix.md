---
description: Fix a bug with a known cause, plus a regression test - lighter weight than /debug when root cause is already clear
---

Fix the bug described in $ARGUMENTS (if empty, ask the user for the bug report or failing behavior).

This is for bugs whose cause is already known or obvious. If the cause is NOT known, stop and use `/debug` instead — do not guess at a fix here.

1. **Confirm the cause is actually known**
   - State the root cause in one sentence, with the file:line where it lives.
   - If you can't state it confidently without more investigation, switch to `/debug` now rather than proceeding on a guess.

2. **Reproduce first**
   - Trigger the bug locally (`npm run dev`, a failing test, or a curl against `services/api`) before editing anything, so you have a before/after to compare.

3. **Smallest fix**
   - Change only what's needed to correct the root cause at its actual layer (shared schema, API route/service/repository, or web component/hook/service per `.claude/rules/architecture.md`).
   - Don't refactor surrounding code in the same change (see `.claude/rules/coding.md` and `git.md` — keep commits focused).

4. **Regression test**
   - Add a test that fails without the fix and passes with it, in the workspace matching the failing layer: unit (`*.test.ts`) in `packages/shared`/`services/api`, or e2e in `e2e/tests/` if it's a full-flow bug (see `.claude/rules/testing.md` — never skip or weaken an existing test to make this pass).

5. **Verify**
   - Re-run the original reproduction steps and confirm the bug is gone.
   - Run `npm run typecheck` and `npm run test` (plus `npm run test:e2e` if flow-level) and confirm everything passes.
   - Confirm the fix doesn't cross a layer boundary or touch files unrelated to this bug.
