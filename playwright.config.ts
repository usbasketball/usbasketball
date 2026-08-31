import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: "http://localhost:3100",
    headless: true,
  },
  projects: [
    {
      name: "mobile-chrome",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      },
    },
  ],
  // In CI, build and serve the production bundle for deterministic, fast
  // startup. Locally, use the dev server (matches `npm run dev`).
  webServer: process.env.CI
    ? {
        command: "npm run build && npm run start -- --port 3100",
        port: 3100,
        reuseExistingServer: false,
        timeout: 300_000,
      }
    : {
        command: "npm run dev -- --port 3100",
        port: 3100,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
