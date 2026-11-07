import assert from "node:assert/strict";
import { test } from "node:test";
import { collectEvent } from "../collect-event.mjs";
import { confirmReport } from "../confirm-report.mjs";
import { readRunJobs } from "../read-run-jobs.mjs";
import { createGitHubFixture } from "./github-fixture.mjs";

test("collects a current passing CI event from both authoritative workflows", async () => {
  const { options } = createGitHubFixture();
  const event = await collectEvent(options);
  assert.equal(event.status, "verified");
  assert.equal(event.issueId, "KAR-175");
  assert.equal(event.runs.length, 2);
});

test("rejects failed, cancelled, skipped, pending and newer rerun results", async () => {
  for (const conclusion of ["failure", "cancelled", "skipped", null]) {
    const { options, state } = createGitHubFixture();
    state.runs[1].conclusion = conclusion;
    assert.equal((await collectEvent(options)).status, "checks-not-passed");
  }
  const { options, state } = createGitHubFixture();
  state.newerRun = {
    ...state.runs[0],
    conclusion: null,
    id: 999,
    status: "queued",
  };
  assert.equal((await collectEvent(options)).status, "checks-not-passed");
});

test("rejects stale commits, changed bases and fake workflow identity", async () => {
  for (const update of [
    { head_sha: "d".repeat(40) },
    { event: "push" },
    { path: ".github/workflows/other.yml" },
    { conclusion: "failure" },
  ]) {
    const { options, state } = createGitHubFixture();
    Object.assign(state.runs[0], update);
    assert.equal((await collectEvent(options)).status, "not-applicable");
  }
  const { options, state } = createGitHubFixture();
  state.pr.base.sha = "e".repeat(40);
  assert.equal((await collectEvent(options)).status, "checks-not-passed");
});

test("requires every expected job and rejects skipped additional jobs", async () => {
  const { options, state } = createGitHubFixture();
  state.jobsOverride = {
    jobs: [
      { conclusion: "success", name: "Repository checks", status: "completed" },
    ],
    total_count: 1,
  };
  assert.equal((await collectEvent(options)).status, "checks-not-passed");
  state.jobsOverride.jobs.push({
    conclusion: "skipped",
    name: "Quality gate",
    status: "completed",
  });
  state.jobsOverride.total_count = 2;
  assert.equal((await collectEvent(options)).status, "checks-not-passed");
});

test("ignores forks, drafts, closed-unmerged and non-main PRs", async () => {
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
      pr.base.ref = "other";
    },
  ]) {
    const { options, state } = createGitHubFixture();
    mutate(state.pr);
    assert.equal((await collectEvent(options)).status, "not-applicable");
  }
});

test("recognizes a real merge and rejects a forged merged notification", async () => {
  const { options, state } = createGitHubFixture();
  options.eventName = "pull_request_target";
  options.event = {
    action: "closed",
    pull_request: { merged: true, number: 4 },
  };
  assert.equal((await collectEvent(options)).status, "not-applicable");
  Object.assign(state.pr, {
    merge_commit_sha: "c".repeat(40),
    merged: true,
    merged_at: "2026-11-06T23:00:00Z",
    state: "closed",
  });
  const result = await collectEvent(options);
  assert.equal(result.status, "verified");
  assert.deepEqual(result.runs, []);
});

test("manual reconciliation validates its number and current PR state", async () => {
  const { options } = createGitHubFixture();
  options.eventName = "workflow_dispatch";
  options.event = { inputs: { pull_request: "4" } };
  assert.equal((await collectEvent(options)).status, "verified");
  options.event.inputs.pull_request = "4; execute";
  await assert.rejects(() => collectEvent(options), /positive PR number/);
});

test("final confirmation rejects a head/state change after evidence collection", async () => {
  const { options, state } = createGitHubFixture();
  const event = await collectEvent(options);
  state.latestPr = structuredClone(state.pr);
  state.latestPr.head.sha = "e".repeat(40);
  assert.equal(
    await confirmReport({ ...event, requestGitHub: options.requestGitHub }),
    false
  );
});

test("reads all job pages and refuses an incomplete response", async () => {
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
