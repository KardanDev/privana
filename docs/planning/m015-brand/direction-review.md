# KAR-141 — Direction decision and review evidence

**Decision:** the owner selected **Proximidade** in the structured question on November 7, 2026: “Proximidade — warmer typography and a familiar creator experience (Recommended)”. This approves the visual direction and font pairing. It does not approve a PR merge, logo artwork or the full screen rollout.

This builds on the merged [positioning](../m015-positioning/brief.md) and [baseline inventory](../m015-baseline/inventory.md). The compared views are read-only studies of existing behavior with fictional fixtures. They do not connect to the database, send email, accept payment or grant access. The preview toolbar and provisional P marks are review aids.

## Comparison and recommendation

| Direction | Density, hierarchy and imagery | Shape, type and motion intent | Decision / tradeoff |
| --- | --- | --- | --- |
| Galeria | Strong purple rail, larger photographic presence and assertive creator identity. | Figtree, clean caption strips and contained media; direct, brief state feedback. | Compared, not selected. Memorable framing, but its stronger shell competes more with repeated creator imagery. |
| **Proximidade** | Comfortable feed rhythm, soft violet navigation, dominant creator media; flatter Studio/owner information. | Hanken Grotesk UI, Bricolage Grotesque headings; rounded controls, immediate selected states without movement. | **Recommended and owner-selected.** Familiar daily workflows with a warmer brand voice. Two font families cost more than one; reserve display type for its actual job. |
| Ritmo | Compact content/status grouping and operational scanning with standard navigation. | Source Sans 3; restrained containers and status rows, quick color/opacity response. | Compared, not selected. Efficient for heavy use; its tighter rhythm is less welcoming for discovery. |

All three retain royal purple, separate fan/Studio/owner contexts and recognizable product controls. Differences are design judgments, not evidence of conversion uplift or user research. The subordinate “Familiar direto” option kept Hanken alone; it was not selected. The reference hand also considered and declined data-field, timetable, doujin catalogue, Crouwel grid and transit directions; they added density/metaphor without a stronger fit for these everyday tasks. Safe direction reference: `seed:c0e81b28ee1eccfe`.

## Rendered evidence

Captured from the local comparison server on November 7, 2026 with Chromium and actual custom fonts loaded. These are direction studies, not production screenshots or an interaction/accessibility certification. Each of 15 inspected combinations had zero broken visible images and no document-width overflow. The table retains the 12 comparable core views plus the selected mobile dark view; other dark studies remain local review artifacts.

| Direction | Public entry, 1440 × 900 | Fan feed, 1440 × 900 | Studio, 390 × 844 | Owner data, 1440 × 900 |
| --- | --- | --- | --- | --- |
| Galeria | [Entry](review/galeria-public-1440.jpg) | [Feed](review/galeria-feed-1440.jpg) | [Studio](review/galeria-studio-390.jpg) | [Owner](review/galeria-owner-1440.jpg) |
| Proximidade | [Entry](review/proximidade-public-1440.jpg) | [Feed](review/proximidade-feed-1440.jpg) | [Studio](review/proximidade-studio-390.jpg) | [Owner](review/proximidade-owner-1440.jpg) |
| Ritmo | [Entry](review/ritmo-public-1440.jpg) | [Feed](review/ritmo-feed-1440.jpg) | [Studio](review/ritmo-studio-390.jpg) | [Owner](review/ritmo-owner-1440.jpg) |

Selected [mobile dark feed](review/proximidade-feed-390-dark.jpg). The local comparison page also permits entry/feed/Studio/owner switching; that server is temporary and not a durable artifact. Images above are durable review evidence. Editable decisions live in [DESIGN.md](../../../apps/web/DESIGN.md), its [sidecar](../../../apps/web/.impeccable/design.json), the [surface contract](../../../apps/web/.impeccable/surfaces/src-app-layout-tsx.md) and [font study](font-study.md).

## Verification and limits

- The capture run required at least one loaded custom face per direction. For the selected pair, explicit loads of weights 400, 500, 600 and 700 returned a loaded face for the Portuguese/currency specimen. An initial sandbox capture silently used fallback because network access was denied; all committed captures were refreshed after the public font request succeeded.
- Selected mobile Studio was checked with fonts loaded and deliberately blocked, at normal size and CSS `zoom: 2`: no document-width overflow. CSS zoom is a focused enlargement stress check, not a complete browser/assistive-technology audit. Full field, focus, safe-area, long-name and zoom acceptance belongs to the implemented component/screen stories.
- Familiar navigation and visible selected states were inspected; corrected prototype-only view switching and overbroad selected selectors before capture. Other feature actions stay disabled. Motion is specified, not exercised by these static examples.
- Impeccable's focused type detector on the current application returned no findings. That is a source check at its selected scope, not a full UX verdict or proof that the target theme has shipped.

## Sources and handoff

The sketches reused public Unsplash URLs already in the seed: [portrait 1](https://images.unsplash.com/photo-1524504388940-b1c1722653e1), [portrait 2](https://images.unsplash.com/photo-1534528741775-53994a69daeb), [portrait 3](https://images.unsplash.com/photo-1531123897727-8f129e1688ce) and [fashion photo](https://images.unsplash.com/photo-1515886657613-9f3515b0c78f). Demo names and counts are fictional; the depicted people do not endorse Privana. Reusing these references is not commercial-rights clearance. The Impeccable density board and Spotify creator-site reference calibrated density/photographic presence only; no competitor identity, layout or assets were imported into production.

Local HTML sketches remain development-only; they embed reference pictures and are not shipping UI. No generated image, Figma file, service configuration, new package or production stylesheet was introduced. The selected target is documented from the rendered study, with illustrative component snippets identified as handoff guidance rather than current app implementation.

KAR-142 delivers original logo/vector and entry-point assets against this direction. KAR-146–150 and the authorized later screen groups implement and verify the system. Keep both stories In Review until the owner's PR review and merge; do not start KAR-130 or another group automatically.
