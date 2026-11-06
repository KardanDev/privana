# Environment promotion

The sync CLI promotes only a reviewed allowlist of application inputs. It does not infer deployment permission from a key appearing in `.env.schema`. Follow [environment isolation and deployment](deployment.md) before selecting any source file or Vercel target.

Start with an explicit target and a redacted dry run:

```sh
bun run env:preview config/.env.preview --dry-run
bun run env:production config/.env.production --dry-run
```

Paths above are examples, not committed credential files. Without a file argument the CLI reads `apps/web/.env`. Multiple explicit files merge left to right; the later value wins. Empty optional values are omitted: they do **not** delete an existing remote setting. Review stale remote values separately before release.

After reviewing the target, resource ownership and dry-run key names, the same command without `--dry-run` writes to Vercel. An optional `--scope <team-slug>` selects the intended team; `-- --scope <team-slug>` is also accepted. Unknown flags, missing paths, unsupported targets and shell-like scope values fail before execution. No token argument is accepted; use the Vercel CLI's approved authentication mechanism.

Allowed inputs are the auth secret, direct database connection, email delivery mode/sender/key, private Upstash Blob token and paired Upstash Redis REST settings. `CLAIM_URL`, preview directories, `NODE_ENV`, Vercel metadata, derived auth origin and unrelated keys are excluded. Changes to the application schema require deliberate review of `scripts/environment/deployment-keys.ts`.

Hosted preview/production require resend delivery settings, a strong non-sample auth secret, a hosted database URL with the provider's TLS mode, and a complete Redis pair when Redis is configured. URL/sample checks catch common local/example mistakes; they do not verify provider account ownership, sending-domain status, resource isolation or network reachability. Inspect those through the provider and release process. `BETTER_AUTH_URL` remains derived from the selected Vercel origin; review any deliberate custom-domain override separately.

Dry-run logs show the target, key names and skipped count. They never invoke the Vercel process or print values. Applying passes values through stdin with shell execution disabled, marks them sensitive, captures provider output and emits sanitized failures. All source values are validated before the first write. Remote writes are sequential, not atomic: if a later write fails, inspect the target and retry the complete approved plan. No automatic rollback or remote deletion is performed.

Ordinary CI uses injected fixtures and never runs this CLI against real settings. A sync is not a deployment; rebuild the reviewed commit with the intended target configuration. Do not deploy synthetic CI build artifacts. Service keys and claim URLs must remain outside source control and public logs.
