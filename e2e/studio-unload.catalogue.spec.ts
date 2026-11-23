import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { exerciseBrowserUnload } from "./support/exercise-browser-unload";
import { fillStudioPostReview } from "./support/fill-studio-post-review";
import { openStudioPostFixture } from "./support/open-studio-post-fixture";
import { selectStudioMedia } from "./support/select-studio-media";

for (const dark of [false, true]) {
  for (const mode of ["new", "edit"] as const) {
    for (const action of ["reload", "back"] as const) {
      test(`${dark ? "dark" : "light"}: ${mode} native ${action} keeps work on cancel`, async ({
        page,
      }, testInfo) => {
        if (testInfo.project.name === "phone") {
          await page.setViewportSize({ height: 844, width: 320 });
        }
        if (action === "back") {
          await page.route("**/__studio-unload-origin", (route) =>
            route.fulfill({
              body: "<!doctype html><title>Origem fictícia</title>",
              contentType: "text/html",
            })
          );
          await page.goto("/__studio-unload-origin");
        }
        await openStudioPostFixture(page, dark, mode);
        await fillStudioPostReview(page);
        await selectStudioMedia(page);
        const file = page.getByLabel("Adicionar foto ou vídeo", {
          exact: true,
        });
        await file.scrollIntoViewIfNeeded();
        const dialogs = await exerciseBrowserUnload(page, action);
        expect(dialogs).toEqual(["beforeunload"]);
        await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
          "Bastidores em São Paulo"
        );
        await expect(
          page.getByLabel("Sua publicação", { exact: true })
        ).toHaveValue("Meu rascunho com acentos e uma ideia nova. 💜");
        expect(
          await file.evaluate((input) =>
            input instanceof HTMLInputElement ? input.files?.[0]?.name : null
          )
        ).toBe("bastidores.png");
        if (mode === "edit" && action === "reload") {
          await page
            .getByText("Salve suas alterações antes de sair.", { exact: false })
            .scrollIntoViewIfNeeded();
          await assertNoHorizontalOverflow(page);
          await captureNavigationFrame(page, testInfo, "browser-unload-state");
        }
        expect(await exerciseBrowserUnload(page, action, true)).toEqual([
          "beforeunload",
        ]);
        if (action === "back") {
          await expect(page).toHaveURL(
            new URL("/__studio-unload-origin", page.url()).href
          );
        } else {
          await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
            mode === "new" ? "" : "Light"
          );
        }
      });
    }
  }
}

test("file-only changes warn on tab close and clearing the file removes protection", async ({
  page,
}) => {
  await openStudioPostFixture(page, false, "edit");
  await page.getByLabel("Título", { exact: true }).click();
  const file = page.getByLabel("Adicionar foto ou vídeo", { exact: true });
  await selectStudioMedia(page);
  const warning = page.waitForEvent("dialog", { timeout: 5000 });
  await page.close({ runBeforeUnload: true });
  const dialog = await warning;
  await dialog.dismiss();
  expect(dialog.type()).toBe("beforeunload");
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue("Light");
  expect(
    await file.evaluate((input) =>
      input instanceof HTMLInputElement ? input.files?.[0]?.name : null
    )
  ).toBe("bastidores.png");
  await file.setInputFiles([]);
  expect(await exerciseBrowserUnload(page, "reload")).toEqual([]);
});

test("semantic reversion and confirmed discard remove unload protection", async ({
  page,
}) => {
  await openStudioPostFixture(page, false, "edit");
  const title = page.getByLabel("Título", { exact: true });
  await title.fill("Outra ideia");
  await title.fill(" Light ");
  expect(await exerciseBrowserUnload(page, "reload")).toEqual([]);
  await title.fill("Outra ideia");
  await page.getByRole("button", { name: "Fechar editor" }).click();
  await page.getByRole("button", { name: "Descartar alterações" }).click();
  await expect(title).toHaveCount(0);
  expect(await exerciseBrowserUnload(page, "reload")).toEqual([]);
});

for (const dirty of [false, true]) {
  test(`${dirty ? "changed" : "unchanged"} post protects pending saves and recovers after rejection`, async ({
    page,
  }) => {
    await openStudioPostFixture(page, false, "edit");
    const title = page.getByLabel("Título", { exact: true });
    if (dirty) {
      await title.fill("Outra ideia");
    }
    const held = Promise.withResolvers<void>();
    let attempts = 0;
    await page.route("**/api/rpc/studio/savePost", async (route) => {
      attempts += 1;
      if (attempts === 1) {
        await held.promise;
        await route.abort("failed");
      } else {
        await route.fulfill({
          json: { json: { id: route.request().postDataJSON().json.id } },
        });
      }
    });
    await title.click();
    const protectedImmediately = await page.locator("form").evaluate((form) => {
      if (!(form instanceof HTMLFormElement)) {
        throw new Error("Expected the editor form");
      }
      form.requestSubmit();
      return !window.dispatchEvent(
        new Event("beforeunload", { cancelable: true })
      );
    });
    expect(protectedImmediately).toBe(true);
    expect(await exerciseBrowserUnload(page, "reload")).toEqual([
      "beforeunload",
    ]);
    held.resolve();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(title).toBeEnabled();
    const stillProtected = await page.evaluate(
      () =>
        !window.dispatchEvent(new Event("beforeunload", { cancelable: true }))
    );
    expect(stillProtected).toBe(dirty);
    await page
      .getByRole("button", { exact: true, name: "Salvar rascunho" })
      .click();
    await expect(title).toHaveCount(0);
    expect(await exerciseBrowserUnload(page, "reload")).toEqual([]);
  });
}
