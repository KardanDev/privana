# KAR-130 — Bounded UX delivery and review plan

The owner accepted KAR-129 in PRs #7/#8 and authorized KAR-130 on November 7, 2026. This group prepares the current experience for implementation. The approved Proximidade identity, existing routes, server permissions, published CMS overrides and simulated-commerce boundary remain the inputs.

## Deliverables and PR sequence

| Issue | Reviewable outcome | Dependency / boundary |
| --- | --- | --- |
| KAR-143 | Route/role matrix, responsive navigation examples and search/history/focus contract | Current source and merged baseline; no application code change. |
| KAR-177 | Isolated responsive review harness, modular frame/state rendering and a local-only runner | KAR-143/141. Shared tooling only, outside production routes and services. |
| KAR-178 | Public/member discovery, named creator profiles and account entry/recovery | KAR-177/143/140. Read-only test credentials, local filtering and useful return context. |
| KAR-181 | Fan feed/saved, recorded memberships, conversations and account preferences | KAR-178. Independent access fixtures; failed mutations retain useful input/context. |
| KAR-182 | No-charge card and Pix checkout, reference currencies and recovery | KAR-178. Fixed test inputs, zero charge and no access grant. |
| KAR-179 | Mobile/desktop creator application, profile, editor interruption and draft/publish/archive cases | KAR-177/143/140. Public preview and private media remain distinct. |
| KAR-180 | Staff-role operations/confirmation/audit and CMS draft/preview/publish/restore/conflict cases | KAR-177/143/140. No real records, messages or media inspection. |
| KAR-145 | Builder review, source/token/component/screen mapping, three reference-screen definitions and G1 approval record | All critical prototypes and accepted identity. Owner approval remains explicit, never inferred from CI. |

KAR-144 is the prototype container for six bounded child stories. The formatted fan source exceeded the hard PR budget before layout; separating public, community and checkout retains all original acceptance. Each actionable issue has one short-lived branch and ordinary PR; dependent PRs identify their base and merge order. The group review precedes KAR-131 or any later group.

## Review medium and fixture contract

Use an editable repository prototype as the canonical review source, matching the accepted code-led identity studies. The existing Bun/JavaScript toolchain serves only allowlisted review files on loopback. This is a delivery choice, not an assertion that Figma is unavailable. No Figma file or synchronization is claimed; an optional later design copy cannot silently replace the approved repository source.

Keep the tool's scenario selector and prototype notice distinct from the product frame. Fixtures use pt-BR names, currency and dates; every count/result is fictional. Inputs never authenticate, pay, send email, upload media or publish CMS content. State lives in memory and resets on reload. Future-only features stay out of the product-frame navigation.

## Walkthrough evidence

For every domain, link start/end frames and exercise forward, back/cancel and retry paths. Capture representative phone/desktop and light/dark cases; include long/empty/locked/loading/failure/permission examples. Record whether a frame demonstrates current behavior, a proposed UI repair or a future dependency. Route coverage is not proof that live services were exercised.

KAR-145's review must reconcile the full route/role/state inventory with the prototype matrix, current CMS customization and code ownership. Define reference examples for a fan content task, mobile creator editing and owner CMS/data work. Resolve material ambiguity before seeking the owner decision; preserve genuine release/content/tool dependencies as named gates rather than fake approval.
