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

test("card stays visible and shows an error when delete fails", async ({ page, context }) => {
  const title = `Keep me ${Date.now()}`;

  await page.goto("/");

  await page.getByPlaceholder("New card title").fill(title);
  await page.getByRole("button", { name: "Add card" }).click();

  const card = page.getByTestId("card").filter({ hasText: title });
  await expect(card).toBeVisible();

  // A second tab loads the same card into its own React state. Deleting it from
  // the first tab removes it from the real DB; the second tab's stale reference
  // then produces a genuine 404 from the API when it tries to delete it too -
  // no mocked network responses, just two clients racing the real server.
  const staleTab = await context.newPage();
  await staleTab.goto("/");
  const staleCard = staleTab.getByTestId("card").filter({ hasText: title });
  await expect(staleCard).toBeVisible();

  await card.getByRole("button", { name: `Delete ${title}` }).click();
  await expect(card).not.toBeVisible();

  await staleCard.getByRole("button", { name: `Delete ${title}` }).click();

  await expect(staleCard).toBeVisible();
  await expect(staleTab.getByRole("alert")).toHaveText("Failed to delete card. Please try again.");

  await staleTab.close();
});

test("card stays visible and shows an error when move fails on a deleted card", async ({
  page,
  context,
}) => {
  const title = `Move me ${Date.now()}`;

  await page.goto("/");

  await page.getByPlaceholder("New card title").fill(title);
  await page.getByRole("button", { name: "Add card" }).click();

  const card = page.getByTestId("card").filter({ hasText: title });
  await expect(card).toBeVisible();

  // Same real-race setup as the delete test above: a second tab holds a stale
  // reference to a card the first tab deletes from the real DB, so the move
  // request from the stale tab hits a genuine 404 - no mocked responses.
  const staleTab = await context.newPage();
  await staleTab.goto("/");
  const staleCard = staleTab.getByTestId("card").filter({ hasText: title });
  await expect(staleCard).toBeVisible();

  await card.getByRole("button", { name: `Delete ${title}` }).click();
  await expect(card).not.toBeVisible();

  await staleCard.getByRole("combobox").selectOption("in-progress");

  await expect(staleCard).toBeVisible();
  await expect(staleTab.getByRole("alert")).toHaveText("Failed to move card. Please try again.");

  await staleTab.close();
});

test("card stays visible and shows an error when complete fails on a deleted card", async ({
  page,
  context,
}) => {
  const title = `Complete me ${Date.now()}`;

  await page.goto("/");

  await page.getByPlaceholder("New card title").fill(title);
  await page.getByRole("button", { name: "Add card" }).click();

  const card = page.getByTestId("card").filter({ hasText: title });
  await expect(card).toBeVisible();

  const staleTab = await context.newPage();
  await staleTab.goto("/");
  const staleCard = staleTab.getByTestId("card").filter({ hasText: title });
  await expect(staleCard).toBeVisible();

  await card.getByRole("button", { name: `Delete ${title}` }).click();
  await expect(card).not.toBeVisible();

  await staleCard.getByRole("button", { name: "Complete", exact: true }).click();

  await expect(staleCard).toBeVisible();
  await expect(staleTab.getByRole("alert")).toHaveText(
    "Failed to complete card. Please try again."
  );

  await staleTab.close();
});
