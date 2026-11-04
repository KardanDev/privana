# Platform CMS and social UI implementation plan

> For agentic workers: domain-scoped implementation with independent review. Preserve existing checkout and user changes; no commit or deployment requested.

**Goal:** A distinctive social creator product with an audited administration CMS and real operations views.

**Architecture:** Shared validated platform settings contract; Prisma draft/published settings and ledger; role-specific oRPC operations; responsive member shell and separate operations shell.

**Tech Stack:** Existing Next 16, React 19, Better Auth, Prisma 7 cloud, oRPC, Bun, shadcn/Base UI.

**Spec:** ../specs/2026-10-25-platform-cms-design.md

## Constraints and review focus

- One named function/component per domain file; pt-BR product copy; purple default.
- No executable CMS content, private keys in config responses, self-escalation or stale-role access.
- Expected revision protects concurrent edits; drafts never appear publicly.
- Payments deferred; no synthetic transactions or combined currency revenue totals.
- Preserve existing persisted data; additive migrations only.

## Task 1: Platform contract and durable operations API

Owner backend. Files `packages/api/src/contracts/platform.ts`, `domains/platform/**`, `domains/admin/**`, `packages/db/prisma/schema/platform.prisma`, additive migration, API tests.

- [ ] Add validated config/defaults, draft/public storage, revision history and immutable transaction records.
- [ ] Implement `platform.get`, admin CMS get/saveDraft/publish/history/restoreDraft, expectedVersion on mutations; audited role management and filtered finance/analytics APIs.
- [ ] Enforce registration, creator application and messaging flags at their backend mutation boundaries.
- [ ] Test permissions, conflict behavior, feature switches, currency totals; generate client, lint and typecheck.

## Task 2: Operations interface

Owner admin UI. Files `apps/web/src/domains/admin/**`, `/app/admin/**`.

- [ ] Separate sidebar/section navigation, overview charts and actionable counts.
- [ ] Users/team, creators/reports, subscriptions/transactions and audit tables with server filters/pagination.
- [ ] Structured CMS tabs with draft edits, explicit publish, history/restore and public preview; permission-aware controls.
- [ ] Verify loading/error/empty, no fake money/action claims; scoped type/lint.

## Task 3: Social interface and live CMS consumption

Owner root/member UI. Files shared shell/theme/platform provider and member domains.

- [ ] Replace marketing hero with social exploration/stream/suggestion composition; tighten posts and creator profiles.
- [ ] Read published config for brand/color/navigation/categories/announcement/pages/auth copy/feature affordances and metadata.
- [ ] Keep clear locked states, durable actions and mobile tabs; no simulated stories/live activity.
- [ ] Desktop/mobile visual verification and useful navigation checks.

## Task 4: Integration and review

- [ ] Apply additive migration only after valid Prisma cloud connection; verify CMS save/publish and member workflows.
- [ ] Tests, schema validation, TypeScript, Ultracite and production build.
- [ ] Independent review and update setup documentation, rollout limits and provider comparison with primary citations.
