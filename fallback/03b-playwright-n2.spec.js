import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("/api/reset");
});

test("N2 a change of +37.5 % is held and shown on the worklist", async ({ page }) => {
  await page.goto("/");
  const row = page.getByTestId("row-TEST-0002");
  await expect(row.getByTestId("badge")).toHaveText("Held");
  await expect(row.getByTestId("reason")).toContainText("larger than the limit");
  await expect(row.getByTestId("percent")).toHaveText("+37.5 %");
  await expect(row.getByTestId("previous")).toContainText("80");
});
