import type { Page } from "@playwright/test";
import { renderShellLinks } from "./render-shell-links";

export async function openShellLinksFixture(
  page: Page,
  {
    dark = false,
    operations = false,
    registration = true,
    scenario = "",
    flags = "",
  } = {}
): Promise<void> {
  const markup = await renderShellLinks(
    registration,
    operations,
    scenario,
    flags
  );
  await page.route("**/__shell-links", (route) =>
    route.fulfill({
      body: `<!doctype html><html lang="pt-BR" class="${dark ? "dark" : ""}" style="--brand-accent:#6d28d9;color-scheme:${dark ? "dark" : "light"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/catalogue.css"></head><body>${markup}</body></html>`,
      contentType: "text/html",
      headers: {
        "Content-Security-Policy":
          "default-src 'none'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
      },
    })
  );
  await page.goto("/__shell-links");
  await page.evaluate(() => document.fonts.ready);
}
