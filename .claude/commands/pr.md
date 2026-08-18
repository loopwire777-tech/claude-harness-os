---
description: Produce a consistently-structured PR description (title, summary, test plan) for the current diff
---

Produce a PR description for the current diff against the base branch ($ARGUMENTS if the user names a specific base/branch/commit range).

1. **Gather the diff**
   - `git status`, `git diff` against the merge base (or the range in `$ARGUMENTS`), and `git log` on this branch for prior commit message style.
   - If there's nothing staged or committed beyond the base branch, say so and stop rather than fabricating a description.

2. **Identify scope**
   - List which workspaces are touched (`packages/shared`, `services/api`, `apps/web`, `e2e`) and whether the `Card`/`ColumnId` shape changed.
   - Note if this required a real Prisma migration (never a hand-edited one).

3. **Write the description** with exactly these sections:
   - **Title**: under 70 characters, imperative mood, states what changed.
   - **Summary**: 1-3 bullet points on *why* this change exists, not a restatement of the diff. Pull motivation from the conversation/task context if available.
   - **Test plan**: a markdown checklist reflecting the actual verification done, drawn from this repo's Definition of Done:
     - [ ] `npm run typecheck` passes in every affected workspace
     - [ ] `npm run test` passes (unit coverage added/updated for any changed schema or logic)
     - [ ] `npm run test:e2e` passes (if the change touches create/move/complete)
     - [ ] Manual exercise via `npm run dev`, if applicable
     - Only include checklist items relevant to what actually changed — don't pad with steps that don't apply to this diff.

4. **Flag anything the PR should call out explicitly**
   - Any new dependency and the alternative considered.
   - Any schema/shape change and everywhere it propagated (`packages/shared` -> `prisma/schema.prisma` + migration -> API -> web).
   - Any known limitation or follow-up left out of scope.

5. **Do not open or push the PR yourself** unless the user explicitly asks — this command only produces the description text. Creating, pushing, or merging a PR still requires the user's explicit go-ahead per this project's confirmation rules.
