import { test, expect } from "@playwright/test";

test.describe("interest form turnstile checks", () => {
  test("submits successfully with a valid turnstile token", async ({ page }) => {
    await page.addInitScript(() => {
      window.turnstile = {
        render: (_container: HTMLElement, options: Record<string, unknown>) => {
          const callback = options.callback as ((token: string) => void) | undefined;
          callback?.("fake-turnstile-token");
          return "fake-widget-id";
        },
        reset: () => undefined,
        remove: () => undefined,
      };
    });

    await page.route("https://challenges.cloudflare.com/turnstile/v0/siteverify", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          action: "interest_form",
          hostname: "127.0.0.1",
        }),
      });
    });

    await page.goto("/en/signup");

    await expect(
      page.getByRole("heading", { name: "Interest form" })
    ).toBeVisible();

    await page.getByLabel("Full name *").fill("Playwright Tester");
    await page
      .getByLabel("Email address *")
      .fill("playwright.tester+happy@example.com");
    await page.getByLabel("Birth date *").fill("2000-01-15");
    await page.getByLabel("Last played level *").fill("Recreational");

    await page.getByRole("radio", { name: "Guard", exact: true }).check();
    await page
      .getByRole("radio", { name: "Training and playing matches", exact: true })
      .check();
    await page.getByRole("radio", { name: "Man", exact: true }).check();

    await page
      .getByLabel("More info about your background/level")
      .fill("I enjoy structured training and competitive play.");

    await page.getByRole("button", { name: "Send" }).click();

    await expect(
      page.getByRole("heading", { name: "Thanks for your interest!" })
    ).toBeVisible();
    await expect(
      page.getByText("We hope to let you know within two weeks")
    ).toBeVisible();
  });

  test("shows a captcha error when Turnstile verification fails", async ({ page }) => {
    await page.addInitScript(() => {
      window.turnstile = {
        render: (_container: HTMLElement, options: Record<string, unknown>) => {
          const callback = options.callback as ((token: string) => void) | undefined;
          callback?.("fake-turnstile-token");
          return "fake-widget-id";
        },
        reset: () => undefined,
        remove: () => undefined,
      };
    });

    await page.route("https://challenges.cloudflare.com/turnstile/v0/siteverify", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          action: "interest_form",
          hostname: "127.0.0.1",
        }),
      });
    });

    await page.goto("/en/signup");

    await page.getByLabel("Full name *").fill("Playwright Tester");
    await page.getByLabel("Email address *").fill("playwright.tester+invalid@example.com");
    await page.getByLabel("Birth date *").fill("2000-01-15");
    await page.getByLabel("Last played level *").fill("Recreational");

    await page.getByRole("radio", { name: "Guard", exact: true }).check();
    await page
      .getByRole("radio", { name: "Training and playing matches", exact: true })
      .check();
    await page.getByRole("radio", { name: "Man", exact: true }).check();

    await page
      .getByLabel("More info about your background/level")
      .fill("I enjoy structured training and competitive play.");

    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText("We couldn't confirm you're not a robot.")).toBeVisible();
  });
});
