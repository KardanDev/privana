# KAR-183 review evidence

November 7, 2026. Playwright MCP visited all 127 cases at 1440/768/390 px without horizontal overflow. New/edit workflows verified entered title/body/excerpt/visibility through preview, upload failure/retry/omission, save failure/retry, draft, publication and archive cancel/failure/retry/confirmation. Result record views retain the entered title and confirmed state. Archived rows retain the existing edit capability; no restore command is added.

Verified dirty close/continue/discard and starting another new example: a prevented reset cannot clear work before confirmation. Failed attachment hides save/publish until retry or explicit omission; pending fields/actions cannot repeat. Public excerpt and content visibility/media metadata stay distinct, and no file is selected or requested. Publish keeps its current primary emphasis. The compact discard state keeps both decisions above the phone navigation.

Shared rendering was separated into heading/content/case-state helpers. Labels now name inputs concisely; helper/error text is linked as a description, rather than enlarging the label. Scoped Ultracite: 51 files passed. Graph: 127 cases / 1,605 links / no missing destinations. Four server-boundary tests passed (18 assertions); browser console reported zero errors/warnings. Automatic design hints remain suppressed on the repeatedly edited shared CSS; no extra detector was run.

Captures: [editor](publishing-desktop.jpg), [Studio-only preview](publishing-tablet.jpg), [phone discard](publishing-phone.jpg), with embedded origins. README distinguishes named independent filter fixtures from the local result view and documents current API authority versus proposed interruption repair. No live service, production adoption, identity assurance or G1 approval is claimed.

Fresh finish review: `ship` at KAR-183 scope. The documenter preserved PRODUCT/DESIGN/sidecar and shared CSS; primary action emphasis, local groups and discard flow are surface choices, not new visual tokens.
