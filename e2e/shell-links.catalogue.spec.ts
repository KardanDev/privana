import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { openShellLinksFixture } from "./support/open-shell-links-fixture";

const destination = /\/(?:login|register)?$/;
const registrationDestination = /\/register$/;
const signInDestination = /\/login$/;
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
