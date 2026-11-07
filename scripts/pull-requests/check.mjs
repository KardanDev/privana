import { appendFile, readFile } from "node:fs/promises";
import { requestGitHub } from "./request-github.mjs";
import { validatePullRequest } from "./validate-pull-request.mjs";

try {
  const {
    GITHUB_EVENT_PATH,
    GITHUB_REPOSITORY,
    GITHUB_TOKEN,
    GITHUB_STEP_SUMMARY,
  } = process.env;
  if (
    !(
      GITHUB_EVENT_PATH &&
      GITHUB_TOKEN &&
      GITHUB_REPOSITORY === "KardanDev/privana"
    )
  ) {
    throw new Error("Run this entrypoint in the Privana PR-contract workflow.");
  }
  const event = JSON.parse(await readFile(GITHUB_EVENT_PATH, "utf8"));
  const number = event.pull_request?.number;
  if (!Number.isSafeInteger(number) || number < 1) {
    throw new Error("A valid pull request event is required.");
  }
  const basePath = `/repos/${GITHUB_REPOSITORY}/pulls/${number}`;
  const pr = await requestGitHub(basePath, GITHUB_TOKEN);
  if (pr.state !== "open") {
    throw new Error("This pull request is no longer open.");
  }
  const files = [];
  for (let page = 1; page <= 30; page += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: The first short page terminates the bounded complete-diff scan.
    const batch = await requestGitHub(
      `${basePath}/files?per_page=100&page=${page}`,
      GITHUB_TOKEN
    );
    files.push(...batch);
    if (batch.length < 100) {
      break;
    }
  }
  const result = validatePullRequest(pr, files);
  const summary = `## Pull request contract\n\n${result.issue}: ${result.lines} reviewable lines, ${result.files} files.\n\n${result.aboveTarget ? "Above the 400-line / 20-file target; reviewers should check whether it can be split." : "Within the recommended review budget."}\n`;
  if (GITHUB_STEP_SUMMARY) {
    await appendFile(GITHUB_STEP_SUMMARY, summary);
  }
  process.stdout.write(summary);
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : "PR contract failed."}\n`
  );
  process.exitCode = 1;
}
