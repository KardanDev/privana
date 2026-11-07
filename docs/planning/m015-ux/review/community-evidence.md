# KAR-181 review evidence

November 7, 2026. All 44 registered cases at 1440/768/390 px had no horizontal overflow. Playwright MCP verified save pending/failure/retry/confirmation/removal, separate active/expired/no-access records, disabled-message navigation, message pending/failure/confirmation with retained entered text, and retained name/unchecked email preference after failure. Empty required names cannot advance. Error focus reveals the input above the phone navigation (observed input bottom 612px, navigation top 770px).

Captures: [desktop feed](community-desktop.jpg), [tablet preferences](community-tablet.jpg), [phone empty inbox](community-phone.jpg), and [phone failed-message focus](community-phone-focus.jpg). The first three are full-page captures; the last is the actual scrolled phone viewport after focus recovery. Metadata records origins. Cases can be inspected independently and are not persistent global account state.

Scoped Ultracite: 34 files passed. Static case graph: 44 cases, 421 links, no missing destinations. Four server-boundary tests passed (18 assertions); the root 275-test suite passed on the immediate prerequisite. Browser console reported zero errors/warnings, loaded fonts/images were verified, and the single Impeccable detector pass returned no findings. Live email, permissions and data writes were not exercised. G1 remains KAR-145.

Fresh finish review: `ship` for KAR-181, including all four required captures, retained context and unobscured phone focus. The documenter preserved PRODUCT/DESIGN/sidecar; secondary-column and field behavior remain local review patterns, not new production tokens.
