import { repository } from "./config.mjs";

export async function readRunJobs(run, requestGitHub) {
  const jobs = [];
  for (let page = 1; page <= 100; page += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: Read pages in order until the response proves the complete job count.
    const response = await requestGitHub(
      `/repos/${repository}/actions/runs/${run.id}/jobs?filter=latest&per_page=100&page=${page}`
    );
    jobs.push(...response.jobs);
    if (jobs.length >= response.total_count) {
      return jobs;
    }
    if (response.jobs.length === 0) {
      break;
    }
  }
  throw new Error(
    "Could not read the complete CI job list; no success comment will be posted."
  );
}
