---
description: Use when building or modifying the backend in services/api for task-board - Express routes, Prisma queries, or the data model. HOW-TO procedure specific to this repo's Express/Prisma setup; for the layering rule itself (controller -> service -> repository) see .claude/rules/architecture.md.
---

# Node (services/api)

1. **Locate where the change belongs**
   - All routes currently live in a single file, `services/api/src/index.ts`, and call Prisma directly inline — there is no separate service/repository layer yet.
   - If the new logic is more than a thin parse-validate-call-respond, extract it: put the Prisma call in a repository function (e.g. `services/api/src/cards.repository.ts`) and any business logic in a service function that calls the repository — this is what "controller -> service -> repository" in `architecture.md` means concretely here, since today the route does all three jobs.

2. **Add or change a route**
   - Register it in `services/api/src/index.ts` alongside the existing `app.get`/`app.post`/`app.patch` calls, following the existing REST shape (`/cards`, `/cards/:id/move`, `/cards/:id/complete`).
   - Parse the body with `.safeParse()` using the matching schema from `@task-board/shared` (add a new schema there first if the input shape is new), and return `400` with `parsed.error.flatten()` on failure — match the exact pattern already used in the `POST /cards` and `PATCH /cards/:id/move` handlers.
   - Call Prisma (or the repository, once one exists) only after validation succeeds.

3. **Schema/model change**
   - Edit `packages/shared/src/index.ts` first (the Zod schema is the source of truth), then `services/api/prisma/schema.prisma` to match, then run `prisma migrate dev` inside `services/api` to generate a real migration — never hand-edit `services/api/prisma/migrations/*` or `dev.db`.
   - Update `services/api/prisma/seed.ts` if the change affects seed data shape.

4. **Run it**
   - `npm run dev --workspace services/api` to run the API alone on port 3001, or `npm run dev` from root for both api and web.
   - `npm run typecheck` in `services/api` (or from root).
   - Exercise new routes with `curl` against `http://localhost:3001` before wiring up the frontend, to isolate API-layer bugs from UI-layer bugs.
