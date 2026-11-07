import { measureChange } from "./measure-change.mjs";
import { requiredSections, reviewBudget } from "./policy.mjs";
import { readPrimaryIssue } from "./read-primary-issue.mjs";
import { readSections } from "./read-sections.mjs";

const placeholderPattern = /^(?:[-*\s[\]x|:]+|n\/?a|todo|tbd)$/i;

export function validatePullRequest(pr, files) {
  if (pr.draft) {
    throw new Error(
      "Open an ordinary ready-for-review PR. Drafts are not this repository's delivery flow."
    );
  }
  const issue = readPrimaryIssue(pr);
  const sections = readSections(pr.body);
  for (const name of requiredSections) {
    const value = sections.get(name) ?? "";
    if (value.length < 15 || placeholderPattern.test(value)) {
      throw new Error(
        `Complete the ${name} section with specific evidence or an explanation of why it does not apply.`
      );
    }
  }
  if (files.length !== pr.changed_files) {
    throw new Error(
      "The complete changed-file list is required; rerun after GitHub finishes calculating the diff."
    );
  }
  const size = measureChange(files);
  const oversized =
    size.lines > reviewBudget.lines || size.files > reviewBudget.files;
  const approved = pr.labels.some(
    (label) => label.name === "review:large-approved"
  );
  const reason = sections.get("Large change reason") ?? "";
  if (
    oversized &&
    !(approved && reason.length >= 80 && !placeholderPattern.test(reason))
  ) {
    throw new Error(
      `Split this PR: ${size.lines} reviewable lines / ${size.files} files exceed 800 / 30. An exception requires a maintainer's review:large-approved label and a specific Large change reason of at least 80 characters.`
    );
  }
  const aboveTarget =
    size.lines > reviewBudget.targetLines ||
    size.files > reviewBudget.targetFiles;
  return { aboveTarget, issue, ...size };
}
