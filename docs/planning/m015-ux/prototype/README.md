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

Keep one renderer/helper per file and domain scenarios separate. Do not import this harness into the application. KAR-178/181/182/179/180 add the critical linked cases; KAR-145 records owner G1 approval before later screen/token implementation. Static/browser checks of this tool do not certify live permissions, email delivery, commerce or production accessibility.

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
