# KAR-205 — Browser unload protection

The browser can warn before leaving while an open Studio post has meaningful edits or a write is pending. Cancel keeps the editor and its selected file. Accept follows the browser's requested destination. Form values and files stay in memory until the creator saves or discards them.

## Routing audit and approach

The installed Next.js App Router exposes `push`, `replace`, `back` and `forward`. Desktop and mobile navigation, account menus, brand, header, footer and Studio use Next Link. KAR-206 covers that integration across the shell and validation in the App Router. [Next.js Link documentation](https://nextjs.org/docs/app/api-reference/components/link#blocking-navigation).

The editor reuses Studio's semantic change comparison. Its form listeners update the warning on input, change and submit. A mutation-cache subscription attaches protection as soon as a write starts and preserves the last comparison while controls are disabled. The browser listener is removed when the form reverts and no write is pending, or when the editor unmounts after a save or discard.

| Departure | Contract |
| --- | --- |
| Reload, tab/window close, full-document navigation | The browser may prompt when it dispatches `beforeunload`. Cancel keeps the edit. Confirm follows the requested destination. |
| Cross-document browser Back/Forward | The same native protection applies when the browser dispatches the event. Tests exercise Back. |
| Next client-side links | Shared shell and Studio links are tracked in KAR-206. |
| Same-document Back/Forward and programmatic client routing | Browser and router history proceed normally. Save before navigating. |
| Mobile process termination, crashes, power loss | Save before leaving. The page depends on the browser dispatching the event, and unsaved edits exist only in memory. |

The browser requires prior interaction, supplies its own generic prompt text and can skip the event on mobile, including when the browser process is terminated. The editor advises creators to save their changes before leaving. [MDN browser unload guidance](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event).

## Verification

The baseline reload cleared the editor with zero native dialogs. The browser regression suite mounts the real post editor and exercises reload, cross-document Back and tab close with fictional data. It checks retained text and file, file-only changes, reverted values, rejected saves and cleanup after save or discard. A synchronous event probe verifies protection in the same task as submission. Native browser chrome is verified through Playwright's `beforeunload` dialog event.

The screenshots show the editor after canceling a reload. The preview, selected file and guidance remain available in [desktop light](review/studio-browser-departure/desktop-light-retained.jpg), [320px light](review/studio-browser-departure/phone-light-retained.jpg) and [320px dark](review/studio-browser-departure/phone-dark-retained.jpg). Compare the earlier [accepted editor without the guidance](review/studio-context/phone-preserved-light.jpg).

The catalogue passed 357 cases, including 36 unload cases. Workspace and tooling types, the production build and 315 deterministic tests passed. The independent review found the guidance readable at all three viewport sizes. Its overall `fix` disposition records the missing corroboration for the inherited design seed. The original quality bar and critique reference remain unavailable. The 320px select and preview fields still extend slightly past the card edge, inside the viewport.

Rollback is a revert of the issue commit. The tests use intercepted responses and emulated viewports. KAR-202 covers profile work.
