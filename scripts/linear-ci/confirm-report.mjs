import { repository } from "./config.mjs";
import { findPassingRuns } from "./find-passing-runs.mjs";
import { isEligiblePr } from "./is-eligible-pr.mjs";
import { readLinkedIssue } from "./read-linked-issue.mjs";

export async function confirmReport({ pr, context, issueId, requestGitHub }) {
  const latest = await requestGitHub(`/repos/${repository}/pulls/${pr.number}`);
  if (
    !isEligiblePr(latest, context) ||
    latest.state !== pr.state ||
    latest.merged !== pr.merged ||
    readLinkedIssue(latest) !== issueId
  ) {
    return false;
  }
  if (pr.merged) {
    return latest.merge_commit_sha === pr.merge_commit_sha;
  }
  return (
    latest.head.sha === pr.head.sha &&
    latest.base.sha === pr.base.sha &&
    Boolean(await findPassingRuns(latest, requestGitHub))
  );
}
