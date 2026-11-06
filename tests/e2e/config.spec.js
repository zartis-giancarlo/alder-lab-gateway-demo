import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("/api/reset");
});

test("N4 a limit change needs a second approver and leaves a history", async ({ page }) => {
  await page.goto("/config.html");
  await expect(page.getByTestId("live-limit")).toHaveText("25 %");

  await page.getByTestId("user").selectOption("BIO-A");
  await page.getByTestId("propose-limit").fill("30");
  await page.getByTestId("propose-reason").fill("Test value for the demo");
  await page.getByTestId("propose-button").click();
  await expect(page.getByTestId("pending")).toContainText("30 %");
  await expect(page.getByTestId("live-limit")).toHaveText("25 %");

  await page.getByTestId("user").selectOption("BIO-B");
  await page.getByTestId("approve-button").click();
  await expect(page.getByTestId("live-limit")).toHaveText("30 %");

  await page.getByTestId("tab-history").click();
  const row = page.getByTestId("history-row").first();
  await expect(row).toContainText("BIO-A");
  await expect(row).toContainText("BIO-B");
  await expect(row).toContainText("25 %");
  await expect(row).toContainText("30 %");
});
