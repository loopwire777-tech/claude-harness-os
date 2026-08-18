---
description: Focused security pass over the current diff against this repo's security rules and guardrails
---

Run a security review of $ARGUMENTS (if empty, review the full working diff against the base branch), checking it against `.claude/rules/security.md` and every file under `.claude/rules/guardrails/`. Delegate to the `security-reviewer` agent for the actual read-only review; this command frames what it must check.

1. **Establish scope**
   - Get the diff. Prioritize anything touching `services/api`, `.env`, `prisma/`, or user input handling in `apps/web` — these are called out explicitly for proactive review.

2. **Check against the security rules**
   - Every input validated at the system boundary via `@task-board/shared` Zod schemas before touching Prisma — no hand-rolled validation in `services/api`.
   - No secrets, tokens, or `.env` contents logged or printed anywhere, including error messages and API responses.
   - No SQL or shell commands built via string concatenation with user input.
   - No raw SQL outside the repository layer (`.claude/rules/guardrails/database.md`).
   - Every card/resource is treated as globally accessible — flag any code that assumes a hidden trust boundary or per-user scoping that doesn't exist in this no-auth system.
   - Any new/changed dependency checked for known critical vulnerabilities.

3. **Check against the guardrails**
   - No destructive database commands, migrations edited by hand, or schema changes bypassing `prisma migrate dev`.
   - No new env vars introduced without flagging them to the user.
   - No dependency added or changed without stating the alternative considered, and never without explicit confirmation for version changes.
   - Nothing here deploys, publishes, or points at a production database/service.

4. **Report**
   - List findings most-severe first: file:line, the concrete exposure or violation, and what input/state would trigger it.
   - If nothing is found, say so explicitly rather than omitting the section — a clean pass is a valid, reportable outcome.
   - Do not attempt to fix findings automatically if they touch anything destructive, a migration, or a dependency change — surface them and get explicit confirmation first, per the guardrails.
