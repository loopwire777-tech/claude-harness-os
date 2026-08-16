import { test, expect } from "@playwright/test";

test("create a card, move it, and mark it complete", async ({ page }) => {
  const title = `Buy milk ${Date.now()}`;

  await page.goto("/");

  await page.getByPlaceholder("New card title").fill(title);
  await page.getByRole("button", { name: "Add card" }).click();

  const card = page.getByTestId("card").filter({ hasText: title });
  await expect(card).toBeVisible();

  await card.getByRole("combobox").selectOption("in-progress");
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: "Complete" }).click();
  await expect(card.locator("span")).toHaveCSS("text-decoration-line", "line-through");
});
