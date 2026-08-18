# Business Rules

- A "card" is a single task with a title, a column, and a completion flag — there is no description, due date, assignee, priority, or label field anywhere in the schema.
- `title` is required, 1-200 characters (`CardSchema`/`CreateCardInput` in `packages/shared/src/index.ts`). No other field constraints exist.
- A card belongs to exactly one column at a time: `"todo" | "in-progress" | "done"` (`ColumnId`). These three are the entire set — no sub-statuses, no swimlanes, no per-user columns.
- New cards default to the `"todo"` column when `columnId` is omitted (`CreateCardInput`), but `App.tsx` always passes `"todo"` explicitly on create — there is no UI path to create directly into another column.
- `completed` is a boolean, not a column. A card can be completed while sitting in any column (there's no rule tying `completed: true` to the `"done"` column, and the API never enforces one).
- Completion is one-way from the API's perspective: `PATCH /cards/:id/complete` only ever sets `completed: true` — there is no endpoint to un-complete a card. The `App.tsx` UI hides the "Complete" button once a card is completed, reflecting this as a one-way action in practice.
- Cards are ordered by `createdAt` ascending on fetch (`GET /cards`) — the board always renders in creation order, there is no manual reordering/drag-and-drop.
- There is no auth and no ownership: every card is globally visible and mutable by any client, by design of the current scope (per `.claude/rules/guardrails/`).
- `id` is a Prisma-generated `cuid()` — never client-supplied.
