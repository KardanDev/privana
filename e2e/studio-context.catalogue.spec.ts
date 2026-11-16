import { expect } from "@playwright/test";
import { studioContextOverview } from "../apps/web/tests/fixtures/studio-context-overview";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { fillStudioPostReview } from "./support/fill-studio-post-review";
import { openStudioPostFixture } from "./support/open-studio-post-fixture";
import { selectStudioMedia } from "./support/select-studio-media";

const targets = {
  edit: "Editar Outra publicação",
  filter: "",
  new: "Nova publicação",
  profile: "Editar perfil",
};
for (const dark of [false, true]) {
  for (const destination of ["profile", "filter", "new", "edit"] as const) {
    test(`${dark ? "dark" : "light"}: ${destination} keeps Studio context until discard`, async ({
      page,
    }, testInfo) => {
      if (testInfo.project.name === "phone") {
        await page.setViewportSize({ height: 844, width: 320 });
      }
      await openStudioPostFixture(page, dark, "context");
      await page
        .getByRole("button", { exact: true, name: "Editar Light" })
        .click();
      await fillStudioPostReview(page);
      await selectStudioMedia(page);
      const target = page.getByRole("button", {
        exact: true,
        name: targets[destination],
      });
      const filter = page.getByRole("combobox", {
        exact: true,
        name: "Mostrar",
      });
      if (destination === "filter") {
        await filter.focus();
        await filter.selectOption("DRAFT");
      } else {
        await target.click();
      }
      const dialog = page.getByRole("dialog", {
        name: "Descartar suas alterações?",
      });
      await expect(
        dialog.getByRole("button", { name: "Continuar editando" })
      ).toBeFocused();
      await captureNavigationFrame(page, testInfo, "context-confirmation");
      await page.keyboard.press("Tab");
      await expect(
        dialog.getByRole("button", { name: "Descartar alterações" })
      ).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(filter).toHaveValue("ACTIVE");
      await expect(
        page.getByRole("button", { exact: true, name: "Minhas publicações" })
      ).toHaveAttribute("aria-pressed", "true");
      await expect(destination === "filter" ? filter : target).toBeFocused();
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
      if (destination === "profile") {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          fullPage: true,
          path: testInfo.outputPath("context-full-page.jpg"),
          quality: 88,
          type: "jpeg",
        });
      }
      await file.scrollIntoViewIfNeeded();
      await captureNavigationFrame(page, testInfo, "context-preserved");
      await assertNoHorizontalOverflow(page);
      if (destination === "filter") {
        await filter.focus();
        await filter.selectOption("DRAFT");
      } else {
        await target.click();
      }
      await dialog
        .getByRole("button", { name: "Descartar alterações" })
        .click();
      await expect(dialog).toHaveCount(0);
      if (destination !== "filter") {
        await expect(target).toBeFocused();
      }
      if (destination === "profile" || destination === "filter") {
        await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
        if (destination === "profile") {
          await expect(
            page.getByLabel("Nome de exibição", { exact: true })
          ).toBeVisible();
        } else {
          await expect(filter).toHaveValue("DRAFT");
          await expect(filter).toBeFocused();
          await filter.selectOption("ACTIVE");
          await expect(filter).toHaveValue("ACTIVE");
          await expect(filter).toBeFocused();
        }
      } else {
        await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
          destination === "new" ? "" : "Outra publicação"
        );
      }
    });
  }
}

for (const mode of ["new", "edit"] as const) {
  test(`${mode}: same-context actions cancel a competing destination and preserve work`, async ({
    page,
  }) => {
    await openStudioPostFixture(page, false, "context");
    await page
      .getByRole("button", {
        exact: true,
        name: mode === "new" ? "Nova publicação" : "Editar Light",
      })
      .click();
    await fillStudioPostReview(page);
    await page
      .getByRole("button", { exact: true, name: "Minhas publicações" })
      .click();
    await page
      .getByRole("combobox", { exact: true, name: "Mostrar" })
      .selectOption("ACTIVE");
    await page.evaluate((selected) => {
      const buttons = [...document.querySelectorAll("button")];
      buttons.find((button) => button.value === "profile")?.click();
      buttons
        .find((button) =>
          selected === "new"
            ? button.textContent?.trim() === "Nova publicação"
            : button.getAttribute("aria-label") === "Editar Light"
        )
        ?.click();
    }, mode);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
      "Bastidores em São Paulo"
    );
    await page.evaluate(() => {
      document
        .querySelector<HTMLButtonElement>('button[value="profile"]')
        ?.click();
      document
        .querySelector<HTMLButtonElement>(
          '[aria-label="Editar Outra publicação"]'
        )
        ?.click();
    });
    await page.getByRole("button", { name: "Continuar editando" }).click();
    await page.getByLabel("Título", { exact: true }).focus();
    await page.evaluate(() => {
      document
        .querySelector<HTMLButtonElement>('button[value="profile"]')
        ?.click();
      document
        .querySelector<HTMLButtonElement>(
          '[aria-label="Editar Outra publicação"]'
        )
        ?.click();
    });
    await page.getByRole("button", { name: "Descartar alterações" }).click();
    await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
      "Outra publicação"
    );
    await expect(
      page.getByRole("group", { name: "Seções do estúdio" })
    ).toBeFocused();
    await page
      .getByRole("button", { exact: true, name: "Nova publicação" })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByLabel("Título", { exact: true })).toHaveValue("");
  });
}

