# Deployment and data safety

This is the M1 deployment contract. It documents the existing build and the decisions required to operate it; it does not claim that Vercel environments, service isolation, backups or a production release have been verified. The current checkout remains a demonstration and grants no paid access. Later synthetic commerce and real-provider work follow separate [roadmap gates](planning/roadmap.md).

## Existing Vercel build

The root [vercel.json](../vercel.json) retains the existing Vercel Services configuration:

| Field | Contract |
| --- | --- |
| Service | `web`, rooted at `apps/web`, framework `nextjs`. |
| Install | `cd ../.. && bun install --frozen-lockfile`; installs the committed workspace lockfile and generates environment types through postinstall. |
| Build | `cd ../.. && bun run db:generate && cd apps/web && bun run build`; generates Prisma, compiles API declarations and builds Next.js. |
| Ingress | The top-level catch-all rewrite routes to `web`; Next.js owns the pages and API handlers. |
| Toolchain | Bun 1.3.14 and Node 24.x; `.node-version` pins local/CI Node 24.22.1. Confirm the hosted runtime and Bun version in the project settings/build log. |

Vercel's [Services configuration reference](https://vercel.com/docs/services/config-reference) assigns `root`, `installCommand`, `buildCommand` and framework settings to the individual service; public ingress stays at the top level. This repository preserves that existing Services deployment model. Services is currently Beta. Do not move service fields to the top level or switch project-root conventions as an incidental setup change.

Project linking, provider provisioning and deployment are deliberate operator actions. Review the selected Vercel team/project and target environment before running `deploy:setup`, `deploy`, `deploy:prod` or environment-promotion commands. The source configuration alone cannot prove those external settings are correct. The current build performs no migration, seed, financial action or owner bootstrap.

## Environment isolation

Assign an accountable operator and retain resource identifiers in private operational records. Sharing production resources with a local app or a PR preview is not isolation.

| Resource | Local development | Preview / staging | Production |
| --- | --- | --- | --- |
| Vercel/origin | Localhost port 3001 | Approved nonproduction project/environment and exact HTTPS preview origin | Approved production project/domain; controlled promotion |
| Prisma Postgres | Dedicated development cloud database, direct TCP URL | Separate nonproduction database/branch; PR-specific isolation or serialized trusted staging changes | Production database with controlled migration credentials and recovery ownership |
| Upstash Blob | Private development bucket | Separate private test bucket; isolated fixture lifecycle | Private production bucket; production references and retention policy |
| Upstash Redis | Dedicated development instance | Separate preview/staging instance; PR isolation or controlled namespace policy | Dedicated production instance; independent credentials and capacity |
| Resend | Local preview HTML, or deliberate simulator SDK checks | Separate restricted test credentials/sender and approved recipients | Approved verified sender/key and observed delivery handling |
| Auth | Random development-only secret and exact local origin | Independent secret and exact approved preview origin | Independent stable production secret and exact production origin |
| Data/fixtures | Optional opt-in demo seed | Synthetic fixtures in named test resources | No demo seed, simulated verification or scenario-control endpoints |

A preview usually runs a production Next.js build, so local `EMAIL_DELIVERY_MODE=preview` is not a hosted email strategy: production runtime rejects it. Hosted preview/production require the approved `resend` settings. Keep preview recipients controlled by the agreed testing policy; a separate key alone does not prevent unintended email delivery.

Prisma uses the provider's direct TCP connection and TLS parameters. Upstash Blob must remain private. Configure Redis URL and token together. The three Upstash variables are declared in Turbo so strict environment filtering does not discard them. Ordinary startup can report unavailable media and use the existing database rate-limit fallback when optional settings are entirely absent; release acceptance must verify the intended live integrations instead of treating fallbacks as proof of readiness.

Set `BETTER_AUTH_URL` to the exact HTTPS origin for hosted targets, or verify the existing Varlock derivation from `VERCEL_ENV`, `VERCEL_URL` and `VERCEL_PROJECT_PRODUCTION_URL` for that deployment. Do not use a wildcard trusted origin. OAuth, custom multi-origin or cross-domain behavior is not introduced by this contract.

## Configuration and secrets

