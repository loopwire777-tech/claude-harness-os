---
description: Use when asked to review a diff, PR, or set of changes in task-board for correctness and quality before merge. Defines review order and severity classification. Not for reviewing your own work as you write it (that's just careful implementation) or for the /code-review slash command's automated multi-agent flow - use this for a manual/directed review pass.
---

# Code Review

1. **Establish scope**
   - Get the full diff (`git diff` against the base branch, or the specific files named).
   - Identify which workspaces are touched and which layers within them (schema, controller/route, service, repository, component, hook).

2. **Review in this order**
   1. `packages/shared` — schema/type changes first, since everything downstream depends on them.
   2. `services/api` — routes, and if present, service/repository layers.
   3. `apps/web` — components, hooks, `api.ts`.
   4. `e2e` — test coverage for the changed flow.
   - Reviewing in this order surfaces shape mismatches before you spend time on code that consumes the (possibly wrong) shape.

3. **Classify each finding by severity**
   - **Blocker**: incorrect behavior, data loss risk, security issue, broken build/typecheck/test, violates a hard rule in `.claude/rules/`.
   - **Major**: works but likely to break under a realistic input/edge case; missing test for new behavior; architecture layering violated (e.g., a component calling `fetch` directly, a controller calling Prisma directly).
   - **Minor**: naming, duplication, missed simplification, style inconsistency with surrounding code.
   - **Nit**: purely cosmetic; optional for the author to address.

4. **For each finding, verify before reporting**
   - Re-read the actual code at the cited location; don't report from a skim.
   - Confirm the failure scenario is concrete: what input or state triggers it, and what the wrong output/behavior is.
   - Discard findings that don't survive this check.

5. **Report**
   - List findings most-severe first.
   - For each: file:line, one-sentence defect summary, and the concrete failure scenario.
   - Note explicitly if a change is missing required test coverage per the project's testing rules, or crosses a layer boundary defined in `architecture.md`.
