import { linearProject, linearTeam, requiredWorkflows } from "../config.mjs";
import { requestGitHubFixture } from "./request-github-fixture.mjs";
import { requestLinearFixture } from "./request-linear-fixture.mjs";

export function createFixture() {
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
    title: "KAR-175: Report PR events",
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
  const issue = {
    archivedAt: null,
    children: { nodes: [] },
    comments: { nodes: [], pageInfo: { endCursor: null, hasNextPage: false } },
    id: "f4614432-784f-4802-bdfd-9338c9208720",
    identifier: "KAR-175",
    project: { id: linearProject },
    team: { id: linearTeam },
  };
  const state = {
    calls: [],
    commentPages: null,
    issue,
    jobsOverride: null,
    latestPr: null,
    mutationSuccess: true,
    newerRun: null,
    pr,
    runs,
    writes: [],
  };
  const options = {
    event: { workflow_run: { id: 100 } },
    eventName: "workflow_run",
    requestGitHub: (path) => requestGitHubFixture(state, path),
    requestLinear: (query, variables) =>
      requestLinearFixture(state, query, variables),
  };
  return { options, state };
}
