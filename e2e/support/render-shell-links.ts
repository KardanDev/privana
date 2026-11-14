import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const output = resolve("output/playwright/render-shell-links.mjs");
let built: Promise<unknown> | undefined;

export async function renderShellLinks(
  registration: boolean,
  operations: boolean,
  scenario = "",
  flags = ""
): Promise<string> {
  built ??= run(
    "bun",
    [
      "build",
      "apps/web/tests/fixtures/render-shell-links.tsx",
      "--target=node",
      "--production",
      "--env=disable",
      `--outfile=${output}`,
    ],
    { timeout: 30_000 }
  );
  await built;
  const { stdout } = await run(
    "node",
    [
      output,
      registration ? "open" : "closed",
      operations ? "operations" : "entry",
      scenario,
      flags,
    ],
    { timeout: 30_000 }
  );
  return stdout;
}
