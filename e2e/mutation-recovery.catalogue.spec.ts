import { expect } from "@playwright/test";
import { post } from "../apps/web/tests/posts/social-fixtures";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { openMutationFixture } from "./support/open-mutation-fixture";

const MUTATION_ROUTES =
  /\/api\/rpc\/(notifications\/markRead|settings\/update|memberships\/request|creators\/setFollow)$/;

for (const dark of [false, true]) {
  test(`${dark ? "dark" : "light"}: a failed like preserves a successful bookmark and blocks duplicate surfaces`, async ({
    page,
  }, testInfo) => {
    await openMutationFixture(page, dark);
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    let likes = 0;
    let bookmarks = 0;
    await page.route("**/api/rpc/posts/setLike", async (route) => {
      likes += 1;
      await held;
      await route.abort("failed");
    });
    await page.route("**/api/rpc/posts/setBookmark", async (route) => {
      bookmarks += 1;
      await route.fulfill({
        body: JSON.stringify({ json: {} }),
        contentType: "application/json",
      });
    });
    await page.route("**/api/rpc/feed/list", (route) =>
      route.fulfill({
        body: JSON.stringify({
          json: {
            items: [{ ...post, bookmarkCount: 3, isBookmarked: true }],
            nextCursor: null,
          },
        }),
        contentType: "application/json",
      })
    );
    await page
      .getByRole("button", { exact: true, name: "Curtir publicação" })
      .evaluateAll((buttons) => {
        for (const button of buttons) {
          if (button instanceof HTMLButtonElement) {
            button.click();
          }
        }
      });
    await expect.poll(() => likes).toBe(1);
    await expect(
      page
        .getByRole("button", { exact: true, name: "Descurtir publicação" })
        .first()
    ).toHaveText("5");
    await page
      .getByRole("button", { exact: true, name: "Salvar publicação" })
      .evaluateAll((buttons) => {
        for (const button of buttons) {
          if (button instanceof HTMLButtonElement) {
            button.click();
          }
        }
      });
    await expect.poll(() => bookmarks).toBe(1);
    await expect(
      page.getByRole("button", { exact: true, name: "Remover dos salvos" })
    ).toHaveCount(2);
    await expect(
      page
        .getByRole("button", { exact: true, name: "Remover dos salvos" })
        .first()
    ).toBeEnabled();
    await expect(
      page
        .getByRole("button", { exact: true, name: "Descurtir publicação" })
        .first()
    ).toHaveText("5");
    release?.();
    await expect(
      page
        .getByRole("button", { exact: true, name: "Curtir publicação" })
        .first()
    ).toBeEnabled();
    await expect(
      page
        .getByRole("button", { exact: true, name: "Curtir publicação" })
        .first()
    ).toHaveText("4");
    await expect(
      page.getByRole("button", { exact: true, name: "Remover dos salvos" })
    ).toHaveCount(2);
    await captureNavigationFrame(page, testInfo, "independent-rollback");
  });

  test(`${dark ? "dark" : "light"}: a refreshed social count survives a late rejected response`, async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name === "phone") {
      await page.setViewportSize({ height: 844, width: 320 });
    }
    await openMutationFixture(page, dark);
    let release: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/api/rpc/posts/setLike", async (route) => {
      await held;
      await route.abort("failed");
    });
    await page
      .getByRole("button", { exact: true, name: "Curtir publicação" })
      .first()
      .click();
    await expect(
      page
        .getByRole("button", { exact: true, name: "Descurtir publicação" })
        .first()
    ).toHaveText("5");
    let reads = 0;
    let reconcile: (() => void) | undefined;
    const heldRefresh = new Promise<void>((resolve) => {
      reconcile = resolve;
    });
    await page.route("**/api/rpc/feed/list", async (route) => {
      reads += 1;
      if (reads > 1) {
        await heldRefresh;
      }
      await route.fulfill({
        body: JSON.stringify({
          json: {
            items: [{ ...post, isLiked: true, likeCount: 12 }],
            nextCursor: null,
          },
        }),
        contentType: "application/json",
      });
    });
    await page.getByRole("button", { name: "Atualizar publicação" }).click();
    await expect(
      page
        .getByRole("button", { exact: true, name: "Descurtir publicação" })
        .first()
    ).toHaveText("12");
    release?.();
    await expect.poll(() => reads).toBe(2);
    await expect(
      page
        .getByRole("button", { exact: true, name: "Descurtir publicação" })
        .first()
    ).toHaveText("12");
    reconcile?.();
    await expect(
      page
        .getByRole("button", { exact: true, name: "Descurtir publicação" })
        .first()
    ).toBeEnabled();
    await expect(
      page
        .getByRole("button", { exact: true, name: "Descurtir publicação" })
        .first()
    ).toHaveText("12");
    await captureNavigationFrame(page, testInfo, "refreshed-rollback");
    await assertNoHorizontalOverflow(page);
  });

  test(`${dark ? "dark" : "light"}: read, settings and interest failures allow safe retry without duplicate requests`, async ({
    page,
  }, testInfo) => {
    await openMutationFixture(page, dark);
    const attempts: Record<string, number> = {};
    const releases: Record<string, (() => void) | undefined> = {};
    await page.route(MUTATION_ROUTES, async (route) => {
      const path = new URL(route.request().url()).pathname;
      attempts[path] = (attempts[path] ?? 0) + 1;
      await new Promise<void>((resolve) => {
        releases[path] = resolve;
      });
      await route.abort("failed");
    });
    await page
      .getByRole("button", { name: "Ler notificações" })
      .evaluate((button) => {
        if (button instanceof HTMLButtonElement) {
          button.click();
          button.click();
        }
      });
    await expect(page.getByLabel("Não lidas", { exact: true })).toHaveText("0");
    await page.getByRole("textbox", { name: "Seu nome" }).fill("Camila Teste");
    await page.locator("form").evaluate((form) => {
      if (form instanceof HTMLFormElement) {
        form.requestSubmit();
        form.requestSubmit();
      }
    });
    await expect(
      page.getByRole("textbox", { name: "Seu nome" })
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Avise-me no lançamento" })
      .evaluateAll((buttons) => {
        for (const button of buttons) {
          if (button instanceof HTMLButtonElement) {
            button.click();
          }
        }
      });
    await expect(page.getByLabel("Situação dos interesses")).toHaveText(
      "INTEREST_REGISTERED"
    );
    await page
      .getByRole("button", { exact: true, name: "Seguir Luna" })
      .evaluateAll((buttons) => {
        for (const button of buttons) {
          if (button instanceof HTMLButtonElement) {
            button.click();
          }
        }
      });
    await expect.poll(() => Object.keys(attempts).length).toBe(4);
    expect(Object.values(attempts)).toEqual([1, 1, 1, 1]);
    for (const release of Object.values(releases)) {
      release?.();
    }
    await expect(page.getByLabel("Não lidas", { exact: true })).toHaveText("2");
    await expect(page.getByRole("textbox", { name: "Seu nome" })).toBeEnabled();
    await expect(page.getByRole("textbox", { name: "Seu nome" })).toHaveValue(
      "Camila Teste"
    );
    await expect(page.getByRole("alert")).toHaveText(
      "Não foi possível salvar."
    );
    await expect(page.getByLabel("Situação dos interesses")).toHaveText(
      "Nenhum interesse"
    );
    await expect(
      page.getByRole("button", { name: "Avise-me no lançamento" }).first()
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { exact: true, name: "Seguir Luna" }).first()
    ).toBeEnabled();
    await page
      .getByRole("button", { name: "Avise-me no lançamento" })
      .evaluateAll((buttons) => {
        for (const button of buttons) {
          if (button instanceof HTMLButtonElement) {
            button.click();
          }
        }
      });
    await expect.poll(() => attempts["/api/rpc/memberships/request"]).toBe(2);
    releases["/api/rpc/memberships/request"]?.();
    await expect(
      page.getByRole("button", { name: "Avise-me no lançamento" }).first()
    ).toBeEnabled();
    await captureNavigationFrame(page, testInfo, "settings-retry");
  });
}
