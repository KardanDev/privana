import { expect, type Page } from "@playwright/test";
import { test } from "./fixtures/studio-router-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { selectStudioMedia } from "./support/select-studio-media";

const unsavedTitle = "Bastidores em São Paulo";

async function openChangedPost(page: Page) {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Editar Light" }).click();
  const title = page.getByLabel("Título", { exact: true });
  await title.fill(unsavedTitle);
  return title;
}

test("keeping a dirty post restores focus and preserves the local file", async ({
  page,
}, testInfo) => {
  const title = await openChangedPost(page);
  await selectStudioMedia(page);
  await page.getByRole("link", { exact: true, name: "Estúdio" }).click();
  await expect(title).toHaveValue(unsavedTitle);
  const dialog = page.getByRole("dialog", {
    name: "Descartar suas alterações?",
  });
  await expect(dialog).toHaveCount(0);

  const explore = page.getByRole("link", { exact: true, name: "Explorar" });
  if (testInfo.project.name === "desktop") {
    const [otherTab] = await Promise.all([
      page.context().waitForEvent("page", { timeout: 10_000 }),
      explore.click({ modifiers: ["ControlOrMeta"] }),
    ]);
    await expect(otherTab).toHaveURL("/explore");
    await otherTab.close();
    await expect(title).toHaveValue(unsavedTitle);
  }
  if (testInfo.project.name === "phone") {
    const account = page.getByRole("button", { exact: true, name: "Conta" });
    await account.tap();
    await page
      .getByRole("menuitem", { exact: true, name: "Configurações" })
      .tap();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Continuar editando" }).tap();
    await expect(account).toBeFocused();
    await explore.tap();
  } else {
    await explore.press("Enter");
  }

  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Continuar editando" })
  ).toBeFocused();
  await assertNoHorizontalOverflow(page);
  await captureNavigationFrame(page, testInfo, "studio-link-confirmation");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(explore).toBeFocused();
  await expect(page).toHaveURL("/studio");
  await expect(title).toHaveValue(unsavedTitle);
  expect(
    await page
      .getByLabel("Adicionar foto ou vídeo", { exact: true })
      .evaluate((input) =>
        input instanceof HTMLInputElement ? input.files?.[0]?.name : null
      )
  ).toBe("bastidores.png");

  const documentTime = await page.evaluate(() => performance.timeOrigin);
  await explore.click();
  await dialog.getByRole("button", { name: "Descartar alterações" }).click();
  await expect(page).toHaveURL("/explore");
  await expect(title).toHaveCount(0);
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentTime);
});

test("confirming competing links follows only the latest CMS destination", async ({
  page,
}) => {
  await openChangedPost(page);
  const documentTime = await page.evaluate(() => performance.timeOrigin);
  await page.evaluate(() => {
    for (const href of ["/explore", "/pages/fixture-help"]) {
      const links = document.querySelectorAll<HTMLAnchorElement>(
        `a[href="${href}"]`
      );
      const link = Array.from(links).find(
        (item) => item.getClientRects().length
      );
      if (!link) {
        throw new Error(`Missing shared link to ${href}`);
      }
      link.click();
    }
  });
  await page
    .getByRole("dialog", { name: "Descartar suas alterações?" })
    .getByRole("button", { name: "Descartar alterações" })
    .click();
  await expect(page).toHaveURL("/pages/fixture-help");
  await expect(
    page.getByRole("heading", { name: "Destino fictício" })
  ).toBeVisible();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentTime);
  await page.goBack();
  await expect(page).toHaveURL("/studio");
  await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
});

test("a pending save blocks shared navigation until acknowledgement", async ({
  page,
}) => {
  const title = await openChangedPost(page);
  const held = Promise.withResolvers<void>();
  await page.route("**/api/rpc/studio/savePost", async (route) => {
    const { json } = route.request().postDataJSON();
    await held.promise;
    await route.fulfill({ json: { json: { id: json.id } } });
  });
  const explore = page.getByRole("link", { exact: true, name: "Explorar" });
  try {
    await page.getByRole("button", { name: "Salvar rascunho" }).click();
    await expect(title).toBeDisabled();
    await explore.click();
    await expect(page).toHaveURL("/studio");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  } finally {
    held.resolve();
  }
  await expect(title).toHaveCount(0);
  await expect(page).toHaveURL("/studio");
  await expect(page.getByText("Sincronizando alterações.")).toHaveCount(0);
  await explore.click();
  await expect(page).toHaveURL("/explore");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
