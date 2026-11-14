# KAR-193 — Phone account and task navigation

Conta now opens the existing account menu from the bottom bar; the duplicate header account control and misleading Perfil/settings tab are removed. Saved content, memberships, settings, theme, sign-out and eligible application/Studio/staff entries remain discoverable. Only a returned ACTIVE creator profile gets a Studio tab. Existing profiles retain recovery/workspace entry when new applications close. Actual routes and server authority are unchanged.

Phone labels grow from 10px to 12px (14px at roomy widths), with bounded two-line tab wording and full accessible names. Menu labels wrap fully. Equal flex columns reclaim disabled messaging space; controls meet 44px targets, notifications use a 44px header target and footer clearance includes the safe area. Discovery retains one search; no shell search is added.

## Visual and interaction evidence

- Fan phone/light: [accepted baseline](review/phone-account/before-fan-phone-light.jpg) → [current static output](review/phone-account/after-fan-phone-light.jpg), with matching keyboard focus.
- [Actual open menu, pending profile, 320px/dark](review/phone-account/menu-compact-dark.jpg).

The local packet contains 64 baseline, 64 current static and 32 actual-runtime frames at 320/390/768/1280px in both themes. Baselines are exact copies of the accepted KAR-191 packet, with its original provenance; static after frames render the current real components with the same fictional context. Actual-runtime frames use the fresh compiled Next app with fictional viewer/creator read replies. They are separate evidence, not a pixel-matched baseline comparison.

`bun run test:catalogue` passes 99 isolated cases. `node node_modules/@playwright/test/cli.js test e2e/navigation.spec.ts`, with `ALLOW_BROWSER_SMOKE=1` and `BROWSER_SMOKE_ORIGIN=http://127.0.0.1:3002`, passes 27 cases in 50.8 seconds across desktop/tablet/phone projects. These exercise actual menu open/Escape/focus return, touch, theme, target sizes, equal columns, an 80-character published-label/disabled-feature reply, one discovery search, the real anonymous Saved guard and browser back with the search retained. The clock advances the real platform polling interval; no CMS record is published.

Workspace types pass five tasks (four cached); script types pass. Deterministic tests pass 298 cases across 57 files, 884 assertions. The final production build passes with web rebuilt and three package tasks cached. Scoped lint and capture provenance are checked before review. The standard browser readiness check timed out on cold starts; the successful run used the warmed compiled app. Initial development-runtime hydration probes stalled and are not claimed fixed.

## Delivery boundaries

This is presentation with fictional client read replies, not an authenticated session/access grant. Unapproved API calls and external requests stay blocked; selecting Saved still reaches the real anonymous login guard. No login, seed, data write, email, storage, payment, dependency or environment change; no deployment. Chromium touch emulation is not physical-device certification. Rollback is the issue commit, without data reversal.

The accepted Proximidade world and authorities are retained. Original seed-roll provenance and QUALITYBAR remain unavailable; no clean Impeccable finish, ceiling score, authority refresh or G2 acceptance is asserted. KAR-192 retains workspace-shell polish; KAR-148/131 and G2 remain pending. Keep KAR-193 In Review until owner acceptance and main merge, then wait for the next instruction.

## Documentation reconciliation

Fresh documenter review reconciled `PRODUCT.md`, `DESIGN.md`, the sidecar, navigation contract/brief, theme/layout/menu source and the three linked JPEGs: this extends Proximidade; no system or authority files changed.
Per-test JPEG and geometry attachments accompany the Node browser run on the warmed compiled app; cold-readiness and development-hydration limitations remain.
The fresh finisher's FIX concerns only the inherited missing seed receipt and QUALITYBAR; no material current UI/code fix was identified. Study wording/breakpoint drift is reported, not canonized or repaired; no clean SHIP, ceiling, G2, owner acceptance or merge is asserted.
