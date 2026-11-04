# Platform CMS backend verification

Implemented the shared validated config/defaults and exact operations contract in [admin-cms-api.md](admin-cms-api.md). All documented router procedures are available. Public reads expose published settings only. Draft save, publish and revision restore use a version predicate plus increment inside an audited database transaction; stale writes fail with CONFLICT. Restore affects draft only. Missing settings rows receive defaults; database outages propagate from data services.

Permissions use current database role/status. Editors manage CMS, moderators manage ordinary accounts/creator moderation/reports, analysts read aggregate and finance views, and superadmins manage the team and local subscription access. Moderator endpoints cannot suspend team accounts or their creator profiles. Role assignment requires an existing active verified account, blocks self changes and other superadmins, and revokes existing sessions. Superadmin creation remains an operator-bootstrap action. Revocation changes local access only and explicitly audits `billingChanged:false` with a reason.

Published registration flags are enforced both before email signup and in the actual Better Auth user-create database hook. New creator applications and message start/send enforce their flags on the server; existing profile edits and message history remain available. Email subjects, text and escaped HTML use the published brand name. Better Auth's internal appName remains static because the existing synchronous auth factory cannot read live database settings during initialization; session/cookie identity stays stable.

The ledger has integer minor units, ISO currency codes, provider-event idempotency, validated kind/status fields, restrictive foreign keys and no creation/mutation API. The additive SQL migration also rejects updates/deletes of ledger entries and published revisions. No transaction data is synthesized. A future provider adapter must normalize verified events into unique financial entries rather than append repeated webhook lifecycle snapshots; payment processing is still deferred. Analytics query real database aggregates, zero-fill UTC days, keep each currency separate, and reject unsafe numeric precision.

Prepared migration: `packages/db/prisma/migrations/20261026090000_platform_cms/migration.sql`. It adds three tables and their indexes/constraints/triggers without changing existing data. It has **not been applied**. Prisma cloud authentication remains a deployment blocker reported by the root integrator, so database SQL execution and live save/publish workflows remain unverified.

Verified locally on October 26, 2026:

- Prisma 7.10.1 schema validation and client generation passed.
- `bunx tsc -b packages/db packages/auth packages/api --pretty false` passed.
- `bunx ultracite check packages/api packages/auth/src packages/auth/tests packages/db/src` passed across 100 files.
- `bun test packages/api/tests packages/auth/tests` passed 86 tests with 216 assertions, including existing media/access/history/pagination suites and new CMS publication/restore/conflict, permission, URL/color/uniqueness, server flag, actual auth hook, ledger currency/precision, operations pagination and email-brand checks.

Database boundaries in tests use narrow in-memory fixtures; they exercise the actual oRPC middleware, validators, transitions and serializers. They do not establish live PostgreSQL transaction or trigger behavior. No secrets were read or printed, no seed was run, and no cloud database was mutated during this backend phase.

Implementation references consulted through project MCPs: [Prisma optimistic concurrency](https://www.prisma.io/docs/orm/v7/prisma-client/queries/transactions) and [Better Auth before hooks](https://better-auth.com/docs/concepts/hooks). The Better Auth official index maps its latest docs to the installed 1.7 release line.
