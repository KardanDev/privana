# KAR-145 — G1 design and implementation handoff

**Decision: pending owner review.** Prepared November 13, 2026 for KAR-130 only. KAR-131 and every later group remain unstarted. Passing checks, a design-agent verdict and an open PR do not approve G1, merge code or authorize production adoption.

Privana remains a Brazil-first, adult-capable creator subscription platform: familiar fan navigation, a mobile creator workspace and separate owner/team operations. Proximidade is the accepted identity. Payments remain simulated; publication approval, account access, identity/age assurance and commercial entitlement remain separate.

## Canonical editable source

Use the repository [prototype and walkthroughs](prototype/README.md), [navigation contract](navigation.md), [role matrix](role-matrix.md) and [interaction rules](interactions.md). Run the loopback-only review server with the documented Bun command. Scenario hashes are review addresses; the production route inventory still contains 21 pages.

[PRODUCT](../../../apps/web/PRODUCT.md), [DESIGN](../../../apps/web/DESIGN.md), [design sidecar](../../../apps/web/.impeccable/design.json), [approved identity](../m015-brand/direction-review.md) and [brand/font evidence](../m015-brand/font-study.md) own product and visual direction. [Coverage](coverage.md) and the [CMS contract](cms-contract.md) define what the coded examples do and what still requires implementation.

This is an intentional code-led handoff. No Figma file, Code Connect mapping or synchronized design source is claimed. A later design copy must identify its approved revision and cannot silently replace this repository source. New UI implementation must reuse the application's domain/API contracts, rather than import the review harness into Next.js.

## Three coded reference examples

| Reference | Editable code and review path | Implementation contract |
| --- | --- | --- |
| Fan content and navigation | [recent](prototype/fan/recent.mjs), [following/save](prototype/fan/feed.mjs), [post](prototype/fan/post.mjs). Início → Recentes `/` → Seguindo `/feed` → save failure/retry → saved. | One task search lives in discovery. Keep media dominant, distinguish feed sources and preserve access/cursors/context. Production reference acceptance: KAR-150, adoption KAR-154/155/158. |
| Mobile creator editing | [profile cases](prototype/studio/create-profile-cases.mjs), [content editor](prototype/studio/create-editor-cases.mjs). `#studio-overview` → edit/profile/new → preview → interruption/upload/save recovery → confirmed state. | Active-profile authority, public preview versus private content, retained input, deliberate discard and separate draft/publish/archive. Production reference: KAR-150; adoption KAR-161–163. |
| Owner CMS and records | [owner frame](prototype/owner/create-frame.mjs), [record tables](prototype/owner/render-table.mjs), [CMS lifecycle](prototype/cms/create-cases.mjs). `#cms-admin-brand` → save3 → publish4 → restore5/public4 → publish6; editor conflict/reload. | Role-specific controls, readable phone records, separate currencies and loaded/saved/published versions; no optimistic privilege or publication claim. Production reference: KAR-150; adoption KAR-164–168. |

These are running JavaScript/HTML review references. KAR-150 still has to validate their React/shadcn counterparts after the authorized theme/component/shell work; that production work has not been performed by this handoff.

## Token and component mapping

| Approved intent / prototype evidence | Production owner and target |
| --- | --- |
| DESIGN light/dark palette; prototype `--bg`, `--surface`, `--ink`, `--sub`, `--rail`, `--line`, `--primary`, `--on-primary`, `--soft` | KAR-146: semantic aliases in [shared UI styles](../../../packages/ui/src/styles/globals.css), retaining published CMS accent precedence. Prototype names are a mapping aid, not new production tokens. |
| Hanken UI/data; Bricolage headings; 30/27px headings, 16px body and identifying table values, 14px supporting text | KAR-146: existing [font-loading layout](../../../apps/web/src/app/layout.tsx) and shared font aliases. Current app still uses DM Sans/Manrope; accepted font adoption remains pending. Verify payload, fallback metrics and heading/data readability. |
| 12px controls, 16px content, 14px table containers; flat dividers; 44px touch targets | KAR-147: existing [button](../../../packages/ui/src/components/button.tsx), input/textarea/checkbox/card/skeleton/overlay primitives and [shared fields](../../../apps/web/src/shared/components/text-field.tsx). Keep direct imports and domain-owned components. |
| Selected color plus underline; visible focus; native control/record semantics | KAR-147/148: shared navigation/tabs and fields. Test keyboard and non-color state identification in both themes and published accent overrides. |
| Public header, 232px community rail/phone navigation, creator capability and separate owner rail/section selector | KAR-148: [application shell](../../../apps/web/src/shared/layout/app-shell.tsx), navigation components and [operations shell](../../../apps/web/src/domains/admin/operations-shell.tsx). Preserve the real viewer across pages. |
| Retained fields, contextual pending/retry, rollback of only the failed change, confirmed publication/privilege | KAR-149: existing shared query helpers and domain caches/outbox. Replace review hashes and Maps with current typed queries/mutations; preserve identifiers, cursors and overlapping writes. |

Use DESIGN and its sidecar as authority. Final review reconciled reference buttons to 11px/18px padding, controls to 12px corners and field-strength borders, discovery to a 278px column with 32px separation and 1150px collapse, and phone feed media to a full-width, cornerless treatment. Those corrections stay on their originating issue PRs. Mobile owner records demonstrate labeled stacking; compare that with contained horizontal scrolling on real datasets instead of shrinking text.

