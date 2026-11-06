# Verification boundaries

The [M01 stories](planning/linear-index.md) establish a repeatable baseline. They do not certify the later product milestones or production integrations. Current evidence is in [the M01 verification ledger](verification-m01.md); older service reports remain historical evidence.

## Deterministic checks

After a frozen dependency install and environment/Prisma generation, run from the repository root:

```sh
bun run check
bun run check-types
bun run check-types:scripts
bun run test
bun run build
```

The unit command explicitly includes API/auth/DB/web tests and the browser-target guard tests. It does not execute Playwright scenarios. Fixtures exercise authorization, media serialization and HTTP boundaries, concurrent/idempotent writes, optimistic rollback, CMS conflicts, seed preservation, email transport and rate limits with injected or mocked dependencies. Environment-promotion tests use synthetic in-memory values and cannot invoke a real Vercel mutation.

Compilation uses the current application's configured environment locally. CI instead injects nonsecret synthetic settings and an unreachable database. It never migrates, seeds, sends email, uploads media or deploys. Varlock resolves configuration into build output: synthetic CI artifacts are disposable and must never be promoted to a real environment. A green build is not proof of a working cloud service.

## Anonymous browser smoke

Install the pinned runner through `bun install --frozen-lockfile`, then install its matching browser:

```sh
bunx --no-install playwright install chromium
```

Start the app separately against reviewed development/test resources. Every normal page reads published CMS configuration on the server, so a reachable Prisma Postgres database is still required. This is an opt-in runtime check, not a database-free CI test. The runner does not start a server, create accounts or seed data.

PowerShell example:

```powershell
$env:ALLOW_BROWSER_SMOKE='1'
$env:BROWSER_SMOKE_ORIGIN='http://127.0.0.1:3001'
bun run test:browser
```

POSIX equivalent:

```sh
ALLOW_BROWSER_SMOKE=1 BROWSER_SMOKE_ORIGIN=http://127.0.0.1:3001 bun run test:browser
```

The target must be an explicit loopback origin with a port, no credentials/path/query, and the runner must not be configured for production. Confirm the local server uses development/test resources. Target validation cannot identify which database a server is configured to use. A read-only readiness request must receive HTTP 200 before UI scenarios start; these exercise a ready runtime, not cold-start latency. Cold-start performance remains part of M08's measured readiness work.

Fifteen Chromium scenarios cover five checkout behaviors at desktop, tablet and mobile widths: invalid-field focus and test approval, decline/retry, non-payable Pix, currency/Pix restrictions, and Pix expiry/regeneration. Approval/reload assertions demonstrate the current browser-only demo does not persist an entitlement. They do not exercise M04's future server-driven sandbox commerce.

Each scenario starts anonymously. The fixture blocks external requests and unapproved API calls; only exact session/viewer/published-platform reads are allowed. It permits POST for the two read-only oRPC query paths, not arbitrary mutations. Service workers are disabled. Failure screenshots/traces are stored under ignored `output/playwright/`; keep them private and remove them after review. Do not add authenticated traces or saved session state to public PR artifacts.

This smoke does not prove authenticated fan/creator/staff access, email receipt, uploads, ledger processing, real payments or all accessibility requirements. The broader isolated journey/device/authorization matrix belongs to M08.

## Deliberate service checks

| Check | Command / opt-in | Effects and limits |
| --- | --- | --- |
| Database inspection | `bun run db:inspect` | Read-only Prisma schema/guard inspection; uses the configured cloud connection. |
| Seeded HTTP journeys | `ALLOW_DEMO_SMOKE=1 bun run test:smoke` | Logs into the ignored demo manifest and changes demo posts/comments/messages/CMS. Review the development target and pending editorial state first. Never routine PR CI or a production probe. |
| Resend transport | `bun run --cwd packages/auth email:check` | Calls the official SDK's delivery simulator. Provider acceptance/event visibility is not proof of human inbox receipt. |
| Auth email journey | `bun run --cwd packages/auth email:check-auth` | Deliberately creates a synthetic account, sends verification/reset simulator messages and exercises auth state transitions. Review script/configuration and target first. |
| Stored media | `ALLOW_MEDIA_CHECK=1` with `apps/web/scripts/check-media-storage.ts <postId>` under the app's Varlock environment | Reads an existing authorized media record and storage bytes/ranges; requires explicit post ID, DB and private Blob credentials. It does not upload or seed media. |
| Demo seed | `ALLOW_DEMO_SEED=1 bun run db:seed:demo` | Writes fixtures and a private credential manifest. Inspect the named target first; preserve existing records/passwords. Never run automatically on install/build. |

The environment variable prefixes above use POSIX notation; set the equivalent `$env:NAME` in PowerShell. Use the existing project/Varlock entrypoints so Bun's disabled automatic dotenv loading does not silently select another environment. No service check is part of the ordinary deterministic gate.

Before executing a mutating check, identify its resource target and permitted synthetic records. Capture safe identifiers/counts and redacted failures, not passwords, reset links, signed media URLs or provider payloads. Do not treat an opt-in flag as proof that a database is nonproduction.
