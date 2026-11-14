# KAR-191 — Public and desktop navigation

Anonymous/loading viewers retain public discovery without private rail links, application shortcuts or authenticated phone tabs. Signed-in fans see Quero publicar only when applications are enabled. Existing profiles retain Studio access when applications close; pending profiles use Minha candidatura. CMS workspace labels and the four staff-role entries remain supported. Rail labels wrap instead of clipping.

The old Nova publicação rail shortcut opened Studio management, not its local-state editor, and appeared for pending profiles. It is removed; the existing ACTIVE-only Studio publication action remains authoritative. Actual URLs and all server permissions are retained. Unknown pathname context does not fabricate an active link.

## Rendered evidence

- Public phone/light: [before](review/role-navigation/before-anonymous-phone-light.jpg), [after](review/role-navigation/after-anonymous-phone-light.jpg).
- Pending desktop/dark: [before](review/role-navigation/before-pending-desktop-dark.jpg), [after](review/role-navigation/after-pending-desktop-dark.jpg).

The local packet has 16 before and 64 after frames at 320/390/768/1280px, both themes: anonymous/loading, fan, active/pending/suspended creator, staff and long-label/disabled-feature examples. Captures record zero runtime, external-request or horizontal-overflow errors. Before frames use the accepted shell with the nullable-path fixture guard; they do not invent an active route. The fixture names its fictional account/static limitations visibly.

Actual Sidebar, Topbar and MobileNavigation server output is checked in Chromium using the existing isolated CSS/font runner. The baseline public regression found nine private links. After correction, `bun run test:catalogue` passes 99 cases, including native keyboard destinations, public/loading absence, role/profile entries, registration/messaging/application switches and full desktop label rendering. Static fixtures do not prove authentication, hydration, client-router transitions, popup interaction or operations access.

Scoped Ultracite passes; workspace types pass five tasks (four cached), tooling types pass. `bun run test` passes 298 tests across 57 files, with 884 assertions. `bun run build` recompiles the web app successfully. No live service, migration, seed, configuration, email, storage or payment change; no deployment. Rollback is the issue commit with no data reversal.

## Remaining gates

KAR-193 retains the authenticated phone Conta menu, settings wording, role tabs, task search and expanded-label behavior. Those existing phone controls remain intact in this slice; their presence in a capture is not acceptance. KAR-192 owns workspace-shell polish. Brand truncation at 320px and pre-existing direction-study wording in design authorities are reported, not canonized or repaired here. KAR-148/131 and G2 remain pending; no later group or milestone starts.

Open one ordinary main-target PR after verification. Keep KAR-191 In Review until owner acceptance and merge; passing CI is a separate gate.

Fresh documentation reconciliation checked the source, PRODUCT/DESIGN/sidecar, surface brief and four review before/after frames: Proximidade's purple/plum grounds, Hanken UI and Bricolage headings remain intact; KAR-191 introduces no new design tokens or system rules.

The finish disposition remains `fix` for inherited seed provenance. The reported `concept-seed --check-seed seed:c0e81b28ee1eccfe` check returned `SEED UNKNOWN`; KAR-141 commit `885e6a2` corroborates the reference ID, not its missing original roll receipt. Missing QUALITYBAR leaves the ceiling unscored; no SHIP or owner acceptance is asserted.

No persisted detector receipt is included; the automatic hook's reported clean result does not supply one. Existing direction-study wording, shell-measurement differences and 320px brand truncation are reported, not canonized or repaired; design authorities remain untouched.