test("same-task context changes cannot bypass a pending save; acknowledgement exits directly", async ({
  page,
}) => {
  await openStudioPostFixture(page, false, "context");
  await page.getByRole("button", { exact: true, name: "Editar Light" }).click();
  await fillStudioPostReview(page);
  let release: (() => void) | undefined;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/rpc/studio/savePost", async (route) => {
    await held;
    await route.fulfill({
      body: JSON.stringify({
        json: { id: route.request().postDataJSON().json.id },
      }),
      contentType: "application/json",
    });
  });
  await page.locator("form").evaluate((form) => {
    if (!(form instanceof HTMLFormElement)) {
      return;
    }
    const submit = form.querySelector('button[value="DRAFT"]');
    if (!(submit instanceof HTMLButtonElement)) {
      return;
    }
    form.requestSubmit(submit);
    [...document.querySelectorAll("button")]
      .find((button) => button.textContent?.trim() === "Nova publicação")
      ?.click();
    document
      .querySelector<HTMLButtonElement>('button[value="profile"]')
      ?.click();
    document
      .querySelector<HTMLButtonElement>(
        '[aria-label="Editar Outra publicação"]'
      )
      ?.click();
    const filter = document.querySelector("select");
    if (filter) {
      filter.value = "DRAFT";
      filter.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await expect(page.getByLabel("Título", { exact: true })).toBeDisabled();
  await expect(
    page.getByRole("combobox", { exact: true, name: "Mostrar" })
  ).toHaveValue("ACTIVE");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  release?.();
  await expect(page.getByLabel("Título", { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("button", { exact: true, name: "Minhas publicações" })
  ).toHaveAttribute("aria-pressed", "true");
});

test("delayed and rejected overview refetches retain edits; fresh permissions still govern", async ({
  page,
}, testInfo) => {
  await openStudioPostFixture(page, false, "context");
  await page.getByRole("button", { exact: true, name: "Editar Light" }).click();
  await fillStudioPostReview(page);
  await selectStudioMedia(page);
  let release: (() => void) | undefined;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let requests = 0;
  await page.route("**/api/rpc/studio/overview", async (route) => {
    requests += 1;
    await held;
    await route.abort("failed");
  });
  const refresh = page.getByRole("button", {
    name: "Atualizar dados fictícios",
  });
  await refresh.click();
  await expect.poll(() => requests).toBe(1);
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
    "Bastidores em São Paulo"
  );
  const rejected = page.waitForEvent("requestfailed", (request) =>
    request.url().endsWith("/studio/overview")
  );
  release?.();
  await rejected;
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
    "Bastidores em São Paulo"
  );
  await page.unroute("**/api/rpc/studio/overview");
  await page.route("**/api/rpc/studio/overview", (route) =>
    route.fulfill({
      body: JSON.stringify({
        json: {
          ...studioContextOverview,
          posts: studioContextOverview.posts.map((post) => ({
            ...post,
            title: "Atualizada no servidor",
          })),
        },
      }),
      contentType: "application/json",
    })
  );
  const refreshed = page.waitForResponse((response) =>
    response.url().endsWith("/studio/overview")
  );
  await refresh.click();
  await refreshed;
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
    "Bastidores em São Paulo"
  );
  expect(
    await page
      .getByLabel("Adicionar foto ou vídeo", { exact: true })
      .evaluate((input) =>
        input instanceof HTMLInputElement ? input.files?.[0]?.name : null
      )
  ).toBe("bastidores.png");
  await page.route("**/api/rpc/studio/overview", (route) =>
    route.fulfill({
      body: JSON.stringify({
        json: {
          ...studioContextOverview,
          profile: { ...studioContextOverview.profile, status: "SUSPENDED" },
        },
      }),
      contentType: "application/json",
    })
  );
  await refresh.click();
  await expect(
    page.getByRole("button", { exact: true, name: "Nova publicação" })
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { exact: true, name: "Editar Light" })
  ).toBeDisabled();
  await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
    "Bastidores em São Paulo"
  );
  const save = page.getByRole("button", {
    exact: true,
    name: "Salvar rascunho",
  });
  await expect(save).toBeDisabled();
  await save.scrollIntoViewIfNeeded();
  await captureNavigationFrame(page, testInfo, "permission-preserved");
  await page.locator("form").evaluate((form) => {
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  });
  await page
    .getByRole("button", { exact: true, name: "Editar perfil" })
    .click();
  await page.getByRole("button", { name: "Continuar editando" }).click();
});
