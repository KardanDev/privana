# KAR-204 — Preserve work while switching Studio context

Studio previously removed a filled post editor when switching to the profile. Tab, filter, new-post and edit-post actions now ask the mounted editor before replacing its context. They reuse semantic change detection and the native confirmation from KAR-203. Escape/keep-editing retains the current fields, selected file, list and filter; discard applies only the latest requested destination. Re-selecting the current context clears a competing destination without resetting work.

## Review evidence

- [Before: switching to the profile removed the editor](review/studio-context/before-desktop-profile-light.jpg).
- [After: confirmation in the actual Studio screen, desktop/light](review/studio-context/after-desktop-confirmation-light.jpg).
- [Safe action first, 320px/dark](review/studio-context/phone-confirmation-dark.jpg) and [retained selection after cancel, 320px/light](review/studio-context/phone-preserved-light.jpg).
- [Fresh suspension retains work and disables writes, 390px/light](review/studio-context/phone-permission-preserved.jpg).

The baseline probe failed because the expected confirmation was absent on accepted main `ca760e2488fad2f4026c2d05859f8ff4200c7cd8`. A second regression failed when fresh suspension removed the editor. Current captures exercise actual StudioScreen/useStudioScreen, PostEditor/usePostForm and the native dialog with fictional replies. Viewport captures show interaction states; full-document retained-editor captures start at the document top. Source/bundle hashes and provenance accompany 57 raw after frames; the five representatives are exact copies of annotated screenshots. These are browser review artifacts, not pixel goldens.

## Behavior and verification

Pending writes are checked synchronously before accepting a context change or discarding, including competing events before disabled controls render. A confirmed save follows the existing direct exit. Cancel returns native focus to the initiating control. Confirmed replacements restore that control or the persistent named Studio navigation group when it was removed. Filters own their restoration after data loads, including cached results. The guard ref is registered and cleaned up through React's imperative handle; the parent cannot read or reset the form.

Delayed/rejected background refetches retain the editor and selected file. Updated post data does not reset local values. Fresh creator permissions still disable new/edit and save/publish: a retained editor explains why saving is unavailable, and its submit handler also refuses writes. Keeping local inputs available does not grant permission to persist them. Existing server authorization and fresh upload-owner checks remain authoritative.

The final full catalogue passes 321 cases (2.9m), including 36 context cases. Deterministic tests pass 315 across 61 files with 926 assertions; workspace types pass five tasks (four cached), tooling types pass, scoped Ultracite checks fourteen code files, and production compilation passes four tasks (three cached). The fixture uses synthetic empty Next Link build flags; it does not exercise Next router departure. Inactive standalone fixtures now start without an editor, matching the real screen's entry state.

The independent finish review requested evidence for confirmed replacement focus. A dedicated pre-correction probe failed for tab/new/edit; those endpoints now have passing focus assertions, plus a navigation fallback check for competing scripted actions. Inherited authority gates below are outside this narrow correction and remain disclosed.

No schema, dependency, configuration, seed, service write or deployment changes. Roll back this issue's commit; no data rollback is needed. Authentication, persisted saves/uploads, physical devices and screen readers are unverified here. Browser/route departure remains KAR-205; profile safeguards remain KAR-202. KAR-201/196/149 and G2 acceptance remain open.

Proximidade, Hanken/Bricolage, semantic colors and established controls are preserved. Inherited seed-roll corroboration, QUALITYBAR/ceiling, critique-reference and design-authority wording/breakpoint gaps remain unresolved; this issue establishes no whole-surface SHIP or authority refresh.
