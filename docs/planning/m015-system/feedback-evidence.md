# KAR-188 — Overlays and presentation patterns

Menus use 16px actions, 44px targets, wrapping pt-BR labels and visible portal focus. Tooltips use readable supporting text and explicitly named triggers. Empty/error feedback shares native headings and descriptions; loading placeholders have an announced label and decorative skeletons. Existing status labels distinguish outcomes beyond color.

Three owner tables retain their records, captions, rows, conditional actions and minimum widths inside a named keyboard scroll region. Table/supporting text stays readable. Locked-post presentation is separated from Next navigation; the existing profile destination uses a native styled Link. Paging, media delivery, authorization and query/mutation contracts remain unchanged.

## Rendered evidence

| Pattern | Representative capture |
| --- | --- |
| Loading, error, empty, locked content and table | [Desktop/light](review/feedback/states-desktop-light.jpg), [phone/dark](review/feedback/states-phone-dark.jpg) |
| Long labels, disabled/checked state and focus | [Phone menu](review/feedback/menu-phone-dark.jpg) |
| Named supplementary help | [Desktop tooltip](review/feedback/tooltip-desktop-light.jpg) |

The former [phone menu](review/theme-portal-phone.jpg) records the incumbent compact text. Its labels/accent differ from this fictional fixture; it is a component-style reference, not a pixel-identical screen comparison. Final inspection covers 14 captures: full states and open menus at 1280/768/390px in both themes, plus desktop/light and phone/dark tooltips. Captures use actual shared components, fictional records and local actions; no authenticated-role or transaction-processing acceptance is implied.

## Verification

- `bunx ultracite check --staged`: 22 source/style/test files passed.
- `bun run check-types`: five tasks passed; `bun run check-types:scripts`: passed.
- `bun run test`: 275 passed, zero failures, 852 assertions across 55 files.
- `bun run build`: production compilation and Next type checking passed. After the final native-link class merge, the production build passed again.
- With `ALLOW_BROWSER_SMOKE=1`, `BROWSER_SMOKE_ORIGIN=http://localhost:3001`, `bun run test:browser e2e/feedback.spec.ts e2e/controls.spec.ts e2e/checkout-demo.spec.ts e2e/theme`: 42 passed against production. After the final link styling correction, `bun run test:browser e2e/feedback.spec.ts`: all 12 affected cases passed again.

The 12 feedback cases cover both themes at three sizes: ArrowDown/selection, Escape/focus return, disabled menu actions, phone targets, tooltip focus/dismissal, local error retry, loading announcement, native profile-link meaning and ArrowRight scrolling in narrow table regions. A runtime-error guard supplements the existing no-service-write boundary. Capture guards recorded no runtime errors, blocked requests or document overflow.

Rendered review found that the reduced-motion duration rule inadvertently created inherited color transitions: the sampled fixture had 631 active transitions and initially retained light text colors. Setting transition duration to zero gives zero active transitions and immediate correct dark text; a browser regression covers this preference. Normal-motion timing and palette values are preserved. Fixture startup also exposed an inappropriate Next runtime dependency; the extracted locked-content view now runs without a Node global shim. Native-link variant classes are merged through the existing utility.

## Boundaries and review

Fresh independent full visual review: **ship**, no material fixes, all 14 final captures valid. Two tooltip images were recaptured after focus/opacity settled; implementation source was unchanged. The disposition covers this component slice, not owner acceptance or live services. Registry Card and StatCard typography remain with KAR-189's actual catalogue recipes. The full catalogue and screen redesign are separate stories; KAR-131 requires owner G2 review before KAR-132.

One cold development preflight timed out; the server subsequently logged a 43-second response, including 42 seconds in application code. The warmed production checks passed; cold-start diagnosis remains KAR-171. Full-root local lint is still affected by preserved untracked mocks/CRLF outside scope. No live-service, deployment or performance certification is claimed.

No dependency, environment, database, seed, email or billing changes. Rollback is the issue commit without data reversal. Keep Linear In Review until owner acceptance and merge.

Documentation reconciliation checked the final shared overlays/feedback, LockedPostNotice, three native tables and four representative captures against PRODUCT/DESIGN/sidecar and the overlay brief; authority files and inherited seed are preserved, while deferred Card/StatCard typography remains KAR-189, not a new system rule. The recorded provenance scan found 24 rasters with zero missing origins.
