# Repository Map

- `apps/web/src/App.tsx` — all UI state and rendering for the board (single component, no sub-components yet).
- `apps/web/src/api.ts` — the only `fetch` layer; wraps the four API endpoints.
- `apps/web/src/main.tsx` — React entry point, mounts `App`.
- `apps/web/vite.config.ts` — Vite dev server config, proxies `/api/*` to `http://localhost:3001`.
- `services/api/src/index.ts` — single-file Express server: all routes, validation, and Prisma calls currently live here together.
- `services/api/prisma/schema.prisma` — the `Card` data model (source of truth for the DB shape).
- `services/api/prisma/migrations/` — generated migration history; `20260816110424_init` is the initial migration.
- `services/api/prisma/seed.ts` — seed script for `npm run db:reset`.
- `services/api/.env` — holds `DATABASE_URL`, gitignored.
- `packages/shared/src/index.ts` — `ColumnId`, `CardSchema`, `CreateCardInput`, `MoveCardInput` — the only source of truth for the `Card` shape and column ids.
- `packages/shared/src/index.test.ts` — Vitest coverage for the shared schemas.
- `e2e/tests/task-board.spec.ts` — Playwright e2e spec(s) driving the real UI against real dev servers.
- `e2e/playwright.config.ts` — spins up both api and web via `webServer` for e2e runs.
