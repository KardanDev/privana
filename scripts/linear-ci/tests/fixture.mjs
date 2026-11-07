import { linearProject, linearTeam, requiredWorkflows } from "../config.mjs";

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
  const requestGitHub = async (path) => {
    state.calls.push(path);
    if (path.includes("/pulls/")) {
      const reads = state.calls.filter((item) =>
        item.includes("/pulls/")
      ).length;
      return structuredClone(
        reads > 1 && state.latestPr ? state.latestPr : state.pr
      );
    }
    if (path.includes("/jobs?")) {
      if (state.jobsOverride) {
        return structuredClone(state.jobsOverride);
      }
      const index = path.includes("/100/") ? 0 : 1;
      const jobs = requiredWorkflows[index].jobs.map((name) => ({
        conclusion: "success",
        name,
        status: "completed",
      }));
      return { jobs, total_count: jobs.length };
    }
    if (path.includes("/actions/workflows/")) {
      const index = path.includes("/quality.yml/") ? 0 : 1;
      return {
        workflow_runs: structuredClone([
          ...(state.newerRun ? [state.newerRun] : []),
          state.runs[index],
        ]),
      };
    }
    if (path.endsWith("/actions/runs/100")) {
      return structuredClone(state.runs[0]);
    }
    throw new Error(`Unexpected test request: ${path}`);
  };
  const requestLinear = async (query, variables) => {
    if (query.includes("mutation")) {
      state.writes.push(variables.input);
      if (state.mutationSuccess) {
        state.issue.comments.nodes.push({
          body: variables.input.body,
          id: variables.input.id,
        });
      }
      return {
        commentCreate: {
          comment: state.mutationSuccess ? { id: variables.input.id } : null,
          success: state.mutationSuccess,
        },
      };
    }
    const value = structuredClone(state.issue);
    if (state.commentPages) {
      value.comments = state.commentPages[variables.after ?? "first"];
    }
    return { issue: value };
  };
  const options = {
    event: { workflow_run: { id: 100 } },
    eventName: "workflow_run",
    requestGitHub,
    requestLinear,
  };
  return { options, state };
}
