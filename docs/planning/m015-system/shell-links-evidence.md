# KAR-190 — Native shell navigation

Phone registration, desktop sign-in and operations return now use native Next Link with `cn(buttonVariants(...))`. Their URLs and appearance are retained; keyboard/assistive-technology users receive link semantics. Registration remains conditional, and actual section/theme/sign-out actions remain buttons. No permission, authentication, routing or data contract changes.

## Evidence and verification

[Phone/dark entry](review/shell-links/entry-phone-dark.jpg) and [desktop/light operations](review/shell-links/operations-desktop-light.jpg) show actual Topbar, SidebarAccount and OperationsShell output. The local packet has before/after captures at 1280/768/390px in both themes: 24 frames, zero recorded overflow/runtime/blocked-request errors. The narrow fixture renders SidebarAccount outside its normal desktop rail to inspect that component, not propose a phone layout.

Matching baselines: [phone entry](review/shell-links/before-entry-phone-dark.jpg), [desktop operations](review/shell-links/before-operations-desktop-light.jpg). The correction changes native roles rather than the shared visual treatment.

The regression first failed on accepted main because sign-in had role=button and could not be located as a link. After the correction, `bun run test:catalogue` passes all 36 Chromium cases (29.6 seconds): the existing 27 plus nine role/keyboard/destination/registration-switch/action-role cases. Final test cleanup lifts identical regexes to constants; behavior is unchanged.

The fixture server-renders the real components in Node using fictional props, then checks their browser accessibility and native Enter navigation against intercepted local destinations. It runs in the existing isolated CSS/font runner; no production route, client shim, service account, API mutation or external call. Static output does not validate hydration, Next client-router prefetch, authenticated access or actual owner operations.

Scoped Ultracite passes on ten code/configuration files. `bun run check-types` passes five tasks (four cached); `bun run check-types:scripts` passes. `bun run test` passes 294 cases across 56 files; `bun run build` passes with the web task rebuilt (9.9 seconds, three package tasks cached). CI runs the same isolated browser cases. Full-root local lint still includes preserved unrelated mocks/checkout formatting; GitHub CI is separate.

## Delivery boundaries

The three CTA substitutions preserve current shared styling and Proximidade authorities. The full public/fan navigation and search work stays KAR-191; Studio/owner shell density, inherited small labels/eyebrow and brand truncation stay KAR-192. This slice does not accept the whole shell or G2. Another navigation CTA in `admin-creators.tsx` belongs to the later owner-screen workstream, outside these shell controls.

No dependency, environment, migration, seed, email, storage or billing changes; no deployment. Rollback is the issue commit without data reversal. Publish an ordinary main-target PR, keep KAR-190 In Review until accepted/merged, then resume the next child; do not advance KAR-132 or another milestone.

Fresh finish review reports **SHIP** only for the three CTA substitutions; KAR-191/192 and G2 remain pending. The documenter reconciled component diffs, shared CSS/button variants and fixture/tests against the preserved product/design/sidecar and theme/control/menu/shell briefs, checked capture metadata and inspected only the four linked representative images.

Hash checks confirm 12 identical before/after pairs and exact representative copies. No system refresh is warranted. Inherited truncation, small labels, dense menus and the operations eyebrow remain uncanonized for KAR-192; fixture limits and separate owner/CI/merge/deployment gates still apply.
