# KAR-141 — Google Font study

November 7, 2026. The owner selected Proximidade in the structured question: Hanken Grotesk UI with Bricolage Grotesque brand/headings. This packet compares fonts in read-only product studies; it does not change the application's current DM Sans/Manrope setup or claim a production performance result.

## Proposed roles

| Direction | UI / data | Brand / display | Reason and tradeoff |
| --- | --- | --- | --- |
| Galeria | Figtree 400–700 | Figtree 600–700 | One family, open shapes, decisive headings and a relatively small measured file. Wide photographic content needs restraint in the surrounding type. |
| Proximidade | Hanken Grotesk 400–700 | Bricolage Grotesque 600–700 for wordmark and major headings only | Human, clear UI with a more recognizable brand voice. A second family has a real payload cost; keep it out of tables, fields and metadata. |
| Ritmo | Source Sans 3 400–700 | Source Sans 3 600–700 | Compact, readable workhorse for frequent scanning and dense owner views. Use spacing to create density; do not shrink labels to imitate the reference. |

Selected study: Proximidade, because the humanist UI and stronger brand lettering can distinguish Privana while preserving familiar creator-platform controls. This rationale is design judgment, not user research. Galeria and Ritmo remain comparison evidence rather than approved alternatives.

## Delivery evidence

The official CSS2 API was requested with a Chrome user-agent, normal variable `wght@400..700`, and `display=swap`. The specimen was `Ação, criação, João, São Paulo · R$ 29,90 · 0123456789`. The table sums the WOFF2 response bytes for Unicode subsets needed by that specimen, measured November 7, 2026. It excludes HTTP headers, CSS, images, additional scripts/styles, italics and future languages.

| Family | Required subset in this request | Font bytes | Official metadata / license |
| --- | --- | --- | --- |
| Figtree | latin | 20,156 | [Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/figtree/METADATA.pb), [OFL](https://github.com/google/fonts/blob/main/ofl/figtree/OFL.txt) |
| Hanken Grotesk | latin | 34,704 | [Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/hankengrotesk/METADATA.pb), [OFL](https://github.com/google/fonts/blob/main/ofl/hankengrotesk/OFL.txt) |
| Bricolage Grotesque | latin | 41,344 | [Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/bricolagegrotesque/METADATA.pb), [OFL](https://github.com/google/fonts/blob/main/ofl/bricolagegrotesque/OFL.txt) |
| Source Sans 3 | latin | 28,872 | [Google Fonts metadata](https://github.com/google/fonts/blob/main/ofl/sourcesans3/METADATA.pb), [OFL](https://github.com/google/fonts/blob/main/ofl/sourcesans3/OFL.txt) |

The Hanken/Bricolage study totals 76,048 font bytes for this request. Production must remeasure the actual chosen weights, axes, subsets and preload behavior; the prototype CSS request is not a bundle-size guarantee. The family metadata lists Latin coverage and variable weight axes; visible Portuguese specimens and browser font-load checks complement that metadata. They do not certify every possible Unicode name.

All four families are distributed under SIL Open Font License 1.1 in the linked official repository files. Preserve each font's copyright and license alongside any redistributed binary. Do not use a reserved font name for a modified font without its required permission; Source Sans 3's metadata identifies the reserved name “Source”. No font modification or binary redistribution is made by this study. [Google's CSS2 documentation](https://developers.google.com/fonts/docs/css2) supplies the API syntax used here.

## Selected typography contract

- Body and ordinary form text: 16px equivalent, around 1.5 line height, normal browser zoom. Supporting metadata: 14px equivalent, not tiny 10px status labels. A compact table may use 14px only with an explicit density/readability check.
- Use 400 for reading, 500–600 for labels/actions, 600–700 for headings; no synthetic italic or extra decorative weight. Keep body paragraphs at a comfortable measure and avoid display type in operational tables.
- Use tabular numerals for comparable counts, currency and dates when the selected family supports them. Test `0/O`, `1/I/l`, `R$ 29,90`, `1.234,56`, punctuation and pt-BR accents at actual sizes.
- Fallback: selected UI family, `system-ui`, `-apple-system`, `"Segoe UI"`, sans-serif. The display family falls back to the chosen UI family. Production's Next font pipeline should self-host the selected assets; verify its generated metric fallback rather than assume this generic stack prevents reflow.
- Evaluate fallback/blocked fonts, 200% zoom, long names, phone widths, light/dark text and weight changes together. A font-loading check proves availability, not lack of layout shift, assistive-technology quality or field CWV.
- The existing app already uses Next's font pipeline. KAR-146–150 implement approved roles/tokens and coded references; screen stories adopt them. No second font loader, analytics event or public Google request is introduced into the application by this document.

## Acceptance status

Explicit browser loads returned a loaded face at 400, 500, 600 and 700 for both selected families with the specimen above. The actual sketch requests Bricolage's optical-size range as well as weight; the byte table measures the stated weight-only request, not that entire sketch. All committed captures were refreshed with custom fonts available. A deliberately blocked-font mobile Studio and CSS 200% enlargement check had no document-width overflow; this does not establish field performance or complete accessibility acceptance.

Owner choice is recorded in [the decision packet](direction-review.md) and [DESIGN.md](../../../apps/web/DESIGN.md). The decision is ready for PR review; application font adoption and its performance checks remain later work. Final brand assets follow in KAR-142; later group authorization remains separate.
