import type { Page } from "@playwright/test";
import { getNavigationReviewViewer } from "../../apps/web/tests/fixtures/get-navigation-review-viewer";
import { buildReviewFixture } from "./build-review-fixture";

export async function openMessageFixture(
  page: Page,
  dark = false
): Promise<void> {
  const bundle = await buildReviewFixture("messages");
  await page.route("**/message-review.js", (route) =>
    route.fulfill({ body: bundle, contentType: "text/javascript" })
  );
  await page.route("**/api/rpc/**", async (route) => {
    const { pathname } = new URL(route.request().url());
    if (
      route.request().method() === "POST" &&
      ["/api/rpc/viewer/get", "/api/rpc/messages/get"].includes(pathname)
    ) {
      await route.fulfill({
        body: JSON.stringify({
          json: pathname.endsWith("viewer/get")
            ? getNavigationReviewViewer("fan")
            : [],
        }),
        contentType: "application/json",
      });
      return;
    }
    await route.fallback();
  });
  await page.route("**/__message-review", (route) =>
    route.fulfill({
      body: `<!doctype html><html lang="pt-BR" class="${dark ? "dark" : ""}" style="color-scheme:${dark ? "dark" : "light"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/catalogue.css"></head><body><div id="message-review"></div><script src="/message-review.js" defer></script></body></html>`,
      contentType: "text/html",
      headers: {
        "Content-Security-Policy":
          "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
      },
    })
  );
  await page.goto("/__message-review");
  await page.getByRole("heading", { name: "Mensagens em revisão" }).waitFor();
  await page.evaluate(() => document.fonts.ready);
}
