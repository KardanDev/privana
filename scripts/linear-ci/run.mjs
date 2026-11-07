import { appendFile, readFile } from "node:fs/promises";
import { repository } from "./config.mjs";
import { report } from "./report.mjs";
import { requestJson } from "./request-json.mjs";

try {
  const {
    GITHUB_EVENT_NAME,
    GITHUB_EVENT_PATH,
    GITHUB_REPOSITORY,
    GITHUB_TOKEN,
    LINEAR_API_KEY,
    GITHUB_STEP_SUMMARY,
  } = process.env;
  if (
    !(
      GITHUB_EVENT_PATH &&
      GITHUB_TOKEN &&
      LINEAR_API_KEY &&
      GITHUB_REPOSITORY === repository
    )
  ) {
    throw new Error(
      "Configure LINEAR_API_KEY as a Privana Actions secret; this reporter requires trusted workflow context."
    );
  }
  const result = await report({
    event: JSON.parse(await readFile(GITHUB_EVENT_PATH, "utf8")),
    eventName: GITHUB_EVENT_NAME,
    requestGitHub: (path) =>
      requestJson(`https://api.github.com${path}`, { token: GITHUB_TOKEN }),
    requestLinear: (query, variables) =>
      requestJson("https://api.linear.app/graphql", {
        body: { query, variables },
        token: LINEAR_API_KEY,
      }),
  });
  const summary = `## Linear update\n\nResult: ${result}. No issue state, merge or deployment was changed.\n`;
  if (GITHUB_STEP_SUMMARY) {
    await appendFile(GITHUB_STEP_SUMMARY, summary);
  }
  process.stdout.write(summary);
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Linear reporting failed."}\n`
  );
  process.exitCode = 1;
}
