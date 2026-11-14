import { defineConfig } from "@playwright/test";
import { readBrowserTarget } from "./e2e/support/read-browser-target";

export default defineConfig({
  expect: { timeout: 15_000 },
  forbidOnly: true,
  fullyParallel: false,
  globalSetup: "./e2e/wait-for-local-app.ts",
  outputDir: "./output/playwright/results",
  projects: [
    {
      name: "desktop-chromium",
      use: { viewport: { height: 900, width: 1280 } },
    },
    {
      name: "tablet-chromium",
      use: {
        hasTouch: true,
        isMobile: true,
        viewport: { height: 1024, width: 768 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        hasTouch: true,
        isMobile: true,
        viewport: { height: 844, width: 390 },
      },
    },
  ],
  reporter: "list",
  retries: 0,
  testDir: "./e2e",
  testIgnore: ["catalogue.spec.ts", "shell-links.catalogue.spec.ts"],
  testMatch: "**/*.spec.ts",
  timeout: 60_000,
  use: {
    actionTimeout: 15_000,
    baseURL: readBrowserTarget(process.env),
    browserName: "chromium",
    locale: "pt-BR",
    navigationTimeout: 45_000,
    screenshot: "only-on-failure",
    serviceWorkers: "block",
    storageState: { cookies: [], origins: [] },
    trace: "retain-on-failure",
    video: "off",
  },
  workers: 1,
});
