# Graph Report - .  (2026-11-04)

## Corpus Check
- Corpus is ~4,758 words - fits in a single context window. You may not need a graph.

## Summary
- 125 nodes · 155 edges · 10 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: contains: 100 · imports: 23 · imports_from: 23 · calls: 9


## Input Scope
- Requested: auto
- Resolved: committed (source: cli)
- Included files: 27 · Candidates: 47
- Excluded: 151 untracked · 39526 ignored · 0 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `18eaf31`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `cn()` - 17 edges
2. `Button()` - 5 edges
3. `Context` - 2 edges
4. `DatabaseConfig` - 2 edges
5. `attachmentVariants` - 2 edges
6. `Attachment()` - 2 edges
7. `attachmentMediaVariants` - 2 edges
8. `AttachmentMedia()` - 2 edges
9. `bubbleVariants` - 2 edges
10. `Bubble()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "API Database Context"
Cohesion: 0.13
Nodes (12): DatabaseConfig, Context, adminProcedure, AuthConfig, cmsProcedure, Database, financeProcedure, moderationProcedure (+4 more)

### Community 2 - "Form Utility Components"
Cohesion: 0.21
Nodes (1): cn()

### Community 3 - "Input Group Components"
Cohesion: 0.21
Nodes (6): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, Input(), Textarea()

### Community 4 - "Attachment Components"
Cohesion: 0.20
Nodes (4): Attachment(), AttachmentMedia(), attachmentMediaVariants, attachmentVariants

### Community 5 - "Interactive Messaging Components"
Cohesion: 0.24
Nodes (2): Button(), buttonVariants

### Community 7 - "Empty State Components"
Cohesion: 0.29
Nodes (2): EmptyMedia(), emptyMediaVariants

### Community 8 - "Conversation Bubble Components"
Cohesion: 0.38
Nodes (4): Bubble(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants

### Community 10 - "Marker Components"
Cohesion: 0.50
Nodes (2): Marker(), markerVariants

### Community 11 - "API Router"
Cohesion: 0.67
Nodes (2): appRouter, AppRouterClient

### Community 13 - "Marketplace Payments"
Cohesion: 1.00
Nodes (1): marketplacePayments

## Knowledge Gaps
- **13 isolated node(s):** `o`, `publicProcedure`, `protectedProcedure`, `adminProcedure`, `cmsProcedure` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Form Utility Components`** (1 nodes): `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Interactive Messaging Components`** (2 nodes): `Button()`, `buttonVariants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Empty State Components`** (2 nodes): `EmptyMedia()`, `emptyMediaVariants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Marker Components`** (2 nodes): `Marker()`, `markerVariants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `API Router`** (2 nodes): `appRouter`, `AppRouterClient`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Marketplace Payments`** (1 nodes): `marketplacePayments`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Form Utility Components` to `Attachment Components`, `Conversation Bubble Components`, `Interactive Messaging Components`, `Card Components`, `Dropdown Menu Components`, `Empty State Components`, `Input Group Components`, `Marker Components`, `Message Display Components`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **Why does `Button()` connect `Interactive Messaging Components` to `Attachment Components`, `Input Group Components`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `o`, `publicProcedure`, `protectedProcedure` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Database Context` be split into smaller, more focused modules?**
  _Cohesion score 0.1323529411764706 - nodes in this community are weakly interconnected._
- **Should `Dropdown Menu Components` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._