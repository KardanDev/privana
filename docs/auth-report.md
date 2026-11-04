# Accounts and transactional email

Implemented Portuguese `/login`, `/register`, `/forgot-password`, `/reset-password`, and `/verify-email` pages. Forms use accessible native labels, fieldsets, autocomplete, pending states, error alerts, and explicit success messages. Sign-in goes to `/feed`; reset and verification callbacks are constructed from the current app origin, never from user redirect query parameters. Reset pages use a no-referrer policy.

Better Auth remains pinned to 1.7.10. Its MCP version index identifies current documentation as 1.7; explicit `v1.7` and `1.7` searches returned no entries, so the index's current documentation was retrieved and checked against installed source/types. References: https://better-auth.com/docs/authentication/email-password and https://resend.com/docs/api-reference/emails/send-email .

Authentication has no Polar startup, customer-creation, or checkout dependency. The payment boundary explicitly remains disabled. Email verification is required in every environment. Passwords require 12–128 characters; password reset tokens last 30 minutes; reset revokes sessions transactionally through the Prisma adapter. Verification links last one hour. Upstash Redis supplies atomic shared rate limits when configured, with stricter login, registration, reset and resend limits. Keys use an HMAC rather than raw IP addresses and expire automatically; sessions and permissions remain in Prisma. Database rate limiting remains the unconfigured-development fallback. Trusted origins contain only the configured app URL; secure cookies are enabled in production. User role, status, locale and email notification defaults cannot be supplied via signup or user updates. Suspended accounts cannot create new sessions; application authorization must continue rejecting suspended existing sessions.

## Email configuration

Set `BETTER_AUTH_URL` to the exact public origin and `BETTER_AUTH_SECRET` to a strong secret of at least 32 characters. Auth receives these values through the existing ENV service configuration. Public pages and builds do not initialize a Resend client or require its credentials.

For local email, explicitly set `EMAIL_DELIVERY_MODE=preview`. The supported workspace development commands start the web service in `apps/web`, where it writes private HTML files to `.local-mail/`. This folder is gitignored. Open the newest HTML file locally to use verification/reset links; treat files as credentials and delete them after local testing. Tokens are never printed in application logs. Production rejects preview mode.

For real delivery, including development, set `EMAIL_DELIVERY_MODE=resend`, `RESEND_API_KEY`, and `EMAIL_FROM` (for example, `Privana <conta@your-verified-domain>`). An explicit `preview` mode continues writing local HTML even if Resend credentials are present. Verify the exact sending domain in Resend, publish its DKIM/SPF records, and configure DMARC. The default `onboarding@resend.dev` sender has sandbox recipient restrictions; a verified production domain is needed for general delivery.

The server uses the official `resend` Node.js SDK, instantiated only for an actual Resend send. An injectable provider factory keeps transport tests local. It awaits `emails.send`, explicitly checks the SDK's returned `error`, and requires a response email ID before accepting success. The ten-second abort signal and deterministic payload-based idempotency key cover request timeout and duplicate retries. Changing the sender changes the key too. Invalid API keys, unverified/restricted senders, quotas, connection errors and invalid payloads produce sanitized Portuguese HTTP 503 messages. Application error construction discards arbitrary provider messages, and the transport adds no credential, payload or auth-link logging. A provider-accepted ID is not proof that the recipient inbox received the email; delivery events must be checked separately. There is no automatic retry queue.

Auth templates continue reading the current published brand from the database when a verification/reset message is created. Draft brand changes do not affect sent mail. Missing Resend configuration remains actionable without preventing public-page builds.

Official references: [Node.js SDK](https://resend.com/docs/send-with-nodejs), [sending and idempotency](https://resend.com/docs/api-reference/emails/send-email), and [Resend MCP server](https://resend.com/docs/mcp-server). The requested remote MCP endpoint is `https://mcp.resend.com/mcp` and requires the operator's OAuth connection. MCP is an agent operations connection; the application sends account emails through its SDK/API key. No Resend MCP tools were exposed during the November 4 checks, so live verification used the official SDK. Test messages went only to Resend's documented simulator, not to human recipients.

Templates include Portuguese HTML and plain text, escaped dynamic names/URLs, HTTPS links (localhost HTTP allowed in development), a prominent royal-purple action, expiration copy and an ignore-if-unrequested explanation.

## Deliberate owner bootstrap

Create and verify the intended owner account first. Run from the repository root; the wrapper loads the app environment through Varlock:

```sh
bun run owner:bootstrap owner@example.com
```

This command is manual and was **not** run. It requires an existing verified ACTIVE account, atomically changes the server role to `admin`, and records `owner.bootstrap` in the audit table. Existing admins produce an idempotent no-op. No signup option, first-user rule or public endpoint grants owner rights. Keep database credentials restricted to operators.

## Verification

`bun test packages/auth/tests` covers template injection, unsafe link protocols, production transport constraints with zero network activity, provider failure propagation, deterministic idempotency, and owner eligibility. It also executes the actual SDK against a mocked network boundary and checks the official endpoint, SDK user agent, authentication header, payload, and abort signal. Returned SDK errors and missing acceptance IDs cannot silently succeed; arbitrary provider/request messages are not copied into public errors.

On November 4, 2026, `resend` **6.34.1** accepted the SDK transport test after the operator updated the sender settings. The complete application-level check passed: registration, verification email acceptance, verification link/database flag, reset email acceptance, reset callback, password change, old-password rejection (401), login with the replacement password/session cookie and reused reset-token rejection (400). These calls exercise the same Better Auth configuration and SDK callbacks used by the web application.

The live check first exposed Prisma's default five-second transaction limit during cloud signup. The shared client now uses a ten-second acquisition limit and twenty-second transaction timeout. The full auth/email check passed after that correction; script-specific TypeScript and scoped Ultracite checks also pass.

Run the complete live check deliberately in development:

```powershell
$env:ALLOW_EMAIL_CHECK = '1'
bun run --cwd packages/auth email:check-auth
Remove-Item Env:ALLOW_EMAIL_CHECK
```

The script uses a unique `delivered+privana-…@resend.dev` recipient, holds random passwords and auth links only in memory, and removes only its exact temporary account afterward. It checks password reset, old-password rejection, login with the new password and one-time reset-token rejection. It creates no demo or customer messages. See [Resend's test-address guidance](https://resend.com/docs/knowledge-base/what-email-addresses-to-use-for-testing).

The current sending-only API key is sufficient for SDK delivery but cannot read email status or domain records (`restricted_api_key`). Provider acceptance and a working application link do not establish delivery to a human inbox. Check recipient delivery events separately in the Resend dashboard when testing a real address.
