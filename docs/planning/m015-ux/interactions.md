# KAR-143 — Search, history, interruption and keyboard rules

**Status:** proposed interaction contract for G1 review. Existing data/business authority is preserved. [Navigation](navigation.md) and [role coverage](role-matrix.md) define the contexts.

## One search per task

| Context | Search/filter placement | Scope and recovery |
| --- | --- | --- |
| Public/fan discovery | One labeled creator search on `/explore`; category controls sit beside/below it | Name/handle/category within existing discovery capability. Preserve current query on profile return; distinguish no creators from no matches. |
| Home/feed | Link to discovery; no second persistent “global search” above a sidebar search | Recent/following tabs choose the feed source. They do not silently search private posts. |
| Saved/memberships | Current list/filter controls only | Never imply that filtering creates access, renews membership or searches inaccessible content. |
| Inbox | Existing conversation list/selection | Do not add a global user/message search when the current capability does not supply it. |
| Studio | Existing status filter; one set of list controls | Status is scoped to the creator's own content. Draft/archived/empty-filter states are named distinctly. |
| Owner lists | One search/filter toolbar for the active section | Existing search/status/role/kind/currency controls remain section-specific; reset paging on a changed filter. No duplicate shell search. |
| CMS | Current editing tabs and fields | These are document editing controls, not a public-content search engine. |

## History and scroll

- A creator-profile visit from discovery returns to the same search/category and useful scroll position. Back from a post/profile preserves the originating feed/list rather than jumping to its top.
- A new primary destination starts at its heading. Explicit reload/retry preserves meaningful query state and nonsecret input; a permission change rechecks authority instead of restoring inaccessible content from cache.
- Studio tabs/editor and owner sections currently stay on one route. Keep their parent-list filter/scroll when closing a contained editor/detail. Browser Back retains the existing route semantics; do not promise unimplemented section deep links.
- Use visible Voltar/Fechar controls for contained work. Browser history, keyboard Escape and dialog cancellation must agree on whether work is being discarded. Never navigate away while showing a false “saved” state.
- The prototype may use its own scenario hashes to link frames. Those are review-tool addresses, not new production URLs or proof of auth/deep-link implementation.

## Interrupted work and feedback

| Situation | Required experience | Current-scope boundary |
| --- | --- | --- |
| Dirty creator editor / CMS document | Ask before leaving/discarding; keep unsaved input after a failed save; discard requires an explicit choice | In-memory preview work is not server autosave. Vault, scheduling and cross-device draft sync remain future work. |
| Save or mutation pending | Immediate local feedback, a named pending state and duplicate-submit protection | Success follows the authoritative response; optimistic state must roll back only its own change. |
| Image/upload failure | Preserve text and distinguish public preview from private protected media; offer the actual retry/cancel action | The prototype never uploads a real file or exposes a signed/private URL. |
| Archive/moderation/revoke/publish | Name the affected record and effect; explicit confirmation; pending and failure/retry states | Local revoke is not a provider refund; publish approval is not identity assurance; restore CMS history changes the draft. |
| CMS version conflict | Keep dirty work visible, explain that the published/saved version changed, and offer deliberate reload/review | Never silently overwrite another operator or label a restored draft “live”. |
| Demo card/Pix | Keep “sem cobrança e sem liberação de acesso” visible through method, review and result | Test inputs only; Pix in BRL; reference currencies create no live charge/renewal/entitlement. |

## Keyboard, overlays and focus

- One main landmark and visible heading per workspace; provide a skip link. Name navigation regions and mark the selected destination with `aria-current` plus a visual treatment.
- Use links for destinations and buttons for local actions. Target touch controls at least 44px; do not rely on hover, color or tiny text to convey a status or an icon's purpose.
- A menu trigger has an accessible name and expanded state. A modal drawer/confirmation contains focus, supports Escape/cancel and restores focus to its trigger; underlying controls are inert while modal.
- Place focus at the new page/frame heading after primary navigation, at the error/invalid field after a failed submit, and at the result/status after a completed action. Background refresh must not steal focus or destroy selection.
- Retain the originating control after a cancelled dialog; after a confirmed archive/removal, move focus to the next useful list item/heading with a concise announcement.
- Honor reduced motion. Keep selected-state feedback immediate and avoid layout shifts; animation never substitutes for loading, failure or success text.
- Loading skeletons preserve the work area's shape; empty states offer an existing relevant destination. Missing permission gets a truthful explanation/recovery, not an enabled privileged CTA.

## Deferred adoption and verification

KAR-148 owns shell/navigation adoption; KAR-149 owns mutation/recovery parity; KAR-152 owns the login-return gap; the named screen stories own local details. KAR-144's child prototypes demonstrate these decisions for review, and KAR-145 records approval. Production keyboard/screen-reader, true zoom, physical-device, browser-history and service verification remain explicit implementation/acceptance checks.
