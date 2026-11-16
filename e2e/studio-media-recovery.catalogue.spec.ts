import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { fillStudioPostReview } from "./support/fill-studio-post-review";
import {
  type MediaFailure,
  mockStudioMediaTransport,
} from "./support/mock-studio-media-transport";
import { openStudioPostFixture } from "./support/open-studio-post-fixture";
import { selectStudioMedia } from "./support/select-studio-media";

for (const dark of [false, true]) {
  test(`${dark ? "dark" : "light"}: confirmed media survives a rejected save without another upload`, async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "phone") {
      await page.setViewportSize({ height: 844, width: 320 });
    }
    await openStudioPostFixture(page, dark);
    await fillStudioPostReview(page);
    await selectStudioMedia(page);
    const transport = await mockStudioMediaTransport(page);
    transport.failure = "save";
    transport.hold = "put";
    await page.locator("form").evaluate((form) => {
      const button = form.querySelector('button[value="PUBLISHED"]');
      if (
        form instanceof HTMLFormElement &&
        button instanceof HTMLButtonElement
      ) {
        form.requestSubmit(button);
        form.requestSubmit(button);
      }
    });
    for (const phase of ["put", "end", "complete", "save"] as const) {
      // biome-ignore lint/performance/noAwaitInLoops: Confirm each dependent wire phase before releasing the next network gate.
      await expect.poll(() => transport.events.includes(phase)).toBe(true);
      await expect(
        page.getByLabel("Adicionar foto ou vídeo", { exact: true })
      ).toBeDisabled();
      await expect(
        page.getByRole("button", { name: "Fechar editor" })
      ).toBeDisabled();
      const message = page.getByText(
        phase === "save"
          ? "Aguardando confirmação do servidor…"
          : "Enviando e verificando seu arquivo…",
        { exact: true }
      );
      await expect(message).toBeVisible();
      expect(transport.saves).toHaveLength(phase === "save" ? 1 : 0);
      if (phase === "complete") {
        await message.scrollIntoViewIfNeeded();
        await captureNavigationFrame(page, testInfo, "media-unconfirmed");
      }
      transport.hold = (
        {
          complete: "save",
          end: "complete",
          put: "end",
          save: undefined,
        } as const
      )[phase];
      transport.release?.();
    }
    await expect(page.getByRole("alert")).toContainText(
      "Não foi possível confirmar o salvamento."
    );
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
    await captureNavigationFrame(page, testInfo, "media-retry");
    await assertNoHorizontalOverflow(page);
    expect(transport.events).toEqual([
      "begin",
      "put",
      "end",
      "complete",
      "save",
    ]);
    expect(transport.bytes).toBeGreaterThan(0);
    const { bytes } = transport;
    transport.failure = undefined;
    transport.hold = "save";
    await page.getByRole("button", { exact: true, name: "Publicar" }).click();
    await expect.poll(() => transport.saves.length).toBe(2);
    expect(transport.paths).toHaveLength(1);
    expect(transport.completionRequests).toEqual(transport.paths);
    expect(transport.bytes).toBe(bytes);
    expect(transport.saves[1]).toEqual(transport.saves[0]);
    expect(transport.saves[1]).toMatchObject({
      mediaKey: transport.paths[0],
      mediaType: "image/png",
      status: "PUBLISHED",
    });
    await expect(
      page.getByRole("heading", { exact: true, name: "Nova publicação" })
    ).toBeVisible();
    transport.release?.();
    await expect(
      page.getByRole("heading", { exact: true, name: "Nova publicação" })
    ).toHaveCount(0);
  });
}

for (const change of ["file", "owner"] as const) {
  test(`a changed ${change} cannot reuse the previous confirmed media`, async ({
    page,
  }) => {
    await openStudioPostFixture(page);
    await fillStudioPostReview(page);
    await selectStudioMedia(page);
    const transport = await mockStudioMediaTransport(page);
    transport.failure = "save";
    await page
      .getByRole("button", { exact: true, name: "Salvar rascunho" })
      .click();
    await expect(page.getByRole("alert")).toBeVisible();
    if (change === "file") {
      await selectStudioMedia(page, true);
    } else {
      transport.owner = "second-viewer";
    }
    transport.failure = undefined;
    await page
      .getByRole("button", { exact: true, name: "Salvar rascunho" })
      .click();
    await expect(
      page.getByRole("heading", { exact: true, name: "Nova publicação" })
    ).toHaveCount(0);
    expect(transport.paths).toHaveLength(2);
    expect(transport.completionRequests).toEqual(transport.paths);
    expect(transport.saves[1]?.clientPostId).toBe(
      transport.saves[0]?.clientPostId
    );
    expect(transport.saves[1]?.mediaKey).toBe(transport.paths[1]);
    expect(transport.paths[1]?.startsWith(`${transport.owner}/`)).toBe(true);
  });
}

for (const failure of [
  "put",
  "end",
  "complete",
  "json",
  "key",
  "type",
  "owner",
] as const satisfies readonly MediaFailure[]) {
  test(`${failure}: unconfirmed media never reaches post save and permits a fresh attempt`, async ({
    page,
  }, testInfo) => {
    await openStudioPostFixture(page);
    await fillStudioPostReview(page);
    await selectStudioMedia(page);
    const transport = await mockStudioMediaTransport(page);
    transport.failure = failure;
    await page
      .getByRole("button", { exact: true, name: "Salvar rascunho" })
      .click();
    const error = page.getByRole("alert");
    await expect(error).toBeVisible();
    const messages = {
      complete: "Não foi possível confirmar o envio do arquivo.",
      end: "Não foi possível enviar o arquivo.",
      json: "Não foi possível confirmar o envio do arquivo.",
      key: "A confirmação do arquivo é inválida.",
      owner: "Não foi possível enviar o arquivo.",
      put: "Não foi possível enviar o arquivo.",
      type: "A confirmação do arquivo é inválida.",
    };
    await expect(error).toContainText(messages[failure]);
    if (failure === "json") {
      await captureNavigationFrame(page, testInfo, "media-confirmation-error");
    }
    expect(transport.saves).toHaveLength(0);
    transport.failure = undefined;
    await page
      .getByRole("button", { exact: true, name: "Salvar rascunho" })
      .click();
    await expect(
      page.getByRole("heading", { exact: true, name: "Nova publicação" })
    ).toHaveCount(0);
    expect(transport.paths).toHaveLength(2);
    expect(transport.saves).toHaveLength(1);
    expect(transport.saves[0]?.mediaKey).toBe(transport.paths[1]);
  });
}
