import { requiredWorkflows } from "../config.mjs";
import { requestGitHubFixture } from "./request-github-fixture.mjs";

export function createGitHubFixture() {
  const pr = {
    base: {
      ref: "main",
      repo: { full_name: "KardanDev/privana" },
      sha: "b".repeat(40),
    },
    body: "Linear issue: KAR-175",
    draft: false,
    head: {
      ref: "codex/kar-175-linear-updates",
      repo: { full_name: "KardanDev/privana" },
      sha: "a".repeat(40),
    },
    merged: false,
    number: 4,
    state: "open",
    title: "KAR-175: Verify PR events",
  };
  const runs = requiredWorkflows.map((workflow, index) => ({
    conclusion: "success",
    event: "pull_request",
    head_sha: pr.head.sha,
    id: index + 100,
    name: workflow.name,
    path: `.github/workflows/${workflow.file}`,
    pull_requests: [{ base: { sha: pr.base.sha }, number: pr.number }],
    status: "completed",
  }));
  const state = {
    calls: [],
    jobsOverride: null,
    latestPr: null,
    newerRun: null,
    pr,
    runs,
  };
  return {
    options: {
      event: { workflow_run: { id: 100 } },
      eventName: "workflow_run",
      requestGitHub: (path) => requestGitHubFixture(state, path),
    },
    state,
  };
}
