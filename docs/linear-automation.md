# GitHub and Linear automation

Delivery uses one actionable issue per ordinary PR; see [the contribution workflow](contributing.md). PR titles use `KAR-123: Resulting behavior`, branches contain the same issue ID, and the body has one `Linear issue: KAR-123` line. The [PR-contract workflow](../.github/workflows/pull-request-contract.yml) checks identity, substantive sections and review budgets on code/metadata/label changes. It also runs its deterministic policy tests without installing application dependencies or receiving service secrets.

## Required CI and merge policy

[Quality](../.github/workflows/quality.yml) retains frozen install, generation, lint, types, deterministic tests and production compilation. It adds isolated notification tests, a stable **Quality gate** and merge-queue/manual triggers. The gate fails when repository checks fail, cancel or skip. The additional **Pull request contract** check verifies PR scope separately from product compilation.

After these workflows are merged, an administrator should configure `main` to require **Quality gate**, **Pull request contract**, current-base checks, resolved conversations and an independent review. Prefer squash merges and remove merged branches after dependents have landed. Existing `Repository checks` protection can remain during transition. Workflow files alone do not configure GitHub rules. Merge-queue Quality runs are supported; the PR-only contract is already validated before queue entry.

CI uses synthetic build settings, never a production database/key, migration, seed, email or upload. It does not publish synthetic `.next`/resolved configuration or a Turbo build cache. Browser and real-service journeys stay opt-in as documented in [testing.md](testing.md). Adding a workflow is not permission to deploy or bypass review.

## Automatic issue comments

[Linear updates](../.github/workflows/linear-updates.yml) creates two distinct notifications:

1. **Required PR checks passed** after both current-head **Quality** and **Pull request contract** workflows finish successfully, including every required job. The comment links the PR, tested commit and both runs. Stale heads, newer pending reruns, changed bases, failures, cancellation, skipped jobs, drafts and fork PRs do not produce a green comment.
2. **Pull request merged** after GitHub confirms a merge into `main`. The comment contains the PR, actual merge commit and UTC timestamp. Closing without merging produces no merge comment. This message records a merge; it does not claim all tests passed when a maintainer bypassed checks.

The primary issue must be unarchived, have no child issues and belong to the configured Privana project/team. The reporter checks this independently of PR text. It never moves issue status, approves/merges a PR or deploys. Human acceptance and merge remain necessary before Done.

Events are deduplicated by repository/PR/event/commit, using deterministic UUIDs and paginated comment lookup. A merge and an earlier CI success have different identities. Failure is visible in the reporting workflow and can be retried without posting a second comment. Provider error bodies and tokens are excluded from logs.

## Credentials and trust boundary

Store a dedicated Linear personal API key in the repository Actions secret **LINEAR_API_KEY** with access to read Privana issues/comments and create comments. The owner confirmed that secret is configured. MCP authentication is separate from Actions credentials. Personal keys use the raw Authorization value; this integration does not accept an OAuth token in place of a personal key.

The reporting workflow has read-only GitHub contents/actions/PR permissions and exposes the Linear key only to its final Node step. `workflow_run` and the merged-only `pull_request_target` job explicitly check out the trusted default branch, disable persisted checkout credentials, install no project dependencies, and never run PR code, interpolate its body into a shell, restore its caches or download its artifacts. Metadata is read again from the GitHub API. Requests use fixed endpoints, timeouts and rejected redirects.

The workflow must exist on `main` before GitHub can activate the default-branch triggers. Merge the template/contract prerequisite PRs before the reporting PR. A successful test in the reporting PR proves the mocked contract and compilation, not live delivery from its protected default-branch workflow. Confirm the first real notification after merge; do not weaken the trust boundary to make a PR access the secret.

## Retry and operational checks

After setup or a provider interruption, open **Actions → Linear updates → Run workflow**, select `main` and enter the PR number. For an open PR it reconciles current successful checks; for a merged PR it reconciles the merge. Existing event comments are left alone. Check the run summary for `reported`, `already-reported`, `checks-not-passed`, `stale` or `not-applicable`. An authorization/schema error fails visibly; correct the secret/permissions and rerun.

Test locally without service access:

```sh
node --test scripts/pull-requests/tests/*.test.mjs
node --test scripts/linear-ci/tests/*.test.mjs
```

These fixtures cover PR policy, green/merge events, replay, stale/failed runs, project/role boundaries, pagination and transport failures. They never send real comments. A live delivery claim requires an actual Actions run and a matching Linear comment.

API references: [GitHub workflow events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [secure use](https://docs.github.com/en/actions/reference/security/secure-use), [Linear GraphQL](https://linear.app/developers/graphql), [Linear schema](https://github.com/linear/linear/blob/master/packages/sdk/src/schema.graphql).
