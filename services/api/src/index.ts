import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { CreateCardInput, IdParam, MoveCardInput } from "@task-board/shared";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get("/cards", async (_req, res) => {
  const cards = await prisma.card.findMany({ orderBy: { createdAt: "asc" } });
  res.json(cards);
});

app.post("/cards", async (req, res) => {
  const parsed = CreateCardInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const card = await prisma.card.create({ data: parsed.data });
  res.status(201).json(card);
});

app.patch("/cards/:id/move", async (req, res) => {
  const parsedId = IdParam.safeParse(req.params);
  if (!parsedId.success) {
    return res.status(400).json({ error: parsedId.error.flatten() });
  }
  const parsed = MoveCardInput.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const card = await prisma.card.update({
    where: { id: parsedId.data.id },
    data: { columnId: parsed.data.columnId },
  });
  res.json(card);
});

app.patch("/cards/:id/complete", async (req, res) => {
  const parsedId = IdParam.safeParse(req.params);
  if (!parsedId.success) {
    return res.status(400).json({ error: parsedId.error.flatten() });
  }
  const card = await prisma.card.update({
    where: { id: parsedId.data.id },
    data: { completed: true },
  });
  res.json(card);
});

app.delete("/cards/:id", async (req, res) => {
  const parsedId = IdParam.safeParse(req.params);
  if (!parsedId.success) {
    return res.status(400).json({ error: parsedId.error.flatten() });
  }
  try {
    await prisma.card.delete({ where: { id: parsedId.data.id } });
    res.status(204).end();
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ error: "card not found" });
    }
    throw err;
  }
});

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`api listening on http://localhost:${port}`);
});
