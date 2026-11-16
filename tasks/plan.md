# KAR-131 execution plan

Tasks and acceptance status live in Linear. The component story below is accepted on main through PR #27 (`cc55dc8`). Current work is KAR-148's bounded shell delivery; no later group or milestone starts here.

The owner accepted KAR-130/G1 and requested continuation on November 13. KAR-146 supplies the theme prerequisite in PR #22. Work stays inside KAR-131 until its G2 owner review; no later group or milestone starts automatically.

## Architecture

- Reuse React, installed Base UI/shadcn primitives and the existing shared UI package. Keep new functions/components in separate domain files and direct imports.
- Controls use the approved semantic tokens. Phone targets, labels, native names/values, caller refs, error descriptions and keyboard behavior stay part of the public component contract.
- Compose field labels/descriptions/errors through installed Base UI field context, retaining caller descriptions instead of replacing them. Keep native selectors where the product already uses them.
- Preserve data, validation, access, media URLs, query/mutation and payment authority. This is shared UI work, not a new business capability.
- The editable catalogue uses real shared primitives and CSS outside production routing. Its local runner exposes an allowlist on loopback, without environment files, auth, RPC or service mutations. Reuse the installed build toolchain.

## Ordered Linear index

| Issue | Result | Prerequisite |
| --- | --- | --- |
| [KAR-187](https://linear.app/kardandev/issue/KAR-187) | Readable controls, phone targets and accessible form composition | KAR-146 |
| [KAR-188](https://linear.app/kardandev/issue/KAR-188) | Named overlays, useful feedback and consistent data/media presentation | KAR-146; work follows KAR-187 |
| [KAR-189](https://linear.app/kardandev/issue/KAR-189) | Editable real-component states, safe runner and interaction acceptance | KAR-187/188 |

Each actionable issue has one ordinary PR, explicit prerequisite/base and task-owned staging. Use the project's <=400-line/20-file target and <=800/30 hard budget; refine again if necessary. Generic task-size guidance does not justify combining independent stories.

## Verification checkpoints

After each slice, run scoped lint, relevant types and meaningful interaction checks; inspect light/dark phone/desktop states and publish exact results. Preserve the known local root-lint constraint rather than formatting unrelated files. KAR-188 reuses KAR-187's browser fixture boundary; it starts on that issue's branch until PR #23 lands. Table wrappers retain native captions, rows and actions while adding a named keyboard scroll target.

At catalogue acceptance, verify long pt-BR content, labels, retained input, touch/keyboard checkbox behavior, disabled/pending actions, Escape/focus return and local-server boundaries. Include the existing StatCard's supporting typography and unused registry Card with their actual catalogue recipes. Reconcile every KAR-147 criterion with actual source/evidence.

KAR-148–150 remain separate stories in this same authorized group. G2 requires owner review of the completed group before KAR-132; passing CI alone never accepts, merges, deploys or completes the group.

## Risks and boundaries

Field-context adoption must preserve existing IDs, descriptions, refs and submit payloads. Native validation and backend rules remain authoritative. Treat disabled and pending states explicitly rather than changing data flows through a reskin.

The installed library has native/inline patterns rather than every available registry component. Do not add unused dialogs or another framework to fill a catalogue. Current screen-specific composition remains with its existing later screen story.

## Main-branch delivery recovery

The owner accepted #23–25, but #24/25 initially reached only their feature bases. Main-target PR #26 has now delivered KAR-188. KAR-189 follows separately; its prepared replay remained byte-identical when rebased onto that actual main merge.

Keep the original KAR-188/189 issues: these are delivery corrections, not new feature stories. Their original PRs are already merged and cannot be retargeted, so each requires a main-target follow-up. Publish KAR-188 first; wait for its main merge before opening KAR-189. Do not repeat the dependent-branch merge path.

Verify unchanged implementation/capture bytes, scoped lint, workspace/tooling types, deterministic tests, production build and fresh PR checks. Keep the two issues In Review until main delivery, KAR-147/131 active, and KAR-148–150/G2 pending. Do not advance KAR-132 or another milestone.

## KAR-189 execution

Reuse the real controls/feedback fixtures and add actual Card/StatCard recipes in a local React catalogue. Provide local theme/accent/example selection; synchronize native color-scheme with the theme. Sources remain editable in the repository, with a quick rebuild on restart.

Compile the current shared Tailwind CSS through the already installed PostCSS toolchain, with explicit source paths. Reuse only selected first-party font faces and WOFF2 files from an existing local Next production build; do not expose .next/server, resolved environment or application routes. A missing font build must give a clear instruction to run the normal build once.

Serve exact generated HTML/JS/CSS/font/license paths on 127.0.0.1:53471, GET/HEAD only. Reject foreign hosts/origins, API/source/environment paths and writes. Add boundary tests and a dedicated browser configuration that starts this static runner without the application. Keep CI's synthetic build disposable and never upload it.

KAR-147 and its three component children are now accepted and verified on main through PR #27. The shell delivery below is next within the same authorized group; G2 still precedes KAR-132.

## KAR-148 ordered delivery

| Issue | Result | Prerequisite |
| --- | --- | --- |
| [KAR-190](https://linear.app/kardandev/issue/KAR-190) | Native links for the three existing shell navigation CTAs | Accepted KAR-147/143 |
| [KAR-191](https://linear.app/kardandev/issue/KAR-191) | Public and desktop workspace entries match viewer state | KAR-190 main merge (PR #28 accepted) |
| [KAR-193](https://linear.app/kardandev/issue/KAR-193) | Interactive phone account menu, role tabs and task search | KAR-191 main merge |
| [KAR-192](https://linear.app/kardandev/issue/KAR-192) | Responsive Studio/owner shell composition and focus/safe areas | KAR-193 main merge |

KAR-190 uses native Next Link plus existing merged button variants for phone registration, desktop sign-in and operations return. Keep registration switches, actual button actions, destinations and all authorization unchanged. No new abstraction or business capability is needed for these three substitutions.

Exercise the actual components' static server-rendered output in Chromium, using the existing isolated CSS/font runner and fictional props. Verify native accessible roles, keyboard Enter/destination, registration-off behavior and retained owner section buttons. This fixture proves link semantics, not authenticated access or client-router prefetch. Capture light/dark phone/tablet/desktop appearance with no external services or writes.

Keep source functions modular and the issue below the preferred 400-line/20-file budget. Run scoped lint/types, deterministic/browser checks and build; obtain bounded finish review/documentation. Publish only an ordinary PR targeting main; wait for owner review/merge before the next child. Original KAR-148 criteria stay on the parent until all four children and combined evidence are accepted; G2 still precedes KAR-132.

## KAR-191 execution

PR #28 is accepted on main (`f70f9f7`). Linear owns the refined acceptance: public/desktop entries first, with authenticated phone account/search work preserved in KAR-193. Retain the existing authenticated phone access until its complete replacement lands.

Use one small Studio-entry selector based on the returned viewer/profile state and application switch. Anonymous/loading viewers get public discovery only; fans get application entry when enabled; existing profiles retain their workspace/application entry. Remove the misleading rail publication shortcut: `/studio` opens management, not its local-state editor. Actual publication remains the ACTIVE-only Studio action. Preserve supported CMS labels, staff filtering and real routes.

Verify the selector's role/state/flag matrix and actual Sidebar/phone-tab static output through the existing isolated catalogue. Unknown route context must not fabricate an active link. Capture 320/390/768/1280px light/dark cases and long labels; check keyboard destinations. Fixtures prove rendered roles/links and reflow, not authentication, hydration or menu interaction. No live services or writes are needed.

Likely changes: focused layout modules, policy tests, bounded fixture/test helpers, this plan/index and one review packet. Run scoped lint, workspace/tooling types, unit/catalogue tests and production build. Obtain fresh Impeccable finish review and documentation, then publish one ordinary main-target PR and hold KAR-193 for owner review/merge.

## KAR-193 execution

Linear owns this issue's phone acceptance. PR #29 is now accepted on main at `4d3f47d`; the local issue branch was fast-forwarded to that content-identical merge with its changes preserved. KAR-191 is Done. This is the accepted G1 navigation design, not a new concept round.

Reuse MobileAccountMenu at a real bottom Conta trigger and remove the duplicate header account control. Fans/applicants/restricted profiles keep stable fan tabs; only a returned ACTIVE profile gets a Studio tab. Reuse the Studio-entry selector for application/workspace recovery in Conta, including when new applications are closed. Keep supported CMS labels, existing routes and server access checks. Use readable, bounded phone labels, full menu wording and safe-area clearance; disabling messaging redistributes space.

The shell has no search input; discovery already owns one search and disables search in its suggestion column. Preserve this task placement and verify it by source review plus a bounded local browser journey where available. Do not add another shell search or change discovery's query contract.

The browser-mounted probe of existing components exposed a Next runtime dependency, so do not introduce private adapters. Keep the isolated real-component SSR role/flag matrix, and verify popup, focus return, native destinations and theme feedback through the actual local Next app. The development runtime stalled during hydration; a fresh build on owned loopback port 3002 passes the interactions. Use fictional client read replies, block mutations/external requests, and exercise the real anonymous server guard and browser back. Do not claim authenticated sessions, a repaired development runtime or live service acceptance.

Capture before/after 320/390/768/1280px light/dark states. Run scoped lint, types, unit/catalogue checks and production build. Keep functions/components in domain files, inspect the review budget before expanding tooling, obtain fresh Impeccable finish/documentation review and open one ordinary main-target PR. The inherited seed-provenance gap remains disclosed; no invented roll or authority refresh. Hold KAR-192 and G2 for the owner's next decision.

## KAR-192 execution

Linear owns this final KAR-148 shell slice. Owner accepted PR #30 on main at `7eb164b`; KAR-193 is Done. Preserve the accepted G1/Proximidade navigation contract, actual routes, role permissions and same-route Studio/owner state.

Replace the phone owner's horizontal section strip with one labeled native menu; retain the role-filtered desktop rail and existing selection hook. Make the fixed desktop rail scroll within its viewport, wrap long workspace identity/name labels, keep community return discoverable, reserve safe-area space and leave focus unobscured. Studio retains its editor/filter/tab lifecycle while its heading/actions and section controls reflow readably. Reuse Base UI and current tokens rather than introduce another shell framework or section URLs.

Ordered work: capture actual unchanged component baselines; implement the bounded shell presentation/selection dispatch; verify real menu/hook behavior in isolated browser fixtures and actual shell markup for creator/staff roles. Cover 320/390/768/1280px light/dark, long names, targets, keyboard dismissal/return, same-route selection and native community return. No authenticated access or integration claim from fictional fixtures; no data/service writes. Keep content/CMS/analytics business screens for their own issues.

Run scoped Ultracite, workspace/tooling types, deterministic/catalogue tests and production build; inspect budget before review, obtain fresh Impeccable finish/documentation review and publish one ordinary issue PR. Reconcile KAR-148 criteria with evidence without accepting the parent or G2 before owner review/merge. Preserve inherited seed/QUALITYBAR and authority-wording gaps; no invented provenance or authority repair. Stop for review before another issue/group.

## KAR-149 bounded recovery delivery

PR #31 is accepted on main at `496c69d`; KAR-192 and KAR-148 are Done. Recovery work stays inside the authorized KAR-131 group. Linear owns the ordered child acceptance: KAR-194 conversation drafts → KAR-195 optimistic rollback contract → KAR-196 Studio work → KAR-197 CMS recovery → KAR-198 session/authority checkpoint. Each child has one ordinary issue PR and an owner review/merge gate; KAR-150/G2 and later groups remain pending.

## KAR-194 execution

The current MessagesPage keys ConversationPanel by conversation ID, while useConversation owns unsent text locally. Switching/closing the panel therefore discards the draft; a late failure can restore only an unmounted panel's state. Keep keyed history isolation and lift only the conversation-keyed draft record to the existing inbox page. Use functional state updates and focused domain files so failure callbacks affect their original conversation and retain newer typing. Drafts remain page-memory only and disappear when the inbox/page runtime ends; do not add browser storage, a provider framework or server draft persistence.

Prove the current loss before editing production behavior, using bounded client fixtures of actual messaging components/hooks and intercepted fictional RPC replies. Then verify A/B draft isolation, phone back/remount, fast UTF-8 typing, delayed/rejected sends after a switch, newer typing, same-request retry and duplicate-submit guards. Existing idempotency, message cache/count reconciliation, selection/query URLs and server permission checks stay authoritative. Session-expiry redirects and broader inbox visual work retain their own issues.

Target <=400 reviewable lines/20 files; keep fixtures/evidence bounded and refine if implementation grows independently. Run scoped lint, workspace/tooling types, deterministic messaging checks, full catalogue and production build as appropriate. Compare light/dark phone/desktop behavior, obtain fresh Impeccable finish/documentation review, open one ordinary KAR-194 PR and hold KAR-195 for owner review. Existing design-seed/QUALITYBAR and authority-wording gaps remain disclosed; no invented receipt or G2 acceptance.

## KAR-195 execution

Owner accepted PR #32; merged main is `7831e12`. Record a source-linked contract for the existing social, notification-read, settings and interest hooks. Reuse their domain helpers and proven tests. Audit cancellation, mutation keys/duplicate guards, field-owned rollback and final scoped reconciliation against current TanStack Query documentation. Keep server access/publication/payment authority intact; do not introduce a universal mutation wrapper.

Investigate whether a late social-toggle failure replaces a newer refreshed flag/count pair. Reproduce any gap before changing its existing helper, then retain newer projections while restoring only the failed action's unchanged optimistic fields. Verify real-hook duplicate guards and delayed/rejected/out-of-order behavior in deterministic fixtures where existing checks do not cover them. Preserve current typography, layout and labels. Keep new tests/evidence bounded, run relevant lint/types/unit/browser/build checks, publish one ordinary issue PR and hold KAR-196 for owner review. No live service, seed, login, data/schema/configuration change or next group is part of this issue.

## KAR-196 bounded Studio recovery

Owner accepted PR #33 on main `40feb52`; KAR-195 is Done. Refine Studio recovery into KAR-199 post-save retry proof, KAR-200 completed-upload reuse, KAR-201 dirty post navigation/discard and KAR-202 profile recovery. Each child has one ordinary PR and owner review before the next; KAR-196/149 acceptance and G2 remain held. KAR-29 provider/session lifecycle and later Studio visual redesign remain separate.

## KAR-199 execution

Mount the actual PostEditor/StudioPosts and save hook with fictional intercepted RPCs. Verify pending duplicate guards, draft/publish distinction, retained text/audience/preview and invalid file selection, unchanged creation retry IDs, stored IDs for edits and restricted presentation. Preserve the existing server conflict contract for changed uncertain retries rather than silently creating a second post. Reuse authoritative backend idempotency/access fixtures; correct only a demonstrated save-feedback gap. A native Chromium probe confirms FormData retains the selected File object's identity; completed upload transport/service proof stays with KAR-200. Keep current Proximidade controls; no real login, save, upload, seed, schema/runtime configuration change or deployment. Aim for <=400 reviewable lines, then checks, independent review and an ordinary KAR-199 PR; hold KAR-200.

## KAR-200 execution

Owner accepted PR #34 on main `b166ffd`; KAR-199 is Done. Reuse its actual-editor fixture and installed Upstash browser SDK, intercepting begin, same-origin fictional PUT, SDK end, application completion and post-save replies. Verify slow stages and duplicate guards, retained selections, confirmed media reuse on unchanged save retries, and fresh media for changed files/owners. Refuse malformed/unconfirmed completion without publication. Prefer transport interception over a replacement uploader or live storage writes; fix only demonstrated client feedback gaps. The current UI combines sending and verification in one pending message; separate protocol stages are observed by request order, not invented UI states. Keep provider/session lifecycle, expiry, resumability and durable status with KAR-29. Preserve Proximidade and runtime configuration; publish one bounded KAR-200 PR, then hold KAR-201 for owner review.

## KAR-201 bounded departure safeguards

Owner accepted PR #35 on main `2ee0813`; KAR-200 is Done. Deliver KAR-203 semantic dirtiness/explicit editor close → KAR-204 Studio context transitions → KAR-205 supported browser/route departure. Each child has one ordinary PR and owner acceptance/merge before the next. Start only KAR-203: compare actual form values using the existing save normalization, preserve selected files, and reuse the established native confirmation hook through a shared module. Keep/cancel/Escape retains the mounted editor; discard closes it and focuses a persistent content region. Check pending writes imperatively before close/discard; keep the confirmed-save callback separate. Verify actual components and isolated replies, both themes and phone/desktop, with no new storage or service writes. Preserve Proximidade; hold KAR-204/205, KAR-202 and parent/group acceptance.
