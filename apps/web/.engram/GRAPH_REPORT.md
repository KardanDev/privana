# Graph Report - .  (2026-11-04)

## Corpus Check
- Corpus is ~1,781 words - fits in a single context window. You may not need a graph.

## Summary
- 73 nodes · 60 edges · 17 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: contains: 41 · imports_from: 11 · imports: 7 · calls: 1


## Input Scope
- Requested: auto
- Resolved: committed (source: cli)
- Included files: 32 · Candidates: 47
- Excluded: 231 untracked · 68392 ignored · 0 sensitive · 6 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `18eaf31`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `auth` - 4 edges
2. `identifyEvlogUser()` - 3 edges
3. `ThemeProvider()` - 2 edges
4. `createContext()` - 2 edges
5. `identifyUser` - 2 edges
6. `db` - 2 edges
7. `{ register, onRequestError }` - 1 edges
8. `withVarlock` - 1 edges
9. `nextConfig` - 1 edges
10. `config` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Application Shell Providers"
Cohesion: 0.22
Nodes (3): bodyFont, headingFont, ThemeProvider()

### Community 1 - "RPC HTTP Handlers"
Cohesion: 0.22
Nodes (7): apiHandler, DELETE, GET, PATCH, POST, PUT, rpcHandler

### Community 2 - "Authentication Service Context"
Cohesion: 0.36
Nodes (5): { GET, POST }, Context, createContext(), auth, db

### Community 3 - "Error Logging Instrumentation"
Cohesion: 0.29
Nodes (5): { register, onRequestError }, identifyEvlogUser(), identifyUser, { register, onRequestError }, { withEvlog, useLogger, log, createError }

### Community 4 - "oRPC Client Setup"
Cohesion: 0.50
Nodes (3): client, link, orpc

### Community 5 - "Login Screen"
Cohesion: 0.67
Nodes (1): metadata

### Community 6 - "Next.js Configuration"
Cohesion: 0.67
Nodes (2): nextConfig, withVarlock

### Community 7 - "Request Proxy"
Cohesion: 0.67
Nodes (2): config, proxy

### Community 12 - "Browser Auth Client"
Cohesion: 1.00
Nodes (1): authClient

### Community 13 - "PostCSS Configuration"
Cohesion: 1.00
Nodes (1): config

### Community 16 - "Next.js Agent Guidance"
Cohesion: 1.00
Nodes (1): Next.js Agent Rules

### Community 17 - "96px Favicon"
Cohesion: 1.00
Nodes (1): 96×96 Favicon

### Community 18 - "Apple Touch Icon"
Cohesion: 1.00
Nodes (1): Apple Touch Icon

### Community 19 - "Offline Recovery Page"
Cohesion: 1.00
Nodes (1): Offline Page

### Community 20 - "Privana Vector Favicon"
Cohesion: 1.00
Nodes (1): Privana Favicon

### Community 23 - "192px Web App Icon"
Cohesion: 1.00
Nodes (1): 192px Web App Icon

### Community 24 - "512px Web App Icon"
Cohesion: 1.00
Nodes (1): 512px Web App Icon

## Knowledge Gaps
- **31 isolated node(s):** `{ register, onRequestError }`, `withVarlock`, `nextConfig`, `config`, `{ GET, POST }` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Login Screen`** (1 nodes): `metadata`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Configuration`** (2 nodes): `nextConfig`, `withVarlock`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Request Proxy`** (2 nodes): `config`, `proxy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Browser Auth Client`** (1 nodes): `authClient`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Configuration`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Agent Guidance`** (1 nodes): `Next.js Agent Rules`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `96px Favicon`** (1 nodes): `96×96 Favicon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apple Touch Icon`** (1 nodes): `Apple Touch Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Offline Recovery Page`** (1 nodes): `Offline Page`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Privana Vector Favicon`** (1 nodes): `Privana Favicon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `192px Web App Icon`** (1 nodes): `192px Web App Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `512px Web App Icon`** (1 nodes): `512px Web App Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `auth` connect `Authentication Service Context` to `Error Logging Instrumentation`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `identifyEvlogUser()` connect `Error Logging Instrumentation` to `RPC HTTP Handlers`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `{ register, onRequestError }`, `withVarlock`, `nextConfig` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._