import { repository, requiredWorkflows } from "./config.mjs";
import { readRunJobs } from "./read-run-jobs.mjs";

export async function findPassingRuns(pr, requestGitHub) {
  const passing = [];
  for (const workflow of requiredWorkflows) {
    const result = await requestGitHub(
      `/repos/${repository}/actions/workflows/${workflow.file}/runs?event=pull_request&head_sha=${pr.head.sha}&branch=${encodeURIComponent(pr.head.ref)}&per_page=100`
    );
    const run = result.workflow_runs
      .filter(
        (item) => item.head_sha === pr.head.sha && item.event === "pull_request"
      )
      .sort((a, b) => b.id - a.id)[0];
    if (
      !(
        run &&
        run.status === "completed" &&
        run.conclusion === "success" &&
        run.name === workflow.name &&
        run.path === `.github/workflows/${workflow.file}`
      )
    ) {
      return null;
    }
    const association = run.pull_requests?.find(
      (item) => item.number === pr.number
    );
    if (
      !association ||
      (association.base?.sha && association.base.sha !== pr.base.sha)
    ) {
      return null;
    }
    const jobs = await readRunJobs(run, requestGitHub);
    const complete = workflow.jobs.every((name) =>
      jobs.some(
        (job) =>
          job.name === name &&
          job.status === "completed" &&
          job.conclusion === "success"
      )
    );
    if (
      !complete ||
      jobs.some(
        (job) => job.status !== "completed" || job.conclusion !== "success"
      )
    ) {
      return null;
    }
    passing.push({ id: run.id, name: workflow.name });
  }
  return passing;
}
