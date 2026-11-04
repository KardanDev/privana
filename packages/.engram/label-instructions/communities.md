# Community Labeling

Engram is running in assistant/skill mode (no API key). You are the host
assistant (Claude Code / Codex / Gemini CLI). Read the community listing below
and write 2-5 word plain-language names for each.

## Language

Write every name in English (en). Do not switch languages.

## Communities

Community 0: DatabaseConfig, Context, config.ts, context.ts, index.ts, adminProcedure, AuthConfig, cmsProcedure, createAuth(, createPrismaClient(, Database, financeProcedure
Community 1: dropdown-menu.tsx, DropdownMenu(, DropdownMenuCheckboxItem(, DropdownMenuContent(, DropdownMenuGroup(, DropdownMenuItem(, DropdownMenuLabel(, DropdownMenuPortal(, DropdownMenuRadioGroup(, DropdownMenuRadioItem(, DropdownMenuSeparator(, DropdownMenuShortcut(
Community 2: cn(, checkbox.tsx, Checkbox(, label.tsx, Label(, skeleton.tsx, Skeleton(, tooltip.tsx, Tooltip(, TooltipContent(, TooltipProvider(, TooltipTrigger(
Community 3: input.tsx, input-group.tsx, InputGroup(, InputGroupAddon(, inputGroupAddonVariants, InputGroupButton(, inputGroupButtonVariants, InputGroupInput(, InputGroupText(, InputGroupTextarea(, Input(, textarea.tsx
Community 4: Attachment(, AttachmentMedia(, attachmentMediaVariants, attachmentVariants, attachment.tsx, AttachmentAction(, AttachmentActions(, AttachmentContent(, AttachmentDescription(, AttachmentGroup(, AttachmentTitle(, AttachmentTrigger(
Community 5: Button(, button.tsx, buttonVariants, message-scroller.tsx, MessageScroller(, MessageScrollerButton(, MessageScrollerContent(, MessageScrollerItem(, MessageScrollerProvider(, MessageScrollerViewport(
Community 6: card.tsx, Card(, CardAction(, CardContent(, CardDescription(, CardFooter(, CardHeader(, CardTitle(
Community 7: empty.tsx, Empty(, EmptyContent(, EmptyDescription(, EmptyHeader(, EmptyMedia(, emptyMediaVariants, EmptyTitle(
Community 8: Bubble(, bubbleVariants, bubble.tsx, BubbleContent(, BubbleGroup(, BubbleReactions(, bubbleReactionsVariants
Community 9: message.tsx, Message(, MessageAvatar(, MessageContent(, MessageFooter(, MessageGroup(, MessageHeader(
Community 10: marker.tsx, Marker(, MarkerContent(, MarkerIcon(, markerVariants
Community 11: index.ts, appRouter, AppRouterClient
Community 12: sonner.tsx, Toaster(
Community 13: payments.ts, marketplacePayments
Community 14: prisma.config.ts
Community 15: postcss.config.mjs

## Instructions

Write a single JSON object mapping each community id (as a string) to its
2-5 word name to: C:\Users\D.Kruger\Documents\privana\packages\.engram\label-instructions\communities.json

Example:
```json
{
  "0": "Authentication Flow",
  "1": "Authentication Flow",
  "2": "Authentication Flow"
}
```

Then re-run `engram update` (or `engram label`) to ingest the names.
