# KAR-139 — Brazil-first positioning brief

**Status:** Recommended direction for owner review, not approved public copy. November 7, 2026; source baseline `c6149dc6ea386d97ec1093dc7dbebffd6dabb30d`. Part of KAR-128. The owner authorized this group after merging the KAR-127 baseline PRs. Approval of this brief does not start KAR-129 or enable a feature.

## Product promise

Privana is a creator-membership platform being built for adults in Brazil, with a fan experience, a mobile Creator Studio and a separate owner/team workspace. Today it is a testing implementation with recorded access and a browser payment demonstration. It is not an operating paid-subscription offer.

**Recommended positioning:** make the relationship and the creator's next task easy to understand in Brazilian Portuguese. Fans choose whom to follow; creators manage a public profile and publications; operators can explain the recorded state of access, content and configuration. Treat this as a product hypothesis to validate, not an exclusive advantage over other platforms.

**Working internal one-liner:** “Uma plataforma para acompanhar criadores e cuidar do conteúdo que você publica, pensada primeiro para o Brasil.”

The intended advantage is the combination of clear local language, phone-first creator work and visible state boundaries. Existing source and samples support designing toward it; no customer research establishes market preference, faster work or superior trust yet. [Category evidence and validation tasks](category-and-validation.md) define how to test it.

## People and current jobs

| Person / situation | Job and next useful action | Evidence and availability boundary |
| --- | --- | --- |
| Visitor deciding whom to follow | Explore creators; open a public profile; understand what is public and what is restricted | `/explore`, `/creators/[handle]` exist. Public previews remain separate from protected content. |
| Fan returning on a phone | Find followed creators, read accessible posts, save content, use existing conversations and account settings | Current fan routes exist. Following and membership interest grant no restricted access. Do not promise automatic launch emails. |
| Applicant preparing a creator profile | Understand the application, public fields and publication restriction; submit when applications are enabled | `/studio` creates a PENDING application. Approval and age/identity assurance are different. Do not invent an approval deadline. |
| Active creator managing content | Edit the public profile; create/save/publish/archive supported posts; recover from failed work | Existing Studio supports these actions. KAR-162 owns unsaved-work repair. No Vault, scheduling, automation or earnings promise. |
| Owner or permitted team member | Inspect authorized records; review creators/reports; edit and publish supported CMS configuration | Eight existing sections, role-filtered. Access revocation is not a refund; a CMS draft is not live. Broader permissions/business rules are future work. |

These are workflow roles, not invented demographic personas or interview findings. A creator retains fan capabilities. Account role, profile status and eligibility must not become one “verified user” badge.

## Public entry recommendation

Lead with actual creators and their available work. Use one primary discovery action and a distinct creator entry. This is message hierarchy for later prototypes, not a new landing-page layout or navigation implementation.

| Unit | Recommended pt-BR copy | Behavior / condition |
| --- | --- | --- |
| Heading | “Encontre criadores para acompanhar.” | Direct discovery-led candidate; owner can replace it at review. |
| Supporting line | “Explore perfis, siga criadores e acompanhe as publicações no seu feed.” | Refers to current discovery/follow/feed behavior, without promising paid access. |
| Primary action | “Explorar criadores” | `/explore`; available publicly. |
| Creator entry | “Quero criar conteúdo” | Existing `/studio` entry; signed-out visitors use the existing login return path. Respect the application feature flag and current profile state. |
| Existing creator entry | “Abrir meu Studio” | Existing authenticated creator workspace; no extra account or creator eligibility implied. |
| Stage disclosure | “Ambiente de testes. Assinaturas e pagamentos estão em demonstração, sem cobrança ou liberação de acesso.” | Required near commercial decisions in the current stage. Demo profiles retain their own label. |

Two heading alternatives for owner review: “Quem você acompanha, mais perto.” emphasizes the relationship; “Perto de quem cria.” preserves the current short tagline. Both need the concrete supporting line. Recommend the first table's direct direction for testing; none is recorded as owner-approved.

Do not describe the internal test environment as a public beta, open paid launch or age-verified community. External restricted-content onboarding remains gated by the existing roadmap. Content categories and allowed public imagery require owner/content-policy decisions before publication.

## Voice and evidence rules

- Address the person as “você”. Use familiar pt-BR verbs and concrete objects: seguir, salvar publicação, enviar candidatura, publicar, arquivar. Keep “Studio” as the proposed workspace name; do not alternate with “painel”, “estúdio” and “dashboard” for the same destination.
- Be warm at discovery, precise during work, and calm at loss, restriction and recovery. Avoid flirtatious service messages, infantilizing language and jokes about privacy or money. Creator-authored expression remains the creator's voice.
- State the completed outcome before the next action. Explain a restriction beside the disabled action or relevant decision; do not bury commercial limits in the footer.
- Use record-derived counts with their meaning. Demo profiles, seeded posts and synthetic financial records are test material, not proof of popularity, customers, earnings or identity assurance.
- Keep privacy statements scoped to actual visibility. Account display names appear in comments/conversations; creator display name, handle and public profile fields are distinct. Never market anonymity, guaranteed secrecy or “100% secure”.

The [language contract](language.md) fixes the nouns and verbs. KAR-140 specifies individual states and policy/support dependencies. No logo, font, palette, fee, legal policy or payment provider is selected here.

## Approaches considered

| Approach | Tradeoff / decision |
| --- | --- |
| Relationship and practical creator work, in pt-BR | Recommended. Fits the owner's creator-first premise and working fan/Studio scope. Requires comprehension testing rather than invented differentiation claims. |
| Earnings-led acquisition | Defer. Real subscriptions, payout economics and creator earnings evidence are unavailable. Reference prices cannot substantiate income claims. |
| Luxury/exclusivity-led acquisition | Keep as an optional visual consideration for KAR-129, not the central promise. Purple alone does not establish quality, scarcity or privacy; exclusive access must match server decisions. |

Jobs-to-be-Done guides the two entry paths; choice simplicity supports one primary action; uncertainty reduction puts state/consequence next to an action. These are design rationales, not conversion predictions. No fabricated scarcity, default paid consent or social-proof counters follow from them.

## Owner decision record

**Pending:** review this issue's PR and record approval or requested edits to (1) the central promise, (2) public heading/entry pair, (3) glossary including “Studio”, and (4) current testing disclosure. The recommended path and alternatives above make the decision concrete. PR review is the approval venue; no approval is inferred from preparing this document.

Content/support leads still need assignment and approved inputs in KAR-140. After both KAR-128 PRs are reviewed, stop for explicit owner advancement before brand concepts in KAR-129. No product code or CMS publication is part of this brief.
