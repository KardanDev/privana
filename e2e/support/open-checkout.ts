import { expect, type Page } from "@playwright/test";
import { assertNoHorizontalOverflow } from "./assert-no-horizontal-overflow";

export async function openCheckout(page: Page): Promise<void> {
  await page.goto("/checkout/demo");
  await expect(
    page.getByRole("heading", { level: 1, name: "Testar assinatura" })
  ).toBeVisible();
  await expect(page.getByLabel("Número de teste")).toBeVisible();
  await assertNoHorizontalOverflow(page);
}
