import { repository } from "./config.mjs";

export function isEligiblePr(pr, context) {
  const trusted =
    pr.base?.repo?.full_name === repository &&
    pr.head?.repo?.full_name === repository &&
    pr.base.ref === "main";
  if (!trusted || pr.draft) {
    return false;
  }
  if (context.mode === "merge" || (context.mode === "reconcile" && pr.merged)) {
    return (
      pr.merged === true &&
      pr.state === "closed" &&
      Boolean(pr.merge_commit_sha && pr.merged_at)
    );
  }
  return (
    pr.state === "open" &&
    !pr.merged &&
    (!context.head || context.head === pr.head.sha)
  );
}
