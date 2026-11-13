# Local Privana UX review

KAR-177 supplies the shared review harness for KAR-144. This is development-only tooling, outside production routes/builds. It inherits the approved Proximidade direction and original identity kit. The initial two structural cases verify framing/navigation; they do not complete the fan, Studio or owner prototype stories.

From the repository root, with the existing pinned Bun installed:

```sh
bun docs/planning/m015-ux/prototype/server/start.mjs
```

Open `http://127.0.0.1:53470/`. An optional positional port selects another loopback port. Stop the command with Ctrl+C. No service configuration, application dev server, installation or database is required. Font specimens load from Google Fonts; approved identity files are served from the repository. Domain fixtures may use the existing public Unsplash samples; these are not private creator assets or endorsements.

Choose a case in the review toolbar; its hash is a review address, not a production route. The lower frame is the proposed product context. Theme/selection and future fixture edits are local memory only; reload/Reiniciar resets them. Navigation and theme controls work by keyboard. The toolbar notice and route reference stay outside the product-frame navigation.

The server binds only to loopback and serves an exact allowlist of review/identity files. It rejects methods other than GET/HEAD and has no auth, RPC, upload, email, database or payment handler. CSP blocks connections and form submissions. Sensitive auth/card fixture fields must remain non-submitting examples; never add real customer data or credentials. New review modules require an intentional allowlist entry.

Run the server-boundary checks with:

```sh
bun test docs/planning/m015-ux/prototype/server/respond.test.mjs
```

Keep one renderer/helper per file and domain scenarios separate. Do not import this harness into the application. KAR-178/181/182/179/183/180/185/184 add the critical linked cases; KAR-145 records owner G1 approval before later screen/token implementation. Static/browser checks of this tool do not certify live permissions, email delivery, commerce or production accessibility.

## Public and account walkthrough (KAR-178)

Start with `#fan-public` → Explorar → search a name/city or a nonmatching term → open a named profile → browser Back. The search and scroll position return. Each card keeps its own public handle. Use `#fan-discover-member` to review signed-in interest and the return to that same profile. Locked posts remain locked.

From a guest profile, Entrar leads to read-only test credentials. Entrar shows a disabled pending action; the separate review toolbar selects success or invalid credentials. Success demonstrates the current `/feed` fallback, not a repaired return-to flow (KAR-152/M02). Recovery returns a generic account-neutral response without sending mail. Criar conta demonstrates disabled registration. Fixture credentials cannot authenticate anywhere.

## Fan community walkthrough (KAR-181)

Start `#fan-feed` → Salvar → use the review-toolbar failure outcome → retry → confirm → Ver salvos → remove. The post remains available after failure, and saving never grants content access. Select the independent loading/failed/empty feed cases from the toolbar. Wide feed recommendations disappear at narrower widths; no second search is added.

Assinaturas compares independent active/expired fixtures. Active opens a clearly labeled content example; expired opens the locked profile. `#fan-memberships-empty` is the no-access destination after a checkout demonstration, not an automatic subscription.

Mensagens → Abrir conversa → edit the nonsecret text → send → select failure → retry/confirm. Failure retains text and focus; pending disables editing; confirmation shows the entered text. Empty and disabled-message cases are separate configuration examples. Conta exposes Salvos, Assinaturas and Configurações on phone. Settings covers only the existing name and email-notification preference, with pending/failure/confirmation; none of these examples sends email. Case selection can inspect independent fixtures and does not represent persistent global account state.

## No-charge checkout walkthrough (KAR-182)

From the signed-in Isabela profile, Testar assinatura → select BRL/USD/EUR → review → decline/retry or approve. Back/retry retains the chosen currency. Only the public test card `4242 4242 4242 4242`, expiry `12/30`, CVC `123` appears; fields are read-only. The toolbar can inspect an empty invalid-card fixture and recovery. USD 9.90 / EUR 8.90 are fixed reference prices, not FX quotes.

Usar Pix em BRL deliberately switches method/currency → review → generate the nonpayable example → toolbar expiry → retry/confirm. Expiry is manually selected, not a running clock; the current product duration is 300 seconds. The code is exactly `DEMONSTRACAO-PIX-NAO-PAGAVEL-SEM-VALOR`, never a real Pix payload/QR. Results return to empty recorded access or a still-locked profile. These cases use a signed-in fan persona; the actual demo route is also public, and this prototype adds no new login guard.

This browser review creates no provider, saved card, charge, commercial-sandbox transaction or entitlement. Server-owned simulated commerce remains a separate contract. Live payment onboarding, tokenization, webhooks, reconciliation, refunds and payouts are outside this group.

## Creator profile walkthrough (KAR-179)

