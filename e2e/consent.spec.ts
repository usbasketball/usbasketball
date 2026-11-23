import { expect, test } from "@playwright/test";
// next-intl serialises every message into the page payload, so match the
// rendered element rather than the button text.
const BANNER = 'role="region" aria-label="Consent settings"';

import { CONSENT_COOKIE, createConsent, serializeConsent } from "../lib/consent";

// The banner must be decided by the server: it is in the first HTML response
// for visitors without a choice and absent for visitors who already chose.
test("banner is in the server-rendered HTML for new visitors", async ({ request }) => {
  const html = await (await request.get("/en")).text();
  expect(html).toContain(BANNER);
});

for (const analytics of [true, false]) {
  test(`no banner in the server HTML once analytics=${analytics} is stored`, async ({ request }) => {
    const value = serializeConsent(createConsent({ analytics }));
    const html = await (
      await request.get("/en", { headers: { cookie: `${CONSENT_COOKIE}=${value}` } })
    ).text();
    expect(html).not.toContain(BANNER);
  });
}

test("footer link reopens the banner and declining is saved", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "No thanks" }).click();
  await expect(page.getByRole("button", { name: "Yes, allow" })).toBeHidden();

  await page.getByRole("button", { name: "Cookie settings" }).click();
  await expect(page.getByText("Current choice: analytics declined.")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Yes, allow" })).toBeHidden();
});
