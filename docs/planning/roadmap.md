# Privana delivery roadmap

The current plan is maintained in [Linear: delivery roadmap and release gates](https://linear.app/kardandev/document/privana-delivery-roadmap-and-release-gates-1b866a380ec5). [The Linear index](linear-index.md) maps deliverables and executable stories to their actual issue IDs. This document explains sequencing and release gates; issue status and acceptance evidence live in Linear.

The target is a Brazil-first creator platform with a complete fan experience, a mobile Creator Studio and a separate owner/team control center. Keep the existing modular application and working features, preserve data, and deliver small vertical slices. The first release uses synthetic verification and commerce for internal testing. External restricted-content onboarding and real money each have additional gates.

## Starting evidence

Planning used the 499-file current-source audit, `repomix-output.xml` and the original KAR-5, KAR-6, KAR-7 and KAR-8 requirements. The repository baseline was `f8040ab` on November 6, 2026. The packed snapshot was checked against selected current source; it is context, not the source of truth.

Email/password authentication, Resend SDK delivery, private Upstash media, Redis controls, community interactions, Studio, operations and versioned CMS already have substantial implementation. They need verification and targeted extension. Historical service/browser evidence does not establish that today's checks pass.

The initial pre-M01 blockers included a Studio save-helper parse error, missing repository CI, stale Blob/Turbo environment guidance and tooling assets entering lint scope. M01 repaired and verified that baseline; see its merged handoff. The existing checkout is a browser-only demonstration that grants no access. Server-driven synthetic entitlements remain planned work in M4.

## Milestones and release gates

Dependencies establish a delivery sequence, not calendar commitments. Cross-cutting security, privacy, accessibility, responsive design and optimistic recovery apply throughout.

| Milestone | Deliverable | Exit evidence | Depends on |
| --- | --- | --- | --- |
| M1 — Delivery foundation | Reproducible setup, corrected baseline, safe CI, regression boundaries and review workflow | Fresh lint/types/unit/build results; checks demonstrated on a real PR; environment/migration contracts and reviewed handoff | None |
| M1.5 — Platform redesign and polish | Distinct identity, accessible themes/components and complete responsive redesign of existing public, fan, Studio and owner/CMS screens | G0 baseline, G1 approved design, G2 coded references, G3 owner acceptance with route/state/accessibility/performance evidence; see the execution brief | M1 |
| M2 — Accounts, eligibility and onboarding | Fan defaults, separate creator applications/capabilities, verification contracts, synthetic fixtures, account security, consent and privacy workflows | State transitions and direct route/API denials pass; applicant approval is independent of verification; synthetic results cannot establish production eligibility | M1.5 |
| M3 — Protected media and content permissions | Recoverable private uploads, supported video, retention and one authoritative placement/audience/purchase policy | Two creators and separate fans prove isolation, safe previews, removal/revocation and recoverable failures across API/media/cache paths | M2 |
| M4 — Sandbox commerce and entitlements | Server checkout, immutable ledger, monthly terms, PPV, tips, reversals, payout fixtures and durable jobs | Trusted events grant/revoke only synthetic access; pending/redirect states grant nothing; replay, expiry, refund and currency invariants pass | M2–M3 |
| M5 — Fan discovery, Library and community | Complete mobile browsing, receipts, purchases, subscriber-only Inbox, polls, tips, notifications and safety flows | Role/device journeys prove purchase retention, subscription expiry, pagination, unread state and optimistic rollback; one search per context | M2–M4 |
| M6 — Creator Studio and daily workflow | Task-oriented Overview, Vault, mixed-media editor, scheduling, Audience, Inbox, automations and recorded earnings | A creator completes the working loop on a phone; publication and delayed sends recheck access; automation logs explain sends/skips | M2–M5 |
| M7 — Owner control center and CMS | Configurable staff permissions, approvals, people/support operations, moderation/appeals, restricted cases, CMS, business rules, audits and health controls | Each staff persona completes only permitted tasks; decisions are reasoned/audited; configuration works in consumer layouts; simulated and live figures remain distinct | M2, M4–M6 |
| M8 — Brazil beta and operational readiness | Isolated Vercel environments, complete QA, approved real-assurance activation, monitoring, recovery and beta decision | Device/API/media/performance/accessibility evidence and restore/incident drills pass; real eligibility operations are approved before external restricted-content onboarding | M1–M7; owner/provider decision for real assurance |
| M9 — Approved live billing and payouts | Selected provider adapter, signed events, balances/reserves/adjustments, reconciliation, billing support and creator payouts | Written approval for the actual business/content/Brazil/currencies/payout model; reconciled provider sandbox; separate owner approval before a limited live pilot | M4, M7–M8; owner/provider approval |
| M10 — Advanced parity, growth and expansion | Selected tiers/offers, advanced Vault/queue, broadcasts, acquisition/exports, Brazil marketing experiments and qualified market expansion; future-format specifications | Each selected slice has its own access, commercial, operating and test gate; live rooms/stories/custom requests/delegation start with explicit decisions; incomplete features stay outside navigation | M8; M9 when real commercial operation is involved |
| M11 — Yoti Age Verification Integration | Provider-gated real age-assurance implementation tracked in KAR-124 and its stories | Approved provider communication and eligibility evidence before M08 external restricted-content onboarding; no synthetic approval in production | M2 and M7 contracts; feeds the M8 gate |

The live roadmap includes 12 milestones, including M01.5, M11 Yoti and the M08 Sentry work. M01 is Done. M01.5 is organized into ten workstreams and 36 actionable stories. It now executes one owner-authorized group at a time; the live index records the current boundary. See the execution brief and Linear for detailed acceptance and dependencies.

## Current implementation boundary

M01 is complete: [PR #1](https://github.com/KardanDev/privana/pull/1) is merged and KAR-9/KAR-17–22 are Done. Its historical starting blockers are resolved; the evidence is recorded in the M01 verification handoff. Those historical observations are not current failure claims.

On November 7, the owner accepted the merged KAR-127 baseline and authorized KAR-128 next. Its [positioning brief](m015-positioning/brief.md), vocabulary and dependent copy proposal require review before KAR-129. The [redesign execution brief](m015-redesign-plan.md) and Linear stories define the remaining gates; consult the [live delivery index](linear-index.md) for current authorization. No later group or milestone starts automatically, and deployment/provider decisions remain separate.

## What the beta must demonstrate

Use at least two creators and separate fan accounts to exercise signup, synthetic age checks, application/review, workspace switching, Vault upload, draft and scheduled publication, monthly sandbox subscription, PPV, Library, subscriber messaging, basic automation, poll, tip/refund, expiry and takedown. Verify desktop and narrow mobile behavior, plus direct API, media, cache and delayed-job access.

The interface should make the next action clear: restrained royal-purple branding, consistent typography and status labels, useful loading/empty/error/read-only states, accessible focus and touch behavior, and no duplicate search controls. Optimistic actions must reconcile or roll back; they never grant paid access or override the server's eligibility decision.

Repeatable seeds use safe synthetic media and varied access states, preserve existing records/passwords and keep credentials outside committed documentation. A screen, route or fixture earns no completion credit without its working behavior and evidence.

## Delivery practice

Each executable story has a user outcome, testable acceptance criteria and concrete implementation checklists. Its PR explains resulting behavior, meaningful validation, migration impact and rollout/recovery constraints; relevant UI changes include desktop/mobile evidence. Keep functions and components within focused domain files and avoid parallel implementations of the same policy, transport or ledger.

Maintain one parity/status matrix through Linear and the index. Record decisions and unresolved gates in [scope and decisions](scope-and-decisions.md). Capacity, assignees and dates are set when the owner schedules work; this roadmap invents none.
