# Node Description Batch 2 of 2

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
For an entity node (any other kind — e.g. a person, place, event, object),
describe what the entity is and its role, grounded in its type, its
relations (neighbors) and the provided citations/evidence — e.g.
"Lady Carfax, a wealthy heiress who disappears en route to Lausanne.".
Ground entity descriptions in the citations/evidence when present; do not
speculate beyond the context, so a node with no supporting context may be
left out of the reply.
Write every description in English (en). Do not switch languages.
No marketing language.
Respond ONLY with a JSON object mapping each node id (as a string) to its
one-sentence description — no prose, no markdown fences.

- "login_page_loginpage": "LoginPage()" | kind=code-symbol | source=src/app/login/page.tsx:L5 | neighbors=[page.tsx]
- "login_page_metadata": "metadata" | kind=code-symbol | source=src/app/login/page.tsx:L3 | neighbors=[page.tsx]
- "next_config_nextconfig": "nextConfig" | kind=code-symbol | source=next.config.ts:L9 | neighbors=[next.config.ts]
- "next_config_withvarlock": "withVarlock" | kind=code-symbol | source=next.config.ts:L3 | neighbors=[next.config.ts]
- "postcss_config": "postcss.config.mjs" | kind=code-symbol | source=postcss.config.mjs:L1 | neighbors=[config]
- "postcss_config_config": "config" | kind=code-symbol | source=postcss.config.mjs:L1 | neighbors=[postcss.config.mjs]
- "pwa_config": "pwa.config.ts" | kind=code-symbol | source=pwa.config.ts:L1 | neighbors=[withPwa()]
- "pwa_config_withpwa": "withPwa()" | kind=code-symbol | source=pwa.config.ts:L3 | neighbors=[pwa.config.ts]
- "rest_route_apihandler": "apiHandler" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L14 | neighbors=[route.ts]
- "rest_route_delete": "DELETE" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L48 | neighbors=[route.ts]
- "rest_route_get": "GET" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L44 | neighbors=[route.ts]
- "rest_route_handlerequest": "handleRequest()" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L22 | neighbors=[route.ts]
- "rest_route_patch": "PATCH" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L47 | neighbors=[route.ts]
- "rest_route_post": "POST" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L45 | neighbors=[route.ts]
- "rest_route_put": "PUT" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L46 | neighbors=[route.ts]
- "rest_route_rpchandler": "rpcHandler" | kind=code-symbol | source=src/app/api/rpc/[[...rest]]/route.ts:L13 | neighbors=[route.ts]
- "src_context_context": "Context" | kind=code-symbol | source=src/context.ts:L15 | neighbors=[context.ts]
- "src_proxy_config": "config" | kind=code-symbol | source=src/proxy.ts:L5 | neighbors=[proxy.ts]
- "src_proxy_proxy": "proxy" | kind=code-symbol | source=src/proxy.ts:L3 | neighbors=[proxy.ts]
- "success_page": "page.tsx" | kind=code-symbol | source=src/app/success/page.tsx:L1 | neighbors=[SuccessPage()]
- "success_page_successpage": "SuccessPage()" | kind=code-symbol | source=src/app/success/page.tsx:L2 | neighbors=[page.tsx]
- "utils_orpc_client": "client" | kind=code-symbol | source=src/utils/orpc.ts:L8 | neighbors=[orpc.ts]
- "utils_orpc_link": "link" | kind=code-symbol | source=src/utils/orpc.ts:L7 | neighbors=[orpc.ts]
- "utils_orpc_orpc": "orpc" | kind=code-symbol | source=src/utils/orpc.ts:L9 | neighbors=[orpc.ts]
- "agents_nextjs_agent_rules": "Next.js Agent Rules" | kind=entity | source=AGENTS.md
- "favicon_96x96": "96×96 Favicon" | kind=entity | source=public/favicon/favicon-96x96.png
- "favicon_apple_touch_icon": "Apple Touch Icon" | kind=entity | source=public/favicon/apple-touch-icon.png
- "offline_page": "Offline Page" | kind=entity | source=public/offline.html
- "privana_favicon_svg": "Privana Favicon" | kind=entity | source=public/favicon/favicon.svg
- "public_sw": "sw.js" | kind=code-symbol | source=public/sw.js:L1
- "src_env_server": "env.server.ts" | kind=code-symbol | source=src/env.server.ts:L1
- "web_app_manifest_192_icon": "192px Web App Icon" | kind=entity | source=public/favicon/web-app-manifest-192x192.png
- "web_app_manifest_512_icon": "512px Web App Icon" | kind=entity | source=public/favicon/web-app-manifest-512x512.png

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\D.Kruger\Documents\privana\apps\web\.engram\description-instructions\batch-001.json

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
