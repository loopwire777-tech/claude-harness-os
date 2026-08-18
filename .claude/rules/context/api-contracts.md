# API Contracts

All routes are defined in `services/api/src/index.ts` and mounted at `/cards` (proxied through the web dev server as `/api/cards`). Validation uses the schemas in `packages/shared/src/index.ts`.

## `GET /cards`
- No input.
- Returns all cards, ordered by `createdAt` ascending.
- Response: `Card[]`.

## `POST /cards`
- Body validated against `CreateCardInput`: `{ title: string (1-200 chars), columnId?: ColumnId (defaults to "todo") }`.
- On validation failure: `400` with `{ error: <zod flattened error> }`.
- On success: `201` with the created `Card`.

## `PATCH /cards/:id/move`
- Body validated against `MoveCardInput`: `{ columnId: ColumnId }`.
- On validation failure: `400` with `{ error: <zod flattened error> }`.
- On success: `200` with the updated `Card`.
- No existence check before update — a nonexistent `id` currently throws a Prisma error rather than returning `404`.

## `PATCH /cards/:id/complete`
- No body.
- Sets `completed: true` unconditionally (no toggle, no undo endpoint).
- On success: `200` with the updated `Card`.
- No existence check before update — a nonexistent `id` currently throws a Prisma error rather than returning `404`.

## Shared types (`@task-board/shared`)
- `ColumnId`: `"todo" | "in-progress" | "done"`.
- `Card`: `{ id: string, title: string, columnId: ColumnId, completed: boolean, createdAt: string }`.
- `CreateCardInput`: `{ title: string, columnId: ColumnId }` (`columnId` defaults to `"todo"`).
- `MoveCardInput`: `{ columnId: ColumnId }`.
