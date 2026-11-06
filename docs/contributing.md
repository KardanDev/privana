# Contributing to Privana

Use [Linear's roadmap](planning/linear-index.md) for scope and acceptance criteria. Only M1 is currently authorized for implementation. Later issues remain planned work. Keep existing records, secrets and working domain boundaries intact.

## Toolchain and clean setup

Run commands from the repository root unless a command explicitly selects a package. Use Bun **1.3.14**, declared in `package.json`, and Node **24.22.1**, pinned in `.node-version`. The quality workflow uses the same versions. Commit intentional dependency changes together with `bun.lock`.

```sh
git clone https://github.com/KardanDev/privana.git
cd privana
bun install --frozen-lockfile
```

Installation runs the existing Varlock type-generation postinstall. It does not provision a service, migrate a database or seed records. A frozen install fails when the manifest and lockfile disagree; investigate that difference instead of removing the lockfile.

Copy [apps/web/.env.example](../apps/web/.env.example) to `apps/web/.env` **only when the destination does not exist**. Keep an existing file and update only the settings you intend to change. All example service values are placeholders; the example intentionally leaves `BETTER_AUTH_SECRET` empty.

Generate a fresh secret locally, then save it in the ignored `.env` file:

```sh
bun -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('hex'))"
```

| Setting | Local development contract |
| --- | --- |
| `DATABASE_URL` | A dedicated development **Prisma Postgres cloud direct TCP** URL from Prisma Console, retaining its supplied credentials and TLS parameters. An HTTP/Accelerate URL is not interchangeable with the current adapter. |
| `BETTER_AUTH_SECRET` | Independently generated secret of at least 32 characters; keep stable across instances of the same environment. |
| `BETTER_AUTH_URL` | Exact origin `http://localhost:3001` for normal local development. |
| `EMAIL_DELIVERY_MODE` | `preview` writes local verification/reset HTML; `resend` uses the official SDK and requires a verified sender and key. |
| `RESEND_API_KEY`, `EMAIL_FROM` | Leave empty in local preview mode; configure both for deliberate SDK delivery checks. |
| `UPSTASH_BLOB_TOKEN` | Token for a dedicated private development bucket. Media operations report unavailable when it is absent. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Configure both for shared Upstash limits. Both empty uses the existing database fallback; a partial pair fails validation. |

The schemas in `apps/web/.env.schema` and `packages/db/.env.schema` define the environment contract. The DB schema imports the app's database settings. Bun's automatic `.env` loading is disabled in `bunfig.toml`; use the project commands and Next.js/Varlock integration. Turbo forwards the declared service variables and hashes the relevant `.env` files; it does not load their values itself.

```sh
bun run env:generate
bun run db:generate
```

These commands generate types and the Prisma client without applying migrations or querying cloud records. A fresh runtime still needs a reachable, initialized development database. A maintainer should review and deliberately apply versioned migrations to a dedicated empty database following [the deployment contract](deployment.md). Existing databases need schema/history inspection before any migration action. `db:push`, resets and the historical baseline-repair SQL are not clean-setup steps.

```sh
bun run dev:web
```

Open `http://localhost:3001`. No data is created automatically. Empty data shows empty states; invalid database credentials remain a real connection failure. For local email preview, open the newest HTML in `apps/web/.local-mail/`. Those files contain expiring authentication links and remain ignored.

## Command matrix

| Root command | Purpose | Service/data effects |
| --- | --- | --- |
| `bun install --frozen-lockfile` | Install locked dependencies; run environment type generation | Package registry/cache access; no database migration or seed. |
| `bun run env:generate` | Regenerate Varlock types | Generated local files only. |
| `bun run db:generate` | Generate Prisma client | Generated local files; configuration validation, no database writes. |
| `bun run check` | Ultracite formatting/lint check | Read-only source checks. |
| `bun run check-types` | Check workspace types | DB/auth/API declaration outputs and web incremental metadata. |
| `bun run check-types:scripts` | Check maintenance-script types | Type checking only; does not execute those scripts. |
| `bun run test` | Deterministic unit/contract fixtures | No live-service acceptance claim. See [testing boundaries](testing.md). |
| `bun run build` | Compile packages and Next.js | Local build/cache output; no migration or seed. |
| `bun run dev:web` | Run the app on port 3001 | Real configured services are used when a user performs actions. |
| `bun run --cwd apps/web start` | Serve an existing production build | Uses its resolved production configuration; not a substitute for rebuilding with the intended settings. |
| `bun run db:inspect` | Inspect database schema/checks/triggers | Deliberate read-only cloud connection. |
| `bun run db:migrate:deploy` | Apply reviewed versioned migrations | **Writes to the configured database**; operator-controlled, outside build/CI. |
| `bun run db:seed:demo` | Create/update development fixtures | **Writes demo data**; requires `ALLOW_DEMO_SEED=1`, never production or routine setup. |
| `bun run test:smoke` | Run the seeded local HTTP journeys | Opt-in login, message/post/comment and CMS changes in the configured development database. |

Run the quality commands before requesting review, after generation. `bun run fix` formats/lints files and can change source; inspect the resulting diff. Follow the focused browser and service commands in [testing.md](testing.md), including their explicit opt-ins and side effects. An anonymous checkout browser check is not proof of authenticated creator, email, storage or payment readiness.

## CI and build artifacts

[The quality workflow](../.github/workflows/quality.yml) runs installation, generation, lint, workspace/script types, deterministic tests and a production compilation. It uses a deliberately unreachable loopback database and nonsecret build-only authentication values. It receives no real service keys and runs no migrations, seeds or external email/storage checks.

Varlock resolves server configuration into build output. The synthetic CI build and its `.next`, Turbo cache and resolved environment artifacts are disposable. Do not publish, promote or reuse that output as a deployment or upload it as a distributable artifact. Release builds must be recreated in the intended isolated environment with its approved configuration. A green compilation proves compilation, not cloud connectivity, inbox receipt or a complete end-to-end journey.

Turbo's `check-types` default caches `dist/**` because DB/auth/API use `tsc -b` to emit declarations and their build metadata there. The UI override emits no files. The web override caches only `tsconfig.tsbuildinfo`; dependency declaration tasks complete first. Keep those declarations aligned if a package's compiler command changes.

## Changes and review

Create a branch using the actual Linear issue, keep functions/components focused in domain files, and use direct UI imports. Preserve the shared authorization, notification and ledger contracts rather than adding parallel implementations. Include additive migration/recovery details with any data change.

The PR must link its issue, describe observable behavior and show meaningful validation. Attach relevant desktop/mobile evidence for UI changes, including failure recovery. Reviewers assess permission boundaries, concurrency and data preservation as well as appearance. Resolve findings and rerun affected checks before changing issue state. Required checks, human review, merge and deployment are distinct gates; an agent does not independently approve its own PR.

Keep secrets, owner claim links, demo passwords, browser auth state, private media and identity evidence out of source, logs and review artifacts. The optional demo seed writes credentials to ignored local files; preserve their existing passwords when reseeding. Service checks and mutations always target a named, approved environment, as described in [testing.md](testing.md) and [deployment.md](deployment.md).
