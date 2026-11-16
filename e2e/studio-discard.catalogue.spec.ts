import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { fillStudioPostReview } from "./support/fill-studio-post-review";
import { openStudioPostFixture } from "./support/open-studio-post-fixture";
import { selectStudioMedia } from "./support/select-studio-media";

for (const dark of [false, true]) {
  for (const mode of ["new", "edit"] as const) {
    test(`${dark ? "dark" : "light"}: ${mode} close keeps work until discard is confirmed`, async ({
      page,
    }, testInfo) => {
      if (testInfo.project.name === "phone") {
        await page.setViewportSize({ height: 844, width: 320 });
      }
      await openStudioPostFixture(page, dark, mode);
      await fillStudioPostReview(page);
      await selectStudioMedia(page);
      const close = page.getByRole("button", { name: "Fechar editor" });
      await close.click();
      const dialog = page.getByRole("dialog", {
        name: "Descartar suas alterações?",
      });
      const keep = dialog.getByRole("button", { name: "Continuar editando" });
      const discard = dialog.getByRole("button", {
        name: "Descartar alterações",
      });
      await expect(dialog).toBeVisible();
      await expect(keep).toBeFocused();
      await captureNavigationFrame(page, testInfo, "discard-confirmation");
      await page.keyboard.press("Tab");
      await expect(discard).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(keep).toBeFocused();
      await page.evaluate(() => {
        const background = document.querySelector(
          '[aria-label="Fechar editor"]'
        );
        if (background instanceof HTMLElement) {
          background.focus();
        }
      });
      await expect(keep).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(close).toBeFocused();
      await close.click();
      await keep.click();
      await expect(close).toBeFocused();
      await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
        "Bastidores em São Paulo"
      );
      await expect(
        page.getByLabel("Sua publicação", { exact: true })
      ).toHaveValue("Meu rascunho com acentos e uma ideia nova. 💜");
      const file = page.getByLabel("Adicionar foto ou vídeo", { exact: true });
      expect(
        await file.evaluate((input) =>
          input instanceof HTMLInputElement ? input.files?.[0]?.name : null
        )
      ).toBe("bastidores.png");
      await file.scrollIntoViewIfNeeded();
      await captureNavigationFrame(page, testInfo, "discard-preserved");
      await assertNoHorizontalOverflow(page);
      await close.click();
      await discard.click();
      await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
      await expect(
        page.getByRole("region", {
          exact: true,
          name: "Publicações do estúdio",
        })
      ).toBeFocused();
    });
  }
}

for (const mode of ["new", "edit"] as const) {
  for (const state of ["untouched", "reverted"]) {
    test(`${mode}: ${state} work closes without a false discard warning`, async ({
      page,
    }) => {
      await openStudioPostFixture(page, false, mode);
      if (state === "reverted") {
        const title = page.getByLabel("Título", { exact: true });
        const initial = await title.inputValue();
        await title.fill("Outra ideia");
        await title.fill(` ${initial} `);
        await page
          .getByLabel("Quem pode ver?", { exact: true })
          .selectOption("SUBSCRIBERS");
        await page
          .getByLabel("Quem pode ver?", { exact: true })
          .selectOption("PUBLIC");
        await selectStudioMedia(page);
        await page
          .getByLabel("Adicionar foto ou vídeo", { exact: true })
          .setInputFiles([]);
      }
      await page.getByRole("button", { name: "Fechar editor" }).click();
      await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
      await expect(page.getByRole("dialog")).toHaveCount(0);
    });
  }
}

for (const action of ["close", "discard"] as const) {
  test(`same-task ${action} cannot bypass a pending save; acknowledgment exits directly`, async ({
    page,
  }) => {
    await openStudioPostFixture(page);
    await fillStudioPostReview(page);
    if (action === "discard") {
      await page.getByRole("button", { name: "Fechar editor" }).click();
    }
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/api/rpc/studio/savePost", async (route) => {
      const { json } = route.request().postDataJSON();
      await held;
      await route.fulfill({
        body: JSON.stringify({ json: { id: json.clientPostId } }),
        contentType: "application/json",
      });
    });
    await page.locator("form").evaluate((form, selected) => {
      if (!(form instanceof HTMLFormElement)) {
        return;
      }
      const submit = form.querySelector('button[value="DRAFT"]');
      if (!(submit instanceof HTMLButtonElement)) {
        return;
      }
      form.requestSubmit(submit);
      const button =
        selected === "close"
          ? document.querySelector('[aria-label="Fechar editor"]')
          : document.getElementById("discard-post-changes");
      if (button instanceof HTMLButtonElement) {
        button.click();
      }
    }, action);
    await expect(page.getByLabel("Título", { exact: true })).toBeDisabled();
    await expect(page.getByRole("dialog")).toHaveCount(
      action === "discard" ? 1 : 0
    );
    release?.();
    await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

test("keeping the editor after a rejected save preserves its retry identity", async ({
  page,
}) => {
  await openStudioPostFixture(page);
  await fillStudioPostReview(page);
  const attempts: unknown[] = [];
  await page.route("**/api/rpc/studio/savePost", async (route) => {
    const { json } = route.request().postDataJSON();
    attempts.push(json);
    if (attempts.length === 1) {
      await route.abort("failed");
      return;
    }
    await route.fulfill({
      body: JSON.stringify({ json: { id: json.clientPostId } }),
      contentType: "application/json",
    });
  });
  const save = page.getByRole("button", {
    exact: true,
    name: "Salvar rascunho",
  });
  await save.click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Fechar editor" }).click();
  await page.getByRole("button", { name: "Continuar editando" }).click();
  await save.click();
  await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
  expect(attempts).toHaveLength(2);
  expect(attempts[1]).toEqual(attempts[0]);
});
