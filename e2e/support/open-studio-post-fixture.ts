import type { Page } from "@playwright/test";
import { getNavigationReviewViewer } from "../../apps/web/tests/fixtures/get-navigation-review-viewer";
import { buildReviewFixture } from "./build-review-fixture";

export async function openStudioPostFixture(
  page: Page,
  dark = false,
  mode: "new" | "edit" | "PENDING" | "SUSPENDED" = "new"
): Promise<void> {
  const bundle = await buildReviewFixture("studio-posts");
  await page.route("**/api/rpc/viewer/get", (route) =>
    route.fulfill({
      body: JSON.stringify({
        json: getNavigationReviewViewer(
          mode === "new" || mode === "edit" ? "active" : mode.toLowerCase()
        ),
      }),
      contentType: "application/json",
    })
  );
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
  await page.getByRole("heading", { name: "Publicações em revisão" }).waitFor();
  await page.evaluate(() => document.fonts.ready);
}
