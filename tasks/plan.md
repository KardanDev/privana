# KAR-147 implementation plan

Tasks and acceptance status live in Linear. This file records the approved component story's delivery split; it does not duplicate the tracker or advance another group.

The owner accepted KAR-130/G1 and requested continuation on November 13. KAR-146 supplies the theme prerequisite in PR #22. Work stays inside KAR-131 until its G2 owner review; no later group or milestone starts automatically.

## Architecture

- Reuse React, installed Base UI/shadcn primitives and the existing shared UI package. Keep new functions/components in separate domain files and direct imports.
- Controls use the approved semantic tokens. Phone targets, labels, native names/values, caller refs, error descriptions and keyboard behavior stay part of the public component contract.
- Compose field labels/descriptions/errors through installed Base UI field context, retaining caller descriptions instead of replacing them. Keep native selectors where the product already uses them.
- Preserve data, validation, access, media URLs, query/mutation and payment authority. This is shared UI work, not a new business capability.
- The editable catalogue uses real shared primitives and CSS outside production routing. Its local runner exposes an allowlist on loopback, without environment files, auth, RPC or service mutations. Reuse the installed build toolchain.

## Ordered Linear index

| Issue | Result | Prerequisite |
| --- | --- | --- |
| [KAR-187](https://linear.app/kardandev/issue/KAR-187) | Readable controls, phone targets and accessible form composition | KAR-146 |
| [KAR-188](https://linear.app/kardandev/issue/KAR-188) | Named overlays, useful feedback and consistent data/media presentation | KAR-146; work follows KAR-187 |
| [KAR-189](https://linear.app/kardandev/issue/KAR-189) | Editable real-component states, safe runner and interaction acceptance | KAR-187/188 |

Each actionable issue has one ordinary PR, explicit prerequisite/base and task-owned staging. Use the project's <=400-line/20-file target and <=800/30 hard budget; refine again if necessary. Generic task-size guidance does not justify combining independent stories.

## Verification checkpoints

After each slice, run scoped lint, relevant types and meaningful interaction checks; inspect light/dark phone/desktop states and publish exact results. Preserve the known local root-lint constraint rather than formatting unrelated files. KAR-188 reuses KAR-187's browser fixture boundary; it starts on that issue's branch until PR #23 lands. Table wrappers retain native captions, rows and actions while adding a named keyboard scroll target.

At catalogue acceptance, verify long pt-BR content, labels, retained input, touch/keyboard checkbox behavior, disabled/pending actions, Escape/focus return and local-server boundaries. Include the existing StatCard's supporting typography and unused registry Card with their actual catalogue recipes. Reconcile every KAR-147 criterion with actual source/evidence.

KAR-148–150 remain separate stories in this same authorized group. G2 requires owner review of the completed group before KAR-132; passing CI alone never accepts, merges, deploys or completes the group.

## Risks and boundaries

Field-context adoption must preserve existing IDs, descriptions, refs and submit payloads. Native validation and backend rules remain authoritative. Treat disabled and pending states explicitly rather than changing data flows through a reskin.

The installed library has native/inline patterns rather than every available registry component. Do not add unused dialogs or another framework to fill a catalogue. Current screen-specific composition remains with its existing later screen story.

## Main-branch delivery recovery

The owner accepted #23–25, but #24/25 initially reached only their feature bases. Main-target PR #26 has now delivered KAR-188. KAR-189 follows separately; its prepared replay remained byte-identical when rebased onto that actual main merge.

Keep the original KAR-188/189 issues: these are delivery corrections, not new feature stories. Their original PRs are already merged and cannot be retargeted, so each requires a main-target follow-up. Publish KAR-188 first; wait for its main merge before opening KAR-189. Do not repeat the dependent-branch merge path.

Verify unchanged implementation/capture bytes, scoped lint, workspace/tooling types, deterministic tests, production build and fresh PR checks. Keep the two issues In Review until main delivery, KAR-147/131 active, and KAR-148–150/G2 pending. Do not advance KAR-132 or another milestone.

## KAR-189 execution

Reuse the real controls/feedback fixtures and add actual Card/StatCard recipes in a local React catalogue. Provide local theme/accent/example selection; synchronize native color-scheme with the theme. Sources remain editable in the repository, with a quick rebuild on restart.

Compile the current shared Tailwind CSS through the already installed PostCSS toolchain, with explicit source paths. Reuse only selected first-party font faces and WOFF2 files from an existing local Next production build; do not expose .next/server, resolved environment or application routes. A missing font build must give a clear instruction to run the normal build once.

Serve exact generated HTML/JS/CSS/font/license paths on 127.0.0.1:53471, GET/HEAD only. Reject foreign hosts/origins, API/source/environment paths and writes. Add boundary tests and a dedicated browser configuration that starts this static runner without the application. Keep CI's synthetic build disposable and never upload it.

Keep this issue below the hard PR budget; refine before implementation if a necessary addition would exceed it. Parent acceptance remains pending owner review of every child; no move to KAR-132.
