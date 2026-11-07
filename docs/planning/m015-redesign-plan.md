# M01.5 — Platform redesign and polish

Planning revision: November 6, 2026. Baseline: `f28b21e`; M01 is merged and Done. This revision plans M01.5 only. It does not authorize implementation or advancement into another milestone.

The [Linear epic](https://linear.app/kardandev/issue/KAR-126) owns delivery status. [PRODUCT.md](../../apps/web/PRODUCT.md) records the product premise confirmed by the owner. The execution index below links every refined work item and dependency.

## Outcome and boundaries

Deliver a recognizable Privana identity and a complete, coded redesign of the existing public, fan, Creator Studio, and owner/team experiences before adding product features. Brazil is the first market: pt-BR, BRL conventions, mobile creator work, private participation, and truthful access and payment information are central.

Royal purple is a confirmed brand constraint. Precise colors, logo, Google Fonts, component styling, and final compositions require a visual direction decision. Familiar creator-platform interactions are useful; copying another service's branding or rebuilding a generic social network is not the goal. The owner must be able to compare coherent alternatives in actual product screens before approving one.

In scope: hierarchy, typography, theme, layout, responsive behavior, navigation, copy, existing CMS presentation, component architecture, feedback, and bounded usability repairs required to make existing actions usable. An unsaved-change guard, field-error association, or truthful disabled state is a usability repair; a new subscription engine or content capability is feature work.

Out of scope: new Vault/scheduling/automation/live streaming/polls/tipping, new financial or entitlement logic, real payment or age-provider activation, a layout-builder CMS, configurable permission engines, new support queues, and invented dashboards. These stay in M02–M11. Future patterns can be documented in design source with a clear “future / not implemented” annotation; they do not enter production navigation.

Current browser checkout remains a no-charge, no-entitlement demonstration, including test-card and Pix examples. M04 owns authoritative sandbox orders and entitlements; M09 owns approved live billing. M01.5 cannot make an unsupported age, identity, security, conversion, revenue, or availability claim appear true through copy or styling.

## Evidence and discovery still required

The draft's ten stories mixed outcome containers with large implementation scopes. They become ten concise workstream deliverables with 36 bounded child stories. Existing IDs and meaningful dependencies are retained; no arbitrary dates, estimates, or assignees are assigned.

Two independent Impeccable assessments informed this revision. Assessment A reviewed source and fresh public pages at desktop and phone sizes: home, discovery, a seeded creator profile, login, registration, and initial demo checkout. Its provisional public Operate score is 24/40; this is not a whole-platform score. Authenticated fan, Studio, and owner states still require a rendered baseline before their designs are approved. Read-only source review does not prove action outcomes or permission correctness.

Observed public priorities are a missing marketplace/trust explanation before account creation, inconsistent mobile/desktop task destinations, and excessive prelaunch controls ahead of creator content on a phone. Source review also identified a creator unsaved-work risk. Retain the calm content-focused shell, honest demo language, existing labeled controls, and existing query/optimistic recovery contracts while addressing those problems.

Assessment B independently identified accepted CMS accent values that can lose dark-mode contrast, faint default input borders, incomplete runtime-token propagation to toast/charts, and a blanket reduced-motion override. These are concrete theme/state acceptance targets, not a reason to replace the working stack. Its source detector scanned 261 markup files and returned one contextual warning; its rendered detector failed, so no clean rendered-detector result is claimed. See the [dated design audit](m015-design-audit.md) and [Linear audit record](https://linear.app/kardandev/document/m015-baseline-findings-and-audit-limits-5556e8f61506) for evidence and limits.

Baseline artifacts must include the commit, seeded fixture identity, origin, role, viewport, theme, route/section, state, screenshot, and observed limitation. Store reproducible non-sensitive fixtures and sanitized evidence in the repository or an issue attachment; temporary screenshots are discovery input, not a durable release archive. Never publish real private messages, premium media, credentials, email tokens, or personal information in evidence.

## Coverage contract

This is a starting inventory from source, not a substitute for the rendered audit. Every row needs a named implementation story and final disposition. Routes with several workspaces must cover their sections, not just one screenshot of the URL.

| Surface | Existing routes or sections | Redesign workstream / required emphasis |
| --- | --- | --- |
| Public entry | Anonymous `/`, `/explore`, entry into `/creators/[handle]` | Public proposition and fan/creator paths; one primary action and truthful current availability. Decide anonymous versus signed-in home behavior in IA; retain route continuity. |
| Authentication | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email` | Labeled fields, password-manager/paste support, eligibility and identity copy, field/server errors, verification/reset states. No real email send just for screenshots. |
| Fan content | Signed-in `/`, `/feed`, `/explore`, `/creators/[handle]`, `/saved` | Single search per context, meaningful content hierarchy, post actions/comments, allowed media and locked states, filtered/empty lists, return position. |
| Fan account | `/memberships`, `/messages`, `/notifications`, `/settings` | Accurate access status, usable inbox and composer, unread feedback, preferences, account versus creator-profile naming. Existing list and paging behavior only. |
| Demonstration checkout | `/checkout`, `/checkout/[handle]` including `/checkout/demo`, `/success` | Existing route handoffs, creator/order context next to decisions, test inputs, Pix only in the supported BRL example, explicit zero real charge and no access grant; no live-looking receipt. |
| Creator Studio | `/studio`: application/status, overview metrics, post list/filter/load more, create/edit/draft/publish/archive, media field, profile form | Phone-first daily work; approval/restriction truth, intentional dirty-state protection, recoverable submission/upload errors. Current profile image controls use URLs; uploads/cropping are not silently added. |
| Owner operations | `/admin`: overview, people/team, creator review, reports, subscriptions, transactions, CMS, audits | Separate shell, role-filtered navigation and server authorization, readable data and action consequences, local search/filter scope, truthful current list caps. |
| CMS | `/admin` CMS: brand, content, navigation, pages, features, preview/history | Draft versus live, dirty/saved/published/conflict states, preview, publish, restore and audit consequences. Preserve version/CAS protection. |
| Reading/support | `/pages/[slug]`, configured footer/support links | Readable policy/help template, missing/disabled content fallback, safe existing links. Owner-approved policy text is a content dependency; do not invent legal commitments. |
| Resilience and compatibility | Global loading/error/not-found, offline/PWA fallback, `/feed`, `/dashboard`, checkout redirects | Deliberate error/retry/offline copy and truthful stale state; preserve compatibility/deep links and keyboard focus. No new routable feature implied by a fallback. |
| Transactional email appearance | Existing verification/reset and other enabled templates | Reuse identity and accessible copy in Resend SDK templates. Preview/test fixtures first; no production bulk sends or email-delivery claim without a separate permitted service test. |

Required roles: anonymous, fan, creator applicant, active creator, restricted/suspended account as supported, superadmin, moderator, editor, and analyst. Do not infer full server capability from a role label or visual badge. Role/action mismatches found in audit get a bounded repair or an explicitly linked blocker in the responsible feature milestone.

Required states, where meaningful: 0/1/many records; long names, handles and pt-BR text; missing/broken image; loading/slow; empty versus filtered-empty; recoverable error; offline/stale; signed out/session expired; permission denied; locked versus accessible; pending/success/failure; dirty/draft/published; destructive confirmation; CMS version conflict. This is a risk-based matrix, not every state multiplied by every viewport.

## Delivery sequence and decision gates

| Wave | Deliverable | Review gate |
| --- | --- | --- |
| 1 | Baseline route/role/state matrix; architecture and capability audit; confirmed product brief | G0: scope and real gaps are explicit; authenticated baselines are available or named blockers. |
| 2 | Positioning/copy; brand concepts, logo and typography; task navigation; interactive prototypes | G1: owner approves one direction and critical phone/desktop flows. No broad production visual rewrite before this decision. |
| 3 | Tokens/fonts/CMS boundary; shared primitives, shells and feedback; coded reference screens | G2: approved feed/profile, Studio editor, and owner table examples match source designs and pass basic access, keyboard and responsive checks. |
| 4 | Public/auth, fan, mobile Studio, owner/CMS screen rollouts in reviewable PRs | Every story has real states, screenshots and regression evidence. Reuse approved patterns; new art direction returns to G1. |
| 5 | Coverage closure, accessibility, performance/recovery, governance and final review | G3: owner and independent code/design reviewer accept implemented parity and the evidence register. Stop at M01.5. |

Design source must be editable and versioned: approved Figma frames/components/variables if that connection supports the work, or an explicitly agreed repository prototype and token/component catalogue. A flat image alone is insufficient. Design/code mapping lists component, token and screen counterparts. Image generation, when appropriate for public concepts, is a reference/prototyping aid, not fake customer evidence. Its comp-first versus code-first workflow choice remains unset until that visual session; app screens are code-first.

Critical prototypes: anonymous discovery → creator → account; fan feed/profile → saved/membership/inbox; creator application/status → profile → interrupted post draft → publish/archive; owner triage → safe action → audit; CMS edit → save → preview → publish/restore/conflict; demo card/Pix → pending/success/failure without entitlements. Unimplemented steps are labeled design-only and handed to their actual milestone.

## Design and frontend acceptance standards

- **Identity and type:** compare two or three coherent visual directions on representative product screens, not isolated moodboards. Choose one or at most two Google Fonts with pt-BR diacritics, readable small text, numeric alignment, fallback behavior and limited loaded weights. Record licenses, source files, light/dark marks, favicon/PWA/social assets and safe cropping rules. Keep the premium accent subordinate to content and actions in workspaces.
- **Tokens and CMS:** semantic component tokens live in the current shared Tailwind/shadcn styling architecture. Trace theme overrides between shared CSS, app CSS and runtime CMS accent. Both themes must work with the default purple and all currently accepted accent inputs. Existing CMS controls cover name/tagline/logo/accent, announcements/content, navigation/categories/curation/pages and feature switches. Fonts, arbitrary layout blocks, CSS injection and a theme builder are not current CMS capabilities. Any required new schema or validation behavior needs an explicit linked scope decision.
- **Architecture:** retain domain modules, focused component/function files, direct imports, existing oRPC contracts and TanStack Query cache semantics. Extract demonstrated repeated patterns, not a second UI framework. Preserve server/client boundaries and avoid a monolithic screen or a speculative component factory. Refactoring is tied to a named redesign outcome.
- **Navigation and density:** public entry explains the product; fan areas prioritize creators/content; Studio prioritizes creation; owner areas prioritize triage and traceable decisions. Desktop/phone labels refer to the same tasks. Account settings is not mislabeled as a public profile. Search appears once per task context; nested workspace filters remain clearly scoped. No hidden critical action or inactive feature entry.
- **Interaction:** visible pending state starts with the action; use safe optimistic updates for reversible social/read/preferences actions, with field-specific rollback and reconciliation. Keep text/selection and context after recoverable failures. Publication, CMS publish, permission changes and payment/access outcomes require authoritative confirmation; do not optimistically grant money, permissions or content. No duplicate submission or toast storms on retry.
- **Forms and media:** visible labels, associated field errors, meaningful autocomplete/input modes and password-manager support. Destructive changes explain consequences. Current private media boundaries remain intact in rendered props, URLs, previews and error states. Hide/revoke accurately after authorization changes. Improve upload feedback using existing lifecycle contracts; media processing expansion stays in M03.
- **Localization and ethics:** clear pt-BR verbs and consistent nouns; BRL in minor units and explicit currencies for existing examples; no false FX conversion. Use the timezone actually specified by the API rather than silently inventing one. Never imply creator approval is identity verification. No fabricated testimonials, social proof, scarcity, revenue or safety guarantees; no preselected paid consent. Search indexing and sharing expose only authorized public material.

## Quality gates

Target WCAG 2.2 AA for implemented surfaces, assessed with automated checks plus manual keyboard and assistive-technology walkthroughs. Text contrast is at least 4.5:1 for normal text and 3:1 for qualifying large text; non-text controls and focus are checked separately. Frequent mobile actions should have a 44px effective hit area as a product usability target; do not misstate it as the WCAG AA minimum. Verify reflow at 320 CSS pixels, zoom/large text, focus not obscured, named overlays and focus return, errors/status announcements, accessible authentication and reduced motion. Record criterion, severity, reproduction and owner for any exception; unresolved critical access/privacy defects block acceptance.

Representative layouts: 360/390px phone, 768px tablet, and 1280/1440px desktop; both themes plus CMS accent/logo stress cases. Test touch/virtual keyboard, long labels, table overflow, sticky elements and scroll restoration. All route/section rows need a checked disposition; use automated visual coverage for high-risk templates and representative states, supported by manual review elsewhere. Snapshot approval requires explaining differences, not replacing all baselines blindly.

Browser support is a planning decision for this milestone: current stable Chrome, Edge and Firefox on desktop; current Android Chrome; current and previous major iOS Safari. Cover critical creator/fan flows on actual touch browsers, with WebKit automation as a regression proxy rather than proof of iOS behavior. Manual assistive-technology examples are NVDA with Chrome on Windows and VoiceOver with Safari on iOS. Record tested versions and unavailable devices; a missing required platform is a gate exception for explicit owner review, not a passing test. This default can be revised at G0 before estimates.

Measure production-build performance on repeatable fixtures and documented device/network settings before and after. Target Core Web Vitals of LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile when field data exists; lab measurements are proxies, not proof of field INP. Before rollout, approve numeric route-level lab and bundle budgets from the measured baseline, report medians of at least three comparable runs, and require an explicit rationale for regressions. Keep fonts and images bounded, avoid unnecessary client hydration/waterfalls, and profile long-list interactions before choosing virtualization. Never cache private/authenticated output publicly to hit a score.

Each implementation story needs: approved design reference; current route/role/state scope; actual API/data binding; before/after screenshots; meaningful interaction/recovery checks; relevant accessibility/localization checks; independent PR review and merged evidence. Use `KAR-…` in branch/PR names. Keep PRs to a coherent screen family or shared prerequisite. Existing M01 quality gates remain required. Do not add redundant tests for mechanical style changes; do test risky state, access and recovery behavior.

Final acceptance requires no unresolved critical/high redesign regressions, a reasoned disposition for every baseline finding and route, all child deliverables accepted, a component/token/copy handoff, and owner approval recorded against the actual preview/build. M01.5 completion does not start M02 or deploy production automatically.

## Skills and connected-tool routing

Use relevant capabilities per issue; do not run unrelated marketing campaigns, email sends, infrastructure mutations or deployments just to satisfy an inventory count. Skill availability is not proof of external connection or tool success. Record the skill/reference, tool, artifact and observed limitation on the issue.

| Work | Skills to apply when executing | Connected tools / evidence |
| --- | --- | --- |
| All planning and design reviews | Impeccable context/shape/critique and appropriate scoped playbooks; brainstorming for unresolved creative decisions; verification-before-completion | Linear owns hierarchy, decisions and evidence. Separate heuristic and detector assessments prevent one from substituting for the other. |
| Product, positioning and copy | Frontend-design; marketing-psychology used ethically; copywriting/copy-editing, CRO/signup/onboarding/paywalls only for the corresponding existing flow | Current product evidence first; current primary competitor material for pattern research. No invented commercial claims. |
| IA and responsive workflows | Impeccable shape/adapt/harden/clarify; site-architecture; UI/UX Pro Max guidance | Role/task map, prototypes and task walkthroughs; Figma tools only after their specific prerequisite skills and connection checks. |
| Identity and editable design system | Impeccable new-work and approved direction process; frontend-design; tailwind-design-system; relevant Figma design/library/spec skills | Figma or agreed editable repo equivalent; code/token references; font licenses. No actual visual direction is selected by this planning revision. |
| React/shadcn implementation | shadcn, vercel-react-best-practices, composition patterns where a real reuse problem exists; Ultracite | Inspect installed Base UI conventions and shared components. Context7 resolves current documentation before API-specific work; CLI component docs before adding/changing component APIs. |
| Forms/auth/email appearance | Email/password and Better Auth guidance if behavior changes; React Email/Resend guidance for existing templates | Preserve existing auth/Resend SDK contracts; fixture previews and permitted integration evidence. No unsolicited messages. |
| QA/performance/security boundaries | Web-design-guidelines, webapp-testing/Playwright, verification-before-completion; systematic-debugging for reproduced bugs | Browser evidence, keyboard/screen reader, meaningful tests, production-build measurements, GitHub PR checks. Preserve private media/RBAC contracts. |

Used in this refinement: Linear plugin reads; Impeccable context and independent assessments; frontend-design, brainstorming, marketing-psychology, UI/UX Pro Max instructions, shadcn and React performance guidance, Web Interface Guidelines, verification guidance; Context7 shadcn theming documentation; browser/source evidence and the bundled detector. The shadcn MCP reports no custom registry. Python is not installed, so UI/UX Pro Max's search could not execute; no generated palette or font result is claimed. CUA/shared Playwright profile limitations are recorded by Assessment B; Assessment A obtained fresh isolated public browser captures. Figma editing, deployment, external sending, and visual implementation were not performed.

References for measurable standards: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Core Web Vitals](https://web.dev/articles/vitals), [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), [shadcn semantic theming](https://ui.shadcn.com/docs/theming). Product-specific targets above are delivery decisions, not external certification claims.

## Open decisions and handoff

- Owner: choose the final direction/type/logo after seeing alternatives in real screens; this is G1, not an unanswered prerequisite to organizing the board.
- Owner/content lead: supply or approve public claims, policy/support content and asset rights. An absent policy remains an explicit content blocker for its surface.
- Design/frontend leads: choose editable design tooling based on actual connection availability and record the agreement; no paid tooling is assumed.
- Delivery lead: estimate bounded stories and select capacity after G0, sequence PRs from the dependency graph, and record actual review owners. No date is promised by this plan.
- Board maintenance: the pre-existing M07 container KAR-7 is archived and cannot be restored through the available Linear tools. Its history/references are retained; see the audit. M01.5's hierarchy is active and complete. Reconcile that future container before M07 execution.
- Future milestone leads: inherit components and annotated patterns while implementing their own business capabilities. Audit findings do not silently expand M01.5.

## Linear execution index

[Execution brief in Linear](https://linear.app/kardandev/document/m015-redesign-execution-brief-coverage-and-acceptance-16b1acc50787). All 36 actionable stories and ten workstream deliverables remain Backlog. Each story contains a user story, four acceptance criteria, two implementation steps, relevant skill/tool guidance and native blocking relationships.

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
