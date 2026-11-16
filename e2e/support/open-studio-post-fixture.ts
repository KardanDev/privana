import type { Page } from "@playwright/test";
import { getNavigationReviewViewer } from "../../apps/web/tests/fixtures/get-navigation-review-viewer";
import { studioContextOverview } from "../../apps/web/tests/fixtures/studio-context-overview";
import { buildReviewFixture } from "./build-review-fixture";

export async function openStudioPostFixture(
  page: Page,
  dark = false,
  mode: "new" | "edit" | "context" | "PENDING" | "SUSPENDED" = "new"
): Promise<void> {
  const bundle = await buildReviewFixture("studio-posts");
  await page.route("**/api/rpc/viewer/get", (route) =>
    route.fulfill({
      body: JSON.stringify({
        json: getNavigationReviewViewer(
          mode === "PENDING" || mode === "SUSPENDED"
            ? mode.toLowerCase()
            : "active"
        ),
      }),
      contentType: "application/json",
    })
  );
  if (mode === "context") {
    await page.route("**/api/rpc/studio/overview", (route) =>
      route.fulfill({
        body: JSON.stringify({
          json: studioContextOverview,
        }),
        contentType: "application/json",
      })
    );
  }
  await page.route("**/studio-post-review.js", (route) =>
    route.fulfill({ body: bundle, contentType: "text/javascript" })
  );
  await page.route("**/__studio-post-review", (route) =>
    route.fulfill({
      body: `<!doctype html><html lang="pt-BR" class="${dark ? "dark" : ""}" style="color-scheme:${dark ? "dark" : "light"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/catalogue.css"></head><body><div id="studio-review" data-mode="${mode}"></div><script src="/studio-post-review.js" defer></script></body></html>`,
      contentType: "text/html",
      headers: {
        "Content-Security-Policy":
          "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
      },
    })
  );
  await page.goto("/__studio-post-review");
  await page
    .getByRole("heading", {
      name: mode === "context" ? "Meu estúdio" : "Publicações em revisão",
    })
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
}
