# KAR-139 — pt-BR product language

Proposed contract for owner review, November 7, 2026. Read with [the positioning brief](brief.md). Labels below are specifications for later screen stories; this PR does not rename current controls or change the schema.

## Nouns and states

| Preferred term | Meaning and usage | Keep distinct |
| --- | --- | --- |
| Conta | Email/password account used across fan and creator workflows | Creating an account does not create or approve a creator profile. |
| Nome de exibição da conta | `User.name`, selected at registration and editable in settings; shown in comments and to conversation participants | Not a private legal name. A separate anonymous identity or unique fan handle is not implemented. |
| E-mail | Login and account-message address | Omitted from inspected public profile/comment/conversation DTOs; present in authorized operations records. Never say only the account owner can see it. |
| Fã | Person using discovery and fan features | Not automatically a paying subscriber; do not label every signed-in person “assinante”. |
| Criador / criadores | Person with a creator profile; use the person's own name in individual UI | “Modelo” is not an account permission or the only content category. Avoid changing forms by inferred gender. |
| Candidatura de criador | Request submitted through Studio when enabled | Not payment, identity verification or immediate permission to publish. |
| Perfil em análise | Creator profile PENDING | Can update supported profile fields; cannot publish. No approval-time promise. |
| Perfil aprovado para publicar | Creator profile ACTIVE under current platform review | No age/identity-verification claim or payout eligibility follows. Use in private status/help; do not add a public assurance badge. |
| Perfil suspenso | Creator profile SUSPENDED | Different from a suspended account. Editing/publication follow their actual server restrictions. |
| Perfil público | Creator display name, @handle, biography, category, supplied location, avatar and cover | Separate from account display name. Treat supplied profile media and public previews as public material. |
| Seguir / seguindo | Follow relation and following feed | No charge, membership or restricted-content grant. Do not imply all posts become visible. |
| Interesse registrado | Recorded intent to hear about a future membership offer | No subscription, charge or access grant. Current code stores the interest; automatic launch-email delivery is not established. |
| Assinatura / assinante | Recorded, time-bound membership and its holder | Do not use for a follow, interest entry or successful browser simulation. Current records can be seeded; no real renewal process is active. |
| Ativa / expirada / encerrada / acesso revogado | Actual effective membership status | Expiry derives from server time; show a recorded end date without inventing “próxima cobrança”. A local revocation is not a refund. |
| Publicação | Supported creator post | Avoid alternating “post”, “conteúdo” and “publicação” as action-object synonyms. “Conteúdo” is acceptable as the broader category. |
| Rascunho | Saved, unpublished post or CMS document, qualified by context | Unsaved editor input is not a saved draft; “salvo” does not mean “publicado”. |
| Arquivar publicação | Existing reversible-status operation removes the post from public availability | Do not call it permanent deletion. Do not promise a restore UI before that action exists. |
| Prévia pública | Deliberately public post preview/excerpt | Distinct from protected original media; a blurred image alone is not authorization. |
| Simulação de pagamento | Browser-only card/Pix exercise | Never “pagamento confirmado”, “assinatura concluída” or a real receipt. Use test details only. |
| Valor mensal planejado | Reference BRL amount in a creator profile | Not an active offer, future guaranteed price, FX rate, recurring charge or promised revenue. |
| Studio | Proposed creator workspace name | Separate from fan Início and owner Gestão. Scope remains current profile/posts; no future menus. |
| Gestão | Proposed owner/team workspace label | Not a creator's Studio. Only permitted sections/actions are visible and server-authorized. |
| Prévia / salvar rascunho / publicar versão | Distinct CMS lifecycle actions | Preview is not save; save is not publish; restoring history creates a draft, not a direct public rollback. |

## Action vocabulary

| Context | Prefer | Consequence to state when relevant |
| --- | --- | --- |
| Account | Criar conta; entrar; enviar link de recuperação; salvar nova senha | Email confirmation and generic recovery response; no creator approval implied. |
| Discovery | Explorar criadores; seguir; deixar de seguir | Following affects the feed; paid access is unchanged. |
| Membership interest | Registrar interesse | Confirmation only after server success; avoid “avise-me” until a delivery workflow exists. |
| Creator work | Enviar candidatura; salvar alterações; salvar rascunho; publicar; arquivar publicação | Choose the verb matching the current action and name its object in confirmation. |
| Recovery | Tentar novamente; continuar editando; sair sem salvar | Recovery must exist and retain the described work; unsaved-exit controls are still a KAR-162 requirement. |
| Owner work | Aprovar perfil; suspender perfil; revogar acesso; publicar versão | State exactly which scope changes; never imply identity assurance or money movement. |
| Payment demo | Testar simulação; revisar simulação; simular resultado; testar novamente | No charge, real Pix transfer, receipt or access grant. |

Use sentence case, Portuguese accents and “e-mail” consistently. Keep standard Pix capitalization. Translate the full message rather than concatenating a verb with a translated status. Use singular/plural forms from the actual count, meaningful accessible names and visible labels for every field.

## Locale and content ranges

- Price examples use `R$ 29,90`; always show the record's currency. Other demo currency examples remain examples; never combine currencies or imply automatic exchange/availability.
- Format real dates in pt-BR and include the actual timezone where a deadline matters. The display timezone must match the implementation selected by its screen story; do not label a browser-local value as Brasília time.
- Creator display names support 2–80 characters and handles 3–40, using the current server schema. Long names, diacritics, wrapping descriptions and zero/one/many records belong in future phone/200% zoom checks; do not truncate away the action or warning.
- “18+” describes intended audience, not proven age assurance. Published eligibility, content and privacy wording needs approved owner/policy inputs. Do not create a checkbox or compliance promise to fill that gap.

## Evidence anchors

At `c6149dc`: [comments DTO](../../../packages/api/src/domains/posts/comments.ts), [conversation DTO](../../../packages/api/src/domains/messages/list.ts), [creator DTO](../../../packages/api/src/domains/creators/serialize-creator.ts), [operations users](../../../packages/api/src/domains/admin/operations/users.ts), [profile save](../../../packages/api/src/domains/studio/save-profile.ts), [membership status](../../../packages/api/src/domains/memberships/effective-status.ts), [protected post serialization](../../../packages/api/src/domains/posts/serialize-post.ts), [CMS contracts](../../../packages/api/src/contracts/platform.ts). The [baseline inventory](../m015-baseline/inventory.md) owns route/state coverage. Source evidence establishes implementation vocabulary, not a provider, accessibility or live-service pass.
