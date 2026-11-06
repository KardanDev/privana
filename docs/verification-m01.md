# M01 verification ledger

Prepared November 6, 2026. Scope: [KAR-9 delivery foundation](https://linear.app/kardandev/issue/KAR-9), with KAR-17 through KAR-22. Later milestones remain in Backlog. No migration, seed, live email, payment or deployment was executed for this milestone.

## Repository and planning evidence

- Read the complete original Linear requirements and reconciled the selected 499-file Repomix snapshot against current source at `f8040ab`.
- Replaced bulk descriptions with ten ordered milestones, ten deliverable parents and 95 executable stories. Read-back verified every story's intended parent, milestone and initial status. KAR-8 is superseded planning material.
- The canonical roadmap, scope decisions and issue links are in [planning](planning/roadmap.md). Acceptance criteria remain in Linear; code visibility alone earns no completion credit.

## Local checks

| Check | Evidence |
| --- | --- |
| Original regression | Focused Studio tests reproduced `Unexpected )` at `commit-studio-post.ts:29`; all three existing cases pass after removing the stray token. |
| Frozen install | `bun install --frozen-lockfile`: success, unchanged lockfile after the intentional pinned Playwright addition; Varlock postinstall completed. |
| Formatting/lint | `bun run check`: success after narrowly excluding editor skill/agent assets. |
| Package types | `bun run check-types`: five workspace tasks successful; web/UI outputs now match their compiler behavior. |
| Maintenance/tooling types | `bun run check-types:scripts`: success, including root scripts and the committed browser harness. |
| Deterministic suite | `bun run test`: 271 passed, zero failed, 834 assertions across 54 files, including refusal of mutating demo checks in production or unidentified environments. The recorded unrestricted run avoids Bun's parent-directory permission diagnostic from the filesystem sandbox. |
| Production compilation | `bun run build`: four tasks successful, Next.js 16.4.3 compilation/type/static-generation completed. No database migration/seed ran. |
| Environment dry-run | `bun run env:production --dry-run`: eight allowlisted names and skipped count only; no values printed and no remote writes. Fixture tests separately prove no subprocess invocation during dry-run. |
| Browser smoke | All 15 anonymous checks passed in 25.5 seconds across desktop/tablet/mobile Chromium, against the compiled local app at `http://127.0.0.1:3011` using development resources. Card validation/approval/decline, Pix/currency/expiry, no persisted grant and overflow checks passed. This is not an authenticated/provider E2E gate. |

The initial clean Linux [quality run](https://github.com/KardanDev/privana/actions/runs/42305436017) passed every step at `ccd1664`, including frozen installation, generation, lint, types, tests and production compilation without real service credentials. Follow-up review guards are included in the latest PR checks; the current head must remain green before merge.

The cloud-backed browser runtime reads published CMS configuration. Browser artifacts remain ignored/private. Synthetic CI artifacts are disposable and cannot be promoted to production. The expanded roadmap now also indexes the later M01.5, M11 and Sentry planning additions; none is implemented by this PR.

On this Windows host, initial requests through `localhost` timed out in the test runtime while explicit IPv4 loopback returned HTTP 200 in approximately one second. The successful suite used explicit IPv4 and a read-only readiness preflight. No application performance claim is inferred from that environment-specific routing issue.

## Review and release gates

The PR must link the six M01 stories and contain fresh CI evidence, review findings and their resolutions. Human review/merge, required-check enforcement and any deployment approval remain separate. Keep M01 in review rather than marking it complete while those gates are open. No M02 implementation follows automatically from this handoff.

M01 adds no schema migration. Real staging isolation, restore/incident drills, complete role/device journeys, external eligibility and live-money integration remain the later milestone deliverables recorded in Linear.
