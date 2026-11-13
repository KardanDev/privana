# KAR-145 handoff review evidence

November 13, 2026. This records the code-led KAR-130 handoff; G1 remains pending owner review.

Checked [handoff](../handoff.md), [coverage](../coverage.md), [CMS contract](../cms-contract.md), [prototype walkthrough](../prototype/README.md), final shared geometry, recent/following sources and all four reference captures.
The accepted PRODUCT, DESIGN, sidecar and surface contract remain the authority; this pass establishes no new visual world, tokens or direction roll.

Fresh builder `kar145_builder_check` reported “nothing important left” within the handoff scope.
Fresh finish reviewer `kar145_finish_review` initially returned `fix` for the rounded/inset phone feed and design geometry.
The scored-fix pass resolved both findings with no observed regression: disposition `ship` applies only to those scored fixes, not full-platform approval.

Corrections remain on their originating KAR-177/KAR-178/KAR-181 branches, rather than being bundled into KAR-145:

- Phone post and image reach x0–390 with zero outer radius; text retains an 18px gutter.
- Buttons use 11px/18px padding and controls 12px corners; field borders use `#9D8CAA` / `#8A729C`.
- Secondary content uses a 278px column, 32px separation and 1150px collapse.
KAR-145 adds explicit Recentes `/` and Seguindo `/feed` tabs to reconcile the two existing sources.

| Reference capture | Viewport / theme | Observed reference |
| --- | --- | --- |
| [Fan desktop](reference-fan-desktop.jpg) | 1440×1000 / light | Recent content, selected tab and discovery column |
| [Fan phone](reference-fan-phone.jpg) | 390×844 / dark | Following content, full-width cornerless post/media |
| [Studio phone](reference-studio-phone.jpg) | 390×844 / light | New publication editor and retained field geometry |
| [Owner desktop](reference-owner-desktop.jpg) | 1440×1000 / dark | Dirty CMS draft and Save emphasis |

All four references were regenerated as full-page JPEG quality 85 captures with embedded origins; table dimensions describe viewports, not full-page image heights.
The existing provenance scan covered 29 rasters with zero missing origins. No new browser run or design detector was used for this documentation pass.

| Recorded check | Result |
| --- | --- |
| Playwright MCP / Chromium | 272 cases at 390/768/1440px: 816 case-width checks; valid title/H1, no horizontal overflow or uncaught page errors |
| Scenario graph | 272 cases, 3,866 edges, zero missing destinations |
| Inventory reconciliation | 21 actual routes / 21 mapped routes; eight owner sections |
| Local documentation links | Seven handoff/index/plan/walkthrough documents; 67 local links resolve without replacement characters |
| Scoped Ultracite | 83 files passed after Windows CRLF normalization |
| Secretless `bun run test` | 275 passed, zero failed; 852 assertions across 55 files |

The case-width sweep is structural browser coverage, not interactive acceptance of every state. Domain evidence retains its separately stated interaction scope.
Full local root lint still fails on pre-existing untracked studies and CRLF differences outside the prototype; those files are preserved. Clean-checkout GitHub CI remains separate.
No production code changed after the recorded test pass. This document claims no PR creation, green CI, merge, live service or production deployment.

Before/after SHA-256 checks confirmed the four authority files remained byte-identical across this documentation edit:

| Authority file | SHA-256 before = after |
| --- | --- |
| [PRODUCT](../../../../apps/web/PRODUCT.md) | `E2FD7EA623D9368DE33C77402F817414B99CA268360CC0AFDB4FC720BF8ACEF3` |
| [DESIGN](../../../../apps/web/DESIGN.md) | `2C8023964310BF9A54909789CAC895F9E916537EF24CAD2C347DFFAD5E485C1E` |
| [Sidecar](../../../../apps/web/.impeccable/design.json) | `20C2D0A729804245F734ACA8EDB71879F559EB23B395DCE3C3CDA356C833F459` |
| [Surface contract](../../../../.impeccable/surfaces/docs-planning-m015-ux-prototype-index-html.md) | `AADF122BAE7A843D0F18057041FB1EDCD22947E40E47FA246B86DF0CF578472D` |

Palette: inherited royal purple, violet neutrals and dark plum; editable CMS accent samples remain local data.
Type: Hanken UI/data and Bricolage headings; 16px body/identifying values and 14px supporting text.
Layout: accepted community/Studio/owner separation, media-first phone feed and readable owner records.
Geometry: the formerly recorded shared control/secondary-column drift is reconciled in its originating issues; no defect is canonized as a new token.
Named rule: the Creator Content Rule and inherited `seed:c0e81b28ee1eccfe` remain intact.

Mapped KAR-157/KAR-168 gaps are recorded as Agent notes; no future feature work is included in this handoff.
Physical devices, assistive technology, real zoom, production authentication/services and performance measurements remain unverified by these references.
G1 requires an explicit owner decision on the accepted revision. Issues stay In Review until accepted and merged; stop before KAR-131 and wait for explicit advancement.
