import {test, expect} from "@playwright/test";

test.describe("Mobile navigation", () => {
  test.use({viewport: {width: 375, height: 667}});

  test.beforeEach(async ({page}) => {
    // Skip in projects that use a wide viewport (desktop/tablet projects run all
    // describes, but mobile nav only makes sense below the lg breakpoint 1024px)
    const vp = page.viewportSize();
    test.skip(
      !!vp && vp.width >= 1024,
      "mobile nav not rendered at this viewport",
    );
    await page.goto("/nl");
  });

  test("hamburger button is visible", async ({page}) => {
    await expect(page.getByRole("button", {name: "Open menu"})).toBeVisible();
  });

  test("desktop nav is hidden", async ({page}) => {
    await expect(page.locator(".hidden.lg\\:flex").first()).not.toBeVisible();
  });

  test("drawer opens when hamburger is clicked", async ({page}) => {
    await page.getByRole("button", {name: "Open menu"}).click();
    const drawer = page.getByRole("dialog", {name: "Navigation menu"});
    await expect(drawer).not.toHaveClass(/translate-x-full/);
    await expect(drawer.getByRole("link").first()).toBeVisible();
  });

  test("drawer closes when close button is clicked", async ({page}) => {
    await page.getByRole("button", {name: "Open menu"}).click();
    const drawer = page.getByRole("dialog", {name: "Navigation menu"});
    await expect(drawer).not.toHaveClass(/translate-x-full/);
    await page.getByRole("button", {name: "Close menu"}).click();
    await expect(drawer).toHaveClass(/translate-x-full/);
  });

  test("drawer closes when backdrop is clicked", async ({page}) => {
    await page.getByRole("button", {name: "Open menu"}).click();
    const drawer = page.getByRole("dialog", {name: "Navigation menu"});
    await expect(drawer).not.toHaveClass(/translate-x-full/);
    // Backdrop covers the left side; drawer is w-72 (288px) from the right
    await page.mouse.click(10, 300);
    await expect(drawer).toHaveClass(/translate-x-full/);
  });
});

test.describe("Desktop navigation", () => {
  test.use({viewport: {width: 1280, height: 800}});

  test.beforeEach(async ({page}) => {
    await page.goto("/nl");
  });

  test("desktop nav is visible", async ({page}) => {
    await expect(
      page.locator("header .hidden.lg\\:flex").first(),
    ).toBeVisible();
  });

  test("hamburger button is not visible", async ({page}) => {
    await expect(
      page.getByRole("button", {name: "Open menu"}),
    ).not.toBeVisible();
  });

  test("nav contains Informatie link", async ({page}) => {
    await expect(
      page.locator("header").getByRole("link", {name: "Informatie"}),
    ).toBeVisible();
  });
});
