# Platform security and correctness review

Reviewed on 2026-10-27. Scope: CMS draft/publication flow, operations permissions, financial read models, additive SQL migration, and demo seeding. This is a code and unit-test review; no cloud database mutation or real mail/payment delivery was performed.

## Findings

### Resolved P2 — Moderators could not load private media returned by report inspection

`packages/api/src/domains/admin/report-details.ts:50` returns `/api/media/{postId}` to the `moderationProcedure`, including moderators. `packages/api/src/domains/access/authorize-post-media.ts:31` checks ordinary post access, and `can-access-post.ts:26` grants privileged access only to admins and the content owner. A moderator inspecting reported subscriber-only, archived, or suspended-creator content therefore receives the private body but gets a 403 for its image/video unless they independently have ordinary access. Existing report tests cover admin/member/suspended-admin, but omit moderator media.

Resolution: `can-review-reported-media.ts` authorizes active moderators only when a report references the requested post. The media endpoint retains ordinary access checks and does not grant general premium access to moderators. Regression coverage includes reported private media, unreported media, suspended moderators, members, editors, and analysts.

### Resolved P2 — Target-role guards were not atomic with moderation/team writes

`packages/api/src/domains/admin/set-user-status.ts:18` checks the target's role, then updates by ID only at line 26. A moderator's read of a member can race with an admin granting that member an editor/analyst/moderator role; the subsequent write can suspend the now-privileged account despite the stated staff protection. `set-creator-status.ts:16`/`:32` has the corresponding race for a profile whose owner is promoted concurrently. `set-team-role.ts:25`/`:34` can similarly overwrite a manual owner promotion between its guard and write. Transactions alone at PostgreSQL's default read-committed isolation do not lock these earlier reads.

Resolution: status updates now compare the target role and status in an `updateMany` predicate; team grants also require current verified/active eligibility. A zero-row update returns `CONFLICT` before session/audit changes. `lock-creator-moderation-target.ts` uses parameterized `SELECT ... FOR UPDATE OF creator, owner` inside the existing transaction, so the creator restriction uses the owner role while holding both row locks. Regression fixtures simulate target changes between read and write and verify denied mutations have no side effects. Actual lock behavior remains a cloud-database integration check.

## Positive checks

- CMS changes use a version-qualified compare-and-swap inside a transaction. A failed compare-and-swap produces neither publication nor audit. Restore edits the draft only; public reads select published configuration.
- Current database role/status controls endpoint access instead of stale session role claims. CMS, moderation, finance and owner operations have distinct procedures. Account/team mutations revoke sessions where relevant.
- Configuration uses bounded strict schemas, safe local/HTTPS destinations, and readable accent checks. The reviewed renderers use plain React text and image/link attributes rather than executable HTML. No unsafe-URL bypass was identified.
- The migration adds rather than resets tables. SQL constraints validate ledger amount/currency/kind/status, enforce event idempotency, and reject update/delete of published revisions and transaction records. Actual trigger behavior still requires a PostgreSQL integration check after cloud access is available.
- Financial views are read-only. No demo transaction or subscription writes were found; amounts remain separated by currency. Before a real provider is integrated, explicitly define lifecycle aggregation: multiple events for one provider transaction must not be mistaken for multiple charges or leave superseded pending totals unresolved.
- Seed execution requires explicit opt-in plus a nonproduction environment; production Vercel is rejected. Reserved user/email/profile ownership checks prevent claiming unrelated records. The seed transaction rolls back on conflict. Existing profile/post content is preserved, passwords are reused through the ignored local manifest, and credential writes are atomic. Rerunning deliberately restores demo account roles/status/verification/passwords; it does not preserve changes to those demo authentication settings.
- Credentials are not printed by the seed. The manifest is marked ready only after a successful database transaction, and the exclusive lock avoids concurrent local seeds.

## Verification

The six new failing regressions reproduced the old behavior before implementation, then passed after the fixes. Final broader run:

```text
bun test packages/api/tests packages/db/tests
```

Result: **95 passed, 0 failed, 252 assertions across 15 files**. `bun run --cwd packages/api check-types` and scoped Ultracite checks also passed. These tests use mocked/in-memory database fixtures; they do not prove real SQL transaction isolation, triggers, migrations, provider delivery, or seeded-account login against Prisma cloud.
