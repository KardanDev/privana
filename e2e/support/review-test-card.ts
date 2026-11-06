import { expect, type Page } from "@playwright/test";

export async function reviewTestCard(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Preencher dados de teste" }).click();
  await expect(page.getByLabel("Número de teste")).toHaveValue(
    "4242 4242 4242 4242"
  );
  await page.getByRole("button", { name: "Revisar simulação" }).click();
  await expect(
    page.getByRole("heading", { name: "Revise a demonstração" })
  ).toBeVisible();
}
