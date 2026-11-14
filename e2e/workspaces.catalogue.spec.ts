import { expect } from "@playwright/test";
import { test } from "./fixtures/anonymous-test";
import { assertNoHorizontalOverflow } from "./support/assert-no-horizontal-overflow";
import { captureNavigationFrame } from "./support/capture-navigation-frame";
import { openWorkspaceFixture } from "./support/open-workspace-fixture";

const sectionTriggerName = /^Selecionar seção:/;
const roles = [
  {
    labels: [
      "Visão geral",
      "Pessoas e equipe",
      "Criadores",
      "Denúncias",
      "Assinaturas",
      "Transações",
      "Conteúdo e marca",
      "Auditoria",
    ],
    role: "admin",
    selected: "audits",
  },
  { labels: ["Conteúdo e marca"], role: "editor", selected: "cms" },
  {
    labels: ["Pessoas e equipe", "Criadores", "Denúncias"],
    role: "moderator",
    selected: "reports",
  },
  {
    labels: ["Visão geral", "Assinaturas", "Transações"],
    role: "analyst",
    selected: "transactions",
  },
];

for (const dark of [false, true]) {
  for (const { role, labels, selected } of roles) {
    test(`${role} ${dark ? "dark" : "light"}: permitted section selection stays on the same route`, async ({
      page,
    }, testInfo) => {
      if (testInfo.project.name === "phone") {
        await page.setViewportSize({ height: 844, width: 320 });
      }
      await openWorkspaceFixture(page, { dark, interactive: true, role });
      const url = page.url();
      const target = labels.at(-1) ?? "";
      const trigger = page.getByRole("button", { name: sectionTriggerName });
      if ((page.viewportSize()?.width ?? 0) < 1024) {
        if (testInfo.project.use.hasTouch) {
          await trigger.tap();
        } else {
          await trigger.click();
        }
        const options = page.getByRole("menuitemradio");
        await expect(options).toHaveText(labels);
        for (const box of await options.evaluateAll((items) =>
          items.map((item) => item.getBoundingClientRect().height)
        )) {
          // Browser transforms can report 43.999969px for a 44px row.
          expect(Number(box.toFixed(3))).toBeGreaterThanOrEqual(44);
        }
        await captureNavigationFrame(page, testInfo, "workspace-section-menu");
        await page.keyboard.press("Escape");
        await expect(trigger).toBeFocused();
        await trigger.press("Enter");
        await page
          .getByRole("menuitemradio", { exact: true, name: target })
          .focus();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("menu")).toBeHidden();
        await expect(trigger).toContainText(target);
      } else {
        const nav = page.getByRole("navigation", {
          name: "Seções da operação",
        });
        await expect(nav.getByRole("button")).toHaveText(labels);
        if (role !== "admin") {
          const previous = await page.getByRole("status").textContent();
          const button = nav.getByRole("button").first();
          const value = await button.getAttribute("value");
          await button.evaluate((node) => node.setAttribute("value", "audits"));
          await button.click();
          await expect(page.getByRole("status")).toHaveText(previous ?? "");
          await button.evaluate(
            (node, original) => node.setAttribute("value", original ?? ""),
            value
          );
        }
        await nav.getByRole("button", { exact: true, name: target }).click();
        await expect(
          nav.getByRole("button", { exact: true, name: target })
        ).toHaveAttribute("aria-current", "page");
      }
      await expect(page.getByRole("status")).toHaveText(
        `Seção atual: ${selected}`
      );
      await expect(page).toHaveURL(url);
      await assertNoHorizontalOverflow(page);
    });
  }
  for (const scenario of ["owner", "active", "pending"]) {
    test(`${scenario} ${dark ? "dark" : "light"}: real workspace markup keeps context, targets and native return`, async ({
      page,
    }, testInfo) => {
      await openWorkspaceFixture(page, {
        dark,
        flags: "long",
        role: scenario === "owner" ? "admin" : scenario,
        workspace: scenario === "owner" ? "owner" : "studio",
      });
      await expect(page.getByRole("main")).toHaveCount(1);
      const back = page.getByRole("link", {
        exact: true,
        name: "Voltar à comunidade",
      });
      await expect(back).toHaveAttribute("href", "/");
      await expect(
        page.getByRole("button", { exact: true, name: "Voltar à comunidade" })
      ).toHaveCount(0);
      if (scenario === "owner") {
        if (testInfo.project.name === "phone") {
          await page.setViewportSize({ height: 844, width: 320 });
        } else if (testInfo.project.name === "desktop") {
          await page.setViewportSize({ height: 420, width: 1280 });
          const last = page
            .locator("aside")
            .getByRole("button", { exact: true, name: "Auditoria" });
          await last.focus();
          const box = await last.boundingBox();
          expect(box?.y).toBeGreaterThanOrEqual(0);
          expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(420);
        }
        const brand = page.getByRole("link", {
          name: `${"Privana".repeat(10)}, página inicial`,
        });
        await expect(brand).toBeVisible();
        const label = brand.locator("span").first();
        expect(
          await label.evaluate(
            (node) =>
              node.scrollWidth <= node.clientWidth &&
              node.scrollHeight <= node.clientHeight
          )
        ).toBe(true);
        const skip = page.getByRole("link", { name: "Pular para a operação" });
        await skip.focus();
        await skip.press("Enter");
        await expect(page.getByRole("main")).toBeFocused();
        await expect(
          page.getByRole("navigation", { name: "Navegação principal" })
        ).toHaveCount(0);
      } else {
        await expect(
          page.getByRole("link", { exact: true, name: "Ver perfil" })
        ).toHaveCount(scenario === "active" ? 1 : 0);
        await expect(
          page.getByRole("button", { exact: true, name: "Nova publicação" })
        ).toHaveCount(scenario === "active" ? 1 : 0);
        const sections = page.getByRole("group", { name: "Seções do estúdio" });
        const boxes = await sections
          .getByRole("button")
          .evaluateAll((items) =>
            items.map((item) => item.getBoundingClientRect().height)
          );
        expect(boxes.every((height) => height >= 44)).toBe(true);
      }
      await assertNoHorizontalOverflow(page);
      await captureNavigationFrame(page, testInfo, "workspace-shell");
      await back.focus();
      await back.press("Enter");
      await expect(page).toHaveURL(new URL("/", page.url()).href);
      await page.goBack();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }
}
