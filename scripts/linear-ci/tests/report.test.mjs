import assert from "node:assert/strict";
import { test } from "node:test";
import { buildComment } from "../build-comment.mjs";
import { createCommentId } from "../create-comment-id.mjs";
import { readRunJobs } from "../read-run-jobs.mjs";
import { report } from "../report.mjs";
import { createFixture } from "./fixture.mjs";

test("posts one CI comment only after both current workflows and all jobs pass", async () => {
  const { options, state } = createFixture();
  assert.equal(await report(options), "reported");
  assert.equal(state.writes.length, 1);
  assert.equal(state.writes[0].issueId, state.issue.id);
  assert.match(state.writes[0].body, /Required PR checks passed/);
  assert.match(state.writes[0].body, /actions\/runs\/100/);
  assert.match(state.writes[0].body, /actions\/runs\/101/);
  assert.equal(await report(options), "already-reported");
  assert.equal(state.writes.length, 1);
});

test("failed, cancelled, skipped, pending and missing required checks cannot post green", async () => {
  for (const conclusion of ["failure", "cancelled", "skipped", null]) {
    const { options, state } = createFixture();
    state.runs[1].conclusion = conclusion;
    assert.equal(await report(options), "checks-not-passed");
    assert.equal(state.writes.length, 0);
  }
  const { options, state } = createFixture();
  state.jobsOverride = {
    jobs: [
      { conclusion: "success", name: "Different job", status: "completed" },
    ],
    total_count: 1,
  };
  assert.equal(await report(options), "checks-not-passed");
  state.jobsOverride = {
    jobs: [
      { conclusion: "failure", name: "Repository checks", status: "completed" },
    ],
    total_count: 1,
  };
  assert.equal(await report(options), "checks-not-passed");
});

test("a newer queued rerun blocks an older successful run for the same SHA", async () => {
  const { options, state } = createFixture();
  state.newerRun = {
    ...state.runs[0],
    conclusion: null,
    id: 999,
    status: "queued",
  };
  assert.equal(await report(options), "checks-not-passed");
  assert.equal(state.writes.length, 0);
});

test("stale source SHA, changed base, wrong workflow and non-PR runs are ignored", async () => {
  for (const update of [
    { head_sha: "d".repeat(40) },
    { event: "push" },
    { path: ".github/workflows/untrusted.yml" },
    { conclusion: "failure" },
  ]) {
    const { options, state } = createFixture();
    Object.assign(state.runs[0], update);
    assert.equal(await report(options), "not-applicable");
    assert.equal(state.writes.length, 0);
  }
  const { options, state } = createFixture();
  state.pr.base.sha = "e".repeat(40);
  assert.equal(await report(options), "checks-not-passed");
});

test("forks, drafts, closed-unmerged and wrong-base PRs never post success", async () => {
  for (const mutate of [
    (pr) => {
      pr.head.repo.full_name = "external/fork";
    },
    (pr) => {
      pr.draft = true;
    },
    (pr) => {
      pr.state = "closed";
    },
    (pr) => {
      pr.base.ref = "other-branch";
    },
  ]) {
    const { options, state } = createFixture();
    mutate(state.pr);
    assert.equal(await report(options), "not-applicable");
    assert.equal(state.writes.length, 0);
  }
});

test("rechecks the head and merge state immediately before writing", async () => {
  const { options, state } = createFixture();
  state.latestPr = structuredClone(state.pr);
  state.latestPr.head.sha = "e".repeat(40);
  assert.equal(await report(options), "stale");
  assert.equal(state.writes.length, 0);
});

test("posts a distinct merge comment from authoritative GitHub state and deduplicates it", async () => {
  const { options, state } = createFixture();
  await report(options);
  Object.assign(state.pr, {
    merge_commit_sha: "c".repeat(40),
    merged: true,
    merged_at: "2026-11-06T23:00:00Z",
    state: "closed",
  });
  options.eventName = "pull_request_target";
  options.event = {
    action: "closed",
    pull_request: { merged: true, number: 4 },
  };
  assert.equal(await report(options), "reported");
  assert.equal(state.writes.length, 2);
  assert.match(state.writes[1].body, /Pull request merged/);
  assert.match(state.writes[1].body, /2026-11-06T23:00:00.000Z/);
  assert.notEqual(state.writes[0].id, state.writes[1].id);
  assert.equal(await report(options), "already-reported");
  assert.equal(state.writes.length, 2);
});

test("a close notification cannot impersonate a merge", async () => {
  const { options, state } = createFixture();
  options.eventName = "pull_request_target";
  options.event = {
    action: "closed",
    pull_request: { merged: true, number: 4 },
  };
  assert.equal(await report(options), "not-applicable");
  options.event.pull_request.merged = false;
  assert.equal(await report(options), "not-applicable");
  assert.equal(state.writes.length, 0);
});

test("manual reconciliation recovers setup or event failures without duplicate writes", async () => {
  const { options, state } = createFixture();
  options.eventName = "workflow_dispatch";
  options.event = { inputs: { pull_request: "4" } };
  assert.equal(await report(options), "reported");
  assert.equal(await report(options), "already-reported");
  assert.equal(state.writes.length, 1);
  options.event.inputs.pull_request = "4; inject";
  await assert.rejects(() => report(options), /positive PR number/);
});

test("rejects wrong-project, archived and parent issues before a mutation", async () => {
  for (const mutate of [
    (issue) => {
      issue.project.id = "another-project";
    },
    (issue) => {
      issue.team.id = "another-team";
    },
    (issue) => {
      issue.archivedAt = "2026-01-01";
    },
    (issue) => {
      issue.children.nodes = [{ id: "child" }];
    },
  ]) {
    const { options, state } = createFixture();
    mutate(state.issue);
    await assert.rejects(() => report(options), /actionable Privana issue/);
    assert.equal(state.writes.length, 0);
  }
});

test("finds duplicate comments beyond the first page, even if Markdown markers were stripped", async () => {
  const { options, state } = createFixture();
  const { marker } = buildComment(state.pr, []);
  const id = createCommentId(`${state.issue.id}:${marker}`);
  state.commentPages = {
    first: { nodes: [], pageInfo: { endCursor: "next", hasNextPage: true } },
    next: {
      nodes: [{ body: "rendered text without HTML", id }],
      pageInfo: { endCursor: null, hasNextPage: false },
    },
  };
  assert.equal(await report(options), "already-reported");
  assert.equal(state.writes.length, 0);
});

test("non-advancing pagination and rejected mutations fail visibly", async () => {
  const first = createFixture();
  first.state.commentPages = {
    first: { nodes: [], pageInfo: { endCursor: "next", hasNextPage: true } },
    next: { nodes: [], pageInfo: { endCursor: "next", hasNextPage: true } },
  };
  await assert.rejects(
    () => report(first.options),
    /pagination did not advance/
  );
  assert.equal(first.state.writes.length, 0);
  const second = createFixture();
  second.state.mutationSuccess = false;
  await assert.rejects(() => report(second.options), /did not confirm/);
});

test("reads every CI job page and rejects truncated responses", async () => {
  const calls = [];
  const jobs = await readRunJobs({ id: 100 }, (path) => {
    calls.push(path);
    return Promise.resolve({
      jobs: [{ name: path.includes("page=2") ? "second" : "first" }],
      total_count: 2,
    });
  });
  assert.equal(jobs.length, 2);
  assert.equal(calls.length, 2);
  await assert.rejects(
    () =>
      readRunJobs({ id: 100 }, () =>
        Promise.resolve({ jobs: [], total_count: 1 })
      ),
    /complete CI job/
  );
});
