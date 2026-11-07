# M01.5 discovery audit

November 6, 2026 · source baseline `f28b21e` · planning input, not final acceptance.

This audit informs the [redesign plan](m015-redesign-plan.md) and [KAR-126](https://linear.app/kardandev/issue/KAR-126). It selects no new visual direction and makes no whole-platform accessibility or performance claim.

## Evidence and limits

Impeccable Assessment A reviewed product/source and fresh isolated public browser captures independently of Assessment B's detector. It observed loaded `/`, `/explore`, `/creators/vitoria-demo`, `/login`, `/register` and initial `/checkout/demo` on phone and desktop. Its provisional public Operate score was 24/40; authenticated fan, Studio and owner screens are unscored. No account creation, email send, publication, upload, message, payment or cloud setting was performed.

Assessment B independently inspected tokens/components/state architecture and ran the bundled source detector on 261 TS/TSX files. It returned one contextual warning at `cms-preview.tsx:8` (`border-accent-on-rounded`); that is a draft accent marker, not a severe product defect. Exit 2 means findings. A rendered-detector attempt failed with a connection error and is not a clean result.

B's fresh isolated Chromium fallback sampled six anonymous layouts at 320/390/1280px. All returned 200, with no captured page errors or root horizontal overflow; discovery remained in initial skeleton state. These samples do not establish fully loaded application behavior. A later wait timed out. A successfully loaded discovery on localhost in A's separate context prevents treating those timings as a demonstrated production fault. Existing dev-tool overlays are excluded from design findings.

Authenticated workflows, failures, actual-device touch, keyboard/screen-reader journeys, dark-mode rendering and service outcomes remain G0/G2/G3 verification work. Do not close those stories using the public screenshots alone.

Temporary reproduction evidence from this session:

- `tmp/m015-assessment-a.md`, `tmp/m015-a-*.png`: source rationale and loaded public screenshots.
- `tmp/m015-assessment-b.md`, `tmp/m015-detector-source-b.json`: independent technical assessment and raw source result.
- `tmp/m015-browser-b.json`, `tmp/m015-b-*.png`: initial anonymous layout measurements.
- `tmp/m015-token-contrast-b.mjs`: reproducible source-token contrast calculations.

Temporary files are not a durable release archive. [KAR-137](https://linear.app/kardandev/issue/KAR-137) establishes sanitized, reproducible baseline artifacts in the delivery workflow.

## Findings routed into actionable work

| Priority / evidence | Finding | Delivery owner |
| --- | --- | --- |
| P1 · rendered public entry | Anonymous home opens as a feed without explaining the marketplace, fan/creator paths or current prelaunch limits. Registration lacks visible identity/privacy/support context. Approved policy content is a real dependency, not something to invent. | [Positioning/copy](https://linear.app/kardandev/issue/KAR-140), [public entry](https://linear.app/kardandev/issue/KAR-151), [auth](https://linear.app/kardandev/issue/KAR-152) |
| P1 · source and mobile render | Phone navigation mixes Studio with fan tasks and moves saved/membership destinations; “Perfil” leads to settings. This is a task consistency problem rather than a need for novel navigation. | [IA](https://linear.app/kardandev/issue/KAR-143), [shells](https://linear.app/kardandev/issue/KAR-148) |
| P1 · source-supported risk | Closing the Studio editor or switching tabs unmounts unsaved form work. No authored post was used to demonstrate loss; define and test preservation/discard behavior before claiming resolution. | [Mobile composer](https://linear.app/kardandev/issue/KAR-162) |
| P1 · source-token calculation | `has-readable-accent.ts` validates white contrast only. An accepted black accent produces dark primary `#666666` against `#15131b`, about 3.21:1. The default purple is not the failing fixture. Confirm actual rendered pairs and repair the accepted-value derivation. | [Theme/CMS parity](https://linear.app/kardandev/issue/KAR-146) |
| P1 · source calculation plus auth capture | Light input border `oklch(0.815 0.012 295)` is approximately `#c3c1ca`, about 1.78:1 against white. Distinguish an essential control boundary from decorative dividers; verify adjacent rendered surfaces and focus states. | [Themes](https://linear.app/kardandev/issue/KAR-146), [controls](https://linear.app/kardandev/issue/KAR-147) |
| P2 · source | Runtime accent is scoped inside `PlatformProvider`, while `Toaster` sits outside it. Charts/sidebar tokens and draft preview need an explicit brand/semantic scope. Review portals as well as the toast. | [Themes](https://linear.app/kardandev/issue/KAR-146), [CMS](https://linear.app/kardandev/issue/KAR-168) |
| P2 · rendered phone profile/demo | The prelaunch membership panel delays posts beyond the first phone viewport; full demo summary follows inputs. Bring creator/content and zero-real-charge context closer to the decision. | [Profiles](https://linear.app/kardandev/issue/KAR-156), [demo checkout](https://linear.app/kardandev/issue/KAR-160) |
| P2 · measured public controls and source | Repeated 36px actions and 10–11px labels need task-specific touch/readability rules. This is not an automatic WCAG failure; effective hit areas, spacing and exceptions matter. | [Controls](https://linear.app/kardandev/issue/KAR-147), [accessibility](https://linear.app/kardandev/issue/KAR-170) |
| P2 · source | Blanket 0.01ms reduced-motion overrides suppress every animation. Define intentional reduced-motion progress/status behavior instead of relying on a global kill switch. | [Feedback](https://linear.app/kardandev/issue/KAR-149), [accessibility](https://linear.app/kardandev/issue/KAR-170) |
| P2 · verification gap | Existing optimistic identity/rollback and confirmed publication/CMS boundaries are valuable. Their redesigned visual states and race/recovery paths require fixture-based evidence. | [Feedback](https://linear.app/kardandev/issue/KAR-149), [recovery/performance](https://linear.app/kardandev/issue/KAR-171) |

## Strengths to preserve

- The content-focused Operate shell already has restrained accent use, familiar navigation, consistent body/headline roles and responsive foundations. Replace weak hierarchy deliberately; novelty is not an acceptance criterion.
- Demo payment copy explicitly states zero real charge, no renewal and no exclusive access. Preserve that truth across profile, input, review and result states.
- Existing labels, autocomplete, skip link, skeleton/retry/empty states, domain-owned optimistic reconciliation and CMS draft/publish separation provide a stronger foundation than static mockups.

## Next evidence gates

1. Baseline every current role/section and meaningful state, then approve an editable direction and critical flows.
2. Prove the design system in actual fan, creator and owner reference screens before full rollout.
3. Close route/role coverage with accessibility, localization, measured performance, recovery and security-boundary checks.
4. Record owner acceptance against the implemented build. No next milestone starts automatically.

## Existing board limitation

KAR-7, the future M07 owner/CMS container, was already archived at 14:09 UTC on November 6. It is readable when addressed directly but excluded from the non-archived project list. The available Linear tools do not expose issue restoration. This revision preserves its history and later feature references rather than creating a duplicate parent or claiming it was restored. All 47 M01.5 records (one epic, ten workstreams, 36 leaf stories) are unarchived and remain Backlog. Resolve the M07 container when that roadmap area is reopened; it is not an M01.5 product implementation task.
