import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { openReviewFixture } from "./support/open-review-fixture";

const MENU_NAME = "Opções da publicação de exemplo";
const PREVIEW =
  "Ver prévia com o nome completo e as preferências de privacidade";
const TOOLTIP = "Exemplos locais; nenhuma ação altera contas ou pagamentos.";

for (const dark of [false, true]) {
  test(`${dark ? "dark" : "light"}: named menus support keyboard selection, disabled items and Escape focus return`, async ({
    baseURL,
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openReviewFixture(page, "feedback", baseURL);
    const activeTransitions = await page
      .locator("html")
      .evaluate((root, enabled) => {
        root.classList.toggle("dark", enabled);
        return document
          .getAnimations()
          .filter((animation) => animation instanceof CSSTransition).length;
      }, dark);
    expect(activeTransitions).toBe(0);
    const trigger = page.getByRole("button", { name: MENU_NAME });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    const menu = page.getByRole("menu", { name: MENU_NAME });
    await expect(menu).toBeVisible();
    if ((page.viewportSize()?.width ?? 0) < 640) {
      const target = await page
        .getByRole("menuitem", { name: PREVIEW })
        .boundingBox();
      expect(target?.height).toBeGreaterThanOrEqual(44);
    }
    await assertNoHorizontalOverflow(page);
    await expect(page.getByRole("menuitem", { name: PREVIEW })).toBeFocused();
    await expect(
      page.getByRole("menuitem", {
        name: "Publicar em produção (indisponível no exemplo)",
      })
    ).toHaveAttribute("aria-disabled", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.getByRole("menuitem", { name: PREVIEW }).click();
    await expect(
      page.getByText(
        "Prévia selecionada. Exemplo local, sem alteração na plataforma."
      )
    ).toBeVisible();
  });

  test(`${dark ? "dark" : "light"}: tooltip focus and existing recovery/data patterns keep their meaning`, async ({
    baseURL,
    page,
  }) => {
    await openReviewFixture(page, "feedback", baseURL);
    await page
      .locator("html")
      .evaluate(
        (root, enabled) => root.classList.toggle("dark", enabled),
        dark
      );
    const help = page.getByRole("button", { name: TOOLTIP });
    await help.focus();
    await expect(page.locator('[data-slot="tooltip-content"]')).toHaveText(
      TOOLTIP
    );
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-slot="tooltip-content"]')).toHaveCount(0);
    await expect(help).toBeFocused();
    await page.getByRole("button", { name: "Tentar novamente" }).click();
    await expect(page.getByText("Tentativas locais: 1")).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Carregamento de conteúdo" })
    ).toHaveText("Carregando conteúdo…");
    await expect(
      page.getByRole("link", { name: "Ver perfil do criador" })
    ).toHaveAttribute("href", "/creators/perfil-ficticio");
    const region = page.getByRole("region", {
      exact: true,
      name: "Transações verificadas",
    });
    await region.focus();
    await expect(region).toBeFocused();
    if ((page.viewportSize()?.width ?? 0) < 900) {
      await page.keyboard.press("ArrowRight");
      await expect
        .poll(() => region.evaluate((element) => element.scrollLeft))
        .toBeGreaterThan(0);
    }
    await expect(page.getByRole("table")).toHaveAccessibleName(
      "Transações verificadas — consulta sem ações de cobrança"
    );
    await expect(page.getByText("Confirmada", { exact: true })).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
}
