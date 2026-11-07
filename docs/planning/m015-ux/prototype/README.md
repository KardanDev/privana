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

Keep one renderer/helper per file and domain scenarios separate. Do not import this harness into the application. KAR-178/179/180 add the critical linked cases; KAR-145 records owner G1 approval before later screen/token implementation. Static/browser checks of this tool do not certify live permissions, email delivery, commerce or production accessibility.
