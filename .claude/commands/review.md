---
description: Manual/directed code review of the current diff, in review order with severity classification - for a heavier review, invoke the code-reviewer, security-reviewer, and test-engineer agents directly instead
---

Review the diff for $ARGUMENTS (if empty, review the full working diff against the base branch) following the `code-review` skill.

This is a manual, directed review pass done inline — there is no automated multi-agent review command in this repo. If the user wants a heavier review, explicitly invoke the relevant specialist agents one at a time in the same session — e.g. `code-reviewer`, `security-reviewer`, `performance-reviewer`, `test-engineer` — rather than relying on a single slash command to fan them out.

1. **Establish scope**
   - Get the full diff (`git diff` against the base branch, or the specific files named).
   - Identify which workspaces are touched and which layers within them (schema, controller/route, service, repository, component, hook).

2. **Review in this order**
   1. `packages/shared` — schema/type changes first, since everything downstream depends on them.
   2. `services/api` — routes, and service/repository layers if present.
   3. `apps/web` — components, hooks, `api.ts`.
   4. `e2e` — test coverage for the changed flow.
   - This order surfaces shape mismatches before you spend time on code that consumes a possibly-wrong shape.

3. **Classify each finding by severity**
   - **Blocker**: incorrect behavior, data loss risk, security issue, broken build/typecheck/test, violates a hard rule in `.claude/rules/`.
   - **Major**: works but likely breaks under a realistic input/edge case; missing test for new behavior; architecture layering violated (component calling `fetch` directly, controller calling Prisma directly).
   - **Minor**: naming, duplication, missed simplification, style inconsistency with surrounding code.
   - **Nit**: purely cosmetic; optional for the author to address.

4. **Verify before reporting**
   - Re-read the actual code at the cited location; don't report from a skim.
   - Confirm the failure scenario is concrete: what input/state triggers it, what the wrong output/behavior is.
   - Discard findings that don't survive this check.

5. **Report**
   - List findings most-severe first: file:line, one-sentence defect summary, concrete failure scenario.
   - Note explicitly if a change is missing required test coverage (`.claude/rules/testing.md`) or crosses a layer boundary (`.claude/rules/architecture.md`).
