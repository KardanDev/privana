# Node Description Batch 4 of 4

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

- "src_index_protectedprocedure": "protectedProcedure" | kind=code-symbol | source=api/src/index.ts:L14 | neighbors=[index.ts]
- "src_index_publicprocedure": "publicProcedure" | kind=code-symbol | source=api/src/index.ts:L4 | neighbors=[index.ts]
- "src_index_session": "Session" | kind=code-symbol | source=auth/src/index.ts:L157 | neighbors=[index.ts]
- "db_prisma_config": "prisma.config.ts" | kind=code-symbol | source=db/prisma.config.ts:L1
- "ui_postcss_config": "postcss.config.mjs" | kind=code-symbol | source=ui/postcss.config.mjs:L1

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\D.Kruger\Documents\privana\packages\.engram\description-instructions\batch-003.json

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
