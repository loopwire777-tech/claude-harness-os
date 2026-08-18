import { test, expect } from "@playwright/test";

test("create a card, move it, and mark it complete", async ({ page }) => {
  const title = `Buy milk ${Date.now()}`;

  await page.goto("/");

  await page.getByPlaceholder("New card title").fill(title);
  await page.getByRole("button", { name: "Add card" }).click();

  const card = page.getByTestId("card").filter({ hasText: title });
  await expect(card).toBeVisible();

  const createdAt = card.getByTestId("card-created-at");
  await expect(createdAt).toBeVisible();
  await expect(createdAt).toHaveText("just now");

  await card.getByRole("combobox").selectOption("in-progress");
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: "Complete" }).click();
  await expect(card.locator("span")).toHaveCSS("text-decoration-line", "line-through");
});

test("create a card and delete it", async ({ page }) => {
  const title = `Delete me ${Date.now()}`;

  await page.goto("/");

  await page.getByPlaceholder("New card title").fill(title);
  await page.getByRole("button", { name: "Add card" }).click();

  const card = page.getByTestId("card").filter({ hasText: title });
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: `Delete ${title}` }).click();
  await expect(card).not.toBeVisible();
});
