---
version: 1
slug: "apps-web-src-domains-messages-messages-page-tsx"
primary_target: "apps/web/src/domains/messages/messages-page.tsx"
---

# KAR-194 — Conversation draft recovery

Operate mode; harden the accepted conversation workflow within Proximidade.

THESIS: Opening another conversation and returning preserves the member's unsent work without sending it to the wrong recipient.

OWN-WORLD: Retain the existing purple/plum, Hanken/Bricolage, inbox layout, composer and delivery labels. This is behavior refinement, with broader inbox polish owned by KAR-157.

STORY: Each conversation retains its own page-memory draft across keyed panel remounts. Delayed failure restores only its originating empty draft; newer typing and other conversations survive. Pending/retry feedback and server-confirmed delivery remain truthful.

FIRST VIEWPORT: Keep existing conversation selection, query URL, phone back control, composer targets and keyboard use. Draft recovery is visible in the original composer after return; it does not create an automatic send or persisted-draft promise.

FORM: Code-led refinement of the pinned incumbent. Inherited seed:c0e81b28ee1eccfe lacks its original roll receipt; QUALITYBAR remains unavailable. No new visual direction, fabricated provenance or authority refresh.

FINISH: Reproduce current draft loss, then exercise real messaging hooks/controls with fictional delayed/rejected/out-of-order replies, remounts and explicit retries. Light/dark phone/desktop captures remain separate from authenticated/live-service and physical-device acceptance. KAR-195 onward, parent acceptance and G2 stay pending.
