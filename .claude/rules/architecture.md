# Architecture

- Web: component → hook → service → backend. Components render only; no fetch calls in components.
- API: controller → service → repository → db. Controllers parse/respond only; no Prisma calls in controllers.
- Business logic lives in the service layer, not in controllers, components, or hooks.
- Only the repository layer talks to the database.
- All schemas live in `packages/shared`; never redefine a schema elsewhere.
- Derive types from Zod schemas with `z.infer`; never hand-write a duplicate type.
- Import shared schemas/types by package name (`@task-board/shared`), never by relative path across workspaces.
