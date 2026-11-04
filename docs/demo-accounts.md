# Local demonstration accounts

The existing `db:seed:demo` command prepares real Better Auth credential accounts for development. It is intentionally blocked without `ALLOW_DEMO_SEED=1`, `NODE_ENV=development` (or test), and a configured development database. Production and Vercel production are rejected. It does not bypass signup controls in production and never runs automatically on startup or deployment.

The configured Prisma cloud database was expanded successfully on November 4, 2026. The local manifest is ready and contains all 18 usable login credentials; the original ten passwords were preserved. A readable handoff is available in the ignored `apps/web/.local-demo-credentials.json.md` file.

After the database is ready, run from the repository root in PowerShell:

```powershell
$env:NODE_ENV = 'development'
$env:ALLOW_DEMO_SEED = '1'
bun run --cwd packages/db db:seed:demo
Remove-Item Env:ALLOW_DEMO_SEED
```

Varlock loads the existing database environment configuration. The command checks that `apps/web/.local-demo-credentials.json*` is ignored by Git before creating any plaintext credentials. It writes no passwords or connection details to the terminal. A local manifest at `apps/web/.local-demo-credentials.json` contains each account's role, purpose, email and generated password. Treat it as a secret. Hand off credentials only when its status is `ready`; `pending` means a run has not finished successfully. File writes are atomic and request owner read/write permissions where supported; Windows inherits the workspace's user ACLs.

The manifest includes 18 verified accounts:

| Type | Email | Expected access |
| --- | --- | --- |
| Member | `member@demo.privana.test` | Feed, comments, following, bookmarks, message example and membership interest; no paid access |
| Approved creator | `luna-demo@demo.invalid` | Existing Luna profile and studio; access to own posts |
| Approved creator | `rafael-demo@demo.invalid` | Existing art profile and studio |
| Approved creator | `marina-demo@demo.invalid` | Existing lifestyle profile and studio |
| Approved creator | `caio-demo@demo.invalid` | Existing music profile and studio |
| Approved model | `isabela-demo@demo.invalid` | Model profile, lifestyle content and responsive studio |
| Approved creator | `julia-demo@demo.invalid` | Photography profile and studio |
| Approved creator | `fernanda-demo@demo.invalid` | Fitness profile and studio |
| Approved creator | `sofia-demo@demo.invalid` | Art profile and studio |
| Approved creator | `gabriela-demo@demo.invalid` | Music profile and studio |
| Approved creator | `amanda-demo@demo.invalid` | Gastronomy profile and studio |
| Approved creator | `vitoria-demo@demo.invalid` | Lifestyle profile and studio |
| Approved creator | `helena-demo@demo.invalid` | Photography profile and studio |
| Pending creator | `creator-pending@demo.privana.test` | Onboarding/review state; cannot publish before approval |
| Superadmin | `admin@demo.privana.test` | All local operations/CMS/team areas |
| Editor | `editor@demo.privana.test` | CMS draft, publication and revision history |
| Moderator | `moderator@demo.privana.test` | Ordinary account/creator/report moderation |
| Analyst | `analyst@demo.privana.test` | Read-only analytics and financial views |

Passwords use cryptographic randomness and the installed Better Auth password hasher. Reserved `.test`/`.invalid` addresses never receive real email; email verification is explicitly marked complete for these local fixtures. The script resets only its recognized demo accounts to their planned verified active roles/passwords; reruns reuse the same generated plaintext passwords from the manifest. Existing demo profiles and posts are preserved, including edits and moderation states, so a previously suspended creator can remain suspended. Existing user IDs, emails and demo markers are checked before any write; conflicts abort the transaction rather than claiming unrelated accounts or handles.

Examples include thirteen marked demo profiles (twelve approved and one pending), public/subscriber previews, drafts, archived posts, comments, follows, likes, bookmarks, multiple conversations, notifications, a clearly labeled report and an audit entry. The creators span six categories and Brazilian locations. Dates are staggered to make timelines understandable. Unsplash URLs are public display examples; the seed does not fabricate private media objects. Membership interest does not grant access. **No subscription, transaction, payment, payout, earning or processor activity is inserted.** Empty financial screens are expected.

An exclusive ignored lock file prevents simultaneous runs. After an interrupted process, verify that no seed process is running before deleting only `apps/web/.local-demo-credentials.json.lock` and rerunning. Keep the manifest to preserve passwords. A malformed or unknown manifest is rejected without replacement; do not delete it casually, since rebuilding it generates new passwords for the managed demo accounts. Base fixtures and each creator's extended history use bounded transactions. A failed batch leaves the manifest pending while earlier successful batches remain; rerunning resumes idempotently. A successful database commit followed by a file-write failure can also leave pending status.

Validation commands (fixtures only; no cloud writes):

```powershell
bun test packages/db/tests
bunx tsc -p packages/db/tsconfig.seed.json --pretty false
bunx ultracite check packages/db/scripts packages/db/tests packages/db/package.json packages/db/tsconfig.seed.json
```

Verified November 4, 2026:

- The expanded live seed completed with exit code 0. The ignored manifest has `status: "ready"`.
- All 18 stored Better Auth password hashes match their manifest passwords, and expected roles, active statuses and verified email flags match.
- The live read-only verifier returned 13 creator profiles, 159 posts, 62 comments, 98 messages, 14 notifications and one report. Browser/integration checks account for additional test posts and can increase these totals.

The expanded seed initially exceeded a long cloud transaction. Committing creator histories in smaller batches resolved that failure. The safe error classifier reports known Prisma error codes without printing raw driver messages or credentials.

For a read-only credential/hash and data check, run from `apps/web` with the same development opt-in:

```powershell
$env:NODE_ENV = 'development'
$env:ALLOW_DEMO_SEED = '1'
bunx varlock run -- bun ../../packages/db/scripts/verify-demo.ts
Remove-Item Env:ALLOW_DEMO_SEED
```

The verifier requires an existing ready manifest and prints only account keys, boolean validation results and record counts. It does not display passwords or write to the database. Live HTTP login, browser permissions and external email delivery are separate checks performed by the integration workflow.
