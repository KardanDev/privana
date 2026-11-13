// biome-ignore-all lint/performance/noAwaitInLoops: Stylesheets must retain the application's cascade order.
import type { Page } from "@playwright/test";
import { buildControlsFixture } from "./build-controls-fixture";

// Real components in a browser-only fixture; no production route or service calls.
export async function openControlsFixture(page: Page): Promise<void> {
  const bundle = await buildControlsFixture();
  await page.goto("/login");
  const shell = await page.locator("html").evaluate((root) => ({
    classes: root.className,
    styles: Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
      (link) => link.href
    ),
  }));
  await page.route("**/__controls-review", (route) =>
    route.fulfill({
      body: '<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="control-review"></div></body></html>',
      contentType: "text/html",
    })
  );
  await page.goto("/__controls-review");
  await page.locator("html").evaluate((root, classes) => {
    root.setAttribute("class", classes);
  }, shell.classes);
  for (const url of shell.styles) {
    await page.addStyleTag({ url });
  }
  await page.addScriptTag({ content: bundle });
  await page.getByRole("heading", { name: "Controles em revisão" }).waitFor();
  await page.evaluate(() => document.fonts.ready);
}
