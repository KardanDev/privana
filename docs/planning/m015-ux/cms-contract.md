# KAR-145 — Supported customization contract

The current [platform schema](../../../packages/api/src/contracts/platform.ts), [CMS mutation](../../../packages/api/src/domains/admin/cms/update-document.ts), [workspace](../../../apps/web/src/domains/admin/cms/cms-workspace.tsx) and published [provider](../../../apps/web/src/shared/platform/platform-provider.tsx) are authority. The prototype is a local review aid. Admin and editor are the only CMS roles; that permission is independent of creator status.

| Area | Current supported fields and bounds | Review / adoption contract |
| --- | --- | --- |
| Brand | Name 1–80; tagline ≤160; safe logo URL or empty; six-digit accent with ≥4.5:1 contrast against white | Empty logo uses the default identity. Preserve explicit published overrides during default-token/font adoption. No font picker or arbitrary CSS. |
| Discovery | Title 1–120; description ≤500; ≤24 unique categories of 1–60; ≤24 unique valid creator handles | Category changes do not reclassify existing profiles. Featured configuration does not override public/active visibility. |
| Announcement / account entry | Notice ≤240 and optional safe destination; auth title 1–120 and description ≤500 | Empty notice hides it. Copy changes do not verify an email or change authentication authority. |
| Navigation | Six existing destination labels, each 1–80 | Labels do not add routes, reorder the application or grant privileges. Recent `/` and following `/feed` remain distinct. |
| Footer | Text ≤500; valid support email or empty; ≤12 labeled safe links | No link implies working email delivery. One representative row in the prototype; production add/remove/reorder/empty/limit parity belongs to KAR-168. |
| Pages | ≤20 unique lower-case/hyphen slugs ≤80, title 1–120, plain text body 1–20,000 | Published pages resolve under `/pages/[slug]`; missing/unpublished remains unavailable. One prototype row does not certify full collection management. |
| Features | Registration, creator applications, messaging booleans | Publishing enables the new configuration; server guards still decide access. Existing creator edits and stored conversations are separate from availability of new actions. |

Safe URLs use HTTPS without credentials or safe local absolute paths, rejecting decoded controls/backslashes/protocol-relative destinations. The browser adapters name their canonical pure source functions; future production forms must reuse the real schema rather than adopt a separate review validator. Previews display edited content and a local color sample without fetching entered URLs or changing global identity.

## Draft, publication and concurrency

Working fields are not the saved document; the saved draft is not public configuration. Every successful save, publish or restore increments the document version. Only publish changes the public configuration and adds a history revision. Restore copies an existing published revision into a new draft, requiring a later explicit publication to affect the public platform. Current history returns the last 30 published revisions.

The reference sequence starts with fictional v2/public2, saves v3/public2, publishes v4/public4, restores revision 2 into v5/public4, then publishes v6/public6. The restore reference deliberately selects revision 2; production must preserve selection of any supported returned revision, its identity and attribution.

Commands carry the loaded expected version. A conflict retains local fields, distinguishes loaded versus available version, and requires deliberate discard/reload before retry. Keep/continue never silently overwrites work. Pending commands do not claim confirmation or allow a duplicate product action. Publish/restore require a clean saved draft, and workspace exits protect unsaved changes on desktop and phone.

The [runtime theme provider](../../../apps/web/src/shared/platform/platform-provider.tsx) supplies published `--brand-accent`; [shared styles](../../../packages/ui/src/styles/globals.css) currently derive light/dark control colors. KAR-146 must reconcile approved semantic tokens and both themes with those overrides, including hover/focus/disabled/error contrast. White-accent contrast validation alone does not certify every derived state. KAR-168 must verify publication/reload consumers and preserve the existing typed API/audit contract.

## Consumer gap and explicit exclusions

The current feature-field hint promises readable history when messaging is off. [MessagesPage](../../../apps/web/src/domains/messages/messages-page.tsx) instead disables its list query and shows an unavailable state; current read APIs require an ACTIVE account and conversation participation, while send/start enforce the feature flag. KAR-157/168 must reconcile behavior and copy. The review uses “conversations are not erased” and does not claim that UI repair already shipped.

No CMS schema extension is authorized: no layout builder, font control, payment-provider setup, configurable permission engine, scheduling or policy/identity assurance flow. Existing stored configuration and content must survive implementation; no default reset, data migration or reseed is part of this design handoff.
