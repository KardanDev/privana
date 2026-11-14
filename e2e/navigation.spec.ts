import { expect } from "@playwright/test";
import { defaultPlatformConfig } from "../packages/api/src/contracts/platform";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { openNavigationPage } from "./support/open-navigation-page";

const darkClass = /(?:^|\s)dark(?:\s|$)/;
const loginDestination = /\/login(?:\?|$)/;

for (const scenario of ["fan", "active", "pending", "suspended", "staff"]) {
  test(`${scenario}: account menu keeps routes, keyboard focus and one task search`, async ({
    page,
  }, testInfo) => {
    // Real Next runtime, fictional read responses; never an authentication grant.
    await openNavigationPage(page, scenario);
    await expect(page.getByRole("searchbox")).toHaveCount(1);
    if (scenario === "active") {
      await page.setViewportSize({ height: 740, width: 320 });
    }
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      await expect(
        page.getByRole("button", { exact: true, name: "Conta" })
      ).toBeHidden();
      if (scenario === "staff") {
        await captureNavigationFrame(page, testInfo, "navigation-desktop");
      }
      return;
    }
    const trigger = page.getByRole("button", { exact: true, name: "Conta" });
    await expect(
      page.locator('header button[aria-haspopup="menu"]')
    ).toHaveCount(0);
    const navigation = page.getByRole("navigation", {
      exact: true,
      name: "Navegação principal",
    });
    await expect(navigation.locator('a[href="/studio"]')).toHaveCount(
      scenario === "active" ? 1 : 0
    );
    const targets = await navigation
      .locator(":scope > a, :scope > button")
      .evaluateAll((items) =>
        items.map((item) => ({
          height: item.getBoundingClientRect().height,
          width: item.getBoundingClientRect().width,
        }))
      );
    expect(targets.length).toBeGreaterThanOrEqual(3);
    expect(
      targets.every((target) => target.width >= 44 && target.height >= 44)
    ).toBe(true);
    await trigger.focus();
    const messageLabel = navigation.locator('a[href="/messages"] span');
    if (
      scenario === "active" &&
      (await messageLabel.textContent()) === "Mensagens"
    ) {
      expect(
        await messageLabel.evaluate((label) => {
          const range = document.createRange();
          range.selectNodeContents(label);
          return range.getClientRects().length;
        })
      ).toBe(1);
    }
    await page.keyboard.press("Enter");
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    await captureNavigationFrame(page, testInfo, "navigation-menu");
    await expect(menu.locator('a[href="/saved"]')).toBeVisible();
    await expect(menu.locator('a[href="/memberships"]')).toBeVisible();
    await expect(
      menu.getByRole("menuitem", { exact: true, name: "Configurações" })
    ).toHaveAttribute("href", "/settings");
    await expect(menu.locator('a[href="/admin"]')).toHaveCount(
      scenario === "staff" ? 1 : 0
    );
    if (scenario === "pending") {
      await expect(
        menu.getByRole("menuitem", { name: "Minha candidatura" })
      ).toHaveAttribute("href", "/studio");
    }
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await expect(menu).toBeHidden();
    await assertNoHorizontalOverflow(page);
  });
}

test("touch menu changes theme and preserves server protection and browser back context", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ height: 740, width: 320 });
  await openNavigationPage(page, "pending");
  const trigger = page.getByRole("button", { exact: true, name: "Conta" });
  if (testInfo.project.use.hasTouch) {
    await trigger.tap();
  } else {
    await trigger.click();
  }
  await page
    .getByRole("menuitem", {
      exact: true,
      name: "Alternar tema claro ou escuro",
    })
    .click();
  await expect(page.locator("html")).toHaveClass(darkClass);
  await expect(page.getByRole("menu")).toBeHidden();
  await trigger.click();
  await captureNavigationFrame(page, testInfo, "navigation-dark");
  await page.getByRole("menu").locator('a[href="/saved"]').click();
  // Fictional viewer props must not bypass the real anonymous server guard.
  await expect(page).toHaveURL(loginDestination);
  await page.goBack();
  await expect(
    page.getByRole("searchbox", { name: "Buscar criadores" })
  ).toHaveValue("fixture");
  await expect(trigger).toBeVisible();
});

for (const scenario of ["fan", "active", "pending"]) {
  test(`${scenario}: published label and feature updates keep the compact menu usable`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ height: 740, width: 320 });
    await page.clock.install();
    const config = {
      ...defaultPlatformConfig,
      features: {
        ...defaultPlatformConfig.features,
        creatorApplications: false,
        messaging: false,
      },
      navigation: {
        ...defaultPlatformConfig.navigation,
        home: "H".repeat(80),
        memberships: "A".repeat(80),
        saved: "S".repeat(80),
        studio: "E".repeat(80),
      },
    };
    await page.route("**/api/rpc/platform/get", (route) =>
      route.fulfill({
        body: JSON.stringify({ json: config }),
        contentType: "application/json",
      })
    );
    await openNavigationPage(page, scenario);
    await page.clock.fastForward(61_000);
    const navigation = page.getByRole("navigation", {
      exact: true,
      name: "Navegação principal",
    });
    await expect(navigation.locator('a[href="/messages"]')).toHaveCount(0);
    const widths = await navigation
      .locator(":scope > a, :scope > button")
      .evaluateAll((items) =>
        items.map((item) => item.getBoundingClientRect().width)
      );
    expect(widths).toHaveLength(scenario === "active" ? 4 : 3);
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
    await expect(navigation.locator('a[href="/studio"]')).toHaveCount(
      scenario === "active" ? 1 : 0
    );
    const trigger = page.getByRole("button", { exact: true, name: "Conta" });
    await trigger.click();
    const menu = page.getByRole("menu");
    await expect(
      menu.getByRole("menuitem", { exact: true, name: config.navigation.saved })
    ).toBeVisible();
    await expect(menu.locator('a[href="/studio"]')).toHaveCount(
      scenario === "fan" ? 0 : 1
    );
    await captureNavigationFrame(page, testInfo, "navigation-long");
    const menuBox = await menu.boundingBox();
    const triggerBox = await trigger.boundingBox();
    expect(menuBox?.y).toBeGreaterThanOrEqual(0);
    expect((menuBox?.y ?? 0) + (menuBox?.height ?? 0)).toBeLessThanOrEqual(
      triggerBox?.y ?? 0
    );
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await assertNoHorizontalOverflow(page);
  });
}
