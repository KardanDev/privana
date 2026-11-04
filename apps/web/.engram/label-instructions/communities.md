# Community Labeling

Engram is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the community listing below
and write 2-5 word plain-language names for each.

## Language

Write every name in English (en). Do not switch languages.

## Communities

Community 0: ThemeProvider(, layout.tsx, bodyFont, headingFont, RootLayout(, providers.tsx, Providers(, pwa-registration.tsx, PwaRegistration(, theme-provider.tsx
Community 1: route.ts, apiHandler, DELETE, GET, handleRequest(, PATCH, POST, PUT, rpcHandler
Community 2: createContext(, auth, db, route.ts, { GET, POST }, context.ts, Context, services.ts
Community 3: { register, onRequestError }, identifyEvlogUser(, identifyUser, instrumentation.ts, evlog.ts, evlog-auth.ts, { withEvlog, useLogger, log, createError }
Community 4: orpc.ts, client, link, orpc
Community 5: page.tsx, LoginPage(, metadata
Community 6: nextConfig, withVarlock, next.config.ts
Community 7: proxy.ts, config, proxy
Community 8: manifest.ts, manifest(
Community 9: page.tsx, Page(
Community 10: loader.tsx, Loader(
Community 11: page.tsx, DashboardPage(
Community 12: auth-client.ts, authClient
Community 13: config, postcss.config.mjs
Community 14: pwa.config.ts, withPwa(
Community 15: page.tsx, SuccessPage(
Community 16: Next.js Agent Rules
Community 17: 96×96 Favicon
Community 18: Apple Touch Icon
Community 19: Offline Page
Community 20: Privana Favicon
Community 21: sw.js
Community 22: env.server.ts
Community 23: 192px Web App Icon
Community 24: 512px Web App Icon

## Instructions

Write a single JSON object mapping each community id (as a string) to its
2-5 word name to: C:\Users\D.Kruger\Documents\privana\apps\web\.engram\label-instructions\communities.json

Example:
```json
{
  "0": "Authentication Flow",
  "1": "Authentication Flow",
  "2": "Authentication Flow"
}
```

Then re-run `engram update` (or `engram label`) to ingest the names.
