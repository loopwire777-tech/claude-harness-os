# The Full Claude Harness OS

A real Claude Code harness, built layer by layer, on a real repo, across a 6-part YouTube
series. Every commit here is real — no staged demos, no cuts around gaps. This README
documents what's actually in `.claude/` and why, so you can copy any piece of it into your
own project.

**Watch the series:** [The Full Claude Harness OS (6 parts)](https://www.youtube.com/playlist?list=PLSpQpO5wjfzI)

| Part | Topic | Video |
|---|---|---|
| 1 | Foundation — CLAUDE.md, rules, guardrails | [Watch](https://www.youtube.com/watch?v=u6xTyZVvvUk) |
| 2 | Capabilities — skills, subagents | [Watch](https://www.youtube.com/watch?v=b17Xuhn7G4M) |
| 3 | Developer Control — commands, context, templates | [Watch](https://www.youtube.com/watch?v=qVQxAxK9YT8) |
| 4 | Enforcement — hooks | [Watch](https://www.youtube.com/watch?v=AGOxMM9FvxM) |
| 5 | One Feature, Every Layer | [Watch](https://www.youtube.com/watch?v=pugvbcnepWk) |
| 6 | The Full Lifecycle Finale | [Watch](https://www.youtube.com/watch?v=DIZSC_V78m4) |

---

## What this repo is

`task-board` — a minimal Kanban-style task board. One card list, three fixed columns
(`todo`, `in-progress`, `done`). npm workspaces monorepo:

- `apps/web` — React 18 + Vite 5, plain `fetch`, no state manager
- `services/api` — Express 4 + Prisma 5, validated with Zod 3, SQLite
- `packages/shared` — Zod schemas (`CardSchema`, `CreateCardInput`, `MoveCardInput`,
  `ColumnId`) — the single source of truth for the `Card` shape, imported by both `apps/web`
  and `services/api`
- `e2e` — Playwright, driven against real dev servers, no API mocking

The app itself is intentionally simple. It exists to give the harness something real to work
on — every feature, bug, and refactor referenced below happened on this exact codebase.

```
npm install
npm run dev          # api on :3001, web on :5173 (proxies /api)
npm run typecheck
npm run test         # Vitest
npm run test:e2e     # Playwright, auto-starts both dev servers
npm run db:reset     # prisma migrate reset --force + reseed (blocked by a hook — see below)
```

---

## The `.claude/` directory, explained

Everything below is what's *actually* in this repo's `.claude/` folder — not a theoretical
list. Nine things are natively recognized by Claude Code; everything else you've seen in
other "harness" writeups (`guardrails/`, `context/`, `templates/` as top-level folders) is
**not** a real Claude Code feature. Those ideas are real, they just live nested inside one of
the nine below.

```
.claude/
├── CLAUDE.md              # boot config — always loaded every session
├── rules/                 # path-scoped instructions (see below)
│   ├── architecture.md, coding.md, git.md, security.md, performance.md   (always loaded)
│   ├── testing.md, accessibility.md, api.md, database.md                 (paths:-scoped)
│   ├── guardrails/        # subdirectory — NOT a separate top-level feature
│   │   ├── never-do.md, destructive-operations.md, secrets.md
│   │   └── production.md, dependencies.md, database.md
│   └── context/           # also a subdirectory, not its own top-level layer
│       ├── repository-map.md, api-contracts.md, business-rules.md
├── skills/                # loaded on relevance, not always-on
│   ├── feature-development/SKILL.md
│   ├── debugging/SKILL.md
│   ├── code-review/SKILL.md
│   ├── refactoring/SKILL.md
│   ├── react/SKILL.md, node/SKILL.md, playwright/SKILL.md
│   └── pr-prep/SKILL.md + pr-template.md   ← templates live INSIDE a skill, not top-level
├── agents/                # subagents — real tools/model frontmatter
│   ├── architect.md, code-reviewer.md, security-reviewer.md
│   ├── performance-reviewer.md, test-engineer.md
│   └── react-expert.md, node-expert.md, playwright-expert.md
├── commands/               # slash commands
│   ├── feature.md, bugfix.md, debug.md, test.md
│   ├── review.md, refactor.md, e2e.md, security.md, pr.md
├── hooks/
│   └── block-db-reset.sh   # real PreToolUse hook, see below
└── settings.json           # wires the hook to Bash tool calls
```

### CLAUDE.md — boot config, 64 lines

Loaded at the start of every session. Contains only what's true about *this* repo: real tech
stack, real ports, real architecture map, real commands, real conventions. Anthropic's own
guidance is to keep this under 200 lines — every line taxes every session. See it in full:
[`.claude/CLAUDE.md`](.claude/CLAUDE.md).

### rules/ — path-scoped instructions, not one giant file

Five rules load always (architecture, coding, git, security, performance). Four load only
when Claude touches matching files, via `paths:` glob frontmatter (testing, accessibility,
api, database) — so a React accessibility rule never taxes a backend-only session.

`rules/guardrails/` and `rules/context/` are both **subdirectories of `rules/`**, not
separate Claude Code features. Claude Code auto-discovers rule subdirectories recursively —
no special config needed. This repo proved that live in
[Part 1](https://www.youtube.com/watch?v=u6xTyZVvvUk): reading a frontend file loaded
`accessibility.md`; reading a backend file didn't, but loaded `api.md`/`database.md` instead
— same mechanism, same file, verified via the raw `InstructionsLoaded` hook log, not just
`/context`'s aggregate token count.

### skills/ — loaded on relevance, templates live inside them

A skill's `name`/`description` (~100 tokens) sit in context by default; the full `SKILL.md`
body loads only once Claude decides it's relevant to the current task. `pr-prep/`'s bundled
`pr-template.md` is the concrete answer to "where do templates go" — not a top-level
`templates/` folder, but a file referenced on demand from inside the skill that uses it. See
[Part 2](https://www.youtube.com/watch?v=b17Xuhn7G4M) and
[Part 3](https://www.youtube.com/watch?v=qVQxAxK9YT8).

### agents/ — subagents, explicitly invoked, not auto-chained

Eight subagents, each scoped with real `tools`/`model` frontmatter (e.g.
`performance-reviewer` runs on a cheaper model tier; `architect`/`code-reviewer` need more
reasoning). The mechanic that matters: subagents report back to the main session only — they
don't message each other, and there's no automatic multi-agent fan-out. A real 3-specialist
review in this repo required inviting each specialist one at a time, in sequence — proven in
[Part 2](https://www.youtube.com/watch?v=b17Xuhn7G4M) and used again for real in
[Part 6](https://www.youtube.com/watch?v=DIZSC_V78m4), where a test-engineer subagent caught
a bug the other two review passes missed entirely.

### commands/ — slash commands as workflows

Nine commands (`/feature`, `/bugfix`, `/debug`, `/test`, `/review`, `/refactor`, `/e2e`,
`/security`, `/pr`), each a markdown file describing a repeatable workflow. `/pr` is the one
worth reading first — it's what produced this repo's actual merged pull requests. See
[Part 3](https://www.youtube.com/watch?v=qVQxAxK9YT8).

### hooks/ — the enforcement layer

The only layer in this repo that isn't advice. Everything else (CLAUDE.md, rules, skills,
agents, commands) is something Claude reads and generally follows — a hook is something the
harness *executes*, regardless of whether the model "remembers" to do the right thing.

This repo's real hook, [`.claude/hooks/block-db-reset.sh`](.claude/hooks/block-db-reset.sh),
wired up in [`.claude/settings.json`](.claude/settings.json) as a `PreToolUse` matcher on the
`Bash` tool:

```bash
if echo "$command" | grep -Eq 'migrate[[:space:]]+reset|db:reset'; then
  echo "BLOCKED: ..." >&2
  exit 2
fi
```

It hard-blocks `prisma migrate reset` and `npm run db:reset` — mid-turn, even after Claude has
already decided to run the command. Demonstrated live in
[Part 4](https://www.youtube.com/watch?v=AGOxMM9FvxM).

This repo also has a real **git pre-commit hook** (`.git/hooks/pre-commit`, not
version-controlled by git itself — see note below) that scans staged changes for a literal
`.env` file or added lines matching `DATABASE_URL=` / common API-key shapes, and refuses the
commit if it finds one. Worth knowing: **Claude Code hooks and git hooks are two completely
separate systems.** Claude Code has no native git-lifecycle event — the only way it reacts to
`git commit` at all is by string-matching the generic `Bash` tool's command text. They
co-occur in this repo; they don't call each other.

> Note: `.git/hooks/` isn't tracked by git itself (that's a git limitation, not a Claude Code
> one) — if you clone this repo, the pre-commit script won't come with it automatically. See
> [Part 4](https://www.youtube.com/watch?v=AGOxMM9FvxM) for the full script if you want to
> port it into your own `.git/hooks/pre-commit`.

---

## The six episodes, mapped to what's in this repo right now

- **Part 1 — Foundation:** `CLAUDE.md` + the 9-file `rules/` layer + `rules/guardrails/`,
  built from a genuinely empty repo, then the same feature prompt run once bare and once
  harnessed.
- **Part 2 — Capabilities:** all 7 `skills/` + all 8 `agents/`, plus a real sequential
  3-specialist review.
- **Part 3 — Developer Control:** all 9 `commands/`, including `/pr` producing this repo's
  first real merged PR, plus the `rules/context/` and skill-bundled-template corrections.
- **Part 4 — Enforcement:** `hooks/block-db-reset.sh` + the git pre-commit secret scan.
- **Part 5 — One Feature, Every Layer:** the delete-card feature (see `apps/web/src/App.tsx`,
  `services/api/src/index.ts`'s `DELETE /cards/:id` route) — built via a single `/feature`
  command with every layer above firing together, unedited.
- **Part 6 — The Full Lifecycle Finale:** that same delete-card feature run through
  `/debug` → `/test` → security review → `/review` → `/refactor` → `/pr`, unattended, ending
  in a real merged PR with a real bug caught along the way.

---

## Using this as a starting point

Every file under `.claude/` here is real and working — not illustrative pseudo-code. If
you're setting up your own harness:

1. Start with `CLAUDE.md` — repo-specific facts only, under 200 lines.
2. Split anything that shouldn't load every session into `rules/*.md` with `paths:`
   frontmatter.
3. Nest guardrails/context content inside `rules/` subdirectories — don't invent new
   top-level folders, Claude Code won't auto-discover them.
4. Add skills for repeatable multi-step workflows, agents for specialized review passes you
   want to invoke explicitly.
5. Add hooks last, and only for things that must be *enforced*, not just followed — a hook is
   a bigger commitment than a rule, since it runs unconditionally.

Questions, corrections, or your own harness setup to compare notes on — open an issue or drop
a comment on any of the videos above.
