# KAR-178 review evidence

November 7, 2026. Playwright MCP exercised all 21 registered cases at 1440, 768 and 390 CSS pixels. No horizontal overflow or duplicate relevant search was observed. Both Hanken Grotesk and Bricolage Grotesque loaded; browser console reported zero errors/warnings.

Verified local filtering/no matches, query retention through browser Back, all three named creator destinations/handles, signed-in interest and return to the same profile. Verified read-only example credentials, disabled pending sign-in, invalid-email focus/description and generic recovery response. These are local review transitions, not authentication or email delivery.

Captures: [desktop discovery](public-desktop.jpg), [tablet member profile](public-tablet.jpg), [phone invalid sign-in](public-phone.jpg). Full-page captures start at the document top; desktop/tablet use light and phone uses dark through the actual theme control. All contain embedded origins. Portrait URLs are public stock references listed in `prototype/fan/model.mjs`; names/profile details are fictional.

`bun run test`: 275 passed, 852 assertions, including four no-service server-boundary checks. Scoped Ultracite passed. Impeccable detector on changed HTML/CSS returned no findings. Review instructions are in the prototype README. This does not prove assistive-technology, installed-device or live-service acceptance. G1 remains pending KAR-145.

Fresh finish review: `ship` at KAR-178 scope. The independent documenter preserved the approved DESIGN/sidecar: palette, type, geometry and creator-led content remain consistent. Existing initial-study approval wording predates the merged identity; reconcile that ownership status in the handoff, without silently changing visual tokens. Static case-graph check: 21 cases, 95 links, no missing destinations.
