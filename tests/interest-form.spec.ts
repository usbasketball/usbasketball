import { test, expect } from "@playwright/test";

test.describe("interest form happy path", () => {
  test("submits the signup form successfully", async ({ page }) => {
    await page.goto("/en/signup");

    await expect(page.getByRole("heading", { name: "Interest form" })).toBeVisible();

    await page.getByLabel("Full name *").fill("Playwright Tester");
    await page.getByLabel("Email address *").fill("playwright.tester+happy@example.com");
    await page.getByLabel("Birth date *").fill("2000-01-15");
    await page.getByLabel("Last played level *").fill("Recreational");

    await page.getByRole("radio", { name: "Guard", exact: true }).check();
    await page
      .getByRole("radio", { name: "Training and playing matches", exact: true })
      .check();
    await page.getByRole("radio", { name: "Man", exact: true }).check();

    await page.getByLabel("More info about your background/level").fill("I enjoy structured training and competitive play.");

    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByRole("heading", { name: "Thanks for your interest!" })).toBeVisible();
    await expect(page.getByText("We hope to let you know within two weeks")).toBeVisible();
  });
});
