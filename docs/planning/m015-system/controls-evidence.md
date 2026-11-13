# KAR-187 — Shared controls and form associations

The current controls adopt Proximidade's readable typography, field geometry and semantic focus/error roles. TextField now composes installed Base UI Field parts: caller descriptions remain associated, generated IDs stay unique, and labels focus the correct control. Optional external errors preserve entered values and caller refs. No new validation rule or submit payload is introduced.

Buttons wrap long labels; compact/icon actions and checkboxes have 44px phone targets. Native currency selection keeps browser keyboard behavior and the existing BRL/USD/EUR/Pix restrictions. InputGroup owns its outline without clipping its controls. New field parts and shared styles have separate files/direct imports.

## Rendered evidence

| Surface | Desktop | Phone |
| --- | --- | --- |
| Existing login, after | [Light/focus](review/controls/login-desktop-light.jpg) | [Dark/focus](review/controls/login-phone-dark.jpg) |
| Real-component fixture | [Light/error/focus](review/controls/desktop-light.jpg), [dark](review/controls/desktop-dark.jpg) | [Light/error/focus](review/controls/phone-light.jpg), [dark](review/controls/phone-dark.jpg) |

Login before: [desktop](review/theme-desktop-light.jpg), [phone](review/theme-phone-dark-focus.jpg) from accepted KAR-146. The phone baseline used a black published accent; it documents former field/label geometry rather than a pixel-identical color comparison. Logo adoption and whole-screen composition remain their later stories.

The fixture mounts actual shared React/Base UI components, outside production routing. Fictional values are labeled; there is no account session, API submission or data mutation. Browser tests also inspected 768px light/dark states. Measured at 390/768/1280px: 16px input text, 14px label/hint text, Hanken Grotesk, no horizontal overflow. Capture guards reported no blocked requests or runtime errors; login credential fields were empty.

## Verification

- Scoped `bunx ultracite check` over the 19 changed source/test files: passed.
- `bun run check-types`: five tasks passed; `bun run check-types:scripts`: passed.
- `bun run test`: 275 passed, zero failed, 852 assertions across 55 files.
- `bun run build`: passed, including Next.js production compilation and type checking.
- With `ALLOW_BROWSER_SMOKE=1` and `BROWSER_SMOKE_ORIGIN=http://localhost:3001`, `bun run test:browser e2e/controls.spec.ts e2e/checkout-demo.spec.ts e2e/theme`: 30 passed against the production build (1.2 minutes).

The nine new browser cases cover generated/explicit labels, caller hint/error descriptions, stable IDs after rerender, retained text, caller ref focus, disabled fields, native selection, checkbox Space/label operation, mixed state, pending duplicate-submit prevention and effective phone targets. The pending example is local fixture behavior; it does not certify every product mutation. Fifteen existing checkout cases cover invalid cards, simulated approval/decline/retry, non-payable Pix, expiry and currency restrictions. Six inherited theme cases cover 870 contrast samples and open-portal accent refresh.

The regression initially caught an undefined `htmlFor` overriding Base UI's generated association. Removing that override fixed label activation; the test now guards it. Local root lint remains affected by preserved untracked mocks/CRLF outside scope; no full-root lint success is claimed. Known cold-start latency remains tracked in KAR-171.

A bounded rendered probe also checked six button variants in normal/hover states with purple, black and gray accents in both themes: 72 samples, minimum text contrast 4.861:1, no failures. A separate 30-second navigation timed out once before that probe; retrying with the suite's 45-second timeout succeeded. This does not resolve KAR-171 or certify production latency.

## Review and rollout

Fresh independent visual review: **ship**, across all eight production captures, with no material fixes. Its disposition covers sampled control appearance/composition; it did not rerun browser tests or establish auth/mutation readiness. No separate quality-bar card or surviving original seed-roll receipt was available; the accepted design and inherited surface contract were reviewed. This is a component acceptance slice; KAR-188/189 retain overlay/data patterns and the complete editable catalogue. KAR-131 still requires owner G2 review before KAR-132.

No dependency, environment, database, seed, email or payment integration changes. No deployment. Rollback is the issue commit; it requires no data reversal. Keep Linear In Review until the owner accepts and merges the PR.

Documentation reconciliation checked the shared controls/field wrappers, TextField, demo selector and all eight captures against PRODUCT/DESIGN/sidecar and the control brief; accepted files and inherited seed are preserved, while the default button's 10px vertical padding (versus DESIGN's illustrative 11px) remains a bounded implementation difference, not a new token.
