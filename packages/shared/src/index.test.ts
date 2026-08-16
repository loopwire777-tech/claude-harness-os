import { describe, expect, it } from "vitest";
import { CardSchema, CreateCardInput } from "./index";

describe("CardSchema", () => {
  it("accepts a valid card", () => {
    const result = CardSchema.safeParse({
      id: "1",
      title: "Test",
      columnId: "todo",
      completed: false,
      createdAt: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid columnId", () => {
    const result = CreateCardInput.safeParse({ title: "Test", columnId: "bogus" });
    expect(result.success).toBe(false);
  });
});
