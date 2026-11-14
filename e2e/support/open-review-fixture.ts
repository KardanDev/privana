// biome-ignore-all lint/performance/noAwaitInLoops: Stylesheets must retain the application's cascade order.
import type { Page } from "@playwright/test";
import { buildReviewFixture, type ReviewFixture } from "./build-review-fixture";

// Real components in a browser-only fixture; no production route or service calls.
export async function openReviewFixture(
  page: Page,
  kind: ReviewFixture
): Promise<void> {
  const bundle = await buildReviewFixture(kind);
  await page.goto("/login");
  const shell = await page.locator("html").evaluate((root) => ({
    classes: root.className,
    style: root.getAttribute("style") ?? "",
    styles: Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
      (link) => link.href
    ),
  }));
  await page.route("**/__component-review", (route) =>
    route.fulfill({
      body: '<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="control-review"></div></body></html>',
      contentType: "text/html",
    })
  );
  await page.goto("/__component-review");
  await page.locator("html").evaluate((root, classes) => {
    root.setAttribute("class", classes);
  }, shell.classes);
  await page
    .locator("html")
    .evaluate((root, style) => root.setAttribute("style", style), shell.style);
  for (const url of shell.styles) {
    await page.addStyleTag({ url });
  }
  await page.addScriptTag({ content: bundle });
  await page
    .getByRole("heading", {
      name: kind === "controls" ? "Controles em revisão" : "Estados em revisão",
    })
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
}
