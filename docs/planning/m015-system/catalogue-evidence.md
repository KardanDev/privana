# KAR-189 — Editable shared component catalogue

Run `bun run build` once for the approved font assets, then `bun run ui:catalogue`. Open `http://127.0.0.1:53471/`. The application need not run. Edit [catalogue sources](../../../apps/web/tests/catalogue/catalogue.tsx) or the reused fixtures, stop/restart the runner, and refresh. Theme/accent/example selection and actions are temporary; switching examples retains entered values.

Actual Card/StatCard recipes complete their deferred typography: 16px content, 14px support, a native 20px card heading, quiet 16px corners and readable phone indicator labels. [Desktop/light](review/catalogue/content-desktop-light.jpg) and [phone/dark](review/catalogue/content-phone-dark.jpg) show the resulting catalogue. The full local review packet has 21 captures across 1280/768/390px, both themes, invalid/pending fields, feedback, content, menus and a visible tooltip; values are fictional.

## Combined KAR-147 coverage

| Original criterion | Implemented evidence |
| --- | --- |
| Existing control/form primitives | [KAR-187](controls-evidence.md): Button, Input, Textarea, Checkbox, Label, InputGroup, NativeSelect and composed Field parts. |
| Existing overlays, feedback/media/data | [KAR-188](feedback-evidence.md): Menu, Tooltip, Skeleton, Empty, query recovery/loading, status labels, locked-content notice and native owner tables; this slice adds actual Card/StatCard recipes. |
| Installed composition and bounded scope | React/Base UI/shadcn and shared CSS; no installed shared Tabs/Dialog was found, so no speculative framework or component was added. Screen-specific navigation/composition remains in its existing screen stories. |
| Focus, labels, states and phone targets | Reused meaningful control/feedback cases now run against either the app fixture or this static catalogue. They cover error recovery, retained input/ref/IDs, checkbox Space, 44px targets, disabled/pending, Escape/focus return, tooltip dismissal and table scrolling. |
| Editable variants and realistic copy | Three local views, light/dark/native color-scheme, accepted CMS accent examples and long pt-BR copy. Extra catalogue cases cover touch theme activation, persisted menu preference, local action feedback, retained examples and real loaded fonts. |

## Verification

- `bun run test:catalogue`: 27 Chromium cases passed in 20 seconds at desktop, tablet and phone sizes, without the application server or cloud services.
- `bun run test`: 294 passed, zero failures across 56 files; 19 catalogue boundary cases exercise assets, blocked writes, foreign requests and private/API paths.
- `bun run check-types`: five tasks passed; `bun run check-types:scripts`: passed, including catalogue/fixture source types.
- `bun run build`: production compilation and Next types passed. PostCSS tooling now directly declares the already installed versions; the lockfile adds only root workspace metadata.
- Scoped lint, staged whitespace, capture provenance and documentation links are checked before publication. Local full-root lint remains affected by preserved unrelated mocks/CRLF; clean CI is separate.

## Boundaries and review

The loopback runner serves an in-memory allowlist of generated HTML/JS/CSS, selected browser WOFF2 files and their license. It rejects foreign hosts/origins and writes; CSP forbids connections, submissions and embedding. The bundle disables environment inlining. No environment file, server output, application route, source map, database, email or payment action is served. Missing font assets instruct a normal build; restart rebuilds the catalogue, with no watcher or service API.

Quality CI runs the same isolated browser suite after its disposable synthetic build. No build/env/browser artifact is uploaded or promoted. Linear CI comments retain the existing main-target restriction for dependent PRs. No live-service, cross-browser, performance or deployment certification is claimed.

Rollback is the issue commit and stopping the local runner; no data reversal is needed. Keep KAR-189 and parent KAR-147 pending owner acceptance/merged prerequisites. KAR-131 still requires G2 review before KAR-132.

Fresh finish review (`kar189_finish_review`): `SHIP` after all 21 final captures, with no material fixes. This records local finish evidence; owner acceptance, prerequisite merges and KAR-131/G2 remain pending.

Documenter reconciled catalogue/Card/StatCard/shared-fixture source, CSS, capture metadata and both committed content renders with preserved Proximidade authorities. PRODUCT/DESIGN/sidecar and incumbent briefs remain byte-for-byte. Their pre-existing direction-study scope stays intact; implemented semantic/accent/motion details remain in CSS/theme evidence, with no authority refresh or preview-copy canonization.
