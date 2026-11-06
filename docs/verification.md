# Current integration status

November 6 continuation: domain-owned optimistic mutations now cover social actions, messaging, notification reads, settings, creator edits/archives and pending operations feedback. See [optimistic-updates.md](optimistic-updates.md) for immediate/confirmed behavior, rollback boundaries and browser failure tests. The complete 18-account HTTP run passed login/permissions, member flows, creator flows and CMS revision/conflict checks. Private Upstash stored-signature validation, 16-byte range reads (206), and invalid-range rejection (416) also passed against the configured bucket.

## Running the product

Run `bun run dev:web` and open `http://localhost:3001`. The configured database is Prisma Postgres in the cloud. All 18 demonstration accounts are in `apps/web/.local-demo-credentials.json`; its status is `ready`. A readable handoff also lives in `apps/web/.local-demo-credentials.json.md`. Both files are ignored by Git. The accounts include a customer, 12 approved creators/models, one pending creator, superadmin, editor, moderator and analyst.

The expanded seed completed on November 4, 2026, preserving existing passwords. The read-only verifier confirmed all 18 password hashes, roles, active states and verified-email flags. Counts were 13 creator profiles, 159 posts, 62 comments, 98 messages, 14 notifications and one report. The post count includes browser/smoke fixtures; later checks can add labeled messages, comments and archived posts. Histories are committed in bounded per-creator batches to fit cloud transaction limits and can be resumed idempotently. No simulated payment records or paid subscriptions were created.

## Reproducible checks

```powershell
bun run check
bun run check-types
bun run test
bun run build
bunx tsc -p packages/api/tsconfig.scripts.json --pretty false
bunx tsc -p packages/db/tsconfig.seed.json --pretty false
bunx tsc -p packages/auth/tsconfig.scripts.json --pretty false
```

With the local server running and the seed complete:

```powershell
$env:ALLOW_DEMO_SMOKE = '1'
bun run test:smoke
Remove-Item Env:ALLOW_DEMO_SMOKE
```

The HTTP smoke command connects only to localhost:3001, reads the ignored credential manifest, checks every account's login and role permissions, and exercises member, creator and CMS flows. It respects authentication throttling and can take several minutes. It adds a labeled demo message and an archived test publication/comment; it saves and publishes the unchanged CMS config to exercise revision history. It refuses to publish when the CMS has pending draft changes. Run it deliberately against a development setup, never as part of a deployment.

The first live HTTP pass verified all ten logins, CMS/finance/moderation authorization boundaries, feed and premium locks, likes, bookmarks, persistent messages and CMS save/version conflict/publication/revision history. The Varlock getter-only ENV proxy was the cause of the login configuration failure: spreading it lost all authentication settings. Explicit reads and a regression test now protect that boundary.

Prisma `migrate diff` reported no schema differences before baselining. The additive checks and immutable-record triggers were reconciled separately using `scripts/sql/reconcile-platform-guards.sql`; `migrate deploy` now reports no pending migrations. That recovery SQL is for the previously pushed database only and should not be rerun or added to normal startup/build commands.

## UI and payment demo

The product uses self-hosted Google DM Sans for body text and Manrope for headings via Next.js font optimization. The mobile account menu exposes saved posts, memberships, settings, staff operations and sign-out. Desktop account actions sit in the sidebar. Duplicate topbar headings/footer content and the extra discovery search were removed. Dark-mode brand colors now inherit through CSS tokens correctly.

`/checkout/demo` provides card approval/refusal and Pix illustration flows in BRL, plus illustrative card prices in USD/EUR. Six automated flow tests verify allowed test data and that no outcome charges or grants access. See `payment-demo.md`. Card and Pix approvals also passed in the browser. The mobile studio now has readable post rows, compact metrics, draft/archive filters and a visible sync notice. The technical upload fixture was archived after its private-storage and access checks; its bytes remain available to authorized operators for repeatable storage verification.

## Email delivery

```powershell
bun run --cwd packages/auth email:check
```

This command calls the production email transport using the official Resend SDK and the documented `delivered@resend.dev` test recipient. It sends no credentials or access links. It reports provider acceptance and, when the API key permits reading emails, the latest delivery event. A sending-only key is valid for application delivery but cannot inspect domains/delivery records.

The updated sender settings were accepted on November 4. The standalone transport check returned a Resend email ID. The complete application check passed through the actual Better Auth handler and SDK callbacks: temporary `delivered+…@resend.dev` registration, verification email, confirmation link/database flag, reset email/callback, password change, old-password rejection (401), login with the new password/session cookie and reused-token rejection (400). The exact simulator account was removed afterward. The key is sending-only, so status reads report `restricted_api_key`; this does not prevent application email delivery. The requested Resend MCP URL is configured, but no Resend MCP tools were exposed during these checks.

This live check exposed Prisma's default five-second transaction limit during cloud signup. The shared client now uses bounded transaction options (`maxWait: 10s`, `timeout: 20s`); the complete check passed after this fix. The auth-check scripts also pass their dedicated TypeScript configuration.

To exercise the complete registration/reset/login path using the safe simulator:

```powershell
$env:ALLOW_EMAIL_CHECK = '1'
bun run --cwd packages/auth email:check-auth
Remove-Item Env:ALLOW_EMAIL_CHECK
```

This sends two emails to Resend's test recipient and creates/removes one temporary account. It does not print passwords, auth links or cookies. Provider acceptance does not establish human inbox receipt.

## Remaining service integration

Live payment processing and payouts remain intentionally deferred. Upstash Redis in São Paulo now backs atomic shared authentication limits. A live concurrency check sent 20 requests against a limit of five: exactly five were allowed and 15 denied; the test key expired correctly and was removed. A private Upstash Blob bucket is configured; browser upload, stored media registration, authenticated image read and byte-range delivery succeeded. Vercel deployment, video-codec coverage, provider identity verification, payouts and human inbox receipt are separate from these local integration checks.
