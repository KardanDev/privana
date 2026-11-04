# Owner administration implementation

Implemented October 24, 2026.

- `/admin` checks the current authenticated administrator on the server with `requireAdmin()` before rendering. Its metadata excludes indexing.
- The dashboard displays actual database counts for people, creators, pending creators and open reports.
- Four sections manage creators, people, reports and audit history. Creator approval/reactivation, creator suspension, member suspension/reactivation and report resolution/dismissal call the existing protected oRPC procedures. Protected admin/self accounts cannot be suspended through this interface.
- Suspending a creator or account requires a separate native modal confirmation naming the target and describing the consequence. Native dialog behavior provides focus containment and Escape/cancel handling; buttons are disabled while saving. Mutation errors remain visible and successful mutations refresh records and totals.
- Search is submitted explicitly and performed on the server, with 50 records per page. Previous/next navigation uses section-specific continuation flags. Search and section changes return to page 1. Search results explain that top-level totals remain global.
- Report reasons preserve line breaks and wrap long text; IDs, reporter, creation/resolution dates and available creator links remain visible. An expandable inspection loads the target's full body, title, status, visibility and creator context through `admin.reportDetails`, including archived/private content for current administrators. Media uses the existing authorized delivery endpoint and renderer. Closing a report does not pretend to suspend its target.
- Audit entries show translated known actions, responsible user IDs, target IDs and dates. No simulated financial data or role editing was added.

## API adjustment

`admin.overview` accepts an optional `{ search?: string, page?: number }`. Omitted input remains valid; page is zero-based and defaults to 0. Search is trimmed, case-insensitive and limited to 200 characters; pages are integers from 0 through 10000. Each query fetches 51 rows to detect another page and returns at most 50 in descending creation/id order.

The response adds `metrics` and `pagination: { page, hasMore, hasMoreBySection: { creators, users, reports, audits } }`. Existing arrays retain their names. Metrics ignore the search filter. The API contract document now specifies searchable fields. Creator serialization avoids unnecessary follow lookups in the admin response.

## Verification

- `bunx tsc -b packages/api` — passed.
- `bunx tsc --noEmit -p apps/web/tsconfig.json` — passed.
- `bunx ultracite check apps/web/src/domains/admin apps/web/src/app/admin/page.tsx packages/api/src/domains/admin/overview.ts packages/api/tests/admin-overview.test.ts` — 20 files checked, no errors or fixes.
- `bun test packages/api/tests` — 21 tests passed, including eight new admin overview cases covering omitted input, pagination bounds, server search, global counts and access denial.

Runtime browser verification is left to the parent integration task, which owns app startup and the authenticated browser session. No account was promoted and no database rows, payment configuration, dependency manifests or shared layout files were changed by this implementation.

## Reviewer follow-up

Studio posts now use 24-record cursor pages after excluding archived posts in the database, replacing the original 50-record slice. The UI merges pages with TanStack Query's infinite query support and preserves already loaded posts when loading another page fails. Archive invalidation refetches from the first page and derives replacement cursors, so archiving a previous page tail cannot hide older live posts.

New tests exercise 50 archived posts preceding 30 live posts, older-page retrieval, archiving/refetching a page tail, studio authentication, report detail access denial, archived premium inspection, storage-key redaction, private media authorization, creator-only reports and missing reports. API and web TypeScript and the scoped Ultracite check pass after these additions.

## Practical limits

Admin list pagination uses database offsets; rows created concurrently can shift page boundaries. Creator links on reports are provided when the corresponding active creator is present in the loaded creator results; otherwise the creator ID remains visible and the expandable inspection loads context independently. Audit DTOs currently expose action/actor/target/time but do not include before/after metadata.
