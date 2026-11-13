import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
let bundle: string | undefined;

export async function buildControlsFixture(): Promise<string> {
  if (bundle !== undefined) {
    return bundle;
  }
  const output = resolve("output/playwright/controls-fixture.js");
  await run(
    "bun",
    [
      "build",
      "apps/web/tests/fixtures/mount-controls-review.tsx",
      "--target=browser",
      "--minify",
      `--outfile=${output}`,
    ],
    { timeout: 30_000 }
  );
  bundle = await readFile(output, "utf8");
  return bundle;
}
