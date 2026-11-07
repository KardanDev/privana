import { mkdir, readFile, writeFile } from "node:fs/promises";
import { type BrowserContext, chromium } from "@playwright/test";
import { z } from "zod";
import { readBrowserTarget } from "../../e2e/support/read-browser-target";
import { baselineTargets } from "./baseline-targets";
import { measurePage } from "./measure-page";
import { protectBaseline } from "./protect-baseline";
import { signInBaseline } from "./sign-in-baseline";

if (process.env.ALLOW_DESIGN_BASELINE !== "1") {
  throw new Error(
    "Set ALLOW_DESIGN_BASELINE=1 after reviewing the running server's development resources."
  );
}
const origin = readBrowserTarget({
  ...process.env,
  ALLOW_BROWSER_SMOKE: "1",
  BROWSER_SMOKE_ORIGIN: process.env.DESIGN_BASELINE_ORIGIN,
});
const manifest = z
  .object({
    accounts: z.array(
      z.object({ email: z.email(), key: z.string(), password: z.string() })
    ),
    status: z.literal("ready"),
  })
  .parse(
    JSON.parse(await readFile("apps/web/.local-demo-credentials.json", "utf8"))
  );
const output = "docs/planning/m015-baseline/evidence";
await mkdir(output, { recursive: true });
await mkdir("output/playwright", { recursive: true });
const browser = await chromium.launch({ headless: true });
const contexts = new Map<string, BrowserContext>();
const observations: (Awaited<ReturnType<typeof measurePage>> & {
  fixture: string;
  path: string;
  screenshot: string;
  status: number | undefined;
  blocked: string[];
})[] = [];
try {
  for (const target of baselineTargets) {
    let context = contexts.get(target.role);
    if (!context) {
      // biome-ignore lint/performance/noAwaitInLoops: Bound cloud sessions and capture one role at a time.
      context = await browser.newContext({
        locale: "pt-BR",
        serviceWorkers: "block",
      });
      contexts.set(target.role, context);
      if (target.role !== "anonymous") {
        const account = manifest.accounts.find(
          (item) => item.key === target.role
        );
        if (!account) {
          throw new Error(`Missing demo fixture key: ${target.role}`);
        }
        await signInBaseline(context, origin, account);
      }
    }
    const page = await context.newPage();
    try {
      const blocked: string[] = [];
      await protectBaseline(context, origin, blocked);
      await page.setViewportSize({
        height: target.width < 500 ? 844 : 1000,
        width: target.width,
      });
      await page.addInitScript(
        (theme) => localStorage.setItem("theme", theme),
        target.theme
      );
      const response = await page.goto(`${origin}${target.path}`, {
        timeout: 60_000,
        waitUntil: "networkidle",
      });
      await page.waitForFunction(
        () => !document.querySelector('[data-slot="skeleton"]'),
        undefined,
        { timeout: 30_000 }
      );
      if ("button" in target) {
        await page
          .getByRole("button", { exact: true, name: target.button })
          .click();
      }
      const screenshot = `${output}/${target.key}.jpg`;
      await page.screenshot({
        fullPage: false,
        mask: [page.locator('input[type="email"], input[type="password"]')],
        path: screenshot,
        quality: 75,
        style:
          "nextjs-portal, [aria-label='Open Tanstack query devtools'] { visibility: hidden !important; }",
        type: "jpeg",
      });
      const observation = {
        blocked,
        fixture: target.role,
        path: target.path,
        screenshot,
        status: response?.status(),
        ...(await measurePage(page)),
      };
      observations.push(observation);
      process.stdout.write(
        `${target.key}: HTTP ${observation.status}, ${observation.theme}, overflow=${observation.horizontalOverflow}\n`
      );
    } finally {
      await page.close();
      await context.unrouteAll({ behavior: "wait" });
    }
  }
} finally {
  await browser.close();
}
await writeFile(
  "output/playwright/m015-baseline-observations.json",
  `${JSON.stringify({ baseline: process.env.DESIGN_BASELINE_COMMIT ?? "working-tree", capturedAt: new Date().toISOString(), observations, origin }, null, 2)}\n`
);
