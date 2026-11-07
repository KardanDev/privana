# KAR-138 — Reuse contracts for the redesign

Baseline `2fb257a`, November 7, 2026. These are implementation constraints, not a new design system or feature specification. Read alongside [the technical audit](technical-audit.md) and KAR-137 / PR #2's route inventory.

## Token, font and component ownership

| Owner | Existing responsibility | Redesign rule |
| --- | --- | --- |
| `packages/ui/src/styles/globals.css` | Shared semantic light/dark tokens, Tailwind v4 aliases, type roles, radii, focus and motion | Keep one semantic vocabulary; fix derived accent contrast and control boundaries here rather than scatter raw overrides. |
| `apps/web/src/index.css` | Imports the shared UI stylesheet | Avoid creating a second competing app palette. |
| `apps/web/src/app/layout.tsx` | `next/font/google` DM Sans body and Manrope headings; root pt-BR and server platform load | Current fonts are already loaded through Next's font pipeline. Future font selection needs approved specimens, pt-BR coverage, bounded weights and measured payload. |
| `shared/platform/platform-provider.tsx` | Published platform config/query and runtime `--brand-accent` wrapper | Scope theme ownership explicitly across portals/toast and draft previews; do not optimistically publish brand changes. |
| `packages/ui/components.json` | `base-lyra`, CSS variables, RSC, Lucide and shared aliases | Use the installed Base UI/shadcn composition, direct component imports and documented APIs; no parallel kit. |
| `packages/ui/src/components` | 17 installed modules | Reuse buttons, input/textarea/checkbox/label, card, skeleton/empty, tooltip/menu, input-group, toast and message/bubble/attachment/marker/scroller primitives. Add only patterns required by real screens. |
| `shared/layout` and `domains/admin` | Public/fan shell and distinct owner shell | Keep route/task labels consistent while honoring role-specific density and server permissions. A CSS redesign cannot grant access. |

Do not mistake an installed module for a fully tested state catalogue. Future KAR-147 needs focus/hover/invalid/pending/disabled/empty states, actual keyboard behavior and both themes. Read the component CLI/API documentation before changing Base UI trigger/portal/form composition.

## State and data contracts

| Domain / source | Current mechanism to preserve | Failure/race/authority boundary |
| --- | --- | --- |
| Social — `shared/query/use-social-toggle.ts`, patch/rollback/reconcile helpers | Mutation identity per entity/action; explicit state; pending suppression; field-specific rollback | Do not restore whole stale snapshots over unrelated edits or double-count retries. Reconcile after overlapping writes finish. |
| Comments — post comment attempt/cache helpers | Stable attempt IDs, confirmed append and deduplication | Keep text/retry identity after failure; counts and paged histories converge once. |
| Messages — `use-send-message.ts`, outbox/history helpers | Stable attempt IDs, pending/failed outbox, confirmed merge and history anchors | Retry must preserve the attempt; retain other messages and draft text. Current participant policy remains server-owned; future subscriber/paid messaging belongs elsewhere. |
| Settings/profile — settings and Studio form/cache helpers | Targeted optimistic fields and targeted rollback | Do not invent creator approval, overwrite fresh avatar/role/counts, or erase a later save. |
| Studio — `use-post-form.ts`, `commit-studio-post.ts`, API `studio/save-post.ts` | Upload/save phases, reusable completed upload, stable clientPostId, server-confirmed IDs and cache projection | Publication requires an ACTIVE creator profile; media ownership is checked server-side. A pending visual preview is not a published/authorized post. Dirty-work handling is the identified gap. |
| Owner operations — admin command/patch/rollback modules | Existing role-scoped forms, pending action and authoritative API decisions | Local optimistic row display grants no permission. Recheck current role/status, confirmation and audit consequences. Do not create an editable role engine or refund/payout control in a reskin. |
| CMS — `use-cms-workspace.ts`, API `cms/update-document.ts` | Dirty flag, explicit save/preview/publish/restore; expectedVersion and transactional compare-and-swap; history/audit | Save is not publish. Stale version fails; restore creates a draft. Only server-confirmed publication changes public config; preserve concurrent-editor recovery. |
| Access/media — `serialize-post.ts`, `can-access-post.ts`, media routes | Locked body/media fields omitted; authorized private delivery URL; owner/status/access checks | No premium source in unauthorized props or error states; no public cache for private bytes. UI visibility is never authorization. |
| Checkout — `domains/memberships/payment-demo` and payment tests | Browser-only test-card/Pix state machine, reference prices and zero real charge | Browser success/redirect grants no access. Currency examples are not FX conversion; Pix is the supported BRL example. M04/M09 own later commerce. |

Existing regression fixtures cover concurrency, optimistic rollback, post serialization, media boundaries, CMS conflicts, auth/email transport and demo invariants. Preserve those tests and add meaningful checks only when implementation actually changes. The current audit submits no business mutations, so fresh screenshots alone are not success evidence for publishing or sending.

## CMS promise versus current schema

Supported now: name/tagline/logo/accent; existing discovery/content/announcement fields; navigation/categories/curation; plain published pages; registration/application/messaging switches; versioned draft/save/preview/publish/history/restore. Existing approval badge/status is platform review, not age or identity assurance.

Not supported by this schema: arbitrary CSS/JavaScript, a visual layout/block builder, configurable Google Fonts, publication scheduling, configurable staff permission rules, provider health, reconciliation or new finance controls. Design those extension patterns only when their owning milestone is authorized. A preview must show the exact currently supported values, not imply full no-code control.

## Architecture handoff

Keep focused components/functions in domain files, current oRPC contracts and one shared query client. Extract a repeated pattern after observing it in real screens, not through speculative factories. Maintain current server/client boundaries, direct imports and guarded endpoints. Measure query/media/client-bundle changes before introducing memoization, virtualization or an animation library. No rewrite of working auth, transport, storage or financial policy is part of KAR-127.