Conta → Quero publicar opens the application example. Submission → pending → confirmation keeps the publishing status pending; it is not identity/age assurance. Existing pending profiles can update their details. Closed applications and suspended profiles have separate cases; suspension disables profile editing/publication while account access is considered separately.

Start `#studio-overview` for the active creator. Editar perfil → change name/handle/bio → Fechar edição or a workspace navigation link → continue or discard. Continue retains text; explicit discard clears only that local form and returns to the chosen destination. Pending saves disable fields; failure retains changes and reveals the first field above phone navigation; confirmation marks that form clean. The saved profile's local preview uses the edited name/handle as text; entered image URLs are never fetched. Native field constraints reflect existing bounds/HTTPS links.

Active Studio has five phone destinations; applicants/restricted examples keep the four-destination fan frame. Each named case has a fixed persona; crossing domain fixtures does not model a persistent session/viewer. Carrying the live creator capability across all production community pages remains KAR-148 implementation. Browser Back retains local form values; reload/Reiniciar deliberately resets this review tool. Workspace close/link guards are a proposed UI repair, not a claim that the production editor already protects interrupted work. KAR-183 owns composing and post lifecycle.

## Creator content walkthrough (KAR-183)

From `#studio-overview`, Nova publicação starts a fresh local example; if that editor has unsaved work, continue/discard protects it first. Edit title/body/excerpt/visibility, review the public summary separately from owner-only content metadata, and return without losing text. Closing or changing workspace asks before discarding; browser Back retains the form in memory.

Usar mídia de exemplo → pending → fail → retry or continue without media. Text survives; save/publish is unavailable on failed attachment until you retry or deliberately omit it. Only fixed WebP metadata appears: no file chooser, private object or upload request. Save/publish pending disables repeat actions/fields; failure retains edits and useful focus; confirmation keeps the entered title and result state in that editor's record view.

Publish → archive review → cancel or confirm → pending → fail/retry or archived. Archiving preserves a record rather than deleting it. Current archived rows can still be edited; no new restore command is invented. The list/filter/loading/empty examples are independent fixtures on `/studio`, not new deep-link routes or persistent account records. New/edit groups are separate; explicit discard clears only the chosen group. Current API ownership, active-profile and media checks stay authoritative in future implementation.

## Owner records walkthrough (KAR-180)

Choose `#owner-admin-users` in the review toolbar. Search a name/email, combine it with Situação, try a nonmatching search and clear it. Records and feedback update locally without another search bar. Choose Criadores/Denúncias/Assinaturas/Transações/Auditoria in the owner rail. On phone, the Seção selector replaces that rail; records keep their column labels in stacked rows, without the community bottom navigation. Voltar à comunidade is explicit.

Compare `#owner-moderator-reports`, `#owner-editor-cms` and `#owner-analyst-transactions`: moderator gets people/creators/reports; editor gets CMS; analyst gets overview/subscriptions/transactions. Admin gets all eight current sections. Restricted roles have separate denied cases; all roles have loading/failed/empty examples. Selecting a case is a review action, never a way to change actual permissions. Every reference remains `/admin`, whose sections are internal state today.

Overview separates BRL/USD/EUR and labels the counts and sandbox records fictional. An estorno is a read-only recorded example, not a refund command. No currency conversion or mixed-currency total is implied. This PR is the record-reading layer; KAR-185 adds authorized decision actions and audit context, and KAR-184 adds CMS editing/version recovery before G1. No production record, private message/media or service is accessed.

## Owner decision walkthrough (KAR-185)

From the admin/moderator record tables, inspect DEN-104 before resolving or discarding it, review a creator's publication approval/suspension, or review a member account suspension/reactivation. Confirm → pending → choose failure in the review toolbar → retry → confirm. A pending operation does not claim success; confirmed context identifies the event, target transition and fictional actor/time. Report resolution changes only the report, approval does not establish identity/age, and creator publication status is separate from the person's account.

Only admin sees team-role changes and local subscription revocation. Marina's role selector offers the current four allowed roles, with self/admin/active/verified target restrictions explained. The confirmed context uses the selected role and explains session invalidation. Revocation requires a reason and acknowledgement that billing is unchanged; a missing acknowledgement blocks progression. Failure keeps input; Cancel or returning after confirmation clears that form, so a new decision requires acknowledgement again. Analyst records remain read-only; moderator cannot grant roles. Fixture tables remain independent from the confirmed example, explicitly identified on return.

All interactions are local review paths, including audit context. The browser never changes an actual session, user, creator, report, subscription or provider. Keyboard focus reveals controls without moving a pointer-activated checkbox between press and release; Tab/Space remain supported. Reload resets these fictional groups.
