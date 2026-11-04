# Privana API contract

All dates are ISO strings. Prices are integer BRL centavos. Procedure names are stable. List inputs are optional objects with cursor?: string and limit?: number (default 12, max 24). Return lists as { items, nextCursor }. DTO definitions: packages/api/src/contracts/product.ts.

- viewer.get -> ViewerDTO | null.
- creators.list({search?,category?,cursor?,limit?}); creators.get({handle}) -> CreatorDTO; creators.setFollow({creatorId,following}).
- feed.list({creatorId?,saved?,following?,cursor?,limit?}) -> PageDTO<PostDTO>.
- posts.setLike({postId,liked}); posts.setBookmark({postId,bookmarked}); posts.comments({postId,cursor?,limit?}); posts.addComment({postId,body}).
- memberships.list() -> MembershipDTO[]; memberships.request({creatorId}) -> {status:"INTEREST_REGISTERED"} (does not grant access).
- messages.list() -> ConversationDTO[]; messages.get({conversationId,before?:messageId}) -> MessageDTO[] (up to 50, chronological order; pass the first/oldest returned ID to fetch the preceding page; participant-scoped cursor, stable createdAt/id ordering); messages.send({conversationId,body}); messages.start({userId}) -> {id}.
- notifications.list() -> NotificationDTO[]; notifications.markRead({id?}) -> {success:true}.
- settings.get() -> SettingsDTO; settings.update({name,image?,emailNotifications,locale?}).
- studio.overview({cursor?}?) -> {profile: CreatorDTO|null, posts: PostDTO[], nextCursor:string|null, metrics:{followers,posts,activeSubscriptions,interests}}. Each page contains up to 24 non-archived posts ordered by createdAt/id descending; global studio metrics cover the creator's full account. The optional cursor is the final returned post ID. No profile yields empty posts and a null cursor.
- studio.saveProfile({handle,displayName,bio,category,location,avatarUrl?,coverUrl?,monthlyPriceCents}) -> CreatorDTO. New applications are PENDING.
- studio.savePost({id?,title,excerpt,body,visibility:"PUBLIC"|"SUBSCRIBERS",status:"DRAFT"|"PUBLISHED"|"ARCHIVED",previewUrl?,mediaKey?,mediaType?}) -> {id}. studio.deletePost({id}) archives.
- admin.overview({search?,page?}?) -> {creators,users,reports,audits,metrics:{users,creators,pendingCreators,openReports},pagination:{page,hasMore,hasMoreBySection:{creators,users,reports,audits}}}. The optional zero-based page defaults to 0 (max 10000). Each section returns at most 50 records ordered by createdAt/id descending. Search is trimmed, case-insensitive, max 200 characters: creators by displayName/handle, users by name/email, reports by reason/id, audits by action/targetId. Metrics always cover the entire database; hasMore is true if any section has another page. admin.setCreatorStatus({id,status:"ACTIVE"|"SUSPENDED"}); admin.setUserStatus({id,status:"ACTIVE"|"SUSPENDED"}); admin.resolveReport({id,status:"RESOLVED"|"DISMISSED"}).
- reports.create({postId?,creatorId?,reason}) -> {id}.
- admin.reportDetails({id}) -> {id,reason,status,reporterId,createdAt,resolvedAt,creator,post}. Available only to a current active administrator. Creator context includes identity, biography, category, location, profile status and account status; it falls back to the post's creator for post-only reports. The target post includes its full body, title, excerpt, visibility and status (including drafts/archived), date and media type. Media uses authorized /api/media/{postId} URLs; raw storage keys are never returned. Missing/deleted post and creator relations are null.

Protected actions re-read current user status from database. Private media URLs are authorized /api/media/{postId} endpoints. Premium body/media are null when locked. Authentication failure is UNAUTHORIZED; authorization failure is FORBIDDEN. No fabricated seed fallback or paid checkout exists.
