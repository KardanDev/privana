# KAR-140 — Content inputs and owner review

**Status:** Required inputs and proposed adoption gates; November 7, 2026. Policy approval, published destinations and support ownership remain pending. Read with [the copy catalogue](copy-catalogue.md) and [KAR-139's working direction](https://github.com/KardanDev/privana/pull/5).

## What is actually linked

Fresh anonymous browser inspection of `http://localhost:3001/` on November 7 at 09:35 UTC showed a loaded footer with only the copyright and the platform description. **No policy, help or support link was rendered.** An isolated context was used and its tab closed afterward; the pre-existing user tab and development server were preserved. No sign-in, email, CMS write or report was submitted.

Source agrees with that limited observation: `defaultPlatformConfig` has `footer.links: []`, `footer.supportEmail: ""` and `pages: []`. The existing footer can render configured approved links, published CMS pages and a `mailto:` support address. The current public reading route is `/pages/[slug]`; absent slugs return not found. A route pattern or seeded draft is not an approved policy page.

Confirmed application destinations in source: `/explore`, `/creators/[handle]`, `/studio`, `/login`, `/register`, `/forgot-password`, `/reset-password` and `/verify-email`. The existing authenticated report form is reached from creator/post controls. It is not a public legal complaint portal. No `/help`, `/support`, `/terms` or `/privacy` route is supplied by this catalogue.

## Input register

The accountable decision owner is the platform owner. “Required contributor” below is a role to assign, not a claim that a named employee or adviser has accepted the work. No new team assignments, deadlines or publication approvals are fabricated.

| Input / current availability | Required contributor and approval | Adoption owner / unlock evidence |
| --- | --- | --- |
| Positioning, public heading, glossary, current demo disclosure — PR #5 proposed | Platform owner selects or revises the four decisions; content lead applies the decision | KAR-139–140. Record review outcome; no “approved” label from the draft alone. |
| Terms, privacy notice, eligibility and permitted-content wording — no approved published destination observed | Owner assigns qualified policy/privacy review and supplies approved text, language, scope and version; content editor has publication authority | KAR-153 and KAR-168 consume approved content; M02/M08 own consent/eligibility/release gates. Exact slug/URL and read-back evidence required before linking. |
| Support address and help material — no support/help link rendered | Owner assigns an accountable responder, approves a monitored address and supported contact scope; response promises need actual operations evidence | KAR-153, KAR-161 and KAR-168. Configure `footer.supportEmail` or a supported approved page/link, verify the destination and contact process. Sender `EMAIL_FROM` is not automatically a support inbox. |
| Report explanation, public complaints and appeal wording — authenticated report form exists; public operating policy not established here | Owner assigns moderation/policy lead and approves what reports reveal, response process and escalation/contact route | KAR-156/KAR-166 explain current form only; later owner/safety work owns public complaint/appeal capability. No confidential/anonymous/SLA promise without evidence. |
| Profile imagery, original brand assets and public previews — seeded test assets exist | Owner/content lead supplies approved original or licensed assets and rights/consent evidence, with public-versus-protected classification | KAR-142 and screen stories. Demo seed material cannot establish real creator endorsement, commercial photo rights or testimonials. |
| Age/identity assurance labels — platform review and account email confirmation exist; real assurance is a separate gated milestone | Owner and eligibility/policy lead approve the actual assurance contract and evidence before adding an assurance claim | M02/M11/M08. KAR-161/KAR-166 use “perfil em análise/aprovado para publicar”; no fabricated public verification badge. |
| Billing, renewal, price/fees/refund/payout policy — browser demo and reference values only | Owner supplies approved provider/economic and operating terms after the separate selection gate | M04/M09 and relevant finance/owner work. KAR-160 keeps current zero-charge/no-grant copy; no renewal schedule or provider logo implied. |
| Launch-interest email — stored interest exists; automatic launch delivery not established | Owner defines any later notification promise with an implemented delivery/consent workflow and actual verification | KAR-156/KAR-158 say “Registrar interesse” now. No “Você receberá um aviso” or made-up launch date. |

Absent inputs remain dependencies on the owning roadmap work. This group does not draft policy, select providers, collect identity evidence, publish a page or contact a third party to fill them.

## Publication/read-back gate

For each approved help/policy/contact item, capture the exact title, destination, intended audience, version/date, accountable content owner and approval record. Verify it anonymously and on phone/desktop, using real published CMS content rather than only the editing preview. Check that the destination matches the label, existing pages are not duplicated as external footer links, content is readable, and unsupported links remain absent.

When adopting copy, existing CMS fields use their published values; CMS save, preview and publish remain separate. Missing support content must not create a dead “Falar com o suporte” action. Keep recovery actions that really exist: request a fresh auth link, retry a failed operation, return to a permitted workspace or keep editing. A lack of approved policy/support material continues to block external release readiness; it does not prevent preparing this reviewable internal specification.

## Review decisions and handoff

| Review item | Current outcome / next owner action |
| --- | --- |
| Central promise, public heading and vocabulary | Pending owner review in PR #5; this catalogue follows that proposal and must follow requested revisions. |
| Visibility, demo disclosure, access/recovery consequences | Pending owner/content review in the KAR-140 PR; review P04–P08, A06–A10, F07–F13 and M01–M10 first. |
| Policy/support/content assignments and destinations | Owner must assign contributors and supply approved inputs above. No availability is inferred from planning a link. |
| KAR-128 exit and next group | Both issue PRs accepted and merged, with explicit owner decision to advance. KAR-129 remains unstarted. |

The catalogue is complete as a proposed specification; owner approval and absent operating inputs remain visibly pending. Each implementation story must verify its own states, permissions, recovery, localization and rendered behavior. No script, token, private email link or service credential is needed in these documents.

## Source anchors

Visibility: [comments](../../../packages/api/src/domains/posts/comments.ts), [conversation list](../../../packages/api/src/domains/messages/list.ts), [creator serialization](../../../packages/api/src/domains/creators/serialize-creator.ts). Entry/recovery: [login page](../../../apps/web/src/app/login/page.tsx), [auth submission](../../../apps/web/src/domains/auth/submit-auth.ts), [feed member guard](../../../apps/web/src/domains/feed/require-member.ts), [shared member guard](../../../apps/web/src/shared/auth/require-member.ts), [auth email rendering](../../../packages/auth/src/email/render-auth-email.ts).

State/recovery: [message attempts](../../../apps/web/src/domains/messages/use-conversation.ts), [Studio editor](../../../apps/web/src/domains/studio/post-editor.tsx), [CMS conflict message](../../../apps/web/src/domains/admin/cms/cms-error-message.ts), [local revocation](../../../packages/api/src/domains/admin/revoke-subscription.ts). Content/payment: [platform schema/defaults](../../../packages/api/src/contracts/platform.ts), [footer](../../../apps/web/src/shared/platform/platform-footer.tsx), [interest endpoint](../../../packages/api/src/domains/memberships/request.ts), [demo notice](../../../apps/web/src/domains/memberships/payment-demo/demo-notice.tsx), [Pix illustration](../../../apps/web/src/domains/memberships/payment-demo/demo-pix.tsx), [demo outcome](../../../apps/web/src/domains/memberships/payment-demo/demo-outcome.tsx).
