# Node Description Batch 1 of 2

Engram is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the prompt below and write
your JSON answer to the answer file.

## Prompt

You are documenting nodes in a knowledge graph.
For each entry below, write ONE concise factual plain-language sentence
describing what it is or does. Use only the provided context.
For a code symbol (kind=code-symbol — a function, class, or constant),
describe what the function/symbol does based on its name, source location
and neighbors — e.g. "Resolves the configured ontology profile from graphify.yaml.".
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "rest_route": "route.ts" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L1 | neighbors=[evlog.ts, evlog-auth.ts, identifyEvlogUser(), apiHandler, DELETE, GET]
- "lib_evlog_auth": "evlog-auth.ts" | kind=code-symbol | source=src/lib/evlog-auth.ts:L1 | neighbors=[evlog.ts, identifyEvlogUser(), identifyUser, services.ts, auth, route.ts]
- "src_context": "context.ts" | kind=code-symbol | source=src/context.ts:L1 | neighbors=[route.ts, Context, createContext(), services.ts, auth, db]
- "app_layout": "layout.tsx" | kind=code-symbol | source=src/app/layout.tsx:L1 | neighbors=[bodyFont, headingFont, RootLayout(), providers.tsx, pwa-registration.tsx]
- "lib_evlog": "evlog.ts" | kind=code-symbol | source=src/lib/evlog.ts:L1 | neighbors=[instrumentation.ts, { register, onRequestError }, { withEvlog, useLogger, log, createErro…, evlog-auth.ts, route.ts]
- "src_services": "services.ts" | kind=code-symbol | source=src/services.ts:L1 | neighbors=[route.ts, evlog-auth.ts, context.ts, auth, db]
- "components_providers": "providers.tsx" | kind=code-symbol | source=src/components/providers.tsx:L1 | neighbors=[layout.tsx, Providers(), theme-provider.tsx, ThemeProvider()]
- "src_services_auth": "auth" | kind=code-symbol | source=src/services.ts:L9 | neighbors=[route.ts, evlog-auth.ts, context.ts, services.ts]
- "all_route": "route.ts" | kind=code-symbol | source=src/app/api/auth/[...all]/route.ts:L1 | neighbors=[{ GET, POST }, services.ts, auth]
- "lib_evlog_auth_identifyevloguser": "identifyEvlogUser()" | kind=code-symbol | source=src/lib/evlog-auth.ts:L15 | neighbors=[evlog-auth.ts, identifyUser, route.ts]
- "utils_orpc": "orpc.ts" | kind=code-symbol | source=src/utils/orpc.ts:L1 | neighbors=[client, link, orpc]
- "components_pwa_registration": "pwa-registration.tsx" | kind=code-symbol | source=src/components/pwa-registration.tsx:L1 | neighbors=[layout.tsx, PwaRegistration()]
- "components_theme_provider": "theme-provider.tsx" | kind=code-symbol | source=src/components/theme-provider.tsx:L1 | neighbors=[providers.tsx, ThemeProvider()]
- "components_theme_provider_themeprovider": "ThemeProvider()" | kind=code-symbol | source=src/components/theme-provider.tsx:L6 | neighbors=[providers.tsx, theme-provider.tsx]
- "instrumentation": "instrumentation.ts" | kind=code-symbol | source=instrumentation.ts:L1 | neighbors=[{ register, onRequestError }, evlog.ts]
- "lib_evlog_auth_identifyuser": "identifyUser" | kind=code-symbol | source=src/lib/evlog-auth.ts:L10 | neighbors=[evlog-auth.ts, identifyEvlogUser()]
- "login_page": "page.tsx" | kind=code-symbol | source=src/app/login/page.tsx:L1 | neighbors=[LoginPage(), metadata]
- "next_config": "next.config.ts" | kind=code-symbol | source=next.config.ts:L1 | neighbors=[nextConfig, withVarlock]
- "src_context_createcontext": "createContext()" | kind=code-symbol | source=src/context.ts:L5 | neighbors=[route.ts, context.ts]
- "src_proxy": "proxy.ts" | kind=code-symbol | source=src/proxy.ts:L1 | neighbors=[config, proxy]
- "src_services_db": "db" | kind=code-symbol | source=src/services.ts:L8 | neighbors=[context.ts, services.ts]
- "all_route_get_post": "{ GET, POST }" | kind=code-symbol | source=src/app/api/auth/[...all]/route.ts:L5 | neighbors=[route.ts]
- "app_layout_bodyfont": "bodyFont" | kind=code-symbol | source=src/app/layout.tsx:L11 | neighbors=[layout.tsx]
- "app_layout_headingfont": "headingFont" | kind=code-symbol | source=src/app/layout.tsx:L17 | neighbors=[layout.tsx]
- "app_layout_rootlayout": "RootLayout()" | kind=code-symbol | source=src/app/layout.tsx:L25 | neighbors=[layout.tsx]
- "app_manifest": "manifest.ts" | kind=code-symbol | source=src/app/manifest.ts:L1 | neighbors=[manifest()]
- "app_manifest_manifest": "manifest()" | kind=code-symbol | source=src/app/manifest.ts:L6 | neighbors=[manifest.ts]
- "app_page": "page.tsx" | kind=code-symbol | source=src/app/page.tsx:L1 | neighbors=[Page()]
- "app_page_page": "Page()" | kind=code-symbol | source=src/app/page.tsx:L3 | neighbors=[page.tsx]
- "components_loader": "loader.tsx" | kind=code-symbol | source=src/components/loader.tsx:L1 | neighbors=[Loader()]
- "components_loader_loader": "Loader()" | kind=code-symbol | source=src/components/loader.tsx:L3 | neighbors=[loader.tsx]
- "components_providers_providers": "Providers()" | kind=code-symbol | source=src/components/providers.tsx:L12 | neighbors=[providers.tsx]
- "components_pwa_registration_pwaregistration": "PwaRegistration()" | kind=code-symbol | source=src/components/pwa-registration.tsx:L5 | neighbors=[pwa-registration.tsx]
- "dashboard_page": "page.tsx" | kind=code-symbol | source=src/app/dashboard/page.tsx:L1 | neighbors=[DashboardPage()]
- "dashboard_page_dashboardpage": "DashboardPage()" | kind=code-symbol | source=src/app/dashboard/page.tsx:L2 | neighbors=[page.tsx]
- "instrumentation_register_onrequesterror": "{ register, onRequestError }" | kind=code-symbol | source=instrumentation.ts:L3 | neighbors=[instrumentation.ts]
- "lib_auth_client": "auth-client.ts" | kind=code-symbol | source=src/lib/auth-client.ts:L1 | neighbors=[authClient]
- "lib_auth_client_authclient": "authClient" | kind=code-symbol | source=src/lib/auth-client.ts:L3 | neighbors=[auth-client.ts]
- "lib_evlog_register_onrequesterror": "{ register, onRequestError }" | kind=code-symbol | source=src/lib/evlog.ts:L10 | neighbors=[evlog.ts]
- "lib_evlog_withevlog_uselogger_log_createerror": "{ withEvlog, useLogger, log, createError }" | kind=code-symbol | source=src/lib/evlog.ts:L5 | neighbors=[evlog.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\D.Kruger\Documents\privana\apps\web\.engram\description-instructions\batch-000.json

Keep each description factual and concise (one sentence). No markdown, no prose
outside the JSON object. It is acceptable to omit a node if context is
insufficient — but include every node you can ground confidently.

Example answer format:
```json
{
  "node_id_1": "Resolves the configured ontology profile from graphify.yaml.",
  "node_id_2": "Colonel James Barclay, an antagonist in The Crooked Man."
}
```
