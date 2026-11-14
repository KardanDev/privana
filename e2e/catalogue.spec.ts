import { expect } from "@playwright/test";
import { catalogueOrigin } from "../scripts/catalogue/catalogue-assets";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";

for (const dark of [false, true]) {
  test(`${dark ? "dark" : "light"}: catalogue preferences, retained examples and actual fonts`, async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    if (isMobile) {
      await page.getByRole("checkbox", { name: "Tema escuro" }).tap();
      await expect(
        page.getByRole("checkbox", { name: "Tema escuro" })
      ).toBeChecked();
    }
    await page.getByRole("checkbox", { name: "Tema escuro" }).setChecked(dark);
    await expect(page.locator("html")).toHaveCSS(
      "color-scheme",
      dark ? "dark" : "light"
    );
    await page.getByLabel("Cor de destaque").selectOption("#1D4ED8");
    expect(
      await page
        .locator("html")
        .evaluate((root) => root.style.getPropertyValue("--brand-accent"))
    ).toBe("#1D4ED8");
    const name = page.getByRole("textbox", {
      exact: true,
      name: "Nome público",
    });
    await name.fill("Mariana dos Santos e Albuquerque");
    await page.getByLabel("Exemplo", { exact: true }).selectOption("feedback");
    const trigger = page.getByRole("button", {
      name: "Opções da publicação de exemplo",
    });
    await trigger.click();
    await page.getByRole("menuitemcheckbox").click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
    await trigger.click();
    await expect(page.getByRole("menuitemcheckbox")).toHaveAttribute(
      "aria-checked",
      "false"
    );
    await page
      .getByRole("menuitem", { name: "Descartar exemplo local" })
      .click();
    await expect(
      page.getByText(
        "Exemplo local descartado. Nenhum conteúdo real foi removido."
      )
    ).toBeVisible();
    await page.getByRole("link", { name: "Ver perfil do criador" }).click();
    await expect(
      page.getByText("Prévia local selecionada. Nenhum perfil real foi aberto.")
    ).toBeVisible();
    await expect(page).toHaveURL(`${catalogueOrigin}/`);
    await assertNoHorizontalOverflow(page);
    await page.getByLabel("Exemplo", { exact: true }).selectOption("controls");
    await expect(name).toHaveValue("Mariana dos Santos e Albuquerque");
    await page.getByLabel("Exemplo", { exact: true }).selectOption("content");
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 2 })).toHaveCSS(
      "font-size",
      "20px"
    );
    await expect(page.getByText("Pessoas acompanhando este exemplo")).toHaveCSS(
      "font-size",
      "14px"
    );
    await expect(page.getByText("12.345", { exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const loaded = await page.evaluate(() =>
      Array.from(document.fonts)
        .filter((font) => font.status === "loaded")
        .map((font) => font.family.replaceAll('"', ""))
    );
    expect(loaded).toEqual(
      expect.arrayContaining(["Hanken Grotesk", "Bricolage Grotesque"])
    );
    await assertNoHorizontalOverflow(page);
  });
}
