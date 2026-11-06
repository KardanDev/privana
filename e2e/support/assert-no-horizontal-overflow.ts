import { expect, type Page } from "@playwright/test";

export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  expect(
    overflow,
    "The checkout must fit the selected viewport."
  ).toBeLessThanOrEqual(1);
}
