# KAR-145 — Route, role and state reconciliation

Read with the [source inventory](../m015-baseline/inventory.md), [role matrix](role-matrix.md), [handoff](handoff.md) and [walkthrough](prototype/README.md). “Coded” means an isolated fictional review path. “Source-only” means current application behavior was inventoried but this group supplies no complete rendered acceptance for it. Neither classification certifies a live service.

| Production route | Review artifact / important states | Remaining adoption and acceptance owner |
| --- | --- | --- |
| `/` | `fan-public` public-entry proposal; `fan-recent` signed-in recent content, explicit Recentes/Seguindo | KAR-151/154: proposed anonymous entry differs from current recent feed; retain source/access distinction |
| `/explore` | Guest/member search, no matches, named profile and back/scroll; actual category/paging details source-only | KAR-155 |
| `/creators/[handle]` | Three named guest/member/interest profiles, public/locked content and demo entry; unavailable/media edge cases source-only | KAR-156 |
| `/feed` | Following, loading/empty/failure, save pending/retry/confirmation; complete likes/comments/paging source-only | KAR-154/149 |
| `/saved` | Empty, saved, remove and current-access distinction; complete paging/concurrency remains source/tests | KAR-158/154 |
| `/memberships` | Independent active/expired/empty records; cancelled/revoked and full list behavior source-only | KAR-158 |
| `/messages` | List/selected/empty/off, retained send failure/pending/confirmed; real participant/history/paging and disabled-history inconsistency remain source work | KAR-157/149 |
| `/notifications` | Source-only: read/unread, mark-one/all, empty/loading/error and destinations | KAR-159 |
| `/settings` | Existing name and email-notification preference; retained pending/failure/confirmation; no new security preference | KAR-159 |
| `/login` | Read-only example credentials, pending/invalid, `/feed` success fallback; no actual login or safe-return repair | KAR-152 + M02 |
| `/register` | Registration-disabled example; full open signup and email-verification behavior source-only | KAR-152 |
| `/forgot-password` | Example request/pending/generic response; no delivery or account-existence claim | KAR-152 |
| `/reset-password` | Source-only: valid/missing/expired/invalid token, validation and server feedback | KAR-152 |
| `/verify-email` | Source-only: guidance/resend, rate/error and confirmation states | KAR-152 |
| `/studio` | Application/pending/active/suspended; profile dirty/save/retry/preview; content new/edit/upload/draft/publish/archive/filter/empty/failure | KAR-161–163/149: true upload, ownership, complete lists and capability carryover |
| `/admin` | Four staff roles/eight sections; searchable/filterable records, permission denial, current decisions, CMS fields/version/conflict | KAR-164–168: full data, chart/date/filter/paging, audit list and collection parity |
| `/pages/[slug]` | Public reading/source-only; CMS has a local one-page preview, not a published route | KAR-153/168 |
| `/checkout` | Source-only compatibility redirect to `/checkout/demo` | KAR-160 |
| `/checkout/[handle]` | Fixed card/Pix, BRL/USD/EUR reference prices, invalid/declined/expiry/retry/results; no charge or access | KAR-160; provider/ledger integration retains later milestones |
| `/success` | Source-only redirect to membership guard; a redirect proves no payment | KAR-160/158 |
| `/dashboard` | Source-only compatibility redirect to Studio and its guards | KAR-148/163 |

The page count remains **21**, with eight owner sections and five CMS tabs inside their existing parent routes. API/media/auth handlers and generated brand assets are contracts/assets rather than additional UI pages. Global loading/error/not-found/offline/footer/PWA surfaces remain KAR-153; they were not silently replaced with the prototype frame.

## Role and state coverage

| Role / state | Coded critical path | Boundary still enforced by current application/API |
| --- | --- | --- |
| Anonymous | Public discovery/profile, fixed login/recovery and public demo proposals | No member mutations or real authentication; email/token/service states source-only |
| ACTIVE member | Following/recent, saved, recorded access, inbox and preferences | Access/status, participants, cursors and server results remain authoritative |
| Applicant / pending creator | Application/status/profile, no publication | Closing applications is separate from an existing profile's edit capability |
| ACTIVE creator | Profile and content editor/lifecycle, five-item mobile navigation | Actual ownership/media access; fixed cross-domain personas do not carry a live viewer |
| Suspended creator/account or expired session | Restricted fixtures and source guard matrix | Publishing restriction is not account suspension; protected API denies inactive accounts |
| Admin | All eight owner sections; current status/role/local-revoke commands and CMS | Self/admin/target eligibility and expected-version checks remain server policy |
| Moderator | People/creators/reports and allowed decisions | No team-role grants, finance or audit browser |
| Editor | CMS editing/preview/lifecycle and denial | No moderation, finance or audit browser |
| Analyst | Overview/subscriptions/transactions and denial | Read-only records; no local revoke or provider operation |

Current data behavior that must survive adoption includes optimistic likes/bookmarks/follow/preferences, message outbox and cursor/history merging, overlapping rollback, creator cache updates, and confirmed CMS/privilege transitions. The prototype demonstrates selected paths; existing domain tests and the complete source inventory define the rest. KAR-149 and each screen owner must retain them rather than replace them with scenario Maps.

## Evidence interpretation

Public/fan/checkout/creator/owner/CMS evidence documents record representative widths, themes and outcomes. The final reference packet covers recent/following navigation, mobile creator editing and owner CMS. Physical devices, assistive technology, actual zoom, browser coverage, external services, production data and performance budgets are not inferred from those captures. KAR-169–171 and the named stories own measured acceptance after implementation.
