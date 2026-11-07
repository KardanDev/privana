const commentPattern = /<!--[\s\S]*?-->/g;
const primaryPattern = /^Linear issue: (KAR-[1-9]\d*)\s*$/m;
const referencePattern = /\bKAR-[1-9]\d*\b/gi;
const titlePattern = /^KAR-[1-9]\d*: \S/;

export function readPrimaryIssue({ body, title, head }) {
  const content = (body ?? "").replace(commentPattern, "");
  const fields = content.match(/^Linear issue:/gm) ?? [];
  const issue = content.match(primaryPattern)?.[1];
  const titleIssues = title.match(referencePattern) ?? [];
  const branchIssues = head.ref.match(referencePattern) ?? [];
  if (!(fields.length === 1 && issue)) {
    throw new Error("Add exactly one primary line: Linear issue: KAR-123.");
  }
  if (
    !titlePattern.test(title) ||
    titleIssues.length !== 1 ||
    titleIssues[0] !== issue
  ) {
    throw new Error(
      "Use a title such as KAR-123: Describe the resulting behavior, matching the primary issue."
    );
  }
  if (branchIssues.length !== 1 || branchIssues[0].toUpperCase() !== issue) {
    throw new Error(
      "The branch must contain the same single issue ID, e.g. codex/kar-123-description."
    );
  }
  return issue;
}
