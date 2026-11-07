import { repository } from "./config.mjs";

export function buildComment(pr, runs) {
  const merged = pr.merged === true;
  const sha = merged ? pr.merge_commit_sha : pr.head.sha;
  const kind = merged ? "merged" : "ci-passed";
  const marker = `<!-- privana:${kind}:${repository}:${pr.number}:${sha} -->`;
  const root = `https://github.com/${repository}`;
  const lines = [
    merged
      ? `**Pull request merged:** [#${pr.number}](${root}/pull/${pr.number}) → \`main\`.`
      : `**Required PR checks passed:** [#${pr.number}](${root}/pull/${pr.number}).`,
    `Commit: [\`${sha.slice(0, 12)}\`](${root}/commit/${sha}).`,
  ];
  if (merged) {
    lines.push(`Merged at: ${new Date(pr.merged_at).toISOString()}.`);
  } else {
    lines.push(
      ...runs.map(
        (run) => `- [${run.name}](${root}/actions/runs/${run.id}): passed.`
      )
    );
  }
  lines.push(
    merged
      ? "Merge recorded; issue acceptance and deployment remain separate decisions."
      : "Ready for review. This CI result does not approve, merge, deploy or complete the issue.",
    marker
  );
  return { body: lines.join("\n\n"), marker };
}
