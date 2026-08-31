import { test, expect } from "@playwright/test";

const LOCALE = "en";

test.describe("Mobile navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/${LOCALE}`);
    await page.waitForLoadState("networkidle");
  });

  // The MobileNav button lives inside the sticky <header> (banner). The overlay
  // is portaled to <body> (so it's positioned against the viewport rather than
  // the transformed header), so target it as a direct <body> child.
  const overlay = (page: import("@playwright/test").Page) =>
    page.locator("body > div.fixed.inset-x-0");

  test("hamburger button opens the menu", async ({ page }) => {
    const hamburger = page.getByRole("banner").getByRole("button", { name: /open menu/i });
    await expect(hamburger).toBeVisible();

    await hamburger.click();

    const nav = overlay(page).getByRole("navigation");
    await expect(nav).toBeVisible();
    await expect(page.getByRole("button", { name: /close menu/i })).toBeVisible();
  });

  test("close button closes the menu", async ({ page }) => {
    const hamburger = page.getByRole("button", { name: /open menu/i });
    await hamburger.click();

    const closeBtn = page.getByRole("button", { name: /close menu/i });
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(page.getByRole("button", { name: /close menu/i })).not.toBeVisible();
    await expect(hamburger).toBeVisible();
  });

  test("overlay fills the viewport below the header", async ({ page }) => {
    const header = page.getByRole("banner");
    const headerBox = (await header.boundingBox())!;

    await page.getByRole("button", { name: /open menu/i }).click();

    const overlayBox = (await overlay(page).boundingBox())!;

    expect(overlayBox).toBeTruthy();
    // Overlay starts at/below the header (accounting for the header's 1px border)
    expect(overlayBox.y - (headerBox.y + headerBox.height)).toBeLessThanOrEqual(2);
    expect(overlayBox.y).toBeGreaterThanOrEqual(headerBox.y);
    // Overlay extends to the bottom of the viewport
    expect(overlayBox.y + overlayBox.height).toBeGreaterThanOrEqual(
      page.viewportSize()!.height - 2,
    );
    // Overlay spans the full width
    expect(overlayBox.x).toBe(0);
    expect(overlayBox.width).toBe(page.viewportSize()!.width);
  });

  test("CTA button is pinned to the bottom of the viewport", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();

    const cta = overlay(page).getByRole("link", { name: /join/i });
    await expect(cta).toBeVisible();

    const ctaBox = (await cta.boundingBox())!;
    const viewportHeight = page.viewportSize()!.height;
    expect(ctaBox).toBeTruthy();
    // CTA is pinned near the bottom of the viewport (the inner container has
    // py-6 bottom padding, so allow ~30px of breathing room)
    expect(ctaBox.y + ctaBox.height).toBeGreaterThanOrEqual(viewportHeight - 30);
  });

  test("all nav items are visible when menu is open", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();

    const nav = overlay(page).getByRole("navigation");
    const items = ["About", "Membership", "Training schedule", "Confidential counsellor", "Board & committees", "FAQ"];
    for (const item of items) {
      await expect(nav.getByRole("link", { name: item })).toBeVisible();
    }
  });

  test("clicking a nav item closes the menu", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();

    await overlay(page).getByRole("navigation").getByRole("link", { name: "About" }).click();

    await expect(page.getByRole("button", { name: /close menu/i })).not.toBeVisible();
    await expect(page.getByRole("button", { name: /open menu/i })).toBeVisible();
  });

  test("menu is hidden by default", async ({ page }) => {
    // Overlay uses opacity-0 + pointer-events-none when closed; it stays in the
    // DOM, so verify the computed opacity rather than visibility.
    await expect(overlay(page)).toHaveCSS("opacity", "0");
  });
});
