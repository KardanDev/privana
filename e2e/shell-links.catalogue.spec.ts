import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { openShellLinksFixture } from "./support/open-shell-links-fixture";

const destination = /\/(?:login|register|studio)?$/;
const studioDestination = /\/studio$/;
const registrationDestination = /\/register$/;
const signInDestination = /\/login$/;
const privateDestinations =
  'a[href="/messages"], a[href="/saved"], a[href="/memberships"], a[href="/studio"], a[href="/settings"]';
const workspaceCases = [
  ["fan", "Quero publicar"],
  ["active", "Estúdio"],
  ["pending", "Minha candidatura"],
  ["suspended", "Estúdio"],
  ["unknown", "Estúdio"],
  ["staff", "Quero publicar"],
  ["editor", "Quero publicar"],
  ["moderator", "Quero publicar"],
  ["analyst", "Quero publicar"],
] as const;
test.beforeEach(async ({ page }) => {
  await page.route(destination, (route) =>
    route.fulfill({
      body: "<html lang=pt-BR><body><main>Destino local de revisão</main></body></html>",
      contentType: "text/html",
    })
  );
});

test("entry navigation exposes links and follows existing keyboard destinations", async ({
  page,
}) => {
  await openShellLinksFixture(page);
  const entry = page.getByRole("region", {
    name: "Entrada pela barra lateral",
  });
  const signIn = entry.getByRole("link", { exact: true, name: "Entrar" });
  await expect(signIn).toHaveAttribute("href", "/login");
  await expect(
    entry.getByRole("button", { exact: true, name: "Entrar" })
  ).toHaveCount(0);
  const registration = page.locator("header").getByRole("link", {
    exact: true,
    includeHidden: true,
    name: "Criar conta",
  });
  await expect(registration).toHaveAttribute("href", "/register");
  await expect(
    page
      .locator("header")
      .getByRole("button", { includeHidden: true, name: "Criar conta" })
  ).toHaveCount(0);
  await assertNoHorizontalOverflow(page);
  if ((page.viewportSize()?.width ?? 0) < 1024) {
    await registration.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(registrationDestination);
    await openShellLinksFixture(page);
  }
  await signIn.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(signInDestination);
});

test("disabled registration removes both public entries", async ({ page }) => {
  await openShellLinksFixture(page, { registration: false });
  await expect(
    page.getByRole("link", { includeHidden: true, name: "Criar conta" })
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { includeHidden: true, name: "Criar conta" })
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("region", { name: "Entrada pela barra lateral" })
      .getByRole("link", { exact: true, name: "Entrar" })
  ).toBeVisible();
});

test("operations return stays a link while section controls stay buttons", async ({
  page,
}) => {
  await openShellLinksFixture(page, { dark: true, operations: true });
  const back = page.getByRole("link", { name: "Ver plataforma" });
  await expect(back).toHaveAttribute("href", "/");
  await expect(
    page.getByRole("button", { name: "Ver plataforma" })
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { exact: true, name: "Visão geral" })
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("button", { name: "Alternar tema claro ou escuro" })
  ).toBeVisible();
  await assertNoHorizontalOverflow(page);
  await back.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new URL("/", page.url()).href);
});

for (const scenario of ["anonymous", "loading"]) {
  test(`${scenario} navigation omits private destinations and authenticated phone tabs`, async ({
    page,
  }) => {
    await openShellLinksFixture(page, { scenario });
    await expect(page.locator(privateDestinations)).toHaveCount(0);
    await expect(page.locator("body > nav")).toHaveCount(0);
    await expect(page.locator('aside a[href="/explore"]')).toHaveCount(1);
    await assertNoHorizontalOverflow(page);
    await page.setViewportSize({ height: 740, width: 320 });
    await openShellLinksFixture(page, { scenario });
    await assertNoHorizontalOverflow(page);
  });
}

for (const [scenario, label] of workspaceCases) {
  test(`${scenario} desktop workspace entry retains account context and destination`, async ({
    page,
  }) => {
    await openShellLinksFixture(page, { scenario });
    const rail = page.locator("aside");
    const studio = rail.getByRole("link", {
      exact: true,
      includeHidden: true,
      name: label,
    });
    await expect(studio).toHaveAttribute("href", "/studio");
    await expect(rail.locator('a[href="/studio"]')).toHaveCount(1);
    await expect(rail.locator('a[href="/settings"]')).toHaveCount(2);
    await expect(rail.getByLabel("Nova publicação")).toHaveCount(0);
    await expect(rail.locator('a[href="/admin"]')).toHaveCount(
      ["staff", "editor", "moderator", "analyst"].includes(scenario) ? 1 : 0
    );
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      await studio.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(studioDestination);
    }
  });
}

for (const dark of [false, true]) {
  for (const scenario of [
    "anonymous",
    "fan",
    "active",
    "pending",
    "suspended",
  ]) {
    test(`${scenario} with closed applications in ${dark ? "dark" : "light"} preserves profile access and CMS switches`, async ({
      page,
    }) => {
      await openShellLinksFixture(page, {
        dark,
        flags: "applications-off messaging-off long",
        registration: false,
        scenario,
      });
      const rail = page.locator("aside");
      await expect(rail.locator('a[href="/messages"]')).toHaveCount(0);
      await expect(
        page.getByRole("link", { includeHidden: true, name: "Criar conta" })
      ).toHaveCount(0);
      await expect(rail.getByLabel("Quero publicar")).toHaveCount(0);
      await expect(rail.locator('a[href="/studio"]')).toHaveCount(
        ["active", "pending", "suspended"].includes(scenario) ? 1 : 0
      );
      if (scenario === "active") {
        await expect(
          rail.getByRole("link", {
            includeHidden: true,
            name: "Meu espaço de criação e acompanhamento de conteúdo",
          })
        ).toHaveAttribute("href", "/studio");
        if ((page.viewportSize()?.width ?? 0) >= 1280) {
          expect(
            await rail
              .locator('a[href="/studio"] span')
              .evaluate(
                (label) =>
                  label.scrollWidth <= label.clientWidth &&
                  label.scrollHeight <= label.clientHeight
              )
          ).toBe(true);
        }
      }
      await assertNoHorizontalOverflow(page);
    });
  }
}
