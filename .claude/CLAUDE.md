# task-board

A minimal Kanban-style task board: one card list with three fixed columns
(`todo`, `in-progress`, `done`). npm workspaces monorepo, single Postgres/SQLite-backed
API, one React frontend, no auth.

## Tech stack

- **Frontend**: React 18 + Vite 5, plain `fetch` (no data-fetching library, no state manager)
- **API**: Express 4 + Prisma 5, validated with Zod 3
- **DB**: SQLite via Prisma (`services/api/prisma/dev.db`, gitignored)
- **Shared**: Zod schemas/types shared between web and api via `@task-board/shared`
- **Test**: Vitest 2 (unit), Playwright 1.46 (e2e)
- **Language**: TypeScript 5.5 everywhere, `strict: true`, ESM (`"type": "module"`)

## Architecture map

- `apps/web` — React app (`App.tsx` holds all UI state; `api.ts` is the only fetch layer). Vite dev server proxies `/api/*` → `http://localhost:3001/*`.
- `services/api` — Express server (`src/index.ts`, single file, all routes). Prisma schema + migrations + seed live in `services/api/prisma/`.
- `packages/shared` — Zod schemas (`CardSchema`, `CreateCardInput`, `MoveCardInput`, `ColumnId`) and inferred types. Both web and api import from here — this is the only source of truth for the `Card` shape and column ids.
- `e2e` — Playwright tests against the real dev servers (spins up both api and web via `webServer`, no mocking).
- No auth, no ORM abstraction beyond Prisma, no shared UI kit — everything is intentionally flat.

## Coding conventions

- Validate all API input with the Zod schemas from `@task-board/shared`; never hand-roll validation in `services/api`.
- `columnId` values are the literal strings `"todo" | "in-progress" | "done"` (`ColumnId` enum in `packages/shared`) — don't introduce new column ids without updating that enum, the seed data, and `App.tsx`'s `COLUMNS` array together.
- Card shape changes go in `packages/shared/src/index.ts` first, then flow out to the Prisma schema, API routes, and frontend — shared is upstream of both.
- Keep `apps/web/src/api.ts` as the only place that calls `fetch` — components consume it, they don't call `fetch` directly.
- No relative imports across workspace boundaries — always import via the package name (`@task-board/shared`, not `../../packages/shared/src`).

## Commands

Run from repo root unless noted.

- `npm run dev` — starts both `services/api` (port 3001) and `apps/web` (port 5173, proxies `/api`)
- `npm run typecheck` — `tsc --noEmit` in every workspace that defines it
- `npm run test` — Vitest, runs `packages/**/src/**/*.test.ts` and `services/**/src/**/*.test.ts`
- `npm run test:e2e` — Playwright, from `e2e/` (auto-starts api + web dev servers)
- `npm run db:reset` — `prisma migrate reset --force --skip-generate` then reseeds (`services/api/prisma/seed.ts`), run inside `services/api`

## Testing strategy

- **Unit** (Vitest): schema/logic tests colocated as `*.test.ts` next to source, currently only in `packages/shared`. Add unit tests here for anything Zod-schema or pure-logic shaped.
- **E2E** (Playwright): one full user flow per `e2e/tests/*.spec.ts`, driven through the real UI against real dev servers — no API mocking, no component-level testing. `test-results/` is Playwright's own output dir, gitignored.
- There is no API-level integration test layer today — route logic in `services/api/src/index.ts` is only covered by e2e.

## Git workflow

- Single `main`/`master` branch history so far — no branch-naming or PR convention established yet; follow whatever the human sets going forward.
- Never hand-edit `services/api/prisma/dev.db`, `services/api/prisma/migrations/*` output, or anything under `dist/` — these are generated. New schema changes go through `prisma migrate dev`.

## Security requirements

- `services/api/.env` holds `DATABASE_URL` — never commit it (already gitignored) and never print its contents.
- All request bodies must go through the Zod schemas in `@task-board/shared` before touching Prisma — this is the only input boundary in the system.
- No auth exists yet — do not assume any request is trusted or scoped to a user; every card is globally visible/mutable by design of the current scope.

## Definition of done

- `npm run typecheck` passes in every affected workspace.
- `npm run test` passes (add/update Vitest coverage for any changed Zod schema or logic in `packages/shared` or `services/api`).
- `npm run test:e2e` passes for any change touching the create/move/complete flow end-to-end.
- Any `Card`/`ColumnId` shape change is reflected consistently across `packages/shared`, `services/api/prisma/schema.prisma` (+ a real migration), and `apps/web`.
