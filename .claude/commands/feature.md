---
description: Direct entry point into the feature-development workflow for a new feature or user-facing capability
---

Implement the feature described in $ARGUMENTS (if empty, ask the user what to build) following the `feature-development` skill's Understand -> Plan -> Implement -> Test -> Review -> Validate flow. This command is the lightweight, directly-invoked trigger for that same rigor — if you have not already, read the `feature-development` skill now and follow it step by step.

1. **Understand**
   - Restate the requested behavior in 1-2 sentences. Identify what's genuinely new vs. already possible.
   - Trace the data path (UI -> `apps/web/src/api.ts` -> `services/api` route -> Prisma -> SQLite, or the shared-schema equivalent) to find every workspace this touches: `packages/shared`, `services/api`, `apps/web`, `e2e`.
   - Note any existing schema, route, or component this should extend rather than duplicate.

2. **Plan**
   - Start from `packages/shared` — it's upstream of both API and web. Any `Card`/`ColumnId` shape change goes here first.
   - List concrete edits per workspace in dependency order: shared -> `prisma/schema.prisma` + migration -> API route -> `apps/web/src/api.ts` -> web UI.
   - Identify existing test coverage in the touched area and what new tests are needed.
   - If the plan implies a new dependency, a schema change, or anything destructive (see `.claude/rules/guardrails/`), stop and surface it to the user before writing code. Never invent env vars without flagging them.
   - For non-trivial changes spanning workspaces or touching the `Card`/`ColumnId` shape, consider using the `architect` agent to validate the plan before implementing.

3. **Implement**
   - Follow the dependency order from the plan. Don't write UI against a shape that doesn't exist in `packages/shared` yet.
   - Respect layering: web is component -> hook -> service, API is controller -> service -> repository (`.claude/rules/architecture.md`). No `fetch` calls outside `apps/web/src/api.ts`; no Prisma calls outside the repository layer.
   - Delegate implementation to `react-expert` for `apps/web`, `node-expert` for `services/api`, and `playwright-expert` for `e2e`, as appropriate — one workspace at a time.

4. **Test**
   - Add/update unit tests next to changed logic in `packages/shared` or `services/api` (Vitest, `*.test.ts`).
   - Add/update an e2e spec in `e2e/tests/` if this changes a user-facing flow (create/move/complete a card, or a new flow).
   - Run `npm run test` and `npm run test:e2e`; both must pass.

5. **Review**
   - Re-read the full diff for shape consistency across `Card`/`ColumnId`/routes across all three workspaces.
   - Remove anything the feature made obsolete (dead code, now-unused exports) — don't leave it "just in case."

6. **Validate**
   - Run `npm run typecheck` across all affected workspaces.
   - Run `npm run dev` and exercise the new flow manually.
   - Confirm every item in the Definition of Done in `.claude/CLAUDE.md` is met before calling this complete.
