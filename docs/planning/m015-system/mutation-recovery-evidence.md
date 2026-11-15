# KAR-195 — Field-owned optimistic recovery

Late like, saved-post and follow failures previously restored an old flag/count pair over a newer refreshed pair. The helper now consumes each repeated record's snapshot once in traversal order, then restores only an unchanged optimistic pair. This keeps floor-colliding and already-target occurrences separate; newer different flags/counts survive. Other fields, cursors, rows and caches retain their ownership. The source-linked [interaction contract](../../optimistic-updates.md) maps social, notification-read, settings and interest behavior to their hooks, keys, cancellation, recovery and evidence.

Only the rollback helper and its focused comparison function change production behavior. Existing controls, typography, layout, duplicate guards, retry IDs and scoped reconciliation are preserved. Comment counts retain their existing delta rollback. Identical server values carry no version stamp; final refetch remains authoritative. No generic mutation framework, new business feature, browser persistence, dependency/configuration/schema change or server access grant is added.

## Review artifacts

- [Refreshed count retained, 320px/light](review/mutation-recovery/phone-newer-count-light.jpg).
- [Failed like beside a successful saved action, desktop/dark](review/mutation-recovery/desktop-independent-dark.jpg).
- [Failed preference save retains its draft and offers retry, 390px/dark](review/mutation-recovery/phone-retained-draft-dark.jpg).

The ignored `output/playwright/review/kar195/` packet contains 18 interaction frames at 320/390/768/1280px across both themes, plus these three exact-copy representatives. Metadata reports no horizontal overflow; the anonymous browser guard reports no runtime errors or unapproved requests. All 21 rasters carry provenance and the manifest records source hashes. This is behavior evidence with unchanged product appearance: the initial before proof is a unit run on main `7831e12`, not a before screenshot. It failed all three refreshed-toggle regressions (exit 1): newer count 12 was overwritten with old like/save/follow counts 4/2/5. Those regressions now pass.

## Validation and limits

`bun run test` passes 311 tests across 59 files, 902 assertions. `bun run test:catalogue` passes 189 cases (1.8m), including 18 recovery cases across both themes and three viewport projects. Actual onSettled callbacks verify that the first social completion preserves pending state and the last scopes reconciliation. Eleven regressions cover refreshed values, repeated records, floor collisions, already-target values and a newer first occurrence. Four collision regressions failed before the independent review correction and now pass; existing read/settings/comment invariants remain covered.

The browser fixture synchronously clicks two mounted controls and repeats form submission before rerender, then verifies one request per guarded operation. It holds a like while a bookmark succeeds, and holds final refetch after a rejected reply so a server refresh cannot conceal incorrect rollback. It also exercises follow/read/settings/interest rejection, retained settings text, pending row removal and explicit interest retry. Actual PostActions, FollowButton and InterestButton are mounted; actual settings/read hooks use shared controls in a fictional wrapper. Comment navigation is inert. The initial full SettingsForm/Next Image standalone bundle hit `process is not defined`; no private framework adapter was added. Authenticated product pages, actual SettingsForm rendering, notification navigation, persisted data, live services and physical devices remain unproven by these fixtures.

Workspace types pass five tasks (four cached); tooling types pass. Scoped Ultracite on 11 task-owned code files passes. Production compilation passes in 8.641s with web rebuilt and three package tasks cached. Diff/evidence-link checks complete before review. No login, seed, real message/email/storage/payment operation or deployment occurs. Roll back the issue commit to restore prior rollback behavior; no data rollback is needed.

Proximidade authorities are unchanged. The design hook reported no deterministic findings on the two fixture UI files; this is not a visual-quality verdict. Inherited seed-roll corroboration, QUALITYBAR/ceiling evidence and authority study/breakpoint drift remain disclosed; no clean Impeccable SHIP or authority refresh is claimed. KAR-195 stays In Review until owner acceptance/main merge. KAR-196 onward, parent KAR-149 acceptance and G2 remain held.

## Documenter reconciliation

Checked PRODUCT.md, DESIGN.md, its sidecar, the KAR-195 surface brief, navigation/interactions contracts, shared stylesheet/Button/Input, actual social/interest controls and settings/read hooks against the source-linked feedback contract and three review representatives.
The rechecked rollback sources match the regenerated manifest hashes: each repeated occurrence consumes its prior snapshot once before comparing the optimistic pair, including changed/already-target pairs, so floor collisions cannot reuse another occurrence's snapshot. The refreshed 21-raster audit reports no problems and three exact-copy representatives; these isolated fixtures preserve the incumbent purple/plum, Hanken UI, Bricolage headings and control geometry without establishing a new system rule.
No authorities were refreshed. Study wording/concept breakpoints, uncorroborated seed roll and missing QUALITYBAR/ceiling remain uncanonized; the fictional wrapper, inert comments and hook-only settings/read proof do not establish authenticated product, actual SettingsForm, persistence, service, device, clean SHIP or owner acceptance.
