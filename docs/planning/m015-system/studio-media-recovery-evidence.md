# KAR-200 — Confirmed media retry recovery

An unreadable media-confirmation reply exposed an English JSON parser error in the post editor. The client now reports in Portuguese that confirmation failed and offers retry, retaining the original cause for diagnostics. Specific server/validation messages, media ownership/type/key checks, save identity and publication authority remain intact. The production diff only catches failure to decode the application completion response.

## Review artifacts

- [Before: raw parser error, desktop/light](review/studio-media-recovery/before-desktop-completion-light.png) and [after: localized confirmation guidance](review/studio-media-recovery/after-desktop-completion-light.jpg).
- [Unconfirmed media stays pending, 320px/dark](review/studio-media-recovery/phone-unconfirmed-dark.jpg) and [confirmed media retained after save failure, 320px/light](review/studio-media-recovery/phone-retry-light.jpg).

The baseline is the actual failed localized-message assertion on unchanged main `b166ffd` (exit 1). Captures are scrolled form states in the existing fictional actual-editor wrapper, not authenticated Studio layouts or pixel-matched goldens. The packet records theme/viewport/overflow and source/bundle/capture hashes. Existing Proximidade typography, colors, geometry and the combined sending/verification message are preserved.

## Verification and limits

The actual PostEditor/usePostForm/uploadMedia and installed `@upstash/blob` browser SDK run against intercepted begin → one-part multipart PUT → SDK end → application completion → post-save replies. Each held stage keeps file/close controls disabled; no post-save request precedes application confirmation. A double submission produces one pipeline. After confirmed media and a rejected post-save reply, unchanged retry retains its full payload/creation ID with no additional begin, PUT bytes or completion request, and exits only after save acknowledgment.

Changed file objects with the same filename/size and changed fictional owners request fresh media. Rejected PUT/SDK end/application completion, unreadable JSON, mismatched key/type and foreign owner paths block post-save and permit a fresh attempt. The fixtures explicitly refuse SDK resume lookups; they verify application recovery, not resumability. The current client starts another upload when media confirmation was never accepted locally; ambiguous provider/completion outcomes, durable sessions/status, expiry and orphan cleanup remain KAR-29.

The existing [media-handler tests](../../../apps/web/tests/media/media-handlers.test.ts) cover origin/actor refusal before storage calls, authoritative completion metadata and MIME mismatch refusal with injected dependencies. [Post idempotency/access tests](../../../packages/api/tests/post-idempotency.test.ts) preserve changed-payload conflicts and server media authority. Browser counters, fictional completion tokens, same-origin storage replies and role payloads do not prove storage, persistence, authenticated account switching or provider acceptance. SDK protocol was checked against installed source and [official upload documentation](https://github.com/upstash/docs/blob/main/blob/uploads/upload-client.mdx).

Focused browser checks pass 33 cases; the full catalogue passes 252 (2.3m). Deterministic tests pass 313 across 60 files, 906 assertions. Workspace types pass five tasks (four cached), tooling types and scoped lint on five code files pass. Production build passes (four tasks, three cached, 9.261s). The audit verifies 20 annotated rasters, 15 after frames, four exact-copy representatives and six relative links, with matching source/bundle hashes and no problems. No dependency, schema, runtime/service configuration, seed, live login/save/upload or deployment changes occur; catalogue configuration registers this suite. Rollback is the issue commit.

KAR-199 is accepted through PR #34. KAR-201/202 and parent KAR-196/149/G2 acceptance remain held. Inherited seed-roll corroboration, QUALITYBAR/ceiling, authority wording/breakpoint and critique-reference gaps stay disclosed; this packet does not establish clean Impeccable SHIP, an authority refresh, live-service or physical-device acceptance.
