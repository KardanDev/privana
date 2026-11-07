# KAR-142 — Privana identity and asset guide

**Status:** original identity proposal for owner PR review, November 7, 2026. It follows the owner-selected [Proximidade direction](direction-review.md) and [DESIGN.md](../../../apps/web/DESIGN.md). Direction selection does not approve this artwork automatically. Existing application defaults and CMS records remain unchanged.

Review [the identity sheet](identity-preview.html) locally, or use the durable [desktop](review/identity-desktop.png) and [phone](review/identity-mobile.png) captures. The sheet shows light/dark, monochrome, native small sizes, a minimum-width wordmark and a circular app-icon crop. The mark is newly drawn geometric source: an open P with a parallel stem. It echoes the selected study's open monogram without copying a competitor mark.

## Use and export selection

| Asset | Dimensions / purpose |
| --- | --- |
| [mark.svg](../../../apps/web/public/brand/mark.svg) | 64 × 64 vector. Purple default; inline `color` can customize its monochrome fill. |
| [wordmark.svg](../../../apps/web/public/brand/wordmark.svg) | 240 × 64 vector. Purple symbol and dark ink lettering on light surfaces. |
| [wordmark-inverse.svg](../../../apps/web/public/brand/wordmark-inverse.svg) | 240 × 64 vector. One light color for dark surfaces; change inline `color` for another single-color use. |
| [favicon.svg](../../../apps/web/public/brand/favicon.svg), [96px PNG](../../../apps/web/public/brand/favicon-96.png) | Symbol on purple, with rounded outer corners for the favicon. |
| [Apple icon](../../../apps/web/public/brand/apple-touch-icon.png) | 180 × 180 PNG, opaque full-bleed background; the platform applies its shape. |
| [192px app icon](../../../apps/web/public/brand/app-192.png), [512px app icon](../../../apps/web/public/brand/app-512.png) | Ordinary `any` icons; opaque square background. |
| [Maskable app icon](../../../apps/web/public/brand/app-maskable-512.png) | 512 × 512 PNG. Reduced symbol sits inside the central 80%-diameter safe circle. Use `purpose: maskable` separately from ordinary icons. |
| [Social source](../../../apps/web/public/brand/social-preview.svg), [social PNG](../../../apps/web/public/brand/social-preview.png) | Editable 1200 × 630 vector and matching sharing export. Existing public-entry wording; no private content, testimonials or activity claims. |
| [Avatar](../../../apps/web/public/brand/default-avatar.svg), [cover](../../../apps/web/public/brand/default-cover.svg) | Neutral 64 × 64 profile placeholder and 1500 × 500 platform cover. They do not represent real creator media or verification. |

Keep at least **8 source units of clearspace outside the complete mark/lockup viewBox**, scaled with the asset. For example, a 64px-tall lockup needs an additional 8px around it. Keep the supplied mark/lettering relationship and intrinsic aspect ratio. Do not crop, stretch, add shadows, animate individual letters or use a wordmark in the square favicon/CMS slot.

Use the symbol at **20px or larger** in ordinary UI; 16px is a tested favicon exception. Minimum complete wordmark width is **140px**. The examples include 16/20/24/32/48/64px symbols at actual sizes. Choose the inverse version for dark backgrounds; preserve readable contrast. Inline SVG can inherit a selected color; an SVG loaded through an `<img>` does not inherit the host page's text color. For accessible links/buttons, name the action once and make the accompanying decorative mark hidden/empty-alt; a standalone meaningful logo needs a product-name alternative.

Raster source recipe: ordinary/Apple app icons use the mark's 64-unit geometry, white fill and a full purple square behind it, without rounding. The maskable source uses the same background and `translate(9.68 8.24) scale(.72)` on the white geometry. The rounded favicon source is `favicon.svg`. Render at the table's dimensions; these simple compositions preserve editable source without a separate font or image pipeline. The safe-circle check found the furthest white pixel at radius 194.64px, inside 204.8px on the 512px maskable export.

## Editable source and provenance

The SVGs are the editable source, including the exact outlined lettering and original geometric mark. They have no external image/font dependencies, scripts or embedded raster pictures. Bricolage Grotesque's unmodified **600 weight / optical size 48** supplied the wordmark and social heading outlines; Hanken Grotesk 400 supplied the social supporting line. These fixed export instances sit within the selected family roles; they are not a substitute for live UI text or its font-loading pipeline.

Outlines were exported with [Satori](https://github.com/vercel/satori) 0.63.2 and rasterized using [resvg-js](https://github.com/thx/resvg-js) 2.6.2 in an isolated temporary tools directory. Neither tool was added to application manifests/lockfiles. All final exports render without either tool. PNGs are generated from the corresponding vectors/icon geometry; screenshot and export provenance is embedded in their metadata.

Google's CSS2 service supplied fixed, non-variable TTF instances, checked for absence of an `fvar` table before outlining. Source/rights: [Bricolage metadata](https://github.com/google/fonts/blob/main/ofl/bricolagegrotesque/METADATA.pb), [Hanken metadata](https://github.com/google/fonts/blob/main/ofl/hankengrotesk/METADATA.pb) and the included [original font notices/licenses](font-licenses.txt). Both are SIL OFL 1.1. No font file or modified font is redistributed in this kit. The mark geometry is authored for Privana; all creator photography from the direction studies is excluded from these production asset files.

## Adoption boundary and validation

The files are served under `/brand/` but are not activated by app metadata, manifest, email or shell code in this story. [The surface inventory](brand-surfaces.md) records current CMS behavior and the later integration owners. KAR-141 is accepted and merged in [PR #7](https://github.com/KardanDev/privana/pull/7); this KAR-142 asset PR now targets merged `main`. Asset approval is the owner accepting this PR; keep Linear In Review until accepted and merged.

Checks: desktop 1360px and phone 390px sheets rendered with custom fonts, zero broken images and no document-width overflow; 13 exports inspected for size/dependencies; PNG dimensions/source matches and maskable safe zone verified. Native-size and light/dark/monochrome appearances were visually reviewed. These checks validate the asset kit, not installed-PWA behavior, CMS publishing, assistive technology or the future platform redesign. Reverting the asset commit removes these additions without changing records or production configuration.
