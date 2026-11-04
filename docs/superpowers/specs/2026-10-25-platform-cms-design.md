# Privana social product and operations CMS

User requests a less generic OnlyFans/Fansly/Fanvue-like interface and a super-admin CMS for the owner and team, covering branding, content, users, subscriptions, transactions and analytics. Prisma cloud remains the database. Payment processing remains deferred while compatible multi-currency providers are researched.

## Approach

Keep the existing modular Next/oRPC/Prisma application. Replace the marketing-led discovery layout with a social product: compact navigation, central streams, creator suggestions, explicit public/following tabs and restrained purple accents. Avoid decorative marketing hero, serif slogans, fake activity or invented revenue. Creator media and actual posts provide the visual focus.

Use a structured, typed CMS in the existing admin rather than an external service or executable page builder. This keeps deployment simple and allows safe validation, draft previews, atomic publication, revision restore and audits. The user's earlier instruction to proceed using judgment applies; implementation choices below are the builder's choices, not claimed user approvals.

## CMS

Singleton platform document has draft and published JSON, revision number and publisher timestamps. Settings cover brand name/tagline/logo/color, discovery heading/copy/categories/featured handles, announcement, navigation labels, support/footer, public information pages, auth welcome copy and registration/creator-application/messaging switches. No arbitrary HTML, CSS, JS, payment keys or executable templates. Text is rendered normally. URLs and colors are validated. Draft save/publish uses expected revision; stale saves fail with a conflict. Every change is audited. Previous published revisions can be restored to a draft, then deliberately published.

Public config contains only publishable settings and renders throughout shell, discovery, auth, footer and information pages. Defaults keep first installation usable without seeding. Missing database rows use defaults; database outages remain visible in data-driven views.

## Operations

Existing admin role is the super-admin. Add editor, moderator and analyst roles without granting payment or owner powers. Server reads current role/status on every protected operation. Admin can change existing verified team accounts, cannot demote themself or suspend privileged users via a moderator endpoint. Editors manage CMS, moderators manage reports/ordinary accounts/creators, analysts see aggregate and finance data. Existing owner-bootstrap remains the deliberate initial setup.

Separate admin sections: overview/analytics, users/team, creators, reports, subscriptions, transactions, CMS, audit. Bounded server filters and pagination. Subscription access may be revoked with reason and audit; this is explicitly a local access action, not a processor cancellation/refund. Transaction ledger is read-only until an approved provider integration records verified events. Store amounts as integer minor units plus ISO currency; never combine currency totals without exchange rates. Analytics use actual database totals and daily series, including truthful zero states.

## Verification

Test draft/public separation, concurrency conflicts, role gates, stale session demotion, URL injection, feature flags at backend boundaries and currency-separated analytics. Re-run authorization/media suites, typechecks, lint and build. Inspect desktop/mobile and editor/admin flows against working Prisma cloud credentials. Do not seed fake commerce or claim live provider integration.
