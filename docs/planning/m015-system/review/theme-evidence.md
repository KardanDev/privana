# KAR-146 theme foundation evidence

November 13, 2026. Scope is the production theme/font foundation within inherited Proximidade; CMS schema and stored configuration are unchanged.
Fresh `kar146_finish_review` returned `ship` with no material fixes. No UI source changed after that review; this is not full logo, shell, component or screen-family acceptance.
Delivery uses `codex/kar-146-semantic-theme`, rebased onto main after [KAR-145 PR #20](https://github.com/KardanDev/privana/pull/20) merged on November 13. PR creation and clean-checkout CI remain separate delivery evidence.

Checked [global tokens](../../../../packages/ui/src/styles/globals.css), [root SSR layout](../../../../apps/web/src/app/layout.tsx), [published provider](../../../../apps/web/src/shared/platform/platform-provider.tsx) and its [root-accent hook](../../../../apps/web/src/shared/platform/use-published-accent.ts).
Also checked both font loaders, generated production font CSS/resources, input/button/Sonner sources, the calibrated [contrast sampler](../../../../e2e/support/read-theme-contrast.ts), [theme cases](../../../../e2e/theme.spec.ts), [portal case](../../../../e2e/theme-portal.spec.ts) and all six captures.
The accepted PRODUCT, DESIGN, sidecar and both surface briefs were preserved; no new world, token authority document or direction roll was introduced.

The server places the raw published `--brand-accent` on `<html>` before rendering its descendants.
The client hook refreshes that same root property and restores its prior value on cleanup only when its own value is still current.
Configured light controls derive 90% published accent plus black; dark controls derive 40% published accent plus white.
Unconfigured pages retain the literal approved fallback palette, including light `#6929D4` and dark `#C3A1FF` primary values.
Popover, toast, sidebar, focus and chart semantics inherit at document scope rather than relying on an inner application wrapper.
Semantic success/warning/info/destructive surfaces remain distinct; CMS accent publication is not a permission or financial-state signal.

[Next font documentation](https://nextjs.org/docs/app/api-reference/components/font), fetched through Context7, supports self-hosted variable fonts, root CSS variables and subset preloading.
The [Hanken loader](../../../../apps/web/src/shared/theme/body-font.ts) and [Bricolage loader](../../../../apps/web/src/shared/theme/heading-font.ts) retain `next/font/google`, normal variable faces, `display: swap` and Latin preload; Bricolage includes `opsz`.

| Measured Latin resource | Encoded bytes | Generated variable weight range |
| --- | ---: | --- |
| Hanken Grotesk | 34,664 | 100–900 |
| Bricolage Grotesque | 76,868 | 200–800 |

The measured page delivered two WOFF2 resources totaling 111,532 encoded bytes, with no italic face. Its 400–700 usage intent does not bound the downloaded variable weight ranges.
The earlier 76,048-byte weight-only study is not this production payload or a certified production budget; retaining Bricolage optical sizing changes the comparison.
Generated Hanken fallback: size-adjust 100.94%, ascent 99.07%, descent 30.02%; Bricolage: 105.43%, 88.21%, 25.61%. These metrics are not a claim of zero layout shift.
Full font licenses remain in [the existing license record](../../m015-brand/font-licenses.txt); no font library or loading pipeline migration occurred.

[Tailwind's variable-reference documentation](https://tailwindcss.com/docs/theme#referencing-other-variables), fetched through Context7, supports the existing `@theme inline` mappings to runtime font/color variables.
Installed Sonner 2.0.8 `dist/styles.css` is the authority for its CSS variable interface; the [local wrapper](../../../../packages/ui/src/components/sonner.tsx) maps normal and semantic toast colors without a library migration.

The calibrated matrix covers 29 token pairs × five accents × two themes × three viewports = 870 samples.
Accent fixtures: `#6D28D9`, `#000000`, `#767676`, `#c60000`, `#006b52`; viewports: 1280, 768 and 390px.
Minimum text contrast was 4.6462033253:1 against a 4.5:1 requirement; minimum control/chart contrast was 3.1040710731:1 against 3:1.
The sampler explicitly applies `transition: none !important` before resolving token colors. Earlier transition-biased measurements are invalid and must not be reused.
Proper sampling exposed and corrected gray light links on secondary surfaces from 3.902:1 to 4.646:1, and black dark links from 4.089:1 to 4.826:1.
These are calibrated computed-token samples, not a full rendered-content accessibility audit or certification of every future accent/state combination.

| Capture | Viewport / theme | Evidence scope |
| --- | --- | --- |
| [Before desktop](theme-before-desktop.jpg) | 1440×1000 / light | Initial incumbent UI |
| [Before phone](theme-before-phone.jpg) | 390×844 / dark | Initial incumbent UI |
| [Configured light](theme-desktop-light.jpg) | 1440×1000 / light | Published purple foundation |
| [Phone focus](theme-phone-dark-focus.jpg) | 390×844 / dark | Black accent and visible email focus |
| [Expired link](theme-desktop-dark-error.jpg) | 1440×1000 / dark | Actual expired-link error and disabled fields with near-gray accent |
| [Open portal](theme-portal-phone.jpg) | 390×844 / light | Real Base UI portal receiving the refreshed root accent |

All six carry embedded origins. After captures came from a fresh anonymous local production build with empty login credential fields; the portal uses an explicit synthetic viewer/config fixture.
The four after captures are full-page JPEG quality 85 images; listed dimensions are viewports, not full-page heights.
The portal check forces 390×844 in all three project contexts, opens the actual menu, refreshes config and checks inherited accent/font before Escape closes it.
The frontend viewer/config mock is not authentication, authorization or permission acceptance; its checkout data is explicitly demonstrative.

| Final recorded check on reviewed source | Result |
| --- | --- |
| Production build | Passed in 6.96s; includes fresh Next TypeScript validation |
| Type checks | Root workspace types passed earlier; final `check-types:scripts` passed |
| Scoped Ultracite | Fix/check passed for 12 task-owned files |
| Root secretless unit suite | 275 passed, zero failed; 852 assertions across 55 files |
| Browser suite against final production build | Six passed in 13.3s, including calibrated matrix and portal-refresh cases |

Full local root lint still encounters pre-existing untracked studies and Windows CRLF differences outside this scope; those files are preserved. No clean-checkout CI success is claimed here.
The first anonymous production request timed out at 45s; subsequent static/viewer-RPC/login requests returned 200, with an approximately 1.5s response sample. This remains recorded under KAR-171, not fixed or certified as field performance.
Existing hooks reported no deterministic finding; no additional detector or browser run was performed for this documentation pass.

Before/after SHA-256 checks confirmed these authority files remained byte-identical across this documentation edit:

| Authority file | SHA-256 before = after |
| --- | --- |
| [PRODUCT](../../../../apps/web/PRODUCT.md) | `E2FD7EA623D9368DE33C77402F817414B99CA268360CC0AFDB4FC720BF8ACEF3` |
| [DESIGN](../../../../apps/web/DESIGN.md) | `2C8023964310BF9A54909789CAC895F9E916537EF24CAD2C347DFFAD5E485C1E` |
| [Sidecar](../../../../apps/web/.impeccable/design.json) | `20C2D0A729804245F734ACA8EDB71879F559EB23B395DCE3C3CDA356C833F459` |
| [UX surface brief](../../../../.impeccable/surfaces/docs-planning-m015-ux-prototype-index-html.md) | `AADF122BAE7A843D0F18057041FB1EDCD22947E40E47FA246B86DF0CF578472D` |
| [Theme surface brief](../../../../.impeccable/surfaces/packages-ui-src-styles-globals-css.md) | `FC1897CDFADC5BE97B3BBB07C493C0138404B5B4CE46C28BCEFC6DFA7A743C25` |

Palette and type inherit Proximidade; the named Creator Content Rule and `seed:c0e81b28ee1eccfe` remain intact.
Broader logo, shell, authentication scale and page composition remain KAR-148/KAR-152 work, not patterns endorsed or canonized by this foundation.
Physical devices, assistive technology, true zoom, live authentication/services, inbox delivery and production deployment are not verified by these local results.
G1/prerequisite acceptance is recorded in KAR-145 following the owner's confirmed merge. KAR-147–150 retain their own issue scope; no later group or milestone is authorized by these checks.
