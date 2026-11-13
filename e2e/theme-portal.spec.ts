import { expect, test } from "@playwright/test";
import { defaultPlatformConfig } from "../packages/api/src/contracts/platform";
import { protectAnonymousPage } from "./support/protect-anonymous-page";

test("published accent refresh reaches an already-open portalled menu", async ({
  baseURL,
  page,
}, testInfo) => {
  if (!baseURL) {
    throw new Error(
      "Portal checks require an explicit local application origin."
    );
  }
  const blocked = await protectAnonymousPage(page, baseURL);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.route("**/api/rpc/viewer/get*", (route) =>
    route.fulfill({
      json: {
        json: {
          creatorId: null,
          creatorStatus: null,
          email: "theme@example.test",
          id: "theme-fixture",
          image: null,
          name: "Pessoa de revisão",
          role: "member",
        },
      },
    })
  );
  await page.route("**/api/rpc/platform/get*", (route) =>
    route.fulfill({
      json: {
        json: {
          ...defaultPlatformConfig,
          brand: { ...defaultPlatformConfig.brand, accentColor: "#000000" },
        },
      },
    })
  );
  await page.goto("/checkout/demo");
  await page.getByRole("button", { name: "Abrir menu da conta" }).click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await page.clock.fastForward(60_100);
  await expect
    .poll(() =>
      page
        .locator("html")
        .evaluate((root) => root.style.getPropertyValue("--brand-accent"))
    )
    .toBe("#000000");
  const inherited = await menu.evaluate((element) => ({
    family: getComputedStyle(element).fontFamily,
    menu: getComputedStyle(element).getPropertyValue("--primary"),
    // This is a real Base UI portal, outside the application's React wrapper.
    outside: !element.closest("main"),
    root: getComputedStyle(document.documentElement).getPropertyValue(
      "--primary"
    ),
  }));
  expect(inherited.menu).toBe(inherited.root);
  const primaryPixel = await menu.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.setProperty("transition", "none", "important");
    probe.style.color = "var(--primary)";
    element.append(probe);
    const context = document.createElement("canvas").getContext("2d");
    if (!context) {
      throw new Error("Portal color checks require a canvas context.");
    }
    context.fillStyle = getComputedStyle(probe).color;
    context.fillRect(0, 0, 1, 1);
    probe.remove();
    return Array.from(context.getImageData(0, 0, 1, 1).data);
  });
  expect(primaryPixel).toEqual([0, 0, 0, 255]);
  expect(inherited.family).toContain("Hanken Grotesk");
  expect(inherited.outside).toBe(true);
  await testInfo.attach("published-accent-portal", {
    body: await page.screenshot({ fullPage: true, quality: 85, type: "jpeg" }),
    contentType: "image/jpeg",
  });
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  expect(blocked).toEqual([]);
});
