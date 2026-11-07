import assert from "node:assert/strict";
import { test } from "node:test";
import { createCommentId } from "../create-comment-id.mjs";
import { readLinkedIssue } from "../read-linked-issue.mjs";
import { requestJson } from "../request-json.mjs";

test("uses raw Linear API key authentication and GitHub bearer authentication", async () => {
  const calls = [];
  const fetcher = (url, options) => {
    calls.push({ options, url: String(url) });
    return Promise.resolve(
      new Response(JSON.stringify({ data: { ok: true } }), { status: 200 })
    );
  };
  assert.deepEqual(
    await requestJson("https://api.linear.app/graphql", {
      body: { query: "query { viewer { id } }" },
      fetcher,
      token: "test-linear-key",
    }),
    { ok: true }
  );
  await requestJson("https://api.github.com/repos/KardanDev/privana/pulls/4", {
    fetcher,
    token: "test-github-token",
  });
  assert.equal(calls[0].options.headers.Authorization, "test-linear-key");
  assert.equal(calls[0].options.method, "POST");
  assert.equal(
    calls[1].options.headers.Authorization,
    "Bearer test-github-token"
  );
  assert.equal(calls[1].options.redirect, "error");
});

test("rejects redirected/foreign endpoints and never logs secret provider details", async () => {
  const fetcher = () =>
    Promise.resolve(
      new Response("private-response-and-credentials", { status: 401 })
    );
  await assert.rejects(
    () =>
      requestJson("https://untrusted.example/graphql", {
        fetcher,
        token: "secret",
      }),
    /Only the configured/
  );
  await assert.rejects(
    () =>
      requestJson("https://api.github.com/repos/other/repository/pulls/4", {
        fetcher,
        token: "secret",
      }),
    /Only the configured/
  );
  await assert.rejects(
    () =>
      requestJson("https://api.linear.app/graphql", {
        fetcher,
        token: "secret",
      }),
    (error) =>
      error.message.includes("401") &&
      !error.message.includes("private-response-and-credentials")
  );
  await assert.rejects(
    () =>
      requestJson("https://api.linear.app/graphql", {
        fetcher: () =>
          Promise.resolve(
            new Response('{"errors":[{"message":"secret provider detail"}]}')
          ),
        token: "secret",
      }),
    (error) =>
      !error.message.includes("secret provider detail") &&
      error.message.includes("GraphQL")
  );
});

test("notification identity is stable, event-specific and valid UUID v4", () => {
  const id = createCommentId("ci:repo:4:sha");
  assert.equal(id, createCommentId("ci:repo:4:sha"));
  assert.notEqual(id, createCommentId("merge:repo:4:sha"));
  assert.match(
    id,
    /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/
  );
});

test("reporting independently validates the issue boundary instead of trusting PR text", () => {
  const pr = {
    body: "Linear issue: KAR-175",
    head: { ref: "codex/kar-175-linear" },
    title: "KAR-175: Update workflow",
  };
  assert.equal(readLinkedIssue(pr), "KAR-175");
  assert.throws(() =>
    readLinkedIssue({ ...pr, title: "KAR-174: Wrong issue" })
  );
  assert.throws(() =>
    readLinkedIssue({ ...pr, body: "<!-- Linear issue: KAR-175 -->" })
  );
  assert.throws(() =>
    readLinkedIssue({ ...pr, body: `${pr.body}\nLinear issue: KAR-173` })
  );
});
