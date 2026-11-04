# Platform and operations API

Shared types/schema/defaults are in `@privana/api/contracts/platform`. Public `platform.get()` returns only `PlatformConfig`, never draft data. Configuration uses plain text, not executable HTML. Information page addresses are `/pages/{slug}`. Optional logo/announcement destinations use an empty string. Accent must be six-digit hex with at least 4.5:1 white contrast.

## CMS: admin or editor

- `admin.cms.get()` → `CmsDocumentDTO {draft,published,version,publishedAt}`. Defaults start at version 0.
- `admin.cms.saveDraft({config:PlatformConfig,expectedVersion:number})` → `CmsDocumentDTO`.
- `admin.cms.publish({expectedVersion:number})` → `CmsDocumentDTO`.
- `admin.cms.history()` → `CmsRevisionDTO[]` (latest 30 published revisions; each has id, version, publishedAt, publisherId, publisherName).
- `admin.cms.restoreDraft({revisionId:string,expectedVersion:number})` → `CmsDocumentDTO`.

Each mutation increments version, audits the action, and returns the complete document. Reuse the returned version for the next write. Stale expectedVersion returns CONFLICT. Restore changes draft only; publication is explicit. Preview draft locally from the returned draft; public platform.get always returns published.

## Operations

All list inputs are optional objects `{page?:number,search?:string,status?:string}`. Page is zero-based, server page size 25; return `OperationsPageDTO<T> {items,page,hasMore,total}`. Search max 120 chars. Users also accepts `role?:string`; transactions also `currency?:string,kind?:"CHARGE"|"REFUND"`. Invalid status/role/currency inputs fail validation. ISO timestamps throughout.

- `admin.operations.users(input?)` → `OperationsPageDTO<OperationsUserDTO>`; admin/moderator. Item: id,name,email,emailVerified,role,status,createdAt,creatorId.
- `admin.operations.creators(input?)` → `OperationsPageDTO<OperationsCreatorDTO>` (existing CreatorDTO); admin/moderator.
- `admin.operations.reports(input?)` → `OperationsPageDTO<OperationsReportDTO>`; admin/moderator. Item: id,reporterId,postId,creatorId,reason,status,createdAt,resolvedAt.
- `admin.operations.audits(input?)` → `OperationsPageDTO<OperationsAuditDTO>`; admin only. Item: id,actorId,actorName,action,targetId,createdAt. Status ignored/not accepted.
- `admin.operations.subscriptions(input?)` → `OperationsPageDTO<OperationsSubscriptionDTO>`; admin/analyst. Item: id,userId,userName,userEmail,creatorId,creatorName,status,expiresAt,createdAt. Status ACTIVE includes only unexpired active records; EXPIRED includes expired records.
- `admin.operations.transactions(input?)` → `OperationsPageDTO<OperationsTransactionDTO>`; admin/analyst. Item: id,userId,userName,creatorId,creatorName,subscriptionId,provider,externalId,kind,status,amountMinor,currency,occurredAt,createdAt. Kind CHARGE/REFUND; status PENDING/SUCCEEDED/FAILED. Ledger is read-only and contains no synthetic entries.
- `admin.analytics.overview({days?:7|30|90}?)` → `AnalyticsDTO`; admin/analyst. `totals:{users,creators,pendingCreators,posts,activeSubscriptions,openReports}`; `daily:[{date,users,posts,subscriptions,transactions}]` uses UTC calendar dates and zero-fills the selected period; `currencies:[{currency,receivedMinor,refundedMinor,pendingMinor,failedMinor,transactionCount}]` uses all-time ledger aggregates. Currency amounts are integer minor units and never combined across currencies. received/refunded distinguish successful charges/refunds; pending/failed are absolute entry totals.

## Mutations and permissions

- `admin.setTeamRole({id,role:"member"|"editor"|"moderator"|"analyst"})` → `{success:true}`; admin only; existing active verified users only. Self changes and other admin changes are blocked. New super-admins use the operator bootstrap.
- `admin.revokeSubscription({id,reason})` → `{success:true}`; admin only. Reason 10–1000 characters. Revokes local content access and records an audit event; does not cancel/refund anything at a processor.
- Existing `admin.setUserStatus`, `setCreatorStatus`, `resolveReport`, `reportDetails` now also allow moderators; privileged user suspension remains blocked. Existing `admin.overview` stays admin-only.

Team matrix: admin all operations; editor CMS; moderator users/creators/reports; analyst aggregate analytics and subscriptions/ledger. All permissions read current database role/status, never stale session claims. Registration, new creator applications, and sending/starting messages enforce the published feature flags at their server boundaries. Existing profiles may still be edited when new applications are closed; message history remains readable when sending is disabled.
