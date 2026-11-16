import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { fillStudioPostReview } from "./support/fill-studio-post-review";
import { openStudioPostFixture } from "./support/open-studio-post-fixture";

for (const dark of [false, true]) {
  for (const status of ["DRAFT", "PUBLISHED"] as const) {
    test(`${dark ? "dark" : "light"}: ${status} retries retain fields and one creation request identity`, async ({
      page,
    }, testInfo) => {
      if (testInfo.project.name === "phone" && status === "PUBLISHED") {
        await page.setViewportSize({ height: 844, width: 320 });
      }
      await openStudioPostFixture(page, dark);
      await fillStudioPostReview(page);
      const attempts: {
        clientPostId: string;
        status: string;
        visibility: string;
      }[] = [];
      const records = new Set<string>();
      let release: (() => void) | undefined;
      const held = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route("**/api/rpc/studio/savePost", async (route) => {
        const { json: input } = route.request().postDataJSON();
        attempts.push(input);
        records.add(input.clientPostId);
        if (attempts.length === 1) {
          await held;
          await route.abort("failed");
          return;
        }
        await route.fulfill({
          body: JSON.stringify({ json: { id: input.clientPostId } }),
          contentType: "application/json",
        });
      });
      await page.locator("form").evaluate((form, value) => {
        const button = form.querySelector(`button[value="${value}"]`);
        if (
          form instanceof HTMLFormElement &&
          button instanceof HTMLButtonElement
        ) {
          form.requestSubmit(button);
          form.requestSubmit(button);
        }
      }, status);
      await expect.poll(() => attempts.length).toBe(1);
      await expect(page.getByLabel("Título", { exact: true })).toBeDisabled();
      await expect(
        page.getByRole("button", { name: "Fechar editor" })
      ).toBeDisabled();
      const pending = page.getByText("Aguardando confirmação do servidor…", {
        exact: true,
      });
      await expect(pending).toBeVisible();
      await pending.scrollIntoViewIfNeeded();
      await captureNavigationFrame(page, testInfo, "post-pending");
      release?.();
      await expect(page.getByRole("alert")).toHaveText(
        "Não foi possível confirmar o salvamento. Suas alterações continuam no editor. Tente novamente."
      );
      await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
        "Bastidores em São Paulo"
      );
      await expect(
        page.getByLabel("Prévia pública", { exact: true })
      ).toHaveValue("Novidades desta semana");
      await expect(
        page.getByLabel("Sua publicação", { exact: true })
      ).toHaveValue("Meu rascunho com acentos e uma ideia nova. 💜");
      await expect(
        page.getByLabel("Quem pode ver?", { exact: true })
      ).toHaveValue("SUBSCRIBERS");
      await expect(
        page.getByLabel("Imagem de prévia (link HTTPS)", { exact: true })
      ).toHaveValue("https://images.example.invalid/preview.png");
      await captureNavigationFrame(page, testInfo, "post-retry");
      await assertNoHorizontalOverflow(page);
      await page
        .getByRole("button", {
          exact: true,
          name: status === "DRAFT" ? "Salvar rascunho" : "Publicar",
        })
        .click();
      await expect(
        page.getByRole("heading", { exact: true, name: "Nova publicação" })
      ).toHaveCount(0);
      expect(attempts).toHaveLength(2);
      expect(attempts[1]).toEqual(attempts[0]);
      expect(attempts[0]).toMatchObject({ status, visibility: "SUBSCRIBERS" });
      expect(records.size).toBe(1);
      await assertNoHorizontalOverflow(page);
    });
  }

  test(`${dark ? "dark" : "light"}: an existing post uses its stored ID`, async ({
    page,
  }) => {
    await openStudioPostFixture(page, dark, "edit");
    await fillStudioPostReview(page);
    let submitted: Record<string, unknown> | undefined;
    await page.route("**/api/rpc/studio/savePost", async (route) => {
      submitted = route.request().postDataJSON().json;
      await route.fulfill({
        body: JSON.stringify({ json: { id: "post-a" } }),
        contentType: "application/json",
      });
    });
    await page
      .getByRole("button", { exact: true, name: "Salvar rascunho" })
      .click();
    await expect(
      page.getByRole("heading", { exact: true, name: "Editar publicação" })
    ).toHaveCount(0);
    expect(submitted?.id).toBe("post-a");
    expect(submitted?.clientPostId).toBeUndefined();
  });

  test(`${dark ? "dark" : "light"}: invalid media stays selected with contextual recovery`, async ({
    page,
  }) => {
    await openStudioPostFixture(page, dark);
    await fillStudioPostReview(page);
    const media = page.getByLabel("Adicionar foto ou vídeo", { exact: true });
    await media.setInputFiles({
      buffer: Buffer.from("fixture"),
      mimeType: "application/pdf",
      name: "ensaio.pdf",
    });
    await page
      .getByRole("button", { exact: true, name: "Salvar rascunho" })
      .click();
    await expect(page.getByRole("alert")).toHaveText(
      "Escolha uma imagem JPEG, PNG, WebP ou um vídeo MP4."
    );
    await expect(page.getByLabel("Título", { exact: true })).toHaveValue(
      "Bastidores em São Paulo"
    );
    expect(
      await media.evaluate((input) =>
        input instanceof HTMLInputElement ? input.files?.[0]?.name : null
      )
    ).toBe("ensaio.pdf");
    await expect(
      page.getByRole("button", { exact: true, name: "Salvar rascunho" })
    ).toBeEnabled();
  });
}

for (const mode of ["PENDING", "SUSPENDED"] as const) {
  test(`${mode}: restricted Studio presentation omits the editor and disables editing`, async ({
    page,
  }) => {
    await openStudioPostFixture(page, false, mode);
    await expect(page.locator("form")).toHaveCount(0);
    await expect(
      page.getByRole("button", { exact: true, name: "Editar Light" })
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { exact: true, name: "Publicar" })
    ).toHaveCount(0);
  });
}
