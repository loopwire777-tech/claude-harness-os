---
description: Use when implementing a new feature or user-facing capability in task-board, from a request through to a mergeable change. Covers the end-to-end workflow (Understand -> Plan -> Implement -> Test -> Review -> Validate); not for one-line fixes or pure investigation with no known cause (use debugging) or pure cleanup with no behavior change (use refactoring).
---

# Feature Development

1. **Understand**
   - Restate the requested behavior in one or two sentences; identify what's genuinely new vs. already possible.
   - Locate every workspace the feature touches (`packages/shared`, `services/api`, `apps/web`, `e2e`) by tracing the data from UI down to DB, or DB up to UI.
   - Note any existing schema, route, or component the feature extends rather than duplicates.

2. **Plan**
   - Decide the shape change starting from `packages/shared` (schemas/types) since it is upstream of both API and web.
   - List the concrete edits per workspace in dependency order: shared -> prisma schema/migration -> API route -> web api.ts -> web UI.
   - Identify which existing tests cover the touched area and which new tests are needed (unit for shared/api logic, e2e for a full user flow).
   - If the plan implies a new dependency, a schema change, or anything destructive, stop and surface it before writing code.

3. **Implement**
   - Make edits in the dependency order from the plan — don't write UI against a shape that doesn't exist in `packages/shared` yet.
   - Implement one workspace at a time; keep each edit scoped to what the feature requires.

4. **Test**
   - Add/update unit tests next to the changed logic in `packages/shared` or `services/api`.
   - Add/update an e2e spec in `e2e/tests/` if the feature changes a user-facing flow.
   - Run `npm run test` and `npm run test:e2e` and confirm both pass.

5. **Review**
   - Re-read the full diff for consistency: does every workspace agree on the shape (`Card`, `ColumnId`, routes)?
   - Check for anything the feature made obsolete (dead code, now-unused exports) and remove it.

6. **Validate**
   - Run `npm run typecheck` across all affected workspaces.
   - Run `npm run dev` and exercise the new flow manually through the UI.
   - Confirm the definition of done in `.claude/CLAUDE.md` is met before calling the feature complete.