Use [the environment-promotion procedure](environment-promotion.md) to review explicit targets and allowlisted settings. Start with its dry run; its logs should identify names/actions without printing values. Hosted credentials are server-only. `CLAIM_URL`, deployment metadata, local preview paths and derived auth origin are not ordinary service values to promote.

Keep service secrets in the approved environment/secret manager. `.env` files are ignored and must not enter Git, CI artifacts or public client variables. Changing runtime settings does not prove an already compiled artifact uses them: Varlock resolves server configuration at build time. Rebuild for the intended target whenever its resolved configuration changes.

The secretless quality workflow intentionally compiles against synthetic settings. Its build, `.next`/Turbo caches and resolved Varlock artifacts are disposable and must never be deployed or promoted. A release is a new target-specific build of the reviewed commit, not a reused CI artifact. Build success is not evidence of a working database, email inbox, private upload or payment processor.

## Migration contract

Migration execution is separate from install/build and requires a named operator, a reviewed change and a verified target. `bun run db:migrate:deploy` applies the committed migrations to the configured database; it is a write operation. No routine deployment step runs `db:push`, `migrate reset`, demo seed or owner bootstrap.

1. **Inspect the target.** Record environment, provider database identifier, current schema/migration history and application commit without logging credentials. Check for unexpected drift or pending migrations. Use read-only `db:inspect` deliberately; it is not an automatic connection test during install.
2. **Plan preservation.** Prefer additive schema changes and resumable bounded backfills. Define foreign-key, unique/check and immutable-record invariants; measure locking/time/size impact on representative nonproduction data. Keep the preceding application version compatible during the transition.
3. **Prepare recovery.** Confirm a usable provider backup/restore route, responsible operator and isolation destination before changing important data. An existing backup configuration is not proof of a successful restore. Record expected rollback limitations and data loss/recovery objectives.
4. **Validate in isolation.** Apply the exact reviewed migration and backfill against a separate test environment, verify row/reference preservation and relevant negative authorization/concurrency tests, and record results.
5. **Apply once under control.** After approval for the named environment, run the committed migration with scoped credentials and observe its result. Avoid simultaneous operators. A failure requires inspection/recovery; do not rerun blindly or mark it resolved merely to hide an error.
6. **Verify and release.** Check migration history/invariants, then exercise the target-specific app build and affected routes. Promote only the compatible tested commit. Retain safe evidence, backfill progress and outstanding operational work in the issue/PR.

For a genuinely empty development database, a maintainer can apply the versioned migrations after verifying the destination. For the existing cloud database, inspect its actual history and data first. The historical `scripts/sql/reconcile-platform-guards.sql` repaired a previously pushed database; it is not a general migration, install or deploy step. Never repeat that SQL or invent baseline resolution commands without a specific reviewed drift/recovery plan.

`PlatformRevision` and `TransactionRecord` currently have database immutability guards. Preserve those protections through migrations and backfills. Existing `AuditEvent` does not yet have the equivalent guard; the roadmap tracks it separately. Do not describe all historical audit storage as immutable because financial/revision guards exist.

## Promotion, rollback and incident recovery

Release approval identifies the reviewed commit, required checks, migration compatibility, target resources, responsible responder and stop conditions. The quality check and PR review are prerequisites, not authorization to charge money or invite unrestricted external creators.

Vercel's [promotion guidance](https://vercel.com/docs/deployments/promoting-a-deployment) distinguishes a staged production deployment from a preview. Test the build made with the intended production configuration before assigning traffic. Promoting a preview can require a production rebuild, so preview evidence alone does not validate that rebuilt output. Keep the previous compatible deployment reference and the recovery decision recorded.

An application rollback does not roll back database writes, Blob objects, emails or external provider effects. Prefer a compatible code rollback or an additive corrective migration/backfill. Do not delete financial history or rewrite settled records to make balances appear correct. If an isolated restore is necessary, reconcile records and media references and assess later writes before replacing live data.

During an incident, record the start, impact, correlation evidence, containment and recovery owner. Restrict the affected operation deliberately, preserve required data/evidence, and verify recovery through the affected user path. Backup restoration, alerts, incident drills and actual preview/production isolation remain later operational-readiness deliverables until their evidence is attached. M1 documents this contract and checks the build configuration without performing a cloud deployment.
