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

After each slice, run scoped lint, relevant types and meaningful interaction checks; inspect light/dark phone/desktop states and publish exact results. Preserve the known local root-lint constraint rather than formatting unrelated files.

At catalogue acceptance, verify long pt-BR content, labels, retained input, touch/keyboard checkbox behavior, disabled/pending actions, Escape/focus return and local-server boundaries. Reconcile every KAR-147 criterion with actual source/evidence.

KAR-148–150 remain separate stories in this same authorized group. G2 requires owner review of the completed group before KAR-132; passing CI alone never accepts, merges, deploys or completes the group.

## Risks and boundaries

Field-context adoption must preserve existing IDs, descriptions, refs and submit payloads. Native validation and backend rules remain authoritative. Treat disabled and pending states explicitly rather than changing data flows through a reskin.

The installed library has native/inline patterns rather than every available registry component. Do not add unused dialogs or another framework to fill a catalogue. Current screen-specific composition remains with its existing later screen story.
