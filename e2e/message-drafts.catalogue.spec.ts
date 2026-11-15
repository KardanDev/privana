import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { openMessageFixture } from "./support/open-message-fixture";

for (const dark of [false, true]) {
  test(`${dark ? "dark" : "light"}: cross-conversation sends settle out of order without replacing drafts`, async ({
    page,
  }) => {
    await openMessageFixture(page, dark);
    const finish: Partial<Record<string, () => void>> = {};
    const history: Record<
      string,
      { body: string; createdAt: string; id: string; senderId: string }[]
    > = {};
    await page.route("**/api/rpc/messages/get", async (route) => {
      const { json: input } = route.request().postDataJSON();
      await route.fulfill({
        body: JSON.stringify({ json: history[input.conversationId] ?? [] }),
        contentType: "application/json",
      });
    });
    await page.route("**/api/rpc/messages/send", async (route) => {
      const { json: attempt } = route.request().postDataJSON();
      await new Promise<void>((resolve) => {
        finish[attempt.conversationId] = resolve;
      });
      const message = {
        body: attempt.body,
        createdAt: "2026-11-01T12:00:00.000Z",
        id: attempt.clientMessageId,
        senderId: "fictional-viewer",
      };
      history[attempt.conversationId] = [message];
      await route.fulfill({
        body: JSON.stringify({ json: message }),
        contentType: "application/json",
      });
    });
    const composer = page.getByRole("textbox", { name: "Sua mensagem" });
    await page.getByRole("button", { exact: true, name: "Conversa A" }).click();
    await composer.fill("Mensagem A");
    await page
      .getByRole("button", { exact: true, name: "Enviar mensagem" })
      .click();
    await composer.fill("Próxima de A");
    await page.getByRole("button", { exact: true, name: "Conversa B" }).click();
    await composer.fill("Mensagem B");
    await page
      .getByRole("button", { exact: true, name: "Enviar mensagem" })
      .click();
    await composer.fill("Próxima de B");
    await expect.poll(() => Object.keys(finish).length).toBe(2);
    const finishA = finish["conversation-a"];
    const finishB = finish["conversation-b"];
    if (!(finishA && finishB)) {
      throw new Error(
        "Both fictional sends must be pending before confirmation"
      );
    }
    finishB();
    await expect(page.getByLabel("Enviada", { exact: true })).toHaveCount(1);
    await expect(composer).toHaveValue("Próxima de B");
    finishA();
    await page.getByRole("button", { exact: true, name: "Conversa A" }).click();
    await expect(page.getByLabel("Enviada", { exact: true })).toHaveCount(1);
    await expect(composer).toHaveValue("Próxima de A");
  });
  test(`${dark ? "dark" : "light"}: drafts survive switching and closing conversation panels`, async ({
    page,
  }, testInfo) => {
    await openMessageFixture(page, dark);
    await page.getByRole("button", { exact: true, name: "Conversa A" }).click();
    const composer = page.getByRole("textbox", { name: "Sua mensagem" });
    await composer.pressSequentially("Olá, São Paulo! 💜");
    await expect(composer).toHaveValue("Olá, São Paulo! 💜");
    await page.getByRole("button", { exact: true, name: "Conversa B" }).click();
    await composer.fill("Só para B");
    await page.getByRole("button", { name: "Voltar às conversas" }).click();
    await expect(composer).toHaveCount(0);
    await page.getByRole("button", { exact: true, name: "Conversa A" }).click();
    await expect(composer).toHaveValue("Olá, São Paulo! 💜");
    await captureNavigationFrame(page, testInfo, "draft-return");
    await page.getByRole("button", { exact: true, name: "Conversa B" }).click();
    await expect(composer).toHaveValue("Só para B");
    await assertNoHorizontalOverflow(page);
    await page.reload();
    await page.getByRole("button", { exact: true, name: "Conversa A" }).click();
    await expect(composer).toHaveValue("");
  });

  for (const newer of [false, true]) {
    test(`${dark ? "dark" : "light"}: late failure ${newer ? "preserves newer typing" : "restores a remounted conversation"}`, async ({
      page,
    }) => {
      await openMessageFixture(page, dark);
      let release: (() => void) | undefined;
      const held = new Promise<void>((resolve) => {
        release = resolve;
      });
      let requests = 0;
      await page.route("**/api/rpc/messages/send", async (route) => {
        requests += 1;
        await held;
        await route.abort("failed");
      });
      await page
        .getByRole("button", { exact: true, name: "Conversa A" })
        .click();
      const composer = page.getByRole("textbox", { name: "Sua mensagem" });
      await composer.fill("Envio de A");
      await page
        .getByRole("button", { exact: true, name: "Enviar mensagem" })
        .click();
      await expect.poll(() => requests).toBe(1);
      if (newer) {
        await composer.fill("Nova ideia de A");
      }
      await page
        .getByRole("button", { exact: true, name: "Conversa B" })
        .click();
      await composer.fill("Rascunho de B");
      if (!newer) {
        await page
          .getByRole("button", { exact: true, name: "Conversa A" })
          .click();
      }
      release?.();
      if (newer) {
        await expect(composer).toHaveValue("Rascunho de B");
        await page
          .getByRole("button", { exact: true, name: "Conversa A" })
          .click();
      }
      await expect(
        page
          .getByRole("alert")
          .filter({ hasText: "Não foi possível confirmar o envio." })
      ).toBeVisible();
      await expect(composer).toHaveValue(
        newer ? "Nova ideia de A" : "Envio de A"
      );
      await page
        .getByRole("button", { exact: true, name: "Conversa B" })
        .click();
      await expect(composer).toHaveValue("Rascunho de B");
    });
  }

  test(`${dark ? "dark" : "light"}: retry reuses its request and preserves text typed during confirmation`, async ({
    page,
  }, testInfo) => {
    await openMessageFixture(page, dark);
    const attempts: { clientMessageId: string; body: string }[] = [];
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/api/rpc/messages/send", async (route) => {
      const { json: attempt } = route.request().postDataJSON();
      attempts.push(attempt);
      if (attempts.length === 1) {
        await route.abort("failed");
        return;
      }
      await held;
      await route.fulfill({
        body: JSON.stringify({
          json: {
            body: attempt.body,
            createdAt: "2026-11-01T12:00:00.000Z",
            id: attempt.clientMessageId,
            senderId: "fictional-viewer",
          },
        }),
        contentType: "application/json",
      });
    });
    await page.getByRole("button", { exact: true, name: "Conversa A" }).click();
    const composer = page.getByRole("textbox", { name: "Sua mensagem" });
    await composer.fill("Uma mensagem");
    await page
      .getByRole("button", { exact: true, name: "Enviar mensagem" })
      .click();
    await expect(page.getByRole("button", { name: "Reenviar" })).toBeVisible();
    await captureNavigationFrame(page, testInfo, "draft-failed");
    await page.getByRole("button", { name: "Reenviar" }).click();
    await expect.poll(() => attempts.length).toBe(2);
    await composer.fill("Texto escrito durante o reenvio");
    await composer.press("Enter");
    await expect(
      page.getByRole("button", { exact: true, name: "Enviando mensagem" })
    ).toBeDisabled();
    release?.();
    await expect(page.getByLabel("Enviada", { exact: true })).toHaveCount(1);
    expect(attempts).toHaveLength(2);
    expect(attempts[1]?.clientMessageId).toBe(attempts[0]?.clientMessageId);
    await expect(composer).toHaveValue("Texto escrito durante o reenvio");
    await expect(page.getByRole("button", { name: "Reenviar" })).toHaveCount(0);
  });
}
