# Independent implementation review

Reviewed October 24, 2026. Static, read-only review of the product API, authentication configuration and email transport, media endpoints, and the relevant consuming interfaces. No database mutations, secret configuration reads, external messages, or repeated test suite runs were performed. Findings describe the reviewed snapshot; concurrent implementation work may address them afterward.

## Confirmed findings

### P2: Uploaded MP4 posts have no player

`apps/web/src/domains/posts/post-card.tsx:35` selects `mediaUrl` only for image MIME types, and the component contains no video element. The studio accepts MP4, the backend stores it, and the delivery endpoint can stream it, but readers cannot play it from the product interface.

Reproduction: an approved creator uploads an MP4 and publishes a public post, then opens their creator page or feed. The text and optional preview appear, but the video does not. Render an authorized video player using the existing private delivery URL.

### P2: Studio records become inaccessible after 50 newer posts

`packages/api/src/domains/studio/overview.ts:28` retrieves only the latest 50 posts without a cursor. It includes archived posts; `apps/web/src/domains/studio/studio-screen.tsx` subsequently removes archives in the browser. Older published posts remain public but cannot be selected for editing or archival through the studio.

Reproduction: publish one post, then create and archive 50 newer posts. The overview count includes the original active post, but the studio displays an empty state. Exclude archives in the database query and provide bounded cursor pagination for remaining posts.

### P2: Conversation history is permanently truncated in the interface

`packages/api/src/domains/messages/get.ts:6` accepts only a conversation ID, and line 17 retrieves the newest 50 messages. There is no older-message cursor or separate endpoint. The messages remain persisted but are inaccessible through the app once the conversation passes 50 messages.

Reproduction: exchange 51 messages in one conversation and reopen it. The first message cannot be retrieved through the available history API. Return a bounded page with an older-message cursor and expose a load-earlier action.

### P2: Report review lacks access to the reported content

`apps/web/src/domains/admin/admin-report-row.tsx:55` renders the post ID as plain text. `packages/api/src/domains/admin/overview.ts` returns report records without the associated post or creator context, and the router has no admin post lookup. A post report has no creator ID to map through the current creator list. The administrator can resolve/dismiss the report but cannot directly inspect its subject or reliably identify the creator from that row.

Reproduction: submit a report on a post and open administration. The owner sees the reason and an opaque post ID. If the author archives the post, public feed queries cannot locate it at all. Provide an admin-authorized report detail that includes the target post/creator and preserves access to archived targets. No need to expose this information through public procedures.

## Follow-up concerns

- `packages/api/src/domains/posts/serialize-post.ts:13` performs four per-post Prisma lookups; `serializeCreator` adds a fifth follow lookup for authenticated viewers. A maximum feed page invokes 120 ancillary lookups and a 50-post studio invokes 250, although Prisma's batching may reduce actual SQL round trips. Fetch shared creator status and viewer relations in the page query or batch them explicitly. Actual database round-trip counts were not measured.
- `apps/web/src/app/api/rpc/[[...rest]]/route.ts:17` and line 29 log complete errors. Prisma error formatting can include invocation arguments, so full errors from content writes warrant redaction. This review did not reproduce a sensitive log leak; use a bounded error code/request identifier rather than serializing arbitrary errors.
- Private Blob upload/playback and delivered verification/reset emails still need real integration verification. Unit doubles and static inspection do not establish provider configuration or deployment behavior.

## Authorization observations

No confirmed critical authorization bypass was found in the reviewed paths. Post serialization redacts premium body/media, private media rechecks access, upload completion checks ownership and provider metadata, application procedures refresh user status and role, and conversation access checks participation. Owner bootstrap is server-side and additional auth role/status fields disallow client input. These are static observations, not a production readiness certification. Deferred live payments are intentional and are not a finding.

## Resolution review — October 25, 2026

The four original P2 findings above are retained as the historical review record. Static inspection of the revised implementation and its focused test sources found all four addressed:

| Original finding | Current status and evidence |
| --- | --- |
| Missing MP4 playback | Addressed. `apps/web/src/domains/posts/post-media.tsx` renders native video controls for authorized MP4 media using `/api/media/{postId}`. Locked posts cannot render the private video source. Both member posts and admin inspection consume this component. |
| Studio's inaccessible older posts | Addressed. `packages/api/src/domains/studio/overview.ts` excludes archived records in the database query, orders by creation time and ID, and returns a cursor after at most 24 posts. `use-studio-screen.ts` and `studio-load-more.tsx` load subsequent pages. |
| Truncated conversation history | Addressed. `packages/api/src/domains/messages/get.ts` accepts a `before` boundary scoped to the authorized conversation and uses creation time plus ID for deterministic pagination. `conversation-panel.tsx` exposes earlier pages; `merge-message-pages.ts` deduplicates and orders loaded messages. Participant authorization precedes boundary lookup. |
| Uninspectable reported content | Addressed. `packages/api/src/domains/admin/report-details.ts` uses the existing current-role/current-status admin guard and returns associated post and creator context, including archived or suspended targets. It returns an authorized media endpoint rather than a storage key. `admin-report-details.tsx` and `admin-report-inspection.tsx` expose this inspection from each report. |

The RPC route also no longer calls `console.error` on arbitrary errors, addressing the specific logging concern above. This does not assert that every logging path in the application has been audited.

No new confirmed functional or authorization defect was identified in these changes. The per-post query amplification concern remains **pending** while the backend changes are in progress; this resolution review does not mark it fixed. Real private-storage playback and deployed email delivery remain integration verification items, outside this static review.

Reviewed focused test sources for video rendering/redaction, history boundaries and participant denial, studio archive filtering and cursor traversal, and admin report content/authorization. No tests were executed in this follow-up; it makes no claim about runtime test results. Only this report was modified.
