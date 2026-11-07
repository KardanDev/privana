# Linear delivery index

Execution note: November 7, 2026; backlog structure recorded November 6. The live board owns current status and acceptance evidence. See [roadmap](roadmap.md), [scope and decisions](scope-and-decisions.md) and the [Linear project](https://linear.app/kardandev/project/privana-onlyfans-inspired-platform-eab4888a909b).

The project has 12 roadmap milestones. M01.5 is refined into ten workstream deliverables and 36 actionable stories with user outcomes, acceptance criteria, implementation checklists and native dependencies. M01 is merged and Done. M01.5 now executes one owner-authorized group at a time; later groups/milestones stay unstarted. KAR-8 is superseded planning material, not delivered work. Live issue status is authoritative.

## M01 — Delivery foundation

Deliverable: [KAR-9](https://linear.app/kardandev/issue/KAR-9/m01-delivery-foundation). Dependencies: none.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-17](https://linear.app/kardandev/issue/KAR-17/restore-a-trustworthy-main-branch-baseline) | Restore a trustworthy main-branch baseline | Milestone prerequisites |
| [KAR-18](https://linear.app/kardandev/issue/KAR-18/make-setup-and-environment-contracts-reproducible) | Make setup and environment contracts reproducible | Milestone prerequisites |
| [KAR-19](https://linear.app/kardandev/issue/KAR-19/add-a-safe-pull-request-quality-gate) | Add a safe pull-request quality gate | KAR-17, KAR-18 |
| [KAR-20](https://linear.app/kardandev/issue/KAR-20/establish-deterministic-regression-and-service-check-boundaries) | Establish deterministic regression and service-check boundaries | KAR-17 |
| [KAR-21](https://linear.app/kardandev/issue/KAR-21/define-data-safe-deployment-and-migration-contracts) | Define data-safe deployment and migration contracts | KAR-18 |
| [KAR-22](https://linear.app/kardandev/issue/KAR-22/make-the-github-linear-delivery-lifecycle-reviewable) | Make the GitHub–Linear delivery lifecycle reviewable | KAR-17, KAR-18, KAR-19, KAR-20, KAR-21 |

## M01.5 — Platform redesign and polish

Deliverable: [KAR-126](https://linear.app/kardandev/issue/KAR-126). M01 is merged and Done. KAR-127's baseline is accepted in [PR #2](https://github.com/KardanDev/privana/pull/2) and [PR #3](https://github.com/KardanDev/privana/pull/3). The owner accepted and merged KAR-128's [PR #5](https://github.com/KardanDev/privana/pull/5) and [PR #6](https://github.com/KardanDev/privana/pull/6), then authorized **KAR-129 only**. Proximidade was selected on November 7, 2026, and [KAR-141 / PR #7](https://github.com/KardanDev/privana/pull/7) is accepted and merged. KAR-142's [asset kit](m015-brand/asset-guide.md), in [PR #8](https://github.com/KardanDev/privana/pull/8), is based on merged `main` and awaits owner artwork review and merge. **KAR-130 and later groups remain unstarted.**

See the [direction decision](m015-brand/direction-review.md), [positioning brief](m015-positioning/brief.md), [execution brief](m015-redesign-plan.md), [audit](m015-design-audit.md) and [Linear source](https://linear.app/kardandev/document/m015-redesign-execution-brief-coverage-and-acceptance-16b1acc50787). Direction/artwork approval, production adoption and group advancement are separate gates.

[Execution brief in Linear](https://linear.app/kardandev/document/m015-redesign-execution-brief-coverage-and-acceptance-16b1acc50787). Each story contains a user story, four acceptance criteria, two implementation steps, relevant skill/tool guidance and native blocking relationships. Status below is structural; consult Linear for current execution and approvals.

| Deliverable | Workstream | Stories |
| --- | --- | --- |
| [KAR-127](https://linear.app/kardandev/issue/KAR-127) | Baseline: current screens, states and technical constraints | [KAR-137](https://linear.app/kardandev/issue/KAR-137), [KAR-138](https://linear.app/kardandev/issue/KAR-138) |
| [KAR-128](https://linear.app/kardandev/issue/KAR-128) | Positioning: Brazil-first product language and trust | [KAR-139](https://linear.app/kardandev/issue/KAR-139), [KAR-140](https://linear.app/kardandev/issue/KAR-140) |
| [KAR-129](https://linear.app/kardandev/issue/KAR-129) | Brand: distinctive identity, typography and assets | [KAR-141](https://linear.app/kardandev/issue/KAR-141), [KAR-142](https://linear.app/kardandev/issue/KAR-142) |
| [KAR-130](https://linear.app/kardandev/issue/KAR-130) | UX: navigation, prototypes and approved design handoff | [KAR-143](https://linear.app/kardandev/issue/KAR-143), [KAR-144](https://linear.app/kardandev/issue/KAR-144), [KAR-145](https://linear.app/kardandev/issue/KAR-145) |
| [KAR-131](https://linear.app/kardandev/issue/KAR-131) | System: accessible themes, components and coded references | [KAR-146](https://linear.app/kardandev/issue/KAR-146), [KAR-147](https://linear.app/kardandev/issue/KAR-147), [KAR-148](https://linear.app/kardandev/issue/KAR-148), [KAR-149](https://linear.app/kardandev/issue/KAR-149), [KAR-150](https://linear.app/kardandev/issue/KAR-150) |
| [KAR-132](https://linear.app/kardandev/issue/KAR-132) | Public: entry, authentication and supporting touchpoints | [KAR-151](https://linear.app/kardandev/issue/KAR-151), [KAR-152](https://linear.app/kardandev/issue/KAR-152), [KAR-153](https://linear.app/kardandev/issue/KAR-153) |
| [KAR-133](https://linear.app/kardandev/issue/KAR-133) | Fan: discovery, content, conversations and account | [KAR-154](https://linear.app/kardandev/issue/KAR-154), [KAR-155](https://linear.app/kardandev/issue/KAR-155), [KAR-156](https://linear.app/kardandev/issue/KAR-156), [KAR-157](https://linear.app/kardandev/issue/KAR-157), [KAR-158](https://linear.app/kardandev/issue/KAR-158), [KAR-159](https://linear.app/kardandev/issue/KAR-159), [KAR-160](https://linear.app/kardandev/issue/KAR-160) |
| [KAR-134](https://linear.app/kardandev/issue/KAR-134) | Studio: mobile profile, composer and content management | [KAR-161](https://linear.app/kardandev/issue/KAR-161), [KAR-162](https://linear.app/kardandev/issue/KAR-162), [KAR-163](https://linear.app/kardandev/issue/KAR-163) |
| [KAR-135](https://linear.app/kardandev/issue/KAR-135) | Owner: operations, financial records and CMS | [KAR-164](https://linear.app/kardandev/issue/KAR-164), [KAR-165](https://linear.app/kardandev/issue/KAR-165), [KAR-166](https://linear.app/kardandev/issue/KAR-166), [KAR-167](https://linear.app/kardandev/issue/KAR-167), [KAR-168](https://linear.app/kardandev/issue/KAR-168) |
| [KAR-136](https://linear.app/kardandev/issue/KAR-136) | Acceptance: visual, accessibility and performance evidence | [KAR-169](https://linear.app/kardandev/issue/KAR-169), [KAR-170](https://linear.app/kardandev/issue/KAR-170), [KAR-171](https://linear.app/kardandev/issue/KAR-171), [KAR-172](https://linear.app/kardandev/issue/KAR-172) |

| Issue | Actionable story | Depends on |
| --- | --- | --- |
| [KAR-137](https://linear.app/kardandev/issue/KAR-137) | Inventory every existing route, role and rendered state | [KAR-9](https://linear.app/kardandev/issue/KAR-9) |
| [KAR-138](https://linear.app/kardandev/issue/KAR-138) | Audit theme, components, state contracts and tool capabilities | [KAR-9](https://linear.app/kardandev/issue/KAR-9) |
| [KAR-139](https://linear.app/kardandev/issue/KAR-139) | Define Brazil-first positioning and product language | [KAR-137](https://linear.app/kardandev/issue/KAR-137) |
| [KAR-140](https://linear.app/kardandev/issue/KAR-140) | Specify honest public, access and recovery microcopy | [KAR-137](https://linear.app/kardandev/issue/KAR-137), [KAR-139](https://linear.app/kardandev/issue/KAR-139) |
| [KAR-141](https://linear.app/kardandev/issue/KAR-141) | Approve a distinctive visual direction and Google Fonts | [KAR-139](https://linear.app/kardandev/issue/KAR-139), [KAR-140](https://linear.app/kardandev/issue/KAR-140), [KAR-138](https://linear.app/kardandev/issue/KAR-138) |
| [KAR-142](https://linear.app/kardandev/issue/KAR-142) | Deliver the Privana logo and production brand assets | [KAR-141](https://linear.app/kardandev/issue/KAR-141) |
| [KAR-143](https://linear.app/kardandev/issue/KAR-143) | Map role-aware navigation and workspace boundaries | [KAR-137](https://linear.app/kardandev/issue/KAR-137), [KAR-139](https://linear.app/kardandev/issue/KAR-139) |
| [KAR-144](https://linear.app/kardandev/issue/KAR-144) | Prototype the critical fan, creator and owner workflows | [KAR-143](https://linear.app/kardandev/issue/KAR-143), [KAR-141](https://linear.app/kardandev/issue/KAR-141), [KAR-140](https://linear.app/kardandev/issue/KAR-140) |
| [KAR-145](https://linear.app/kardandev/issue/KAR-145) | Approve redesign scope, prototypes and design-code handoff | [KAR-144](https://linear.app/kardandev/issue/KAR-144), [KAR-142](https://linear.app/kardandev/issue/KAR-142), [KAR-138](https://linear.app/kardandev/issue/KAR-138) |
| [KAR-146](https://linear.app/kardandev/issue/KAR-146) | Implement semantic themes, fonts and CMS accent parity | [KAR-145](https://linear.app/kardandev/issue/KAR-145) |
| [KAR-147](https://linear.app/kardandev/issue/KAR-147) | Polish shared controls, forms, overlays and data patterns | [KAR-146](https://linear.app/kardandev/issue/KAR-146) |
| [KAR-148](https://linear.app/kardandev/issue/KAR-148) | Build consistent public, fan, Studio and owner shells | [KAR-147](https://linear.app/kardandev/issue/KAR-147), [KAR-143](https://linear.app/kardandev/issue/KAR-143) |
| [KAR-149](https://linear.app/kardandev/issue/KAR-149) | Preserve fast feedback and safe mutation recovery | [KAR-138](https://linear.app/kardandev/issue/KAR-138), [KAR-147](https://linear.app/kardandev/issue/KAR-147) |
| [KAR-150](https://linear.app/kardandev/issue/KAR-150) | Validate coded reference screens before platform rollout | [KAR-148](https://linear.app/kardandev/issue/KAR-148), [KAR-149](https://linear.app/kardandev/issue/KAR-149) |
| [KAR-151](https://linear.app/kardandev/issue/KAR-151) | Redesign public entry and fan-versus-creator paths | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-140](https://linear.app/kardandev/issue/KAR-140) |
| [KAR-152](https://linear.app/kardandev/issue/KAR-152) | Polish registration, login and account recovery screens | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-140](https://linear.app/kardandev/issue/KAR-140) |
| [KAR-153](https://linear.app/kardandev/issue/KAR-153) | Align reading pages, fallbacks and existing email branding | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-142](https://linear.app/kardandev/issue/KAR-142), [KAR-140](https://linear.app/kardandev/issue/KAR-140) |
| [KAR-154](https://linear.app/kardandev/issue/KAR-154) | Polish feed, post cards and existing social interactions | [KAR-150](https://linear.app/kardandev/issue/KAR-150) |
| [KAR-155](https://linear.app/kardandev/issue/KAR-155) | Refine discovery, search, categories and creator cards | [KAR-150](https://linear.app/kardandev/issue/KAR-150) |
| [KAR-156](https://linear.app/kardandev/issue/KAR-156) | Redesign creator profiles and contextual membership actions | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-154](https://linear.app/kardandev/issue/KAR-154) |
| [KAR-157](https://linear.app/kardandev/issue/KAR-157) | Polish inbox, conversation history and message composer | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-149](https://linear.app/kardandev/issue/KAR-149) |
| [KAR-158](https://linear.app/kardandev/issue/KAR-158) | Clarify saved content and current membership states | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-154](https://linear.app/kardandev/issue/KAR-154), [KAR-156](https://linear.app/kardandev/issue/KAR-156) |
| [KAR-159](https://linear.app/kardandev/issue/KAR-159) | Polish notifications, preferences and account settings | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-149](https://linear.app/kardandev/issue/KAR-149) |
| [KAR-160](https://linear.app/kardandev/issue/KAR-160) | Refine the simulated card and Pix checkout experience | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-156](https://linear.app/kardandev/issue/KAR-156) |
| [KAR-161](https://linear.app/kardandev/issue/KAR-161) | Polish creator application, status and profile management | [KAR-150](https://linear.app/kardandev/issue/KAR-150) |
| [KAR-162](https://linear.app/kardandev/issue/KAR-162) | Make mobile post editing and media feedback resilient | [KAR-150](https://linear.app/kardandev/issue/KAR-150), [KAR-149](https://linear.app/kardandev/issue/KAR-149), [KAR-161](https://linear.app/kardandev/issue/KAR-161) |
| [KAR-163](https://linear.app/kardandev/issue/KAR-163) | Refine Studio overview, content list and post lifecycle | [KAR-162](https://linear.app/kardandev/issue/KAR-162), [KAR-150](https://linear.app/kardandev/issue/KAR-150) |
| [KAR-164](https://linear.app/kardandev/issue/KAR-164) | Polish owner navigation and recorded overview metrics | [KAR-150](https://linear.app/kardandev/issue/KAR-150) |
| [KAR-165](https://linear.app/kardandev/issue/KAR-165) | Improve people, team roles and access-action clarity | [KAR-164](https://linear.app/kardandev/issue/KAR-164) |
| [KAR-166](https://linear.app/kardandev/issue/KAR-166) | Polish creator review and report inspection workflows | [KAR-164](https://linear.app/kardandev/issue/KAR-164) |
| [KAR-167](https://linear.app/kardandev/issue/KAR-167) | Clarify subscriptions, transactions and audit records | [KAR-164](https://linear.app/kardandev/issue/KAR-164) |
| [KAR-168](https://linear.app/kardandev/issue/KAR-168) | Refine CMS editing, preview, publication and history | [KAR-164](https://linear.app/kardandev/issue/KAR-164), [KAR-146](https://linear.app/kardandev/issue/KAR-146) |
| [KAR-169](https://linear.app/kardandev/issue/KAR-169) | Close route coverage and visual parity across devices | [KAR-132](https://linear.app/kardandev/issue/KAR-132), [KAR-133](https://linear.app/kardandev/issue/KAR-133), [KAR-134](https://linear.app/kardandev/issue/KAR-134), [KAR-135](https://linear.app/kardandev/issue/KAR-135) |
| [KAR-170](https://linear.app/kardandev/issue/KAR-170) | Verify accessibility, touch and assistive technology | [KAR-132](https://linear.app/kardandev/issue/KAR-132), [KAR-133](https://linear.app/kardandev/issue/KAR-133), [KAR-134](https://linear.app/kardandev/issue/KAR-134), [KAR-135](https://linear.app/kardandev/issue/KAR-135) |
| [KAR-171](https://linear.app/kardandev/issue/KAR-171) | Verify production-build performance and recovery boundaries | [KAR-132](https://linear.app/kardandev/issue/KAR-132), [KAR-133](https://linear.app/kardandev/issue/KAR-133), [KAR-134](https://linear.app/kardandev/issue/KAR-134), [KAR-135](https://linear.app/kardandev/issue/KAR-135) |
| [KAR-172](https://linear.app/kardandev/issue/KAR-172) | Accept M01.5 and publish design governance handoff | [KAR-169](https://linear.app/kardandev/issue/KAR-169), [KAR-170](https://linear.app/kardandev/issue/KAR-170), [KAR-171](https://linear.app/kardandev/issue/KAR-171) |

## M02 — Accounts, eligibility and onboarding

Deliverable: [KAR-6](https://linear.app/kardandev/issue/KAR-6/m02-accounts-eligibility-and-onboarding). Dependencies: M01, M01.5.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-23](https://linear.app/kardandev/issue/KAR-23/approve-supported-content-markets-and-eligibility-rules) | Approve supported content, markets and eligibility rules | Milestone prerequisites |
| [KAR-24](https://linear.app/kardandev/issue/KAR-24/harden-authentication-and-account-security-controls) | Harden authentication and account security controls | Milestone prerequisites |
| [KAR-25](https://linear.app/kardandev/issue/KAR-25/complete-creator-application-review-and-resubmission) | Complete creator application review and resubmission | KAR-65, KAR-66 |
| [KAR-26](https://linear.app/kardandev/issue/KAR-26/record-consent-and-content-participation-evidence) | Record consent and content participation evidence | KAR-23, KAR-66 |
| [KAR-27](https://linear.app/kardandev/issue/KAR-27/provide-privacy-requests-and-account-lifecycle) | Provide privacy requests and account lifecycle | KAR-23 |
| [KAR-28](https://linear.app/kardandev/issue/KAR-28/apply-api-abuse-controls-and-request-boundary-protection) | Apply API abuse controls and request-boundary protection | KAR-24 |
| [KAR-65](https://linear.app/kardandev/issue/KAR-65/separate-fan-defaults-creator-capabilities-and-workspace-entry) | Separate fan defaults, creator capabilities and workspace entry | KAR-9 |
| [KAR-66](https://linear.app/kardandev/issue/KAR-66/isolate-fan-age-and-creator-verification-sandbox-adapters) | Isolate fan-age and creator-verification sandbox adapters | KAR-65, KAR-23 |

## M03 — Protected media and content permissions

Deliverable: [KAR-10](https://linear.app/kardandev/issue/KAR-10/m03-protected-media-and-content-permissions). Dependencies: M02.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-29](https://linear.app/kardandev/issue/KAR-29/make-private-upload-completion-recoverable) | Make private upload completion recoverable | Milestone prerequisites |
| [KAR-30](https://linear.app/kardandev/issue/KAR-30/deliver-supported-video-reliably) | Deliver supported video reliably | KAR-29 |
| [KAR-31](https://linear.app/kardandev/issue/KAR-31/upload-profile-and-public-preview-images-safely) | Upload profile and public preview images safely | Milestone prerequisites |
| [KAR-32](https://linear.app/kardandev/issue/KAR-32/manage-media-deletion-orphans-and-retention) | Manage media deletion, orphans and retention | KAR-29, KAR-33 |
| [KAR-33](https://linear.app/kardandev/issue/KAR-33/separate-placement-audience-and-unlock-rules) | Separate placement, audience and unlock rules | Milestone prerequisites |
| [KAR-34](https://linear.app/kardandev/issue/KAR-34/optimize-authorized-delivery-and-media-accessibility) | Optimize authorized delivery and media accessibility | KAR-30, KAR-31 |

## M04 — Sandbox commerce and entitlements

Deliverable: [KAR-11](https://linear.app/kardandev/issue/KAR-11/m04-sandbox-commerce-and-entitlements). Dependencies: M02, M03.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-67](https://linear.app/kardandev/issue/KAR-67/create-server-owned-sandbox-orders-and-checkout-intents) | Create server-owned sandbox orders and checkout intents | KAR-65, KAR-66, KAR-10 |
| [KAR-68](https://linear.app/kardandev/issue/KAR-68/project-trusted-sandbox-events-into-an-immutable-ledger) | Project trusted sandbox events into an immutable ledger | KAR-67 |
| [KAR-69](https://linear.app/kardandev/issue/KAR-69/model-monthly-sandbox-subscription-terms-and-renewals) | Model monthly sandbox subscription terms and renewals | KAR-68 |
| [KAR-70](https://linear.app/kardandev/issue/KAR-70/grant-independent-sandbox-post-and-message-purchase-access) | Grant independent sandbox post and message purchase access | KAR-68, KAR-69, KAR-33 |
| [KAR-71](https://linear.app/kardandev/issue/KAR-71/record-sandbox-tips-and-settled-contribution-goals) | Record sandbox tips and settled contribution goals | KAR-68, KAR-70 |
| [KAR-72](https://linear.app/kardandev/issue/KAR-72/simulate-reversals-holds-and-creator-payout-lifecycle) | Simulate reversals, holds and creator payout lifecycle | KAR-68, KAR-69, KAR-71 |
| [KAR-73](https://linear.app/kardandev/issue/KAR-73/provide-durable-scheduled-work-and-event-delivery) | Provide durable scheduled work and event delivery | KAR-68, KAR-6, KAR-10 |

## M05 — Fan discovery, library and community

Deliverable: [KAR-12](https://linear.app/kardandev/issue/KAR-12/m05-fan-discovery-library-and-community). Dependencies: M02, M03, M04.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-35](https://linear.app/kardandev/issue/KAR-35/finish-accessible-discovery-and-creator-profiles) | Finish accessible discovery and creator profiles | Milestone prerequisites |
| [KAR-36](https://linear.app/kardandev/issue/KAR-36/verify-feeds-saved-posts-and-optimistic-social-consistency) | Verify feeds, saved posts and optimistic social consistency | Milestone prerequisites |
| [KAR-37](https://linear.app/kardandev/issue/KAR-37/make-comments-and-paginated-conversations-reliable) | Make comments and paginated conversations reliable | Milestone prerequisites |
| [KAR-38](https://linear.app/kardandev/issue/KAR-38/add-member-blocking-and-private-message-reporting) | Add member blocking and private-message reporting | Milestone prerequisites |
| [KAR-39](https://linear.app/kardandev/issue/KAR-39/complete-notifications-and-preference-aware-email-delivery) | Complete notifications and preference-aware email delivery | KAR-73 |
| [KAR-40](https://linear.app/kardandev/issue/KAR-40/apply-brazil-localization-and-inclusive-interaction-standards) | Apply Brazil localization and inclusive interaction standards | Milestone prerequisites |
| [KAR-74](https://linear.app/kardandev/issue/KAR-74/connect-fan-library-receipts-and-contextual-access-actions) | Connect fan Library, receipts and contextual access actions | KAR-69, KAR-70, KAR-35, KAR-36 |
| [KAR-75](https://linear.app/kardandev/issue/KAR-75/enforce-subscriber-only-chat-and-protected-attachments) | Enforce subscriber-only chat and protected attachments | KAR-69, KAR-70, KAR-37, KAR-38, KAR-10 |
| [KAR-76](https://linear.app/kardandev/issue/KAR-76/add-eligible-single-choice-polls-and-durable-results) | Add eligible single-choice polls and durable results | KAR-33, KAR-36 |
| [KAR-77](https://linear.app/kardandev/issue/KAR-77/expose-tip-checkout-and-honest-contribution-feedback) | Expose tip checkout and honest contribution feedback | KAR-71, KAR-74, KAR-75 |

## M06 — Creator Studio and daily workflow

Deliverable: [KAR-13](https://linear.app/kardandev/issue/KAR-13/m06-creator-studio-and-daily-workflow). Dependencies: M02, M03, M04, M05.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-41](https://linear.app/kardandev/issue/KAR-41/finish-creator-onboarding-and-readiness-checklist) | Finish creator onboarding and readiness checklist | Milestone prerequisites |
| [KAR-42](https://linear.app/kardandev/issue/KAR-42/finish-the-mobile-content-editor) | Finish the mobile content editor | Milestone prerequisites |
| [KAR-43](https://linear.app/kardandev/issue/KAR-43/complete-content-library-management) | Complete content library management | KAR-42, KAR-78 |
| [KAR-44](https://linear.app/kardandev/issue/KAR-44/give-creators-community-and-contact-controls) | Give creators community and contact controls | KAR-38, KAR-75 |
| [KAR-45](https://linear.app/kardandev/issue/KAR-45/provide-honest-creator-activity-analytics) | Provide honest creator activity analytics | Milestone prerequisites |
| [KAR-46](https://linear.app/kardandev/issue/KAR-46/polish-creator-profile-presentation-and-help) | Polish creator profile presentation and help | Milestone prerequisites |
| [KAR-78](https://linear.app/kardandev/issue/KAR-78/build-a-reusable-private-creator-vault) | Build a reusable private creator Vault | KAR-29, KAR-30, KAR-32, KAR-75 |
| [KAR-79](https://linear.app/kardandev/issue/KAR-79/schedule-reschedule-and-recover-post-publication) | Schedule, reschedule and recover post publication | KAR-73, KAR-78, KAR-33, KAR-42 |
| [KAR-80](https://linear.app/kardandev/issue/KAR-80/make-studio-inbox-a-subscriber-workbench) | Make Studio Inbox a subscriber workbench | KAR-75, KAR-78, KAR-44, KAR-82 |
| [KAR-81](https://linear.app/kardandev/issue/KAR-81/deliver-basic-subscriber-automations-with-explainable-logs) | Deliver basic subscriber automations with explainable logs | KAR-73, KAR-75, KAR-78, KAR-80 |
| [KAR-82](https://linear.app/kardandev/issue/KAR-82/organize-followers-subscribers-and-buyers-in-audience) | Organize followers, subscribers and buyers in Audience | KAR-69, KAR-70 |
| [KAR-83](https://linear.app/kardandev/issue/KAR-83/explain-simulated-creator-earnings-and-source-analytics) | Explain simulated creator earnings and source analytics | KAR-68, KAR-69, KAR-71, KAR-72, KAR-45 |

## M07 — Owner control center and CMS

Deliverable: [KAR-7](https://linear.app/kardandev/issue/KAR-7/m07-owner-control-center-and-cms). Dependencies: M02, M04, M05, M06.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-47](https://linear.app/kardandev/issue/KAR-47/harden-privileged-actions-and-owner-protection) | Harden privileged actions and owner protection | Milestone prerequisites |
| [KAR-48](https://linear.app/kardandev/issue/KAR-48/complete-moderation-queues-and-case-handling) | Complete moderation queues and case handling | KAR-93, KAR-50 |
| [KAR-49](https://linear.app/kardandev/issue/KAR-49/complete-platform-customization-and-cms-safeguards) | Complete platform customization and CMS safeguards | Milestone prerequisites |
| [KAR-50](https://linear.app/kardandev/issue/KAR-50/make-audits-and-support-investigations-usable) | Make audits and support investigations usable | KAR-27 |
| [KAR-51](https://linear.app/kardandev/issue/KAR-51/complete-platform-analytics-and-data-definitions) | Complete platform analytics and data definitions | Milestone prerequisites |
| [KAR-52](https://linear.app/kardandev/issue/KAR-52/verify-existing-launch-switches-and-operator-handoff) | Verify existing launch switches and operator handoff | Milestone prerequisites |
| [KAR-93](https://linear.app/kardandev/issue/KAR-93/delegate-staff-access-with-configurable-action-permissions) | Delegate staff access with configurable action permissions | KAR-24, KAR-47 |
| [KAR-94](https://linear.app/kardandev/issue/KAR-94/require-independent-approval-for-sensitive-operations) | Require independent approval for sensitive operations | KAR-93 |
| [KAR-95](https://linear.app/kardandev/issue/KAR-95/investigate-accounts-and-apply-reasoned-capability-restrictions) | Investigate accounts and apply reasoned capability restrictions | KAR-93, KAR-94 |
| [KAR-96](https://linear.app/kardandev/issue/KAR-96/let-members-open-and-follow-private-support-tickets) | Let members open and follow private support tickets | KAR-93, KAR-10, KAR-39 |
| [KAR-97](https://linear.app/kardandev/issue/KAR-97/operate-support-queues-escalation-and-resolution) | Operate support queues, escalation and resolution | KAR-96, KAR-95 |
| [KAR-98](https://linear.app/kardandev/issue/KAR-98/version-regional-and-commercial-business-configuration) | Version regional and commercial business configuration | KAR-94 |
| [KAR-99](https://linear.app/kardandev/issue/KAR-99/manage-validated-transactional-email-templates) | Manage validated transactional email templates | KAR-93, KAR-39 |
| [KAR-100](https://linear.app/kardandev/issue/KAR-100/schedule-targeted-announcements-with-delivery-accountability) | Schedule targeted announcements with delivery accountability | KAR-99, KAR-98 |
| [KAR-101](https://linear.app/kardandev/issue/KAR-101/inspect-integration-health-and-retry-approved-failures-safely) | Inspect integration health and retry approved failures safely | KAR-93 |
| [KAR-102](https://linear.app/kardandev/issue/KAR-102/apply-reversible-emergency-controls-with-impact-previews) | Apply reversible emergency controls with impact previews | KAR-101, KAR-94 |
| [KAR-103](https://linear.app/kardandev/issue/KAR-103/trace-financial-records-without-implying-live-payment-operations) | Trace financial records without implying live payment operations | KAR-93, KAR-95 |
| [KAR-104](https://linear.app/kardandev/issue/KAR-104/schedule-cms-publication-and-govern-legal-policy-revisions) | Schedule CMS publication and govern legal policy revisions | KAR-93, KAR-94 |
| [KAR-105](https://linear.app/kardandev/issue/KAR-105/review-appeals-independently-and-version-moderation-policies) | Review appeals independently and version moderation policies | KAR-48, KAR-93 |
| [KAR-106](https://linear.app/kardandev/issue/KAR-106/operate-restricted-compliance-and-legal-request-cases) | Operate restricted compliance and legal-request cases | KAR-26, KAR-27, KAR-95 |

## M08 — Brazil beta and operational readiness

Deliverable: [KAR-14](https://linear.app/kardandev/issue/KAR-14/m08-brazil-beta-and-operational-readiness). Dependencies: M01, M02, M03, M04, M05, M06, M07.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-53](https://linear.app/kardandev/issue/KAR-53/stand-up-isolated-staging-and-preview-promotion) | Stand up isolated staging and preview promotion | Milestone prerequisites |
| [KAR-54](https://linear.app/kardandev/issue/KAR-54/automate-the-complete-beta-journey-matrix) | Automate the complete beta journey matrix | Milestone prerequisites |
| [KAR-55](https://linear.app/kardandev/issue/KAR-55/meet-measured-performance-and-accessibility-budgets) | Meet measured performance and accessibility budgets | Milestone prerequisites |
| [KAR-56](https://linear.app/kardandev/issue/KAR-56/establish-monitoring-alerts-and-incident-response) | Establish monitoring, alerts and incident response | Milestone prerequisites |
| [KAR-125](https://linear.app/kardandev/issue/KAR-125) | Integrate Sentry MCP onboarding, Next.js monitoring and incident alerts | KAR-56 |
| [KAR-57](https://linear.app/kardandev/issue/KAR-57/validate-backups-restores-and-retention-operations) | Validate backups, restores and retention operations | Milestone prerequisites |
| [KAR-58](https://linear.app/kardandev/issue/KAR-58/run-the-beta-readiness-and-acceptance-gate) | Run the beta readiness and acceptance gate | KAR-53, KAR-54, KAR-55, KAR-56, KAR-57, KAR-107 |
| [KAR-107](https://linear.app/kardandev/issue/KAR-107/activate-approved-real-age-and-identity-assurance-before-external-beta) | Activate approved real age and identity assurance before external beta | KAR-23, KAR-66 |

## M09 — Approved live billing and payouts

Deliverable: [KAR-15](https://linear.app/kardandev/issue/KAR-15/m09-approved-live-billing-and-payouts). Dependencies: M04, M07, M08.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-59](https://linear.app/kardandev/issue/KAR-59/qualify-and-select-an-eligible-paymentpayout-provider) | Qualify and select an eligible payment/payout provider | Milestone prerequisites |
| [KAR-60](https://linear.app/kardandev/issue/KAR-60/promote-sandbox-contracts-to-approved-live-billing) | Promote sandbox contracts to approved live billing | KAR-59 |
| [KAR-61](https://linear.app/kardandev/issue/KAR-61/integrate-tokenized-card-and-approved-pix-checkout) | Integrate tokenized card and approved Pix checkout | KAR-59, KAR-60 |
| [KAR-62](https://linear.app/kardandev/issue/KAR-62/receive-reconcile-and-audit-provider-events) | Receive, reconcile and audit provider events | KAR-59, KAR-60 |
| [KAR-63](https://linear.app/kardandev/issue/KAR-63/provide-billing-support-cancellation-and-dispute-handling) | Provide billing support, cancellation and dispute handling | KAR-61, KAR-62 |
| [KAR-64](https://linear.app/kardandev/issue/KAR-64/launch-creator-payouts-and-limited-live-monetization) | Launch creator payouts and limited live monetization | KAR-63 |
| [KAR-108](https://linear.app/kardandev/issue/KAR-108/reconcile-creator-balances-reserves-and-financial-adjustments) | Reconcile creator balances, reserves and financial adjustments | KAR-59, KAR-60, KAR-62, KAR-94 |

## M10 — Advanced parity, growth and expansion

Deliverable: [KAR-16](https://linear.app/kardandev/issue/KAR-16/m10-advanced-parity-growth-and-expansion). Dependencies: M08.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-84](https://linear.app/kardandev/issue/KAR-84/add-tiers-and-reusable-audience-permission-presets) | Add tiers and reusable audience permission presets | KAR-69, KAR-70, KAR-82, KAR-14 |
| [KAR-85](https://linear.app/kardandev/issue/KAR-85/offer-bounded-bundles-trials-gifts-and-promotions) | Offer bounded bundles, trials, gifts and promotions | KAR-84, KAR-68, KAR-74 |
| [KAR-86](https://linear.app/kardandev/issue/KAR-86/extend-vault-collections-media-bundles-and-post-queue) | Extend Vault collections, media bundles and post queue | KAR-78, KAR-79, KAR-70 |
| [KAR-87](https://linear.app/kardandev/issue/KAR-87/broadcast-privately-to-eligible-subscriber-segments) | Broadcast privately to eligible subscriber segments | KAR-73, KAR-75, KAR-81, KAR-82, KAR-84 |
| [KAR-88](https://linear.app/kardandev/issue/KAR-88/add-opt-in-acquisition-tracking-and-earnings-exports) | Add opt-in acquisition tracking and earnings exports | KAR-83, KAR-35, KAR-39, KAR-6, KAR-33 |
| [KAR-89](https://linear.app/kardandev/issue/KAR-89/specify-gated-live-rooms-ticketing-and-replay-rights) | Specify gated live rooms, ticketing and replay rights | KAR-14, KAR-15, KAR-84, KAR-7 |
| [KAR-90](https://linear.app/kardandev/issue/KAR-90/specify-stories-and-timed-drops-with-shared-access-rules) | Specify stories and timed drops with shared access rules | KAR-79, KAR-70, KAR-10, KAR-14 |
| [KAR-91](https://linear.app/kardandev/issue/KAR-91/specify-custom-requests-acceptance-and-disputes) | Specify custom requests, acceptance and disputes | KAR-70, KAR-75, KAR-7, KAR-15, KAR-14 |
| [KAR-92](https://linear.app/kardandev/issue/KAR-92/plan-delegated-creator-teams-and-scoped-activity-history) | Plan delegated creator teams and scoped activity history | KAR-65, KAR-47, KAR-50, KAR-14 |
| [KAR-109](https://linear.app/kardandev/issue/KAR-109/plan-and-measure-a-brazil-launch-and-creator-acquisition-experiments) | Plan and measure a Brazil launch and creator acquisition experiments | KAR-14, KAR-88 |
| [KAR-110](https://linear.app/kardandev/issue/KAR-110/qualify-south-america-markets-locales-and-currency-operations) | Qualify South America markets, locales and currency operations | KAR-14, KAR-59 |
| [KAR-111](https://linear.app/kardandev/issue/KAR-111/deliver-approved-downloadable-and-scheduled-reports) | Deliver approved downloadable and scheduled reports | KAR-51, KAR-93, KAR-39 |

## M11 — Yoti Age Verification Integration

Deliverable: [KAR-124](https://linear.app/kardandev/issue/KAR-124). Depends on M02 eligibility contracts and M07 operations conventions. Requires owner/provider approval and verified integration evidence before M08 external-beta activation; numbering preserves the original references.

| Issue | User outcome / implementation story | Depends on |
| --- | --- | --- |
| [KAR-112](https://linear.app/kardandev/issue/KAR-112) | Approve Yoti AVS onboarding, Brazil verification policy and service configuration | See live issue dependencies |
| [KAR-113](https://linear.app/kardandev/issue/KAR-113) | Audit eligibility and map safe sandbox-to-Yoti integration boundaries | See live issue dependencies |
| [KAR-114](https://linear.app/kardandev/issue/KAR-114) | Persist minimal Yoti attempts and versioned age-entitlement policy | See live issue dependencies |
| [KAR-115](https://linear.app/kardandev/issue/KAR-115) | Implement authenticated Yoti AVS session creation and hosted redirect | See live issue dependencies |
| [KAR-116](https://linear.app/kardandev/issue/KAR-116) | Verify Yoti session results and RSA-PSS-signed webhook notifications | See live issue dependencies |
| [KAR-117](https://linear.app/kardandev/issue/KAR-117) | Enforce expiring jurisdiction-aware age entitlement across restricted access | See live issue dependencies |
| [KAR-118](https://linear.app/kardandev/issue/KAR-118) | Enable Brazil CPF hosted verification under approved Yoti configuration | See live issue dependencies |
| [KAR-119](https://linear.app/kardandev/issue/KAR-119) | Build responsive fan and creator Yoti age-verification journey | See live issue dependencies |
| [KAR-120](https://linear.app/kardandev/issue/KAR-120) | Add real Yoti operations and audit reporting to Owner Control Center | See live issue dependencies |
| [KAR-121](https://linear.app/kardandev/issue/KAR-121) | Harden age-verification retries, expiry, outages and production cutover | See live issue dependencies |
| [KAR-122](https://linear.app/kardandev/issue/KAR-122) | Automate Yoti integration, security and jurisdiction acceptance tests | See live issue dependencies |
| [KAR-123](https://linear.app/kardandev/issue/KAR-123) | Prove real Yoti communication and sign off controlled Brazil rollout | See live issue dependencies |
