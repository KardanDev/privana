# KAR-137 — Existing screen, role and state inventory

Application baseline: `2fb257a70d4a7537183f280bc4866dcdef0c457e`, November 7, 2026. This is the first child of [KAR-127](https://linear.app/kardandev/issue/KAR-127). It inventories current behavior before selecting a replacement visual direction. No application UI or business rule is changed by this audit.

Scope was reconciled against all **21 `page.tsx` entries** and the running Next.js route inventory on `http://localhost:3001`. The runtime also exposes five API entrypoints and two generated assets. The tables distinguish source-supported behavior from rendered evidence; a route's existence is not proof that all its outcomes were exercised.

## Current page coverage

Risk is the impact of a redesign regression, not an assertion that a defect already exists. Every route has a future implementation owner; those stories remain unstarted while KAR-127 is reviewed.

| Route | Current access and task | Material states to retain | Redesign owner / risk |
| --- | --- | --- | --- |
| `/` | Anonymous and signed-in recent feed, `SocialHome` | Loaded/empty/error; signed-out actions; following versus recent; accessible/locked post | KAR-151 public entry + KAR-154 feed / high |
| `/explore` | Public discovery, `DiscoveryPage` | Search/category/query state, no matches, missing image, loading/retry, follow state | KAR-155 / medium |
| `/creators/[handle]` | Public creator profile, `CreatorPage` | Not found/unavailable; bio/cover variants; follow/message/report; interest/demo offer; locked posts | KAR-156 / high |
| `/feed` | Session-required following feed, `FeedPage` | Login return path; no followed creators; loaded/error/paging; current access | KAR-154 / high |
| `/saved` | Session-required saved feed | Empty/bookmarked/removed; pending/rollback; paging/access changes | KAR-158 + KAR-154 / high |
| `/memberships` | Session-required recorded memberships | Empty, recorded active/expired/cancelled/revoked as returned; errors; no invented renewal/payment | KAR-158 / high |
| `/messages` | Session-required list/history/composer | Feature disabled; no conversations; selected thread via query; history paging; pending/failed sends | KAR-157 / high |
| `/notifications` | Session-required updates | Unread/read/empty; mark-one/all pending/rollback; failure; link destination | KAR-159 / medium |
| `/settings` | Session-required account/preferences | Loaded, validation, saving/recovery, name/preferences; distinct from public creator profile | KAR-159 / high |
| `/login` | Public email/password entry | Invalid/verified-link message; required fields, server errors, pending; `returnTo` | KAR-152 / high |
| `/register` | Public account creation when enabled | Feature disabled; validation/duplicate email; pending; verification guidance | KAR-152 / high |
| `/forgot-password` | Public recovery request | Input validation, generic response, pending/error; no email send during this audit | KAR-152 / high |
| `/reset-password` | Public token-dependent reset form | Missing/error token, valid-token form, validation/pending/error; no real token in evidence | KAR-152 / high |
| `/verify-email` | Public verification guidance/resend UI | Required email, pending/rate/error feedback; no live resend in this audit | KAR-152 / high |
| `/studio` | Active session; applicant/profile and creator workspace | No profile/application; pending/active/suspended profile; posts/profile tabs; composer/list lifecycle | KAR-161–163 / high |
| `/admin` | Active admin/editor/moderator/analyst via `requireOperator` | Role-selected sections; data/loading/error; restricted action; versioned CMS | KAR-164–168 / high |
| `/pages/[slug]` | Public published CMS reading page | Published content, absent slug → not found; long/empty text and supported footer links | KAR-153 / medium |
| `/checkout` | Redirects to `/checkout/demo` | Redirect remains a demo handoff | KAR-160 / high |
| `/checkout/[handle]` | Existing card/Pix browser demonstration | Test-only inputs, BRL Pix, reference currency, review/pending/result/retry/expiry; no access grant | KAR-160 / high |
| `/success` | Redirects to `/memberships` | Signed-out destination continues through login; redirect proves no payment | KAR-160 + KAR-158 / high |
| `/dashboard` | Compatibility redirect to `/studio` | Existing bookmarks/links continue; Studio enforces its own entry rules | KAR-148 + KAR-163 / medium |

Sources: `apps/web/src/app/**/page.tsx`, `shared/layout/app-shell.tsx`, `domains/feed/require-member.ts`, `shared/auth/require-member.ts`, `domains/admin/require-operator.ts`, and the domain components imported by each page. The two member guards differ: the shared guard rechecks ACTIVE status; the feed guard checks the session. Preserve server authorization and route intended behavior; consistency is an explicit M02 handoff, not a client-only access fix in this inventory.

## Sections hidden behind a single route

| Workspace | Existing section/action coverage | States and boundaries | Redesign owner |
| --- | --- | --- | --- |
| Studio overview | Followers, publication count, membership interest, active recorded subscriptions | Real recorded counts; no earnings/trend invention | KAR-163 |
| Studio posts | Active/published/draft/archived filter, 24-row page, load more, create/edit/archive | No-filter-results versus no content; paging failure; publication requires ACTIVE profile | KAR-162–163 |
| Studio composer | Existing text/media fields, public preview versus private media, draft/publish | Uploading/saving, validation, duplicate retry, dirty/discard/interruption | KAR-162 |
| Studio profile | Application/edit, category/location, avatar/cover URL, planned price | Pending profile can update; suspended editing disabled; price creates no charge | KAR-161 |
| Owner overview | Existing analytics series and currency summaries | No-data/source/date definitions; separate currencies | KAR-164 |
| People/team | Accounts/status and supported role forms | Current role/action constraints; confirmation; protected staff; pending/error | KAR-165 |
| Creator review | Profiles and existing approval/suspension actions | Review is not identity/age verification; current decision/audit behavior | KAR-166 |
| Reports | Report list, expansion, authorized inspection and decision | Restricted media context; no private inbox browsing; pending/error/closed state | KAR-166 |
| Subscriptions | Existing access records and supported local revocation | Authoritative status/expiry; local access action is not provider refund | KAR-167 |
| Transactions | Existing financial record inspection | Read-only, source/status/currency; no payout/refund controls implied | KAR-167 |
| Audits | Existing recorded decisions | Owner-only; readable event/actor/time; list limitations remain explicit | KAR-167 |
| CMS — Marca | Name/tagline/logo URL/accent | Supported validation, fallback identity and runtime theme scope | KAR-168 + KAR-146 |
| CMS — Conteúdo | Supported content/announcement/curation fields | Draft content remains private until publish | KAR-168 |
| CMS — Navegação | Existing labels/categories/navigation rows | Supported links and order; no fake routes | KAR-168 |
| CMS — Páginas | Existing page entries | Slug/title/body, row editing and missing-page behavior | KAR-168 |
| CMS — Recursos | Current feature switches | Registration/application/messaging availability must match consumers | KAR-168 |
| CMS lifecycle | Dirty/version status, save, preview, publish confirmation, history and restore | Saved versus live; conflict/reload; authoritative publication and audit | KAR-168 |

Sources: `domains/studio/studio-screen.tsx`, `use-studio-screen.ts`, `profile-form.tsx`, `post-editor.tsx`; `domains/admin/operations-navigation.ts`, `operations-content.tsx`; `domains/admin/cms/cms-workspace.tsx`. Existing owner sections number **eight**, CMS editing tabs **five**; do not count one `/admin` screenshot as complete coverage.

## Role and status matrix

| Fixture / state | Existing entry | Existing owner sections | Evidence status |
| --- | --- | --- | --- |
| Anonymous | Public discovery/profile/auth/demo; member routes redirect to login | None | Public loaded browser inspection and captures |
| `member` | Fan routes; `/studio` is an application entry when no profile | None | Isolated seeded login; phone/light and desktop/dark captures |
| `creator` with ACTIVE profile | Fan capabilities plus current Studio publish/edit/list | None | Isolated seeded login; mobile composer and desktop Studio |
| `creator-nova-criadora-demo` | Pending Studio profile, application status and read-only publication boundary | None | Isolated seeded pending fixture; no approval attempted |
| `admin` | Fan plus owner workspace | All eight sections | Isolated seeded owner overview capture; section inventory from source |
| `editor` | Fan plus restricted owner workspace | CMS only | Isolated seeded CMS phone/light and desktop/dark captures |
| `moderator` | Fan plus restricted owner workspace | People, creators, reports | Source-verified role filter and API guards; no moderator action submitted |
| `analyst` | Fan plus restricted owner workspace | Overview, subscriptions, transactions | Source-verified role filter and API guards; no financial action submitted |
| Suspended account/profile, expired session | Existing guards/status notices and server errors | Denied or restricted as enforced by server | Source/test evidence only; no account was suspended or session revoked to capture it |

No credentials, cookies, signed media URLs or email tokens are committed. The ignored local manifest supplies fixture **keys**, not a new seed. Creator review, account role and age/identity eligibility are independent; a screenshot does not establish production verification.

## State coverage and future-feature boundary

Rendered baseline evidence is representative. Source/tests establish the remaining state inventory: initial/background loading; empty/filter-empty; unavailable media/profile/page; query retry; session/permission restriction; pending/confirmed/rollback; unsaved/draft/published/archive; destructive confirmation; CMS dirty/conflict/restore; demo invalid/declined/pending/expired. Exhaustive state combinations, physical touch, keyboard/screen-reader journeys and field performance are not claimed here. Their review owners are KAR-169–171 and the named screen stories above.

Global `loading.tsx`, `error.tsx`, `not-found.tsx`, existing `public/offline.html`, footer/support links and PWA identity belong to KAR-153. API entrypoints `/api/auth/[...all]`, `/api/rpc/[[...rest]]`, `/api/media/[postId]`, `/api/media/upload` and `/api/media/complete` are authorization/data contracts, not extra UI pages. `/favicon.ico` and `/manifest.webmanifest` are brand assets, owned by KAR-142/KAR-153.

Vault, scheduling, automations, polls/tips, a server-owned sandbox ledger, real payment/Yoti activation, configurable permission engines and a page-layout builder are **future features**. Their patterns may be annotated later; this audit never adds them to production navigation.

## Review boundary

Review this inventory and [the evidence register](evidence.md) in the KAR-137 PR. KAR-138 separately audits token/component/state/tool contracts. KAR-127 stays awaiting review until both child PRs are accepted and merged. **KAR-128 and all later M01.5 groups remain Backlog until the owner reviews this group's PRs and explicitly advances it.**
