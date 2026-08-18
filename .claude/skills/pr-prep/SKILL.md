---
name: pr-prep
description: Use when preparing a pull request description for task-board - writing or drafting PR title/summary/test-plan text, answering "write a PR description", "draft the PR", "prep this for a PR", or similar for the current diff. Not for the code review itself (use code-review) or for pushing/creating the PR on GitHub.
---

# PR Prep

Before writing any PR description text, read `pr-template.md` in this skill directory
(`.claude/skills/pr-prep/pr-template.md`) and follow its structure exactly: Summary, Changes,
Test Plan, Risk/Rollback (plus the title line at the top). Do not invent a different structure
or omit a section — if a section doesn't apply, say so explicitly (e.g. "N/A — no e2e-relevant
flow touched") rather than dropping it.

## Procedure

1. Read `pr-template.md` in this same directory before drafting anything.
2. Inspect the actual diff (`git status`, `git diff`) rather than relying on conversation memory
   of what changed.
3. Fill in each section of the template from the real diff:
   - **Changes**: group by workspace (`apps/web`, `services/api`, `packages/shared`, `e2e`) per
     the repo's architecture map. Flag any `Card`/`ColumnId` shape change and confirm it was
     propagated through `packages/shared` → Prisma schema/migration → `apps/web`, per this
     repo's Definition of Done.
   - **Test Plan**: check off only what was actually run (`npm run typecheck`, `npm run test`,
     `npm run test:e2e`) — don't claim a check passed without having run it.
   - **Risk/Rollback**: this repo has no auth/ownership scoping, so note when a change affects
     globally-visible/mutable data; note whether a Prisma migration is included and whether it's
     reversible.
4. Output the filled-in template as the PR description. Keep the title under ~70 characters.
