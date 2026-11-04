# Studio and operations polish

Updated October 27, 2026.

- Studio uses compact headings, consistent panel spacing and direct Portuguese labels. Counts remain backed by the product API; subscription copy does not promise live billing.
- Opening a new publication from the profile tab now selects the publication tab. Each selected post mounts its own editor, preventing another post's uncontrolled form values from being submitted under the selected ID.
- Editing fields lock during save/upload and duplicate submissions are ignored. Saving refreshes studio, feed and creator queries, including creator publication counts.
- The modular media field explains accepted formats, the 100 MB limit and access visibility. Editing without selecting another file preserves the existing attachment. Upload failures stay visible in the editor.
- Creator applications respect the published CMS flag. Existing creators retain their profile form when applications are closed. Suspended creators see read-only fields and disabled publication actions; the API remains the authority for access.
- The creator category selector uses published CMS categories and retains an existing category that has been removed from the CMS options. Empty category lists allow free text. CMS help explains that category edits do not migrate existing creator records.
- Operations has one search/filter form per section and a clear-filters control that resets both the visible fields and server-query filters. The separate operations shell has no duplicate global search.

## Validation

- `bunx ultracite check apps/web/src/domains/studio apps/web/src/domains/admin` — 74 files passed.
- `bunx tsc --noEmit -p apps/web/tsconfig.json` — passed.
- `bun test apps/web/tests/admin` — 7 passed, 0 failed.

These checks do not establish live database writes or authenticated browser behavior. Integration verification belongs to the main task after the configured Prisma cloud database is available.
