// biome-ignore-all lint/performance/noAwaitInLoops: Each theme mutates and captures the same browser document in order.
import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { openControlsFixture } from "./support/open-controls-fixture";

const CHECKBOX_NAME = /Quero receber novidades/;
const FAILURE = "Não foi possível salvar. Revise o nome e tente novamente.";

test("field labels, descriptions, retained input and caller refs survive an error", async ({
  page,
}) => {
  await openControlsFixture(page);
  const name = page.getByRole("textbox", { exact: true, name: "Nome público" });
  const alternative = page.getByRole("textbox", {
    exact: true,
    name: "Nome alternativo",
  });
  await expect(name).toHaveAttribute("id", "review-name");
  const generated = await alternative.getAttribute("id");
  expect(generated).toBeTruthy();
  expect(generated).not.toBe("review-name");
  await page.getByText("Nome alternativo", { exact: true }).click();
  await expect(alternative).toBeFocused();
  await name.fill("Mariana dos Santos — bastidores e fotografia");
  await page.getByRole("button", { name: "Mostrar erro de exemplo" }).click();
  await expect(name).toHaveAccessibleDescription(
    `Seu e-mail continua privado. Use o nome que você quer mostrar no seu perfil. ${FAILURE}`
  );
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveValue(
    "Mariana dos Santos — bastidores e fotografia"
  );
  await expect(alternative).toHaveAttribute("id", generated ?? "");
  await page.getByRole("button", { name: "Voltar ao nome público" }).click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAccessibleDescription(
    "Seu e-mail continua privado. Use o nome que você quer mostrar no seu perfil."
  );
  await expect(name).not.toHaveAttribute("aria-invalid", "true");
  await expect(page.getByLabel("Campo indisponível")).toBeDisabled();
  await page.getByLabel("Moeda da demonstração").selectOption("EUR");
  await expect(page.getByLabel("Moeda da demonstração")).toHaveValue("EUR");
});

test("checkbox keyboard operation and pending actions prevent a second local submit", async ({
  page,
}) => {
  await openControlsFixture(page);
  const checkbox = page.getByRole("checkbox", { name: CHECKBOX_NAME });
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await page.getByText(CHECKBOX_NAME).click();
  await expect(checkbox).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", {
      name: "Preferências parcialmente selecionadas",
    })
  ).toHaveAttribute("aria-checked", "mixed");
  await page
    .getByRole("button", {
      name: "Salvar alterações e manter minhas preferências de privacidade",
    })
    .click();
  const pending = page.getByRole("button", { name: "Salvando alterações…" });
  await expect(pending).toBeDisabled();
  await expect(pending).toHaveAttribute("aria-busy", "true");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Envios locais: 1.");
});

test("controls remain readable with long pt-BR labels in both themes", async ({
  page,
}, testInfo) => {
  await openControlsFixture(page);
  for (const dark of [false, true]) {
    await page
      .locator("html")
      .evaluate(
        (root, enabled) => root.classList.toggle("dark", enabled),
        dark
      );
    await page.getByRole("button", { name: "Mostrar erro de exemplo" }).click();
    await page.getByLabel("Buscar no conteúdo").focus();
    await assertNoHorizontalOverflow(page);
    if ((page.viewportSize()?.width ?? 0) < 640) {
      for (const control of [
        page.getByRole("checkbox", { name: CHECKBOX_NAME }),
        page.getByRole("button", { name: "Ação compacta" }),
        page.getByRole("button", { name: "Prévia do perfil" }),
        page.getByRole("button", { name: "Mostrar busca" }),
      ]) {
        const box = await control.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
        expect(box?.width).toBeGreaterThanOrEqual(44);
      }
    }
    await testInfo.attach(`controls-${dark ? "dark" : "light"}`, {
      body: await page.screenshot({
        fullPage: true,
        quality: 85,
        type: "jpeg",
      }),
      contentType: "image/jpeg",
    });
  }
});
