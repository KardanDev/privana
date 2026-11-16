# KAR-203 — Deliberate editor close

Closing a filled post editor previously removed its text and selected file immediately. The close action now compares saved-form semantics and asks before discarding local work. Keep-editing/Escape preserves the mounted editor, values, file and attempt. Untouched or reverted work closes directly; confirmed saves use their existing direct exit. Both close and discard check current pending writes before acting.

## Review artifacts

- [Before: close removed the filled editor](review/studio-discard/before-desktop-close-light.png) and [after: explicit confirmation, desktop/light](review/studio-discard/after-desktop-confirmation-light.jpg).
- [Keep-editing first, 320px/dark](review/studio-discard/phone-confirmation-dark.jpg) and [selected file retained, 320px/light](review/studio-discard/phone-preserved-light.jpg).

The initial actual-editor probe failed on unchanged main `2ee0813` because the expected dialog did not exist (exit 1). The baseline shows the editor already gone. Captures use the existing clearly fictional wrapper; they are interaction states, not whole authenticated Studio layouts or pixel-matched goldens. Metadata records viewport/theme/mode/overflow and source/bundle hashes; representatives are exact copies.

## Verification and boundaries

Actual PostEditor, usePostForm, new close guard and shared native dialog run in the browser. Semantic checks cover title/body/excerpt/audience/public preview and selected files, including named empty files; the unnamed empty placeholder stays clean. New/edit browser cases retain UTF-8 fields and filename through both Escape and the safe action, then discard deliberately. Same-task submission followed by close/discard cannot bypass pending writes; acknowledgment exits directly. A rejected-save/keep-editing/retry keeps the full request payload/ID. Whitespace normalized by the existing save parser and cleared selections do not create false warnings. File validity remains the existing upload/save contract.

The native modal starts at “Continuar editando,” supports tabbing between actions, blocks background focus and returns focus to the close control on cancel. Closing/discarding focuses a persistent named content region. A diagnostic confirmed Chromium can move focus to browser chrome from the modal edge while the modal remains open; that native behavior is preserved. No custom browser-chrome trap is claimed. Phone evidence uses emulated Chromium at 320px; other states run at 390/768/1280px, with no physical-device or screen-reader acceptance claim.

The unchanged confirmation hook moves from Admin to shared hooks; Admin only changes its import. Existing save, upload/media authority and server data remain intact. The fixture has no authenticated session or persisted save outcome. Discard drops local editor state; it does not delete stored uploads. Studio new/edit selection, tab/filter transitions and route/browser departure remain KAR-204/205; profile safeguards remain KAR-202. The parent KAR-201/196/149 and G2 stay open.

The full catalogue passes 285 cases (2.5m), including 33 close-specific cases. Deterministic tests pass 315 across 61 files, 926 assertions. Workspace types pass five tasks (four cached), tooling types and scoped Ultracite on ten code files pass. Production build passes four tasks (three cached, 8.283s). The audit verifies 29 annotated rasters, 24 after frames, four exact-copy representatives, four relative links, current source/bundle hashes and byte-identical shared-hook code, with no problems. Catalogue configuration registers this suite; there is no schema, dependency, runtime/service configuration, storage, seed or deployment change. Roll back the issue commit, including the hook move/imports; no data rollback is required.

Proximidade, semantic colors, Hanken/Bricolage and existing controls remain the authority. The modal protects an explicit loss-of-work decision. Inherited seed-roll corroboration, QUALITYBAR/ceiling, critique-reference and authority wording/breakpoint gaps stay disclosed; no whole-surface SHIP or authority refresh is established.
