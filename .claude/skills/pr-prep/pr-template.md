# PR Title

Short, imperative, under ~70 characters (e.g. "Add card completion endpoint").

## Summary

1-3 sentences on what this PR does and why. Focus on intent, not implementation detail.

## Changes

- Bullet list of the concrete changes, grouped by workspace if the PR spans more than one
  (`apps/web`, `services/api`, `packages/shared`, `e2e`).
- Call out any shape change to `Card`/`ColumnId` explicitly, and note that it was propagated
  through `packages/shared` → `services/api/prisma/schema.prisma` (+ migration) → `apps/web`.
- Call out any new dependency and the alternative considered.

## Test Plan

- [ ] `npm run typecheck` passes in every affected workspace
- [ ] `npm run test` passes (list any new/updated Vitest coverage)
- [ ] `npm run test:e2e` passes (list any new/updated Playwright coverage, or state N/A if this
      PR doesn't touch the create/move/complete flow)
- Manual verification steps taken, if any.

## Risk / Rollback

- Blast radius: what breaks if this is wrong (e.g. affects all cards, no auth/ownership scoping).
- Migration risk: does this include a Prisma migration? Is it reversible?
- Rollback plan: revert the commit / PR; note if a migration would need a manual down-migration.
