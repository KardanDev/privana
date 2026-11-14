import { defineConfig } from "@playwright/test";
import { catalogueOrigin } from "./scripts/catalogue/catalogue-assets";

export default defineConfig({
  expect: { timeout: 10_000 },
  forbidOnly: true,
  outputDir: "./output/playwright/catalogue-results",
  projects: [
    { name: "desktop", use: { viewport: { height: 900, width: 1280 } } },
    {
      name: "tablet",
      use: {
        hasTouch: true,
        isMobile: true,
        viewport: { height: 1024, width: 768 },
      },
    },
    {
      name: "phone",
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
  testMatch: ["catalogue.spec.ts", "controls.spec.ts", "feedback.spec.ts"],
  timeout: 45_000,
  use: {
    baseURL: catalogueOrigin,
    browserName: "chromium",
    locale: "pt-BR",
    screenshot: "only-on-failure",
    serviceWorkers: "block",
    storageState: { cookies: [], origins: [] },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bun run ui:catalogue",
    reuseExistingServer: false,
    timeout: 60_000,
    url: catalogueOrigin,
  },
  workers: 1,
});