## Evidence and practical limits

The domain evidence register lives in [review](review/). It contains public, fan, checkout, profile, publishing, owner records/decisions and CMS captures with embedded origins. Each document states its actual review scope. The final reference packet adds current fan, mobile Studio and owner CMS views. There are no real private objects, service requests, authenticated sessions or payment credentials in this tool.

Browser coverage uses Chromium through Playwright MCP at 390/768/1440px. Interaction evidence includes failed input retention, dirty guards, role exclusions, save/publication/version authority and no-fetch preview. Physical devices, installed-browser parity, assistive technology, true zoom, production auth/services and field performance remain KAR-169–171 and named screen acceptance work. Fixture state, dates and counts do not establish production verification or commercial proof.

The secretless suite passes 275 tests/852 assertions, including four review-server boundaries. Scoped prototype lint passes. Full local workspace lint currently also inspects existing untracked design studies and Windows CRLF files outside this prototype and fails there; those files are preserved. GitHub clean-checkout Quality and PR-contract checks are separate evidence, never a claim that the local command passed.

## Named implementation repairs and exclusions

| Finding or boundary | Required owner / treatment |
| --- | --- |
| `/` recent versus `/feed` following was ambiguous in the initial fixtures | Reconciled in this handoff's coded tabs and Início destination. KAR-148/154 must preserve the two actual data sources and authenticated/public entry behavior. |
| Login still falls back to `/feed`; guards differ between shared and feed pages | KAR-152 presentation plus the M02 auth/session contract. Do not claim a repaired intended return or change server authorization through client navigation. |
| Creator capability can disappear when crossing current community pages | KAR-148: carry the actual viewer/capability; fixed review personas are not a persistent session model. |
| Creator handle HTML pattern uses an unescaped class hyphen under current HTML `v` semantics | KAR-161: the prototype's `(?:[a-z0-9_]|-)+` is the working reference. Preserve the server regex unless its own semantics require a change. |
| CMS messaging hint promises readable history, but MessagesPage hides history when the flag is off; read APIs remain participant-protected | KAR-157 and KAR-168 must reconcile consumer behavior and copy. This prototype truthfully says conversations are not erased; it does not claim the disabled history UI was repaired. |
| Collections, actual paging/date/kind/currency filters, complete notification/auth/supporting routes | Preserve source capability and verify in their named screen stories; [coverage](coverage.md) identifies source-only areas. One fixture row never certifies all records or states. |
| Local workspace lint includes untracked studies and CRLF differences | Record as an environment/quality constraint. Resolve through a separate authorized tooling change; do not bundle unrelated files into UI issues. |

No new business capability is approved here: live billing/Pix, payout/refund operations, age/identity activation, scheduling, Vault, tips/polls/live rooms, delegated permission engines and arbitrary CMS layout/font controls retain their roadmap gates. No production deployment, migration, reseed or email delivery test was performed by KAR-130.

## Owner review and delivery order

| PR | Issue | Reviewable result |
| --- | --- | --- |
| [9](https://github.com/KardanDev/privana/pull/9) | KAR-143 | Navigation, role and interaction contract |
| [10](https://github.com/KardanDev/privana/pull/10) | KAR-177 | Isolated review harness |
| [11](https://github.com/KardanDev/privana/pull/11) | KAR-178 | Discovery/profile/account entry |
| [12](https://github.com/KardanDev/privana/pull/12) | KAR-181 | Fan content/access/conversations |
| [13](https://github.com/KardanDev/privana/pull/13) | KAR-182 | No-charge card/Pix examples |
| [14](https://github.com/KardanDev/privana/pull/14) | KAR-179 | Creator application/profile |
| [15](https://github.com/KardanDev/privana/pull/15) | KAR-183 | Creator content lifecycle |
| [16](https://github.com/KardanDev/privana/pull/16) | KAR-180 | Owner navigation/records |
| [17](https://github.com/KardanDev/privana/pull/17) | KAR-185 | Owner decisions/recovery |
| [18](https://github.com/KardanDev/privana/pull/18) | KAR-184 | CMS fields/preview |
| [19](https://github.com/KardanDev/privana/pull/19) | KAR-186 | CMS versions/conflicts |
| [KAR-145 diff](https://github.com/KardanDev/privana/compare/codex/kar-186-cms-version-recovery...codex/kar-145-design-handoff) | KAR-145 | This handoff, complete coverage and reference packet; ordinary PR linked from the issue |

PRs are deliberately issue-scoped and stacked. Review in order; land the prerequisite, rebase/retarget the next PR to `main`, and rerun its required checks. Never merge into a temporary issue branch. Main-target CI/merge automation supplies the Linear comments after its documented conditions; a passing stacked check does not complete the issue. No PR is merged by this handoff.

**G1 owner decision remains open:** accept the navigation/identity/current-feature scope, editable references, supported CMS contract and named implementation boundaries, or request concrete revisions. Record the owner, decision date and accepted revision in KAR-145 after that decision. All group issues remain In Review until accepted and merged. G1 approval does not itself authorize starting KAR-131; wait for the owner's explicit advancement.
