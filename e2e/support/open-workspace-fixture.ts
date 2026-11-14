import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";
import type { Page } from "@playwright/test";
import { buildReviewFixture } from "./build-review-fixture";

const run = promisify(execFile);
const output = resolve("output/playwright/render-workspace-review.mjs");
let built: Promise<unknown> | undefined;

export async function openWorkspaceFixture(
  page: Page,
  {
    workspace = "owner",
    role = "admin",
    dark = false,
    flags = "",
    interactive = false,
  } = {}
): Promise<void> {
  built ??= run(
    "bun",
    [
      "build",
      "apps/web/tests/fixtures/render-workspace-review.tsx",
      "--target=node",
      "--production",
      "--env=disable",
      `--outfile=${output}`,
    ],
    { timeout: 30_000 }
  );
  await built;
  const { stdout } = await run("node", [output, workspace, role, flags], {
    timeout: 30_000,
  });
  if (interactive) {
    const bundle = await buildReviewFixture("workspaces");
    await page.route("**/workspace-review.js", (route) =>
      route.fulfill({ body: bundle, contentType: "text/javascript" })
    );
  }
  const content = interactive
    ? `<div id="control-review" data-role="${role}"></div><script src="/workspace-review.js" defer></script>`
    : stdout;
  await page.route("**/__workspace-review", (route) =>
    route.fulfill({
      body: `<!doctype html><html lang="pt-BR" class="${dark ? "dark" : ""}" style="color-scheme:${dark ? "dark" : "light"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/catalogue.css"></head><body>${content}</body></html>`,
      contentType: "text/html",
      headers: {
        "Content-Security-Policy":
          "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
      },
    })
  );
  await page.goto("/__workspace-review");
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
}
