import { describe, expect, it } from "vitest";
import { CardSchema, CreateCardInput, IdParam } from "./index";

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

describe("IdParam", () => {
  it("accepts a normal id", () => {
    const result = IdParam.safeParse({ id: "clx0000000000000000000000" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty id", () => {
    const result = IdParam.safeParse({ id: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an oversized id", () => {
    const result = IdParam.safeParse({ id: "a".repeat(51) });
    expect(result.success).toBe(false);
  });
});
