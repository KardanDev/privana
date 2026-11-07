# KAR-143 — Route, role and action matrix

Source baseline `7c8feadd09c7dcf470de510c630d4ad44e9dd92c`, November 7, 2026. Read with [navigation](navigation.md). This maps existing authority; presentation changes cannot grant access.

## Account/profile states

| State | Community / member tasks | Studio | Platform operations |
| --- | --- | --- | --- |
| Anonymous / expired session | Public pages and demo; member URLs go through their current login guard | Login required | Login required, then staff guard |
| ACTIVE `member`, no creator profile | Fan, saved, memberships, notifications, settings; messaging when enabled | Application entry if enabled; no publication | No access |
| ACTIVE account, PENDING creator profile | Same fan access | Application status/profile update; no publish | Only if account separately has a permitted staff role |
| ACTIVE account, ACTIVE creator profile | Same fan access | Profile/current post lifecycle; publication subject to server policy | Creator status does not grant staff access |
| ACTIVE account, SUSPENDED creator profile | Fan access remains separate from the publishing restriction | Restriction notice; publication/profile editing follow existing server limits | Creator status does not grant staff access |
| SUSPENDED/DELETED account | Protected API authority is denied; old cached session/UI is not permission | No protected mutations | No protected access |
| ACTIVE `admin` | Fan use remains available | Depends on actual creator profile/capability, not staff title | All eight owner sections |
| ACTIVE `moderator` | Fan use remains available | Same separate profile rule | People, creators, reports; protected staff and self-action restrictions remain |
| ACTIVE `editor` | Fan use remains available | Same separate profile rule | CMS only |
| ACTIVE `analyst` | Fan use remains available | Same separate profile rule | Overview, subscriptions and transactions; actual command guards still apply |

Application availability, account status, profile status, email confirmation and age/identity assurance are separate. Unknown roles receive no extra navigation. Do not invent a `super_user` role: the current backend role `admin` is labeled Superadministrador for the owner.

## Complete route coverage

| Actual URL | Public / member boundary | Task and important guard/state |
| --- | --- | --- |
| `/` | Public | Current recent feed; target public introduction for anonymous visitors and recent feed for signed-in visitors. |
| `/explore` | Public | One creator search plus category filters; public visibility rules remain. |
| `/creators/[handle]` | Public visible profiles | Public/locked posts; signed-in follow/message/report/interest actions retain server checks. |
| `/feed` | Session guard | Following feed; API rechecks ACTIVE account and content access. |
| `/saved` | Session guard | Saved items retain current visibility/access; saving never unlocks a post. |
| `/memberships` | Session guard | Existing access records/status/expiry, with no invented renewal or provider refund action. |
| `/messages` | Session guard | Messaging flag and participant boundary; selected conversation query/history remain compatible. |
| `/notifications` | ACTIVE account guard | Read/unread operations and destination handling. |
| `/settings` | ACTIVE account guard | Account details/preferences; not the public creator profile. |
| `/login` | Public | Email/password; current success fallback `/feed`; safe intended return remains a known repair. |
| `/register` | Public, registration flag | Validation and email-verification guidance; no automatic creator approval. |
| `/forgot-password` | Public | Generic recovery response; do not reveal account existence. |
| `/reset-password` | Public, token-dependent | Missing/invalid/expired token and current reset form; no real token in prototype. |
| `/verify-email` | Public | Confirmation guidance/resend recovery; no claim of inbox receipt from a UI state alone. |
| `/studio` | ACTIVE account guard | Applicant/profile/publishing capability checked separately; all tabs remain on this route. |
| `/admin` | ACTIVE staff guard | Section/action roles below; no fan navigation inside the operations shell. |
| `/pages/[slug]` | Public published CMS pages | Missing/unpublished page remains unavailable; no invented support/policy destination. |
| `/checkout` | Public redirect | Compatibility redirect to `/checkout/demo`. |
| `/checkout/[handle]` | Public browser demo | Card/Pix examples, reference currencies, failures/expiry; no payment or entitlement. |
| `/success` | Redirect | `/memberships`, then its login guard if needed; reaching it proves no payment. |
| `/dashboard` | Redirect | `/studio`, then its own account/profile guards. |

## Owner sections on `/admin`

| Section ID | Label | Visible roles | Action distinction |
| --- | --- | --- | --- |
| `overview` | Visão geral | admin, analyst | Existing metrics; no invented earnings or trend. |
| `users` | Pessoas e equipe | admin, moderator | Team-role changes stay admin-only; protection/self rules apply. |
| `creators` | Criadores | admin, moderator | Publish approval/suspension is distinct from identity/age verification. |
| `reports` | Denúncias | admin, moderator | Only authorized, report-associated inspection; no general private inbox access. |
| `subscriptions` | Assinaturas | admin, analyst | Recorded access; inspect/revoke commands follow their actual server guard. |
| `transactions` | Transações | admin, analyst | Current read-only records; preserve source, status and currency. |
| `cms` | Conteúdo e marca | admin, editor | Draft/save/preview/publish/restore with expected version; no layout builder. |
| `audits` | Auditoria | admin | Existing recorded events; other roles do not gain an audit browser. |

Authority sources: [API procedures](../../../packages/api/src/index.ts), [active-account guard](../../../apps/web/src/shared/auth/require-member.ts), [feed session guard](../../../apps/web/src/domains/feed/require-member.ts), [staff guard](../../../apps/web/src/domains/admin/require-operator.ts), [section roles](../../../apps/web/src/domains/admin/operations-navigation.ts) and the [baseline inventory](../m015-baseline/inventory.md). The shared and feed page guards currently differ; API authority stays decisive. Resolving session consistency is M02 work, not a client-only redesign fix.
