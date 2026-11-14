import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
export type ReviewFixture = "controls" | "feedback";
const bundles = new Map<ReviewFixture, string>();

export async function buildReviewFixture(kind: ReviewFixture): Promise<string> {
  const bundle = bundles.get(kind);
  if (bundle !== undefined) {
    return bundle;
  }
  const output = resolve(`output/playwright/${kind}-fixture.js`);
  await run(
    "bun",
    [
      "build",
      `apps/web/tests/fixtures/mount-${kind}-review.tsx`,
      "--target=browser",
      "--minify",
      `--outfile=${output}`,
    ],
    { timeout: 30_000 }
  );
  const content = await readFile(output, "utf8");
  bundles.set(kind, content);
  return content;
}
