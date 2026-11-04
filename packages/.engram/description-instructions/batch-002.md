# Node Description Batch 3 of 4

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

- "components_empty_emptytitle": "EmptyTitle()" | kind=code-symbol | source=ui/src/components/empty.tsx:L57 | neighbors=[empty.tsx]
- "components_input_group_inputgroup": "InputGroup()" | kind=code-symbol | source=ui/src/components/input-group.tsx:L10 | neighbors=[input-group.tsx]
- "components_input_group_inputgroupinput": "InputGroupInput()" | kind=code-symbol | source=ui/src/components/input-group.tsx:L114 | neighbors=[input-group.tsx]
- "components_input_group_inputgrouptext": "InputGroupText()" | kind=code-symbol | source=ui/src/components/input-group.tsx:L102 | neighbors=[input-group.tsx]
- "components_input_group_inputgrouptextarea": "InputGroupTextarea()" | kind=code-symbol | source=ui/src/components/input-group.tsx:L130 | neighbors=[input-group.tsx]
- "components_label_label": "Label()" | kind=code-symbol | source=ui/src/components/label.tsx:L6 | neighbors=[label.tsx]
- "components_marker_markercontent": "MarkerContent()" | kind=code-symbol | source=ui/src/components/marker.tsx:L57 | neighbors=[marker.tsx]
- "components_marker_markericon": "MarkerIcon()" | kind=code-symbol | source=ui/src/components/marker.tsx:L43 | neighbors=[marker.tsx]
- "components_message_message": "Message()" | kind=code-symbol | source=ui/src/components/message.tsx:L14 | neighbors=[message.tsx]
- "components_message_messageavatar": "MessageAvatar()" | kind=code-symbol | source=ui/src/components/message.tsx:L32 | neighbors=[message.tsx]
- "components_message_messagecontent": "MessageContent()" | kind=code-symbol | source=ui/src/components/message.tsx:L45 | neighbors=[message.tsx]
- "components_message_messagefooter": "MessageFooter()" | kind=code-symbol | source=ui/src/components/message.tsx:L71 | neighbors=[message.tsx]
- "components_message_messagegroup": "MessageGroup()" | kind=code-symbol | source=ui/src/components/message.tsx:L4 | neighbors=[message.tsx]
- "components_message_messageheader": "MessageHeader()" | kind=code-symbol | source=ui/src/components/message.tsx:L58 | neighbors=[message.tsx]
- "components_message_scroller_messagescroller": "MessageScroller()" | kind=code-symbol | source=ui/src/components/message-scroller.tsx:L15 | neighbors=[message-scroller.tsx]
- "components_message_scroller_messagescrollerbutton": "MessageScrollerButton()" | kind=code-symbol | source=ui/src/components/message-scroller.tsx:L81 | neighbors=[message-scroller.tsx]
- "components_message_scroller_messagescrollercontent": "MessageScrollerContent()" | kind=code-symbol | source=ui/src/components/message-scroller.tsx:L47 | neighbors=[message-scroller.tsx]
- "components_message_scroller_messagescrolleritem": "MessageScrollerItem()" | kind=code-symbol | source=ui/src/components/message-scroller.tsx:L63 | neighbors=[message-scroller.tsx]
- "components_message_scroller_messagescrollerprovider": "MessageScrollerProvider()" | kind=code-symbol | source=ui/src/components/message-scroller.tsx:L9 | neighbors=[message-scroller.tsx]
- "components_message_scroller_messagescrollerviewport": "MessageScrollerViewport()" | kind=code-symbol | source=ui/src/components/message-scroller.tsx:L31 | neighbors=[message-scroller.tsx]
- "components_skeleton_skeleton": "Skeleton()" | kind=code-symbol | source=ui/src/components/skeleton.tsx:L3 | neighbors=[skeleton.tsx]
- "components_sonner": "sonner.tsx" | kind=code-symbol | source=ui/src/components/sonner.tsx:L1 | neighbors=[Toaster()]
- "components_sonner_toaster": "Toaster()" | kind=code-symbol | source=ui/src/components/sonner.tsx:L13 | neighbors=[sonner.tsx]
- "components_tooltip_tooltip": "Tooltip()" | kind=code-symbol | source=ui/src/components/tooltip.tsx:L19 | neighbors=[tooltip.tsx]
- "components_tooltip_tooltipcontent": "TooltipContent()" | kind=code-symbol | source=ui/src/components/tooltip.tsx:L27 | neighbors=[tooltip.tsx]
- "components_tooltip_tooltipprovider": "TooltipProvider()" | kind=code-symbol | source=ui/src/components/tooltip.tsx:L6 | neighbors=[tooltip.tsx]
- "components_tooltip_tooltiptrigger": "TooltipTrigger()" | kind=code-symbol | source=ui/src/components/tooltip.tsx:L23 | neighbors=[tooltip.tsx]
- "lib_payments": "payments.ts" | kind=code-symbol | source=auth/src/lib/payments.ts:L1 | neighbors=[marketplacePayments]
- "lib_payments_marketplacepayments": "marketplacePayments" | kind=code-symbol | source=auth/src/lib/payments.ts:L1 | neighbors=[payments.ts]
- "routers_index_approuter": "appRouter" | kind=code-symbol | source=api/src/routers/index.ts:L46 | neighbors=[index.ts]
- "routers_index_approuterclient": "AppRouterClient" | kind=code-symbol | source=api/src/routers/index.ts:L90 | neighbors=[index.ts]
- "src_index_adminprocedure": "adminProcedure" | kind=code-symbol | source=api/src/index.ts:L22 | neighbors=[index.ts]
- "src_index_authconfig": "AuthConfig" | kind=code-symbol | source=auth/src/index.ts:L14 | neighbors=[index.ts]
- "src_index_cmsprocedure": "cmsProcedure" | kind=code-symbol | source=api/src/index.ts:L28 | neighbors=[index.ts]
- "src_index_createauth": "createAuth()" | kind=code-symbol | source=auth/src/index.ts:L21 | neighbors=[index.ts]
- "src_index_createprismaclient": "createPrismaClient()" | kind=code-symbol | source=db/src/index.ts:L6 | neighbors=[index.ts]
- "src_index_database": "Database" | kind=code-symbol | source=db/src/index.ts:L19 | neighbors=[index.ts]
- "src_index_financeprocedure": "financeProcedure" | kind=code-symbol | source=api/src/index.ts:L45 | neighbors=[index.ts]
- "src_index_moderationprocedure": "moderationProcedure" | kind=code-symbol | source=api/src/index.ts:L34 | neighbors=[index.ts]
- "src_index_o": "o" | kind=code-symbol | source=api/src/index.ts:L3 | neighbors=[index.ts]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\D.Kruger\Documents\privana\packages\.engram\description-instructions\batch-002.json

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
