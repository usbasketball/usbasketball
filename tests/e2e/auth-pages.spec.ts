import {test, expect} from "@playwright/test";

const GATED_PAGES = [
  "/nl/trainingschema",
  "/nl/takenschema",
  "/nl/vergaderingen",
  "/nl/vertrouwenspersoon",
  "/en/trainingschema",
  "/en/takenschema",
  "/en/vergaderingen",
  "/en/vertrouwenspersoon",
];

for (const path of GATED_PAGES) {
  test(`${path} redirects to login when unauthenticated`, async ({page}) => {
    await page.goto(path, {waitUntil: "commit"});
    await page.waitForURL(/login/, {timeout: 10_000});
    expect(page.url()).toMatch(/login/);
  });
}
