import { repository, requiredWorkflows } from "./config.mjs";

export async function resolveEvent({ eventName, event, requestGitHub }) {
  if (eventName === "workflow_dispatch") {
    const number = Number(event.inputs?.pull_request);
    if (!Number.isSafeInteger(number) || number < 1) {
      throw new Error("Manual reconciliation requires a positive PR number.");
    }
    return { mode: "reconcile", number };
  }
  if (eventName === "pull_request_target") {
    if (event.action !== "closed" || event.pull_request?.merged !== true) {
      return null;
    }
    return { mode: "merge", number: event.pull_request.number };
  }
  if (
    eventName !== "workflow_run" ||
    !Number.isSafeInteger(event.workflow_run?.id)
  ) {
    return null;
  }
  const run = await requestGitHub(
    `/repos/${repository}/actions/runs/${event.workflow_run.id}`
  );
  const allowed = requiredWorkflows.some(
    (workflow) =>
      run.name === workflow.name &&
      run.path === `.github/workflows/${workflow.file}`
  );
  if (
    !(
      allowed &&
      run.event === "pull_request" &&
      run.status === "completed" &&
      run.conclusion === "success" &&
      run.pull_requests?.length === 1
    )
  ) {
    return null;
  }
  return {
    head: run.head_sha,
    mode: "ci",
    number: run.pull_requests[0].number,
  };
}
