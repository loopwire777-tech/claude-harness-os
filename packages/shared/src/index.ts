import { z } from "zod";

export const ColumnId = z.enum(["todo", "in-progress", "done"]);
export type ColumnId = z.infer<typeof ColumnId>;

export const CardSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  columnId: ColumnId,
  completed: z.boolean(),
  createdAt: z.string(),
});
export type Card = z.infer<typeof CardSchema>;

export const CreateCardInput = z.object({
  title: z.string().min(1).max(200),
  columnId: ColumnId.default("todo"),
});
export type CreateCardInput = z.infer<typeof CreateCardInput>;

export const MoveCardInput = z.object({
  columnId: ColumnId,
});
export type MoveCardInput = z.infer<typeof MoveCardInput>;
