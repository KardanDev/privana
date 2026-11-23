import { expect } from "@playwright/test";
import { test } from "./fixtures/studio-router-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";

test("Studio shared links navigate in the same Next document", async ({
  page,
}, testInfo) => {
  await page.goto("/studio");
  await expect(
    page.getByRole("heading", { name: "Meu estúdio" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Editar Light" }).click();
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue("Light");
  await expect(
    page.getByRole("link", { name: "Comunicado fictício" })
  ).toHaveAttribute("href", "/pages/fixture-news");
  await expect(
    page.getByRole("link", { name: "Ajuda fictícia" })
  ).toHaveAttribute("href", "/pages/fixture-help");
  await expect(
    page.getByRole("link", { name: "Link externo fictício" })
  ).toHaveAttribute("href", "https://example.invalid/fixture");

  const nav = page.getByRole("navigation", { name: "Navegação principal" });
  const explore = nav.getByRole("link", { exact: true, name: "Explorar" });
  await expect(explore).toHaveAttribute("href", "/explore");
  await assertNoHorizontalOverflow(page);
  await captureNavigationFrame(page, testInfo, "studio-router-baseline");
  const documentTime = await page.evaluate(() => performance.timeOrigin);
  if (testInfo.project.name === "phone") {
    await explore.tap();
  } else {
    await explore.press("Enter");
  }
  await expect(page).toHaveURL(new URL("/explore", page.url()).href);
  await expect(
    page.getByRole("heading", { name: "Destino fictício" })
  ).toBeVisible();
  await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentTime);
});

test.describe("suspended creator", () => {
  test.use({ creatorScenario: "suspended" });

  test("Studio renders the real restricted state with no editor", async ({
    page,
  }) => {
    await page.goto("/studio");
    await expect(
      page.getByRole("heading", { name: "Perfil suspenso" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Nova publicação" })
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Editar Light" })
    ).toBeDisabled();
    await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
  });
});
