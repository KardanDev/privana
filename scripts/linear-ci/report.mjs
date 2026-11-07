import { buildComment } from "./build-comment.mjs";
import { collectEvent } from "./collect-event.mjs";
import { confirmReport } from "./confirm-report.mjs";
import { publishComment } from "./publish-comment.mjs";

export async function report(options) {
  const verified = await collectEvent(options);
  if (verified.status !== "verified") {
    return verified.status;
  }
  const { context, issueId, pr, runs } = verified;
  return await publishComment({
    comment: buildComment(pr, runs),
    confirm: () =>
      confirmReport({
        context,
        issueId,
        pr,
        requestGitHub: options.requestGitHub,
      }),
    issueId,
    requestLinear: options.requestLinear,
  });
}
