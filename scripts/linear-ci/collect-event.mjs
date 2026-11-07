import { repository } from "./config.mjs";
import { findPassingRuns } from "./find-passing-runs.mjs";
import { isEligiblePr } from "./is-eligible-pr.mjs";
import { readLinkedIssue } from "./read-linked-issue.mjs";
import { resolveEvent } from "./resolve-event.mjs";

export async function collectEvent(options) {
  const context = await resolveEvent(options);
  if (
    !(context && Number.isSafeInteger(context.number)) ||
    context.number < 1
  ) {
    return { status: "not-applicable" };
  }
  const pr = await options.requestGitHub(
    `/repos/${repository}/pulls/${context.number}`
  );
  if (!isEligiblePr(pr, context)) {
    return { status: "not-applicable" };
  }
  const issueId = readLinkedIssue(pr);
  const runs = pr.merged
    ? []
    : await findPassingRuns(pr, options.requestGitHub);
  if (!runs) {
    return { status: "checks-not-passed" };
  }
  return { context, issueId, pr, runs, status: "verified" };
}
