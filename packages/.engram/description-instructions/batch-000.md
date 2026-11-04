# Node Description Batch 1 of 4

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

- "components_dropdown_menu": "dropdown-menu.tsx" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L1 | neighbors=[DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem(), DropdownMenuLabel()]
- "lib_utils": "utils.ts" | kind=code-symbol | source=ui/src/lib/utils.ts:L1 | neighbors=[attachment.tsx, bubble.tsx, button.tsx, card.tsx, checkbox.tsx, dropdown-menu.tsx]
- "lib_utils_cn": "cn()" | kind=code-symbol | source=ui/src/lib/utils.ts:L3 | neighbors=[attachment.tsx, bubble.tsx, button.tsx, card.tsx, checkbox.tsx, dropdown-menu.tsx]
- "components_input_group": "input-group.tsx" | kind=code-symbol | source=ui/src/components/input-group.tsx:L1 | neighbors=[button.tsx, Button(), input.tsx, InputGroup(), InputGroupAddon(), inputGroupAddonVariants]
- "src_index": "index.ts" | kind=code-symbol | source=db/src/index.ts:L1 | neighbors=[config.ts, DatabaseConfig, context.ts, Context, adminProcedure, AuthConfig]
- "components_attachment": "attachment.tsx" | kind=code-symbol | source=ui/src/components/attachment.tsx:L1 | neighbors=[Attachment(), AttachmentAction(), AttachmentActions(), AttachmentContent(), AttachmentDescription(), AttachmentGroup()]
- "components_message_scroller": "message-scroller.tsx" | kind=code-symbol | source=ui/src/components/message-scroller.tsx:L1 | neighbors=[button.tsx, Button(), MessageScroller(), MessageScrollerButton(), MessageScrollerContent(), MessageScrollerItem()]
- "components_card": "card.tsx" | kind=code-symbol | source=ui/src/components/card.tsx:L1 | neighbors=[Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader()]
- "components_empty": "empty.tsx" | kind=code-symbol | source=ui/src/components/empty.tsx:L1 | neighbors=[Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants]
- "components_bubble": "bubble.tsx" | kind=code-symbol | source=ui/src/components/bubble.tsx:L1 | neighbors=[Bubble(), BubbleContent(), BubbleGroup(), BubbleReactions(), bubbleReactionsVariants, bubbleVariants]
- "components_message": "message.tsx" | kind=code-symbol | source=ui/src/components/message.tsx:L1 | neighbors=[Message(), MessageAvatar(), MessageContent(), MessageFooter(), MessageGroup(), MessageHeader()]
- "components_button": "button.tsx" | kind=code-symbol | source=ui/src/components/button.tsx:L1 | neighbors=[attachment.tsx, Button(), buttonVariants, utils.ts, cn(), input-group.tsx]
- "components_marker": "marker.tsx" | kind=code-symbol | source=ui/src/components/marker.tsx:L1 | neighbors=[Marker(), MarkerContent(), MarkerIcon(), markerVariants, utils.ts, cn()]
- "components_tooltip": "tooltip.tsx" | kind=code-symbol | source=ui/src/components/tooltip.tsx:L1 | neighbors=[Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger(), utils.ts, cn()]
- "components_button_button": "Button()" | kind=code-symbol | source=ui/src/components/button.tsx:L40 | neighbors=[attachment.tsx, button.tsx, buttonVariants, input-group.tsx, message-scroller.tsx]
- "components_input": "input.tsx" | kind=code-symbol | source=ui/src/components/input.tsx:L1 | neighbors=[Input(), utils.ts, cn(), input-group.tsx]
- "components_textarea": "textarea.tsx" | kind=code-symbol | source=ui/src/components/textarea.tsx:L1 | neighbors=[input-group.tsx, Textarea(), utils.ts, cn()]
- "components_checkbox": "checkbox.tsx" | kind=code-symbol | source=ui/src/components/checkbox.tsx:L1 | neighbors=[Checkbox(), utils.ts, cn()]
- "components_label": "label.tsx" | kind=code-symbol | source=ui/src/components/label.tsx:L1 | neighbors=[Label(), utils.ts, cn()]
- "components_skeleton": "skeleton.tsx" | kind=code-symbol | source=ui/src/components/skeleton.tsx:L1 | neighbors=[Skeleton(), utils.ts, cn()]
- "components_attachment_attachment": "Attachment()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L26 | neighbors=[attachment.tsx, attachmentVariants]
- "components_attachment_attachmentmedia": "AttachmentMedia()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L66 | neighbors=[attachment.tsx, attachmentMediaVariants]
- "components_attachment_attachmentmediavariants": "attachmentMediaVariants" | kind=code-symbol | source=ui/src/components/attachment.tsx:L50 | neighbors=[attachment.tsx, AttachmentMedia()]
- "components_attachment_attachmentvariants": "attachmentVariants" | kind=code-symbol | source=ui/src/components/attachment.tsx:L8 | neighbors=[attachment.tsx, Attachment()]
- "components_bubble_bubble": "Bubble()" | kind=code-symbol | source=ui/src/components/bubble.tsx:L44 | neighbors=[bubble.tsx, bubbleVariants]
- "components_bubble_bubblereactions": "BubbleReactions()" | kind=code-symbol | source=ui/src/components/bubble.tsx:L107 | neighbors=[bubble.tsx, bubbleReactionsVariants]
- "components_bubble_bubblereactionsvariants": "bubbleReactionsVariants" | kind=code-symbol | source=ui/src/components/bubble.tsx:L87 | neighbors=[bubble.tsx, BubbleReactions()]
- "components_bubble_bubblevariants": "bubbleVariants" | kind=code-symbol | source=ui/src/components/bubble.tsx:L17 | neighbors=[bubble.tsx, Bubble()]
- "components_button_buttonvariants": "buttonVariants" | kind=code-symbol | source=ui/src/components/button.tsx:L5 | neighbors=[button.tsx, Button()]
- "components_empty_emptymedia": "EmptyMedia()" | kind=code-symbol | source=ui/src/components/empty.tsx:L42 | neighbors=[empty.tsx, emptyMediaVariants]
- "components_empty_emptymediavariants": "emptyMediaVariants" | kind=code-symbol | source=ui/src/components/empty.tsx:L27 | neighbors=[empty.tsx, EmptyMedia()]
- "components_input_group_inputgroupaddon": "InputGroupAddon()" | kind=code-symbol | source=ui/src/components/input-group.tsx:L49 | neighbors=[input-group.tsx, inputGroupAddonVariants]
- "components_input_group_inputgroupaddonvariants": "inputGroupAddonVariants" | kind=code-symbol | source=ui/src/components/input-group.tsx:L28 | neighbors=[input-group.tsx, InputGroupAddon()]
- "components_input_group_inputgroupbutton": "InputGroupButton()" | kind=code-symbol | source=ui/src/components/input-group.tsx:L81 | neighbors=[input-group.tsx, inputGroupButtonVariants]
- "components_input_group_inputgroupbuttonvariants": "inputGroupButtonVariants" | kind=code-symbol | source=ui/src/components/input-group.tsx:L64 | neighbors=[input-group.tsx, InputGroupButton()]
- "components_input_input": "Input()" | kind=code-symbol | source=ui/src/components/input.tsx:L5 | neighbors=[input.tsx, input-group.tsx]
- "components_marker_marker": "Marker()" | kind=code-symbol | source=ui/src/components/marker.tsx:L21 | neighbors=[marker.tsx, markerVariants]
- "components_marker_markervariants": "markerVariants" | kind=code-symbol | source=ui/src/components/marker.tsx:L7 | neighbors=[marker.tsx, Marker()]
- "components_textarea_textarea": "Textarea()" | kind=code-symbol | source=ui/src/components/textarea.tsx:L4 | neighbors=[input-group.tsx, textarea.tsx]
- "routers_index": "index.ts" | kind=code-symbol | source=api/src/routers/index.ts:L1 | neighbors=[appRouter, AppRouterClient]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\D.Kruger\Documents\privana\packages\.engram\description-instructions\batch-000.json

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
