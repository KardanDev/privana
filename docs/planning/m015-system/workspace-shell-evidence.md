# KAR-192 — Responsive Studio and owner shells

Phone operators now use one labeled section menu instead of a clipped horizontal rail. The desktop rail keeps the existing role-filtered sections and scrolls within its viewport, including at 420px height. Context/role labels, full long names, 44px controls, a focusable skip target and safe-area clearance keep the owner workspace distinct from the community. The decorative heading eyebrow is removed. Studio retains its existing editor/filter/tab lifecycle, promotes publication before the public-profile link, uses native destination links and allows section labels to use their natural width before wrapping. Both workspaces offer the existing community route.

The focused owner navigation component shares the demonstrated role/section presentation across rail and menu. Its selection callback still validates the section against the current role. No section URLs, permissions, content operations or generic shell framework are added. Shared Brand wrapping is opt-in for owner headers; the default brand gains a stable icon and tracking within the existing type floor. Theme targets are 44px at intermediate widths too.

## Review artifacts

- [Before contact sheet](review/workspaces/before-workspaces.jpg) and [after contact sheet](review/workspaces/after-workspaces.jpg): actual component frames at natural pixel size, with separate review captions. Owner desktop/phone in light; Studio desktop/phone in dark. These sheets are review compositions, not a single production page.
- [Actual isolated section menu, admin, 320px/dark](review/workspaces/menu-compact-dark.jpg).

The ignored `output/playwright/review/kar192/` packet has 56 before and 56 after static frames: owner admin/editor/moderator/analyst/long-name and Studio ACTIVE/PENDING at 320/390/768/1280px in both themes. The before renderer captured unchanged main `7eb164b`; paired frames retain fictional context, viewport, theme and focus. Twelve baseline overflow cases become zero after cases. After metadata reports zero runtime errors, blocked requests or horizontal overflow. Sixteen isolated interactive-menu captures are separate evidence. All source/representative rasters carry provenance; the contact-sheet manifest records source hashes.

## Validation and limits

`bun run test:catalogue` passes 141 cases (3.2m), including 42 workspace cases. It exercises the actual menu and selection hook with fictional roles: exclusive selection, touch, Escape/focus return, 320px reflow, unchanged URL and rejected tampered local selection. Actual shell SSR fixtures verify native return/back behavior, landmarks, role-filtered headings, ACTIVE publication/profile eligibility, long labels, targets and short-rail focus. Target measurements retain a 44px floor after rounding DOMRect noise to 0.001px.

`bun run check-types` passes five tasks (four cached); `bun run check-types:scripts` passes. `bun run test` passes 298 tests across 57 files, 884 assertions. The final `bun run build` passes in 21.803s with web rebuilt and three package tasks cached. Scoped Ultracite and diff/Markdown-link checks complete before PR review.

The isolated client fixture mounts the real navigation component and hook; the shell fixtures render actual OperationsShell and StudioScreen with a fictional preloaded query cache. They do not mount authenticated product pages or prove server access, hydration, dirty-editor/CMS recovery, live services or physical-device behavior. Existing Studio tab/editor/filter logic and owner section state remain unchanged; interrupted-work parity stays with KAR-149. Requests/mutations remain blocked. No login, seed, data/configuration/dependency/schema change or deployment occurs. Rollback is the issue commit.

## KAR-148 reconciliation for owner review

| Parent criterion | Evidence and boundary |
| --- | --- |
| Approved role/task navigation, shared primitives, distinct owner | KAR-190 native shell links; KAR-191 public/desktop rules; KAR-193 Conta; KAR-192 owner rail/menu and Studio hierarchy. Native links, Button and Base UI are reused. |
| Valid routes, back/current state and landmarks | Existing URLs retained; native return/back and skip-target checks; same-route owner selection keeps its existing state. No section-history/deep-link promise. |
| One task search, truthful account labels and discoverable personal/creator entries | Accepted KAR-191/193 evidence covers discovery's single search, Configurações/Conta, Salvos/Assinaturas and eligible Studio/application entry. This slice adds no search. |
| Reflow, safe areas, focus, long labels, switches and permissions | Combined four-child role/device packets plus current four-width/two-theme captures, short-rail and 320px interaction checks. Server authority and feature-switch policy are unchanged. Physical devices and authenticated service acceptance remain separate. |

KAR-192 remains In Review until owner acceptance/main merge. KAR-148/131, KAR-150/G2 and later groups remain pending. Proximidade authorities are preserved; inherited seed-roll corroboration, QUALITYBAR and study-wording/breakpoint gaps remain disclosed. No clean Impeccable SHIP, ceiling score, authority refresh or parent/G2 acceptance is asserted.

## Documentation reconciliation

Fresh documenter review checked the changed shell/navigation/Brand/theme source, shared styles, PRODUCT.md, DESIGN.md/sidecar, surface brief, accepted navigation/interaction contracts and all three representatives. The eight contact-sheet source hashes match the manifest; the menu representative matches its canonical interaction capture exactly.
The build retains royal-purple/plum tonal layers, Hanken UI, Bricolage major headings, quiet dividers, visible selection/focus and 44px workspace controls. One role-filtered phone menu, the scrollable desktop rail, wrapping identity labels and publication-first Studio actions extend the incumbent system; native destinations and existing local state remain intact.
Existing DESIGN.md/sidecar study wording and 700px/1150px concept breakpoints remain disclosed drift, not revised production rules. Missing inherited seed-roll corroboration/QUALITYBAR remains unverified; no defect is canonized, receipt invented, authority refreshed or owner/parent/G2 acceptance advanced by this documentation pass.
