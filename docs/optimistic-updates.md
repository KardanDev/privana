# Interaction feedback and cache behavior

Updated November 6, 2026. Privana uses TanStack Query v5 with domain-owned mutation hooks and small cache helpers. The server remains authoritative for access, account permissions, publication state and CMS revisions.

| Area | Immediate feedback | Failure and reconciliation |
| --- | --- | --- |
| Likes and saved posts | Icon, count and saved-feed membership update immediately across loaded post surfaces. | Restore only the affected fields; unrelated concurrent changes survive. Refetch social queries after the last overlapping write. |
| Following | Follow state and follower counts update across profiles, discovery, suggestions and embedded creators. | Restore the affected relationship; the following feed responds immediately. |
| Comments | A labeled pending comment and count appear immediately. | Preserve the text on failure, reconcile the confirmed record, and reuse a stable request ID when retrying. |
| Membership interest | The relationship appears immediately in the membership list. | Roll back on failure. Registering interest grants no subscription access. |
| Messages | An outbox bubble appears immediately while the composer accepts another draft. | Failed attempts expose explicit retry; new typing survives. Stable request IDs prevent duplicate delivery after a lost response. Polling reconciles confirmed records without duplicate bubbles. |
| Notification reads | Unread markers clear immediately. | Restore unread state on failure and refetch only notifications. |
| Account settings | Loaded account name and preferences update immediately. | Restore submitted fields on failure, retain unsaved input, and preserve independently refreshed fields. |
| Creator profile | Approved profile fields update immediately in the studio and exact creator cache. | Roll back on failure. Applications and approval state require server confirmation. |
| Creator archive | The row and active-post count update immediately; a persistent sync notice remains visible. | Restore the row/count on failure. The server confirms actual content access changes. |
| Post creation/editing | Show the pending title and upload/save phase; completed uploads can be reused after a failed save. | Retain form inputs. Confirm publication/visibility before updating public access. New posts reuse a stable request ID on retry. |
| Team operations | Pending row changes are visible immediately and conflicting writes are blocked. | Field-level rollback and scoped operations refreshes. Role/access authorization stays server-side. Revocation success waits for confirmation. |
| CMS | Local draft preview and saving/publishing feedback appear immediately. | Preserve local work on failure. Published configuration and revision numbers change only after the server confirms the versioned operation. |
| Reports and authentication | Show submitting/pending feedback and prevent duplicate submission. | Never display a completed report, login, verification or reset before server confirmation. |
| Payment demo | Local card/Pix steps respond immediately. | Explicit simulation only; no transaction, subscription, payout or access grant. |

## Boundaries

- Shared social cache helpers recognize the actual manual and oRPC query keys; hooks avoid refreshing the entire application after each action.
- Rollbacks restore fields or individual rows rather than replacing whole cached lists. This prevents one failed action from undoing a different successful action.
- Mutation keys guard duplicate submissions across mounted surfaces. Query cancellation prevents stale requests from replacing optimistic state.
- Message, comment and post creation request IDs are payload-bound and ownership-checked by the API; they do not confer authorization. No database schema migration is needed.
- Failed optimistic state is temporary client state. Browser reloads read persisted server records. The simulated checkout is entirely independent of access control.

## Browser evidence

On November 6, delayed/failed requests verified immediate like/bookmark updates and rollback, settings-name rollback with the draft retained, and archive row removal/restoration with a visible pending notice. A real message was committed while its response was deliberately replaced with an error; explicit retry left exactly one persisted message after reload and preserved text typed during the first request.

The interface was inspected at 390px, 768px and desktop widths. Discovery has one search field; the tested screens have no horizontal page overflow. The royal-purple palette has stronger form-control contrast, larger mobile icon targets, persistent light/dark selection and reduced-motion support. Computed browser styles confirm DM Sans body text and Manrope headings.
