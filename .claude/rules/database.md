---
paths: ["services/api/**"]
---

# Database

- Schema changes go through Prisma migrations; never edit the database directly.
- Never hand-edit generated migration files or the Prisma client.
- No raw SQL outside the repository layer.
- Every schema change ships with a real migration, not a manual `db push`.
- Keep the Prisma schema as the single source of truth for the data model.
