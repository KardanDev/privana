const primaryPattern = /^Linear issue: (KAR-[1-9]\d*)\s*$/m;
const referencePattern = /\bKAR-[1-9]\d*\b/gi;
const commentPattern = /<!--[\s\S]*?-->/g;

export function readLinkedIssue(pr) {
  const body = (pr.body ?? "").replace(commentPattern, "");
  const issue = body.match(primaryPattern)?.[1];
  const fields = body.match(/^Linear issue:/gm) ?? [];
  const title = pr.title.match(referencePattern) ?? [];
  const branch = pr.head.ref.match(referencePattern) ?? [];
  if (
    !(
      issue &&
      fields.length === 1 &&
      title.length === 1 &&
      title[0] === issue &&
      branch.length === 1 &&
      branch[0].toUpperCase() === issue
    )
  ) {
    throw new Error(
      "PR title, branch and exactly one primary Linear issue must agree before reporting."
    );
  }
  return issue;
}
