# KAR-199 — Studio post-save recovery

A rejected post-save transport displayed the raw English message “Failed to fetch.” The editor now gives Portuguese guidance that it could not confirm the save, retains the current work and offers retry. This wording preserves uncertainty when a response is lost. Specific validation and server conflict messages remain intact. The production change is one focused message function and its existing usePostForm error callback; controls, request IDs, save/upload behavior and layout stay unchanged.

## Review artifacts

- [Before: raw transport error, desktop/light](review/studio-post-recovery/before-desktop-draft-light.png) and [after: confirmation-aware recovery](review/studio-post-recovery/after-desktop-draft-light.jpg).
- [Publish awaiting acknowledgment, 320px/dark](review/studio-post-recovery/phone-pending-publish-dark.jpg).
- [Draft fields retained for retry, 390px/light](review/studio-post-recovery/phone-retry-draft-light.jpg).

The initial browser probe on unchanged main `40feb52` failed the localized-message assertion (exit 1); the retained pre-fix PNG shows the actual English alert. After captures use the same actual editor in a fictional wrapper; they are scrolled form-state evidence, not whole authenticated Studio layouts or pixel-matched goldens. The local packet records widths, theme, mode, overflow, source/bundle hashes and exact-copy representatives.

## Verification and limits

Actual PostEditor, StudioPosts and usePostForm are mounted. Intercepted saves deliberately drop the first reply after recording its fictional request ID, then acknowledge the unchanged retry: the editor retains title, body, public excerpt, audience and preview URL; pending controls reject repeated submission. DRAFT/PUBLISHED intent stays distinct, and the editor exits only after acknowledgment. Edits use their stored post ID, with no creation ID. Invalid file selection remains visible with specific validation feedback; SDK transport is not invoked. PENDING/SUSPENDED props omit the editor and disable row editing. These prove component presentation, not authentication/authorization.

The existing [server idempotency/access suite](../../../packages/api/tests/post-idempotency.test.ts) independently covers unchanged concurrent retries, changed-payload conflicts without overwrite, media ownership/MIME, fresh role checks and edit IDs. The [cache confirmation tests](../../../apps/web/tests/studio/commit-studio-post.test.ts) retain count/filter/access boundaries. The browser's fictional ID set is not a persisted database. A separate native Chromium probe confirmed File identity across repeated FormData construction; it does not establish completed-upload or provider recovery.

`bun run test` passes 313 tests across 60 files, 906 assertions. Workspace types pass five tasks (four cached), tooling types pass, and scoped Ultracite on ten code files passes. The full 219-case catalogue completed with `.last-run.json` status `passed`; 30 cases exercise this editor. Production build passes (25.659s). The source/bundle/provenance audit verifies 29 annotated rasters, four exact-copy representatives and six relative links with no problems. There are no schema, dependency or runtime/service configuration changes; the catalogue configuration registers this suite. No login, real save/upload, cloud data/email/payment operation, seed or deployment occurs. Rollback is the issue commit.

KAR-199 is the first leaf under KAR-196. Completed-upload reuse remains KAR-200; dirty navigation/discard KAR-201; profile recovery KAR-202. KAR-29 service lifecycle and later Studio redesign remain separate. Parent KAR-196/149 and G2 acceptance remain held. Proximidade, typography and controls are preserved; the fixture design hook reported no deterministic findings. Inherited seed-roll corroboration, QUALITYBAR/ceiling and authority wording/breakpoint gaps remain disclosed; no clean Impeccable SHIP, authority refresh, full authenticated Studio, live-service or physical-device acceptance is claimed.
