import { requiredWorkflows } from "../config.mjs";

export function requestGitHubFixture(state, path) {
  state.calls.push(path);
  if (path.includes("/pulls/")) {
    const reads = state.calls.filter((item) => item.includes("/pulls/")).length;
    return Promise.resolve(
      structuredClone(reads > 1 && state.latestPr ? state.latestPr : state.pr)
    );
  }
  if (path.includes("/jobs?")) {
    const index = path.includes("/100/") ? 0 : 1;
    const jobs = requiredWorkflows[index].jobs.map((name) => ({
      conclusion: "success",
      name,
      status: "completed",
    }));
    return Promise.resolve(
      structuredClone(state.jobsOverride ?? { jobs, total_count: jobs.length })
    );
  }
  if (path.includes("/actions/workflows/")) {
    const index = path.includes("/quality.yml/") ? 0 : 1;
    return Promise.resolve({
      workflow_runs: structuredClone(
        [state.newerRun, state.runs[index]].filter(Boolean)
      ),
    });
  }
  if (path.endsWith("/actions/runs/100")) {
    return Promise.resolve(structuredClone(state.runs[0]));
  }
  return Promise.reject(new Error(`Unexpected test request: ${path}`));
}
