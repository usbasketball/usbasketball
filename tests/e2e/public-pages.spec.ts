import {test, expect} from "@playwright/test";

const PAGES = [
  {path: "/nl", heading: "U.S. Basketball", content: "text=If you can"},
  {path: "/nl/informatie", heading: "Informatie", content: "text=Teams"},
  {path: "/nl/aanmelden", heading: "Join US", content: "form"},
  {path: "/nl/help-us", heading: "Help US", content: "text=Bestuur"},
  {
    path: "/nl/privacy",
    heading: "Privacyverklaring",
    content: "text=Contactgegevens",
  },
  {path: "/en", heading: "U.S. Basketball", content: "text=If you can"},
  {path: "/en/informatie", heading: "About", content: "text=Teams"},
  {path: "/en/aanmelden", heading: "Join US", content: "form"},
  {path: "/en/help-us", heading: "Help US", content: "text=Board"},
  {
    path: "/en/privacy",
    heading: "Privacy Policy",
    content: "text=Contact details",
  },
];

for (const {path, heading, content} of PAGES) {
  test(`${path} renders without error`, async ({page}) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("footer").first()).toBeVisible();
    await expect(page.locator("main").getByText(heading).first()).toBeVisible();
    await expect(page.locator(content).first()).toBeVisible();
  });
}

test("/ redirects to a valid locale", async ({page}) => {
  await page.goto("/");
  expect(page.url()).toMatch(/\/(nl|en)(\/|$)/);
});
