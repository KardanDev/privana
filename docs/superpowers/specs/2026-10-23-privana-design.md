# Privana product design

## Intent and decisions

Build a Brazil-first creator membership marketplace on the supplied Better-T-Stack starter. The owner requested a refined royal-purple interface, email/password accounts, email-based account features, persistent product data, a super-admin workspace, modular code, and straightforward Vercel deployment.

The owner explicitly chose: **Keep the creator marketplace and proceed with your judgment; defer live payments.** This authorizes implementation without additional design approval rounds.

## Approach

Retain Next.js App Router, React, oRPC, Better Auth, Prisma/PostgreSQL, Bun, Turborepo, shadcn/Base UI, evlog, and Ultracite. Build a modular monolith with domain folders and one named function or component per implementation file. This is easier to deploy and operate now while preserving separable domain boundaries. A services-first rebuild would add operational cost without helping this initial product. The original Polar-first alternative is incompatible with the intended marketplace.

Use pt-BR, BRL prices stored as integer centavos, UTC timestamps, and America/Sao_Paulo display conventions. All records live in PostgreSQL; media bytes belong in private object storage. Server authorization decides content access before serializing responses. Do not return premium bodies or private media locations to unauthorized clients.

## Experience

- An editorial, responsive discovery experience: warm neutral backgrounds, ink typography, royal-purple primary actions, lavender details, large creator photography, restrained shadows, generous whitespace, desktop sidebar and mobile navigation.
- Discover creators by search and category; view creator profiles and public previews; follow creators; save and like posts; read and add comments.
- A personalized feed, saved library, notifications, and private conversations with persisted history.
- Creator studio for profile/onboarding, price display, public/subscriber posts, drafts, publishing, media, and real activity metrics.
- Email/password registration and login, verification, forgotten/reset password, and account settings. Auth must function independently of Polar.
- Owner administration for creator approval/suspension, user suspension, content reports, and audit history. Owner authority is granted through a deliberate server-side bootstrap, never a signup field or a first-user rule.
- A membership interest action while checkout is unavailable. Do not simulate successful payments, earnings, or active paid memberships.

## Data and authorization

Persist users/preferences, creator profiles, posts/media, follows, reactions, bookmarks, comments, membership interests, subscription/access records, conversations/messages, notifications, reports, and admin audit events. Keep relational integrity, relevant indexes, bounded pagination, author checks and participant checks. Preserve moderation history rather than silently discarding it. Admin data is protected on the server. Suspension blocks mutations and hidden creators/posts are excluded from public reads.

Sample content, if provided, is explicitly labeled demonstration data and seeded only with an explicit development command. Real errors must not silently fall back to demo data. Private media uses an authorized delivery endpoint and cannot be exposed through public URLs. File types and sizes are validated. No sensitive content, auth tokens, or passwords in logs.

## Integrations and limits

Polar is retained as an optional future integration boundary, with live creator checkout disabled. Its policy checked October 23, 2026 prohibits marketplaces/revenue sharing and OnlyFans-related services; Brazil is not listed for seller payouts. Sources: https://polar.sh/legal/acceptable-use-policy and https://polar.sh/docs/merchant-of-record/supported-countries . A token alone does not resolve these restrictions.

Transactional email uses Resend with explicit environment configuration and useful setup failures. Development may use a clearly configured local preview transport; production may not silently discard mail. Storage is configured separately from the application. Missing optional integrations must not crash public pages/builds, and integration-dependent actions explain what is unavailable.

Live payments/payouts, identity verification by a provider, video transcoding, live streams, and deployment to a real Vercel account are outside this first implementation. They must be clearly identified in launch documentation; the general product and its workflows should work locally with configured database/email/storage.

## Validation

Meaningful tests focus on authorization, premium-content redaction, suspension, conversation membership, validation, and email behavior. Run Prisma validation/generation, TypeScript, Ultracite, production build, and browser checks at desktop and mobile sizes. Preserve existing user changes to skill configuration. The generated starter currently reports 354 Ultracite errors; resolve applicable starter issues as part of the product work.
