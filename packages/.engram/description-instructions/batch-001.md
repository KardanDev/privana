# Node Description Batch 2 of 4

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

- "src_config": "config.ts" | kind=code-symbol | source=db/src/config.ts:L1 | neighbors=[DatabaseConfig, index.ts]
- "src_config_databaseconfig": "DatabaseConfig" | kind=code-symbol | source=db/src/config.ts:L1 | neighbors=[config.ts, index.ts]
- "src_context": "context.ts" | kind=code-symbol | source=api/src/context.ts:L1 | neighbors=[Context, index.ts]
- "src_context_context": "Context" | kind=code-symbol | source=api/src/context.ts:L4 | neighbors=[context.ts, index.ts]
- "components_attachment_attachmentaction": "AttachmentAction()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L146 | neighbors=[attachment.tsx]
- "components_attachment_attachmentactions": "AttachmentActions()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L130 | neighbors=[attachment.tsx]
- "components_attachment_attachmentcontent": "AttachmentContent()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L81 | neighbors=[attachment.tsx]
- "components_attachment_attachmentdescription": "AttachmentDescription()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L113 | neighbors=[attachment.tsx]
- "components_attachment_attachmentgroup": "AttachmentGroup()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L187 | neighbors=[attachment.tsx]
- "components_attachment_attachmenttitle": "AttachmentTitle()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L97 | neighbors=[attachment.tsx]
- "components_attachment_attachmenttrigger": "AttachmentTrigger()" | kind=code-symbol | source=ui/src/components/attachment.tsx:L165 | neighbors=[attachment.tsx]
- "components_bubble_bubblecontent": "BubbleContent()" | kind=code-symbol | source=ui/src/components/bubble.tsx:L64 | neighbors=[bubble.tsx]
- "components_bubble_bubblegroup": "BubbleGroup()" | kind=code-symbol | source=ui/src/components/bubble.tsx:L7 | neighbors=[bubble.tsx]
- "components_card_card": "Card()" | kind=code-symbol | source=ui/src/components/card.tsx:L4 | neighbors=[card.tsx]
- "components_card_cardaction": "CardAction()" | kind=code-symbol | source=ui/src/components/card.tsx:L58 | neighbors=[card.tsx]
- "components_card_cardcontent": "CardContent()" | kind=code-symbol | source=ui/src/components/card.tsx:L71 | neighbors=[card.tsx]
- "components_card_carddescription": "CardDescription()" | kind=code-symbol | source=ui/src/components/card.tsx:L48 | neighbors=[card.tsx]
- "components_card_cardfooter": "CardFooter()" | kind=code-symbol | source=ui/src/components/card.tsx:L81 | neighbors=[card.tsx]
- "components_card_cardheader": "CardHeader()" | kind=code-symbol | source=ui/src/components/card.tsx:L22 | neighbors=[card.tsx]
- "components_card_cardtitle": "CardTitle()" | kind=code-symbol | source=ui/src/components/card.tsx:L35 | neighbors=[card.tsx]
- "components_checkbox_checkbox": "Checkbox()" | kind=code-symbol | source=ui/src/components/checkbox.tsx:L7 | neighbors=[checkbox.tsx]
- "components_dropdown_menu_dropdownmenu": "DropdownMenu()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L8 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenucheckboxitem": "DropdownMenuCheckboxItem()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L153 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenucontent": "DropdownMenuContent()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L20 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenugroup": "DropdownMenuGroup()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L54 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenuitem": "DropdownMenuItem()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L78 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenulabel": "DropdownMenuLabel()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L58 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenuportal": "DropdownMenuPortal()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L12 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenuradiogroup": "DropdownMenuRadioGroup()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L186 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenuradioitem": "DropdownMenuRadioItem()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L195 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenuseparator": "DropdownMenuSeparator()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L226 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenushortcut": "DropdownMenuShortcut()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L239 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenusub": "DropdownMenuSub()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L101 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenusubcontent": "DropdownMenuSubContent()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L129 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenusubtrigger": "DropdownMenuSubTrigger()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L105 | neighbors=[dropdown-menu.tsx]
- "components_dropdown_menu_dropdownmenutrigger": "DropdownMenuTrigger()" | kind=code-symbol | source=ui/src/components/dropdown-menu.tsx:L16 | neighbors=[dropdown-menu.tsx]
- "components_empty_empty": "Empty()" | kind=code-symbol | source=ui/src/components/empty.tsx:L4 | neighbors=[empty.tsx]
- "components_empty_emptycontent": "EmptyContent()" | kind=code-symbol | source=ui/src/components/empty.tsx:L83 | neighbors=[empty.tsx]
- "components_empty_emptydescription": "EmptyDescription()" | kind=code-symbol | source=ui/src/components/empty.tsx:L70 | neighbors=[empty.tsx]
- "components_empty_emptyheader": "EmptyHeader()" | kind=code-symbol | source=ui/src/components/empty.tsx:L17 | neighbors=[empty.tsx]

## Instructions

Write a single JSON object mapping each node id to a one-sentence description
to: C:\Users\D.Kruger\Documents\privana\packages\.engram\description-instructions\batch-001.json

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
