import { test as base, expect } from "@playwright/test";
import { getNavigationReviewViewer } from "../../apps/web/tests/fixtures/get-navigation-review-viewer";
import { studioContextOverview } from "../../apps/web/tests/fixtures/studio-context-overview";
import { studioRouterPlatformConfig } from "../../apps/web/tests/fixtures/studio-router/fixture-platform-config";

type CreatorScenario = "active" | "suspended";

export const test = base.extend<{
  creatorScenario: CreatorScenario;
  studioRouterIsolation: undefined;
}>({
  creatorScenario: ["active", { option: true }],
  studioRouterIsolation: [
    async ({ baseURL, context, creatorScenario, page }, use) => {
      if (!baseURL || new URL(baseURL).hostname !== "127.0.0.1") {
        throw new Error(
          "The Studio router fixture requires a loopback origin."
        );
      }
      const blocked: string[] = [];
      const errors: string[] = [];
      const replies = new Map<string, unknown>([
        ["/api/rpc/platform/get", studioRouterPlatformConfig],
        ["/api/rpc/viewer/get", getNavigationReviewViewer(creatorScenario)],
        [
          "/api/rpc/studio/overview",
          {
            ...studioContextOverview,
            profile: {
              ...studioContextOverview.profile,
              status: creatorScenario.toUpperCase(),
            },
          },
        ],
      ]);
      await context.route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        const method = request.method();
        if (url.origin === baseURL) {
          if (method === "POST" && replies.has(url.pathname)) {
            await route.fulfill({ json: { json: replies.get(url.pathname) } });
            return;
          }
          const isAPI =
            url.pathname === "/api" || url.pathname.startsWith("/api/");
          if (method === "GET" && !isAPI) {
            await route.continue();
            return;
          }
        }
        blocked.push(`${method} ${url.origin}${url.pathname}`);
        await route.abort("blockedbyclient");
      });
      const collectError = (error: Error) => errors.push(error.message);
      page.on("pageerror", collectError);
      await use(undefined);
      page.off("pageerror", collectError);
      expect(blocked, "Unexpected fixture network requests").toEqual([]);
      expect(errors, "Unexpected fixture runtime errors").toEqual([]);
    },
    { auto: true },
  ],
});
