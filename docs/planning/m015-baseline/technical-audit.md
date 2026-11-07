# KAR-138 — Technical design baseline

November 7, 2026. Application baseline `2fb257a70d4a7537183f280bc4866dcdef0c457e`. This is the second child of KAR-127. It documents measurable/source-supported risks and reuse contracts; it fixes no product UI, chooses no replacement identity, and starts no later design group.

## Method and scope

Impeccable's technical-audit playbook was applied to current source, the bundled detector and KAR-137's ten freshly loaded public/fan/creator/editor/owner samples. [PR #2](https://github.com/KardanDev/privana/pull/2) owns that route/state inventory and capture evidence; it is a separate reviewable change. The earlier planning assessments are context, not fresh proof of unseen authenticated outcomes.

This is a technical audit, not a new full heuristic critique. Scores below are provisional checklist judgments for the inspected implementation, not measured field performance, an accessibility certification or a whole-product release grade.

| Dimension | Score / 4 | Evidence and limit |
| --- | --- | --- |
| Accessibility | 2 | Real labels/status/skip/focus patterns exist; accepted accent contrast and faint control boundaries need correction. Complete keyboard/assistive-technology journeys remain untested. |
| Performance | 2 | Self-hosted font setup, shared query state and batched post serialization exist; shell query ownership and private-image strategy need measured follow-up. No production CWV benchmark was run. |
| Theming | 2 | Semantic light/dark tokens exist; runtime accent scope and accepted-value derivation are incomplete. |
| Responsive design | 3 | Sampled 390/1440 layouts have no root overflow; compact controls, content hierarchy and physical keyboard/touch behavior still need targeted checks. |
| Implementation integrity | 3 | Modular domains, server guards and recovery contracts are useful foundations. The detector's single warning is contextual, not a severe workflow failure. |
| Total | 12/20 | Provisional “Acceptable” technical baseline; significant targeted work remains. |

## Integrity verdict and detector provenance

The existing implementation has a coherent reusable Operate foundation. Preserve its domain/state/security contracts while replacing the visual direction after owner approval. It is not appropriate to rebuild working transport, auth or media policy to obtain a different appearance.

Command: `.agents/skills/impeccable/scripts/impeccable.cmd detect --json apps/web/src/shared apps/web/src/domains packages/ui/src`. This focused source scan returned one warning, `border-accent-on-rounded`, at `domains/admin/cms/cms-preview.tsx:8`. That top border intentionally shows the draft brand accent. Treat it as a low-priority pattern to reconsider in the future component preview, not a broken task. The launcher's observed exit was **1** despite valid finding JSON; it is recorded in [the sanitized result](detector-results.json), not described as a clean scan or the documented exit-2 convention. No rendered detector overlay or new full browser detector pass is claimed.

## Prioritized findings

| ID / severity | Source and reproduced evidence | User impact / follow-up |
| --- | --- | --- |
| T01 · P1 | `has-readable-accent.ts` validates contrast against white only. The accepted `#000000` accent becomes dark primary `#666666` against `#15131b`: **3.2058:1**, below 4.5:1 for normal text. Default purple/white is **7.1049:1** and is not this failing fixture. | Owner customization can reduce ordinary control text readability. KAR-146 must validate/derive every accepted accent in both themes, including focus/hover/selected states. Preserve CMS versions and validation feedback. |
| T02 · P1 candidate | Shared light input token `oklch(0.815 0.012 295)` converts approximately to `#c3c1ca`: **1.7795:1** against white. The current input uses this boundary on the white card surface. | Essential field boundaries need a stronger semantic control token. KAR-146–147 must verify actual adjacent surfaces and alternative identifying cues before making a criterion-specific WCAG claim; decorative dividers need not all become darker. |
| T03 · P2 | `PlatformProvider` places `--brand-accent` on an internal wrapper; `Providers` mounts `Toaster` outside it. Dark chart/sidebar defaults differ from the runtime accent vocabulary. | The same CMS brand setting has inconsistent scope. KAR-146 must define brand versus semantic/data colors and verify overlay/portal roots; KAR-168 must preview actual shared components. Menu/tooltip portal inheritance is a required test, not asserted broken here. |
| T04 · P2 | `globals.css` forces every animation/transition to 0.01ms for reduced motion. Text/status feedback exists, but the alternative is a blanket kill switch. | Preserve clear pending/confirmed/failed/disclosure feedback without decorative movement. KAR-149 and KAR-170 own intentional reduced-motion behavior. |
| T05 · P1 source-supported risk | `PostEditor` closes directly; `useStudioScreen` clears the editor on close/tab change. The form is unmounted without a dirty/discard guard. No authored post was discarded to manufacture a demonstration. | Mobile creators can lose unsaved work. KAR-162 must define preserve/discard behavior for close/tab/route/retry and keep recoverable text/selection. Use existing draft contracts; no scheduling/Vault expansion. |
| T06 · P2 | Studio/owner metadata often uses 10–11px text; current button variants include compact targets. Fresh samples show stacked Studio/CMS chrome consuming phone space before the task. | KAR-147–148, KAR-162 and KAR-168 must verify readable hierarchy, effective touch areas, safe areas and virtual-keyboard focus. A 44px design target is not the WCAG AA minimum; verify actual size/spacing exceptions. |
| T07 · P2 verification gap | `AppShell` starts the viewer query before its auth/admin return branches; platform config polls every 60s. Authorized media intentionally uses private delivery and some unoptimized images. | KAR-171 should profile duplicate/waterfall/hydration and image costs with repeatable production-build traces. Never disable access checks or publicly cache private output to improve a lab score. |
| D01 · Delivery blocker | GitHub Quality run **42357323429** for PR #2 failed at lint with **54 diagnostics in the automation already on main**. The PR-contract workflow passed; later quality steps were skipped. Windows local whole-repository formatting also reports CRLF differences. | CI failure must not be hidden or called a product-test pass. The previously authorized delivery issue KAR-174 receives a separate repair PR; the design audit does not bundle its changes. |

There is no evidenced P0 from this audit. Counts above are two major source risks, one major control-boundary candidate, four minor/verification findings, plus a distinct delivery blocker; the detector warning is not an additional major defect.

## Reproduce the contrast evidence

```sh
bun scripts/design-audit/reproduce-theme-contrast.ts
```

The script reads current shared CSS and the real accent validator, checks that the audited derivation still matches, then prints the ratios above. It performs no database, provider, browser or CMS write. The OKLCH-to-sRGB calculation clips/rounds the input fixture; these are source-token calculations, not rendered-pixel or full-component conformance results. If the theme changes, re-measure rather than silently reuse this baseline.

## Reuse and remediation order

1. Keep the [state/component contracts](reuse-contracts.md), resolve the separate delivery gate, and review KAR-127's two PRs.
2. After explicit owner advancement, approved positioning/direction/prototypes precede production theming. KAR-146–149 own tokens, primitives, shells and interaction contracts.
3. Screen stories adopt those patterns; use Impeccable harden/adapt/typeset for the specific findings and re-audit them. Finish implementation with Impeccable polish.

No design token, font, permission, payment or CMS capability is changed by this PR. The current Manrope/DM Sans pairing is a baseline fact, not the selected future direction. Do not create DESIGN.md as an approved replacement identity until that decision is actually made.

## Verification boundaries

KAR-137's current deterministic run passed 271 tests / 834 assertions and maintenance-script types; its five capture helpers passed scoped lint. This PR adds read-only arithmetic evidence and documentation, with its own lint/type/contract checks recorded in its description. No new live-service, physical-device, screen-reader, outage, publication or production-performance pass is inferred. [Capabilities and limits](capabilities.md) distinguishes discovered tools from successful connections.
