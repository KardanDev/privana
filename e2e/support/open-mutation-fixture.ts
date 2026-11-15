import type { Page } from "@playwright/test";
import { getNavigationReviewViewer } from "../../apps/web/tests/fixtures/get-navigation-review-viewer";
import { post } from "../../apps/web/tests/posts/social-fixtures";
import { buildReviewFixture } from "./build-review-fixture";

export async function openMutationFixture(
  page: Page,
  dark = false
): Promise<void> {
  const bundle = await buildReviewFixture("mutations");
  const reads: Record<string, unknown> = {
    "/api/rpc/feed/list": { items: [post], nextCursor: null },
    "/api/rpc/memberships/list": [],
    "/api/rpc/notifications/list": ["one", "two"].map((id) => ({
      body: "Novidade fictícia",
      createdAt: "2026-11-01T12:00:00.000Z",
      href: "/notifications",
      id,
      readAt: null,
      title: "Aviso de teste",
    })),
    "/api/rpc/settings/get": {
      emailNotifications: false,
      image: null,
      locale: "pt-BR",
      name: "Camila",
    },
    "/api/rpc/viewer/get": getNavigationReviewViewer("fan"),
  };
  await page.route("**/mutation-review.js", (route) =>
    route.fulfill({ body: bundle, contentType: "text/javascript" })
  );
  await page.route("**/api/rpc/**", async (route) => {
    const { pathname } = new URL(route.request().url());
    if (route.request().method() === "POST" && Object.hasOwn(reads, pathname)) {
      await route.fulfill({
        body: JSON.stringify({ json: reads[pathname] }),
        contentType: "application/json",
      });
      return;
    }
    await route.fallback();
  });
  await page.route("**/__mutation-review", (route) =>
    route.fulfill({
      body: `<!doctype html><html lang="pt-BR" class="${dark ? "dark" : ""}" style="color-scheme:${dark ? "dark" : "light"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/catalogue.css"></head><body><div id="mutation-review"></div><script src="/mutation-review.js" defer></script></body></html>`,
      contentType: "text/html",
      headers: {
        "Content-Security-Policy":
          "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
      },
    })
  );
  await page.goto("/__mutation-review");
  await page.getByRole("heading", { name: "Retornos em revisão" }).waitFor();
  await page
    .getByRole("button", { exact: true, name: "Curtir publicação" })
    .first()
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
}
