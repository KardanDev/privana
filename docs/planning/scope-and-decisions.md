# Privana scope and decisions

[The Linear roadmap](https://linear.app/kardandev/document/privana-delivery-roadmap-and-release-gates-1b866a380ec5) and [issue index](linear-index.md) are the current delivery plan. [The roadmap](roadmap.md) describes its ten milestones. The earlier eight-milestone draft is superseded.

## Source reconciliation

The plan combines the audited repository with the complete source requirements in KAR-5, KAR-6, KAR-7 and KAR-8. Broad issue descriptions were rewritten into concise deliverable parents and bounded stories, as the owner requested.

KAR-5 remains the overall product source. KAR-6 anchors account/onboarding architecture and KAR-7 anchors owner/team operations. KAR-8's unique continuation—additional finance/security tests, operating phases and final acceptance/reporting requirements—was incorporated into retained scope; KAR-8 is canceled as superseded, not marked as implemented. Actual issue links and final counts belong in the index.

Keep existing working features and records. Use additive migrations/backfills and explicit recovery plans rather than resets or duplicate schemas. The initial audit baseline was `f8040ab`; it is starting evidence, not a passing release claim.

## Agreed product boundaries

| Area | Decision |
| --- | --- |
| Initial market | Brazil first, with pt-BR interaction, explicit timezone handling and BRL as the initial test currency. Other currencies/markets require qualification; a dropdown does not establish operational support. |
| Accounts | Email/password first. One account retains fan capabilities and may gain creator capabilities after authorized approval. New fans receive no Studio/profile/application automatically. |
| Workspaces | Separate Fan, Studio and platform-operations layouts. Approved creators switch explicitly between Fan and Studio. One search control serves each context. |
| State model | Email verification, fan age assurance, creator identity, application approval, profile publication, account restrictions, tax/payout readiness and monetization eligibility remain independent. |
| Creator publication | Placement, audience, preview and price are separate dimensions. Private/unlisted URLs grant nothing. Follower/subscriber preview uses the same server evaluator as actual fan access. |
| Messaging | Active subscription is required for new sends in either direction, including attachments, broadcasts and automations. Expired threads become read-only. Following, tips and standalone purchases grant no chat rights. |
| Purchases | PPV is independent of membership: purchased items can remain after subscription expiry, subject to refund/reversal, safety removal and account restrictions. |
| Tips | Tips grant no content or messaging access. Goal progress uses settled contributions adjusted by refunds. |
| Commercial reporting | Integer minor units and explicit currencies; no implicit cross-currency sums. Preserve immutable price/receipt history and compensate ledger corrections. |
| Architecture | Extend the current modular Next.js/oRPC/Better Auth/Prisma application, private Upstash storage/Redis and Resend SDK. Reuse shared authorization, jobs, notifications and ledger contracts. |

## Synthetic testing and real operation

Current checkout is a browser-only card/Pix demonstration with no access grants. M4 replaces that limitation with a controlled server-driven sandbox:

1. Server creates a checkout intent using authoritative item, account, amount and currency.
2. An authorized synthetic adapter emits a trusted event.
3. One transaction records the event/ledger and projects synthetic access or revocation.
4. Retries and out-of-order events converge without duplicate effects.

Pending checkout, browser redirects and client state grant no access. Synthetic identities, events, entitlements and financial totals must be isolated from production records and explicitly labeled. Test card/Pix uses no real credentials or funds. Scenario controls are excluded from production routes and bundles.

M2 establishes separate verification contracts and sandbox fixtures. It does not establish real age or identity assurance. Approved real-verification activation is an explicit owner/provider-gated M8 deliverable **before external restricted-content onboarding**. Internal synthetic testing may proceed while that gate is unresolved. Real documents, selfies or biometric information are never collected for sandbox fixtures.

M9 separately gates real charging and payouts. Polar remains removed; no replacement provider is selected by this plan. Written qualification must cover the actual marketplace/content category, Brazil entity, required currencies, recurring methods, Pix capabilities, creator payouts, reserves, disputes and commercial economics. Reuse M4 contracts rather than create a second financial system. Hosted/tokenized card handling and signed provider events are required boundaries; a successful redirect is never payment proof.

## Release scope

The core sandbox/beta loop includes application review, safe private media, Vault, drafts/scheduling, monthly subscriptions, post/message PPV, Library, subscriber-only Inbox, basic automations, polls, tips and baseline safety controls. Owner operations add support, permissions/independent approvals, moderation and appeals, restricted compliance cases, CMS, auditing, safe configuration and integration health.

Advanced parity is retained in M10: tiers and access presets; bundles/trials/gifts/promos; advanced Vault/queue; subscriber broadcasts and richer automation; opt-in acquisition tracking; earnings exports; Brazil marketing experiments; qualified South America expansion; and approved Excel/PDF/scheduled reports. Delivery is split into selected bounded slices, with no blanket promise that all markets, channels or report formats are active.

Live rooms, stories/timed drops, custom requests and delegated creator teams start with feasibility/policy/access specifications and explicit prioritization. Streaming/replay rights, request disputes and delegated financial powers are unresolved product decisions, not capabilities implied by a route or menu item.

## Owner and team configuration

The CMS and business-rule registry expose supported typed settings, pages/blocks, theme, navigation and operating rules with validation, permission checks, preview, versions, effective dates and rollback. Configuration cannot grant age/creator eligibility, bypass access policy, turn on an unapproved payment provider or rewrite historical financial agreements.

Separate ordinary editing from legal-policy publication and sensitive business changes. Staff roles, reasons, fresh authorization, independent approval where required and immutable audit evidence protect high-impact actions. Staff receive no passwords, unrestricted private inbox browsing, arbitrary SQL/shell access or production secrets through the dashboard. Financial inspection distinguishes local access revocation, synthetic operations and confirmed provider money movement.

## Decisions that still gate release

- **Eligibility and content:** approve allowed markets/content, real age/identity provider and operating procedure, participant/consent evidence, public depicted-person reporting, takedown/appeal handling and qualified legal/privacy review.
- **External beta operations:** approve cohort/invite limits, accountable support/moderation responders, incident ownership, performance/accessibility targets, retention rules and recovery objectives; demonstrate backup restoration and containment drills.
- **Live money:** choose and qualify a provider, settle fees/taxes/currencies/reserves/refund/dispute/payout rules, complete provider sandbox reconciliation and authorize a limited pilot.
- **Expansion:** agree which parity/growth work is selected, provider/market eligibility, translation quality, acquisition measurement, staffing and operating cost before enabling it.

These are decision and implementation gates, not claims of legal compliance or provider acceptance. No calendar, team capacity, service approval or production readiness is inferred.

## Evidence rules

Existing code is classified as verify/harden, extend or missing implementation. Historical seed/email/browser reports retain their dates and limitations. Resend SDK acceptance alone is not proof of inbox delivery; a configured service is not proof of end-to-end readiness.

Completion requires acceptance evidence tied to the actual issue and PR: meaningful checks, negative authorization tests, mobile/accessibility behavior, optimistic failure recovery and migration/data-preservation verification where relevant. Service checks are opt-in and target isolated environments. Credentials, tokens, claim links, identity evidence and private media stay out of committed artifacts and logs.

Only M1 is authorized for immediate implementation. Planning later milestones, creating their issues or recording dependencies does not authorize starting them.
