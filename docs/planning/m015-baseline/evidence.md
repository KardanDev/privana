# KAR-137 — Rendered baseline evidence

Captured November 7, 2026, at **08:44 UTC / 05:44 America/Sao_Paulo**, against application commit `2fb257a70d4a7537183f280bc4866dcdef0c457e` on `http://localhost:3001`. See the [route/role/state inventory](inventory.md). These are current-state references, not redesign proposals.

## Captures

All ten samples returned HTTP 200 after hydration, had no remaining shared skeletons, used `pt-BR`, and had no document-level horizontal overflow at the sampled viewport. This does not prove every state is correct, that all images loaded, or that narrow tables/virtual keyboards/physical touch work. Images show the first viewport: phone 390×844, desktop 1440×1000.

| Evidence | Fixture | Route / state | Size | Theme |
| --- | --- | --- | --- | --- |
| [Public home](evidence/public-home.jpg) | Anonymous | Recent feed, loaded seeded public posts | Desktop | Light |
| [Public profile](evidence/public-profile.jpg) | Anonymous | `vitoria-demo`, prelaunch membership interest | Phone | Light |
| [Fan feed](evidence/fan-feed.jpg) | `member` | Authenticated recent feed | Phone | Light |
| [Fan memberships](evidence/fan-memberships.jpg) | `member` | Existing interest list, subscriptions not live | Desktop | Dark |
| [Creator composer](evidence/creator-compose.jpg) | `creator` | New-post editor opened; nothing submitted | Phone | Light |
| [Creator overview](evidence/creator-overview.jpg) | `creator` | Recorded metrics and existing publication list | Desktop | Dark |
| [Restricted editor](evidence/editor-cms.jpg) | `editor` | CMS-only navigation, brand draft | Phone | Light |
| [Restricted editor, dark](evidence/editor-cms-dark.jpg) | `editor` | Same CMS lifecycle and supported fields | Desktop | Dark |
| [Owner overview](evidence/owner-overview.jpg) | `admin` | Eight section destinations, actual recorded metrics | Desktop | Light |
| [Pending creator](evidence/pending-creator.jpg) | Pending demo creator | Review notice, no New publication action | Phone | Dark |

The floating TanStack development-tool launcher remains visible in these development-server captures and is excluded from product findings; Next.js development chrome is hidden during capture. No screenshot asserts the proposed production appearance. Review the original image for exact wording and layout; JPEG compression is intentional to keep review artifacts small.

## Concrete UX findings for the redesign backlog

| Priority | Observed current behavior | Impact and assigned follow-up |
| --- | --- | --- |
| P1 | Public home starts directly with posts and generic community navigation, without explaining the current creator marketplace/prelaunch state. | Clarify fan/creator purpose before signup: KAR-139–140 and KAR-151. Do not invent customer, safety or revenue claims. |
| P1 | At 390px the Studio composer begins below its heading, actions, four metrics, tabs and list controls. | Give the active creation task more useful space on a phone: KAR-143–144 and KAR-162. Preserve existing draft/publish semantics. |
| P2 | Phone profile's prelaunch interest panel occupies the remainder of the first viewport before actual posts. | Compact the offer and keep creator content discoverable: KAR-156. Existing no-charge/no-access language is valuable. |
| P2 | Mobile fan navigation prioritizes Studio and calls settings “Perfil”; saved/membership destinations are in the account menu. | Make task labels and cross-device destinations consistent: KAR-143 and KAR-148. |
| P2 | Mobile CMS uses stacked operation/identity/version/tab headers before its first field, while save/publish sit below the form. | Improve scanability and action context without changing draft/version/publish authority: KAR-168. |
| P2 | Owner sidebar truncates the default Privana wordmark despite a fixed-width rail; pending Studio counts include drafts under “Publicações”. | Define robust logo sizing and metric meaning with realistic role states: KAR-148, KAR-163–164. Neither observation implies unauthorized publication. |

Strengths to preserve: a coherent restrained accent, ordinary recognizable task controls, real profile/status distinctions, truthful prelaunch/zero-payment labels, separate owner navigation and clear CMS draft-versus-public consequences. These captures do not justify a whole-product heuristic score or accessibility certification.

## Safe reproduction

Use the existing **development** server and ready ignored demo manifest; no seed is run. Review the server's actual resource target first: loopback URL validation alone cannot identify its database. From the repository root, with the locked dependencies and Chromium already installed:

```powershell
$env:ALLOW_DESIGN_BASELINE='1'
$env:DESIGN_BASELINE_ORIGIN='http://localhost:3001'
$env:DESIGN_BASELINE_COMMIT='2fb257a70d4a7537183f280bc4866dcdef0c457e'
node --import tsx scripts/design-audit/capture-baseline.ts
```

The helper uses one isolated session per fixture role, respects authentication throttling, saves no cookies/storage state/traces and closes its browser. Sign-in creates normal authentication sessions; application writes are blocked, with only known read-only oRPC POST queries permitted. The complete run attempted **zero disallowed browser requests**. No post, profile, membership, notification, payment, message or CMS write was submitted. Email/password inputs are masked; only safe seeded content is included here.

Sanitized raw measurements are written under ignored `output/playwright/m015-baseline-observations.json`; this register and the ten images are the durable review artifacts. The helper's target list is explicit and versioned. The native browser MCP was used for public inspection; the isolated local runner handles authenticated fixture access without putting credentials into chat/tool arguments. Windows sandbox restrictions required an approved headless-browser run outside the sandbox. No audit-only server was started; the existing development server stays running.

## Verification and remaining evidence

The deterministic application suite passed **271 tests / 834 assertions**. Maintenance-script types and the focused helper lint are checked separately in the PR. The repository-wide formatting command currently reports pre-existing formatting diagnostics, including Windows CRLF files; this inventory does not silently reformat unrelated files or claim a globally passing gate. The PR's actual CI result is authoritative for its Linux checkout.

No production compilation is rerun against the active development server solely for a documentation/capture change. Real email delivery, mutation outcomes, physical devices, complete keyboard/screen-reader checks, private-message/media fixtures, suspended accounts, service outages and all CMS conflict states remain explicitly unexercised here. Source/tests identify their contracts and their assigned redesign/QA owners in the inventory; KAR-138 records the technical risks without treating untested states as passing.
