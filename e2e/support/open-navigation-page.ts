import type { Page } from "@playwright/test";
import { getNavigationReviewViewer } from "../../apps/web/tests/fixtures/get-navigation-review-viewer";

export async function openNavigationPage(
  page: Page,
  scenario = "fan"
): Promise<void> {
  const replies: Record<string, unknown> = {
    "/api/rpc/creators/get": null,
    "/api/rpc/creators/list": { items: [], nextCursor: null },
    "/api/rpc/viewer/get": getNavigationReviewViewer(scenario),
  };
  await page.route("**/api/rpc/**", async (route) => {
    const { pathname } = new URL(route.request().url());
    if (
      route.request().method() !== "POST" ||
      !Object.hasOwn(replies, pathname)
    ) {
      await route.fallback();
      return;
    }
    await route.fulfill({
      body: JSON.stringify({ json: replies[pathname] }),
      contentType: "application/json",
    });
  });
  await page.goto("/explore?q=fixture");
  await page.getByRole("searchbox", { name: "Buscar criadores" }).waitFor();
  await page
    .locator('aside a[aria-label="Minha conta"]')
    .waitFor({ state: "attached" });
}
