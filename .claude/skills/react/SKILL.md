---
description: Use when building or modifying UI in apps/web for task-board - components, state, or data fetching in App.tsx and related files. HOW-TO procedure specific to this repo's React/Vite setup; for the layering rule itself (component -> hook -> service) see .claude/rules/architecture.md.
---

# React (apps/web)

1. **Locate where the change belongs**
   - All UI state currently lives in `apps/web/src/App.tsx`; all fetch calls live in `apps/web/src/api.ts`.
   - If the feature needs new state/effect logic distinct from a single component's rendering, extract it into a new hook file under `apps/web/src/` (e.g. `useCards.ts`) rather than growing `App.tsx` further — this is what "component -> hook -> service" in `architecture.md` means concretely here, since there is currently no hook layer.

2. **Add or change a data operation**
   - Add the fetch call to `apps/web/src/api.ts` only — never call `fetch` from a component or hook directly.
   - Type the function's params and return using `Card`/`ColumnId` (or new types) imported from `@task-board/shared`, never hand-rolled.
   - Point at the `/api` prefix (Vite proxies it to `services/api` per `apps/web/vite.config.ts`) — don't hardcode `http://localhost:3001`.

3. **Wire it into the component**
   - Call the `api.ts` function from `App.tsx` (or the relevant hook), update state with the returned value — see the existing pattern in `handleCreate`/`handleMove`/`handleComplete` in `App.tsx`: call the api function, then `setCards` with an updater function that maps/filters by `id`.
   - Give any new interactive element a `data-testid` if a Playwright spec will need to target it, matching the existing `data-testid="card"` convention.

4. **Column/status logic**
   - Never introduce a new column string ad hoc. If a new `ColumnId` value is needed, add it to `ColumnId` in `packages/shared/src/index.ts` first, then add it to the `COLUMNS` array in `App.tsx` and to the seed data in `services/api/prisma/seed.ts` in the same change.

5. **Run it**
   - `npm run dev` (starts both `apps/web` on 5173 and `services/api` on 3001) and exercise the change in the browser.
   - `npm run typecheck` in `apps/web` (or from root, which runs it in every workspace that defines it).
