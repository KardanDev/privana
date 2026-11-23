import { defineConfig } from "@playwright/test";

const origin = "http://127.0.0.1:53472";
const next = "node apps/web/node_modules/next/dist/bin/next";
const fixture = "apps/web/tests/fixtures/studio-router";

export default defineConfig({
  forbidOnly: true,
  outputDir: "./output/playwright/studio-router-results",
  projects: [
    { name: "desktop", use: { viewport: { height: 900, width: 1280 } } },
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
  testMatch: "**/*.router.spec.ts",
  timeout: 60_000,
  use: {
    baseURL: origin,
    browserName: "chromium",
    locale: "pt-BR",
    screenshot: "only-on-failure",
    serviceWorkers: "block",
    storageState: { cookies: [], origins: [] },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `${next} build ${fixture} && ${next} start ${fixture} --hostname 127.0.0.1 --port 53472`,
    env: { NEXT_TELEMETRY_DISABLED: "1", NODE_ENV: "production" },
    reuseExistingServer: false,
    timeout: 120_000,
    url: origin,
  },
  workers: 1,
});
