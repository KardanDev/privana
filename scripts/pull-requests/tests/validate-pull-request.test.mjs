import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { measureChange } from "../measure-change.mjs";
import { requiredSections } from "../policy.mjs";
import { readPrimaryIssue } from "../read-primary-issue.mjs";
import { readSections } from "../read-sections.mjs";
import { requestGitHub } from "../request-github.mjs";
import { validatePullRequest } from "../validate-pull-request.mjs";

const ordinaryPr = /ordinary/;
const summarySection = /Summary/;
const evidenceSection = /Evidence/;
const duplicateSection = /duplicate/;
const completeFileList = /complete changed-file/;
const splitRequired = /Split this PR/;

const body = `Linear issue: KAR-174\n\n${requiredSections.map((name) => `## ${name}\n\nSpecific ${name.toLowerCase()} behavior and evidence for this issue.`).join("\n\n")}`;
const pr = {
  body,
  changed_files: 1,
  draft: false,
  head: { ref: "codex/kar-174-review-contract" },
  labels: [],
  title: "KAR-174: Check reviewable scope",
};
const files = [
  { additions: 100, deletions: 10, filename: "scripts/change.mjs" },
];

test("accepts one matching issue and substantive review sections", () => {
  assert.deepEqual(validatePullRequest(pr, files), {
    aboveTarget: false,
    files: 1,
    issue: "KAR-174",
    lines: 110,
  });
});

test("allows dependency issue links without changing primary scope", () => {
  assert.equal(
    readPrimaryIssue({
      ...pr,
      body: `${body}\nDepends on KAR-173 and KAR-175.`,
    }),
    "KAR-174"
  );
});

test("rejects mismatched or multiple branch/title/primary issue IDs", () => {
  for (const update of [
    { title: "KAR-175: Wrong issue" },
    { title: "KAR-174: Also KAR-175" },
    { head: { ref: "codex/kar-175-wrong" } },
    { head: { ref: "codex/kar-174-and-kar-175" } },
    { body: `${body}\nLinear issue: KAR-175` },
    { body: body.replace("KAR-174", "KAR-") },
  ]) {
    assert.throws(() => readPrimaryIssue({ ...pr, ...update }));
  }
});

test("rejects draft PRs, empty guidance and duplicate headings", () => {
  assert.throws(
    () => validatePullRequest({ ...pr, draft: true }, files),
    ordinaryPr
  );
  assert.throws(
    () =>
      validatePullRequest(
        {
          ...pr,
          body: body.replace(
            "Specific summary behavior and evidence for this issue.",
            "<!-- explain the behavior here -->"
          ),
        },
        files
      ),
    summarySection
  );
  assert.throws(
    () =>
      validatePullRequest(
        {
          ...pr,
          body: body.replace(
            "Specific evidence behavior and evidence for this issue.",
            "N/A"
          ),
        },
        files
      ),
    evidenceSection
  );
  assert.throws(
    () => readSections(`${body}\n## Summary\nDuplicate content.`),
    duplicateSection
  );
});

test("the unfilled repository template cannot pass the contract", async () => {
  const template = await readFile(
    new URL("../../../.github/pull_request_template.md", import.meta.url),
    "utf8"
  );
  assert.throws(() => validatePullRequest({ ...pr, body: template }, files));
});

test("flags the target budget and rejects an incomplete file list", () => {
  assert.equal(
    validatePullRequest(pr, [{ ...files[0], additions: 401 }]).aboveTarget,
    true
  );
  assert.throws(
    () => validatePullRequest({ ...pr, changed_files: 2 }, files),
    completeFileList
  );
});

test("excludes only known lock/generated lines while counting all files", () => {
  assert.deepEqual(
    measureChange([
      ...files,
      { additions: 10_000, deletions: 5000, filename: "bun.lock" },
      {
        additions: 40_000,
        deletions: 1,
        filename: "packages/db/prisma/generated/client.ts",
      },
      {
        additions: 900,
        deletions: 1,
        filename: "packages/db/prisma/schema/product.prisma",
      },
    ]),
    { files: 4, lines: 1011 }
  );
});

test("oversize exceptions require both maintainer label and a real split reason", () => {
  const largeFiles = [{ ...files[0], additions: 801 }];
  const reason =
    "\n## Large change reason\n\nThis atomic schema correction must be reviewed together because splitting it leaves the old and new invariants inconsistent.";
  assert.throws(() => validatePullRequest(pr, largeFiles), splitRequired);
  assert.throws(
    () =>
      validatePullRequest(
        { ...pr, labels: [{ name: "review:large-approved" }] },
        largeFiles
      ),
    splitRequired
  );
  assert.throws(
    () => validatePullRequest({ ...pr, body: body + reason }, largeFiles),
    splitRequired
  );
  assert.equal(
    validatePullRequest(
      {
        ...pr,
        body: body + reason,
        labels: [{ name: "review:large-approved" }],
      },
      largeFiles
    ).lines,
    811
  );
  assert.throws(
    () =>
      validatePullRequest(
        { ...pr, changed_files: 31 },
        Array.from({ length: 31 }, () => ({
          ...files[0],
          additions: 0,
          deletions: 0,
        }))
      ),
    splitRequired
  );
});

test("PR strings remain data, including shell and expression-like content", () => {
  assert.equal(
    readPrimaryIssue({
      ...pr,
      // biome-ignore lint/suspicious/noTemplateCurlyInString: This literal is the hostile PR metadata fixture; it must remain uninterpreted text.
      title: "KAR-174: Preserve $(do-not-run) `${{ malicious }}` as text",
    }),
    "KAR-174"
  );
  assert.equal(
    readPrimaryIssue({
      ...pr,
      body: `<!-- Linear issue: KAR-175 -->\n${body}`,
    }),
    "KAR-174"
  );
});

test("GitHub requests are bounded and do not expose provider response bodies", async () => {
  const seen = [];
  const fetcher = (url, options) => {
    seen.push({ options, url });
    return Promise.resolve(new Response('{"ok":true}', { status: 200 }));
  };
  assert.deepEqual(
    await requestGitHub(
      "/repos/KardanDev/privana/pulls/2",
      "synthetic-token",
      fetcher
    ),
    { ok: true }
  );
  assert.equal(seen[0].options.redirect, "error");
  await assert.rejects(
    () =>
      requestGitHub("/test", "synthetic-token", () =>
        Promise.resolve(
          new Response("private-provider-payload", { status: 403 })
        )
      ),
    (error) =>
      !error.message.includes("private-provider-payload") &&
      error.message.includes("403")
  );
});
