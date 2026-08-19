import express from "express";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { CreateCardInput, IdParam, MoveCardInput } from "@task-board/shared";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

async function runOrNotFound<T>(res: Response, op: () => Promise<T>): Promise<T | undefined> {
  try {
    return await op();
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      res.status(404).json({ error: "card not found" });
      return undefined;
    }
    throw err;
  }
}

app.get(
  "/cards",
  asyncHandler(async (_req, res) => {
    const cards = await prisma.card.findMany({ orderBy: { createdAt: "asc" } });
    res.json(cards);
  })
);

app.post(
  "/cards",
  asyncHandler(async (req, res) => {
    const parsed = CreateCardInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const card = await prisma.card.create({ data: parsed.data });
    res.status(201).json(card);
  })
);

app.patch(
  "/cards/:id/move",
  asyncHandler(async (req, res) => {
    const parsedId = IdParam.safeParse(req.params);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.flatten() });
    }
    const parsed = MoveCardInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const card = await runOrNotFound(res, () =>
      prisma.card.update({
        where: { id: parsedId.data.id },
        data: { columnId: parsed.data.columnId },
      })
    );
    if (card === undefined) return;
    res.json(card);
  })
);

app.patch(
  "/cards/:id/complete",
  asyncHandler(async (req, res) => {
    const parsedId = IdParam.safeParse(req.params);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.flatten() });
    }
    const card = await runOrNotFound(res, () =>
      prisma.card.update({
        where: { id: parsedId.data.id },
        data: { completed: true },
      })
    );
    if (card === undefined) return;
    res.json(card);
  })
);

app.delete(
  "/cards/:id",
  asyncHandler(async (req, res) => {
    const parsedId = IdParam.safeParse(req.params);
    if (!parsedId.success) {
      return res.status(400).json({ error: parsedId.error.flatten() });
    }
    const deleted = await runOrNotFound(res, () =>
      prisma.card.delete({ where: { id: parsedId.data.id } })
    );
    if (deleted === undefined) return;
    res.status(204).end();
  })
);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`api listening on http://localhost:${port}`);
});
