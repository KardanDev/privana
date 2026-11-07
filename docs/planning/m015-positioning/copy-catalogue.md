# KAR-140 — Public, access and recovery copy

**Status:** Proposed pt-BR specification for owner/content review, November 7, 2026; source baseline `c6149dc6ea386d97ec1093dc7dbebffd6dabb30d`. Depends on [KAR-139 / PR #5](https://github.com/KardanDev/privana/pull/5). Its [working brief](https://github.com/KardanDev/privana/blob/8669a76622c0af1fb0e3e79b1de584951dda6643/docs/planning/m015-positioning/brief.md) and [glossary](https://github.com/KardanDev/privana/blob/8669a76622c0af1fb0e3e79b1de584951dda6643/docs/planning/m015-positioning/language.md) are proposals, not approved claims. No runtime strings, forms, emails or CMS records change here.

This catalogue maps to [KAR-137's inventory](../m015-baseline/inventory.md). “Existing” means the underlying state/action is present in source, not that this proposed wording is deployed or freshly exercised. “Gated” requires the named repair or approved input before adoption. Placeholders such as `{nome}` and `{data}` are structured values, not literal text to display.

## Public entry and visibility

| ID / placement | Proposed visible copy | Action / factual gate | Screen owner |
| --- | --- | --- | --- |
| P01 · `/`, public heading | Encontre criadores para acompanhar. | Primary “Explorar criadores” → `/explore`; final heading awaits KAR-139 approval | KAR-151 |
| P02 · creator entry | Quero criar conteúdo | Existing `/studio`; no-profile entry honors application availability. Gated: login destination is not preserved today; see the limitations below | KAR-151–152, KAR-161 |
| P03 · public stage / commercial decision | Ambiente de testes. Assinaturas e pagamentos estão em demonstração, sem cobrança ou liberação de acesso. | Persistent near the offer and demo entry; never describe this as a live offer | KAR-151, KAR-156, KAR-160 |
| P04 · registration account-name field | Nome de exibição · Este nome aparece nos seus comentários e nas suas conversas. Você pode usar o nome pelo qual quer aparecer. | Persistent label plus helper, before submitting; account name is distinct from creator profile name | KAR-152, KAR-159 |
| P05 · email field helper | Seu e-mail é usado para entrar e receber mensagens da conta. Ele não aparece no perfil público nem nos comentários. | Scope to inspected public DTOs. Authorized staff records can contain email; no anonymity or “só você pode ver” claim | KAR-152 |
| P06 · creator profile inputs | Nome de exibição do perfil · Seu @usuário | Profile helper: “Nome, @usuário, descrição, localização informada, foto e capa aparecem no seu perfil público.” Do not claim approval/eligibility from these fields | KAR-161 |
| P07 · preview input | Prévia pública · O resumo e a imagem de prévia podem ser vistos por qualquer pessoa. Use apenas material que você quer tornar público. | Distinguish excerpt/preview from protected original media at selection, not only after upload | KAR-162 |
| P08 · restriction on a post | Este conteúdo exige acesso ativo. | “Ver perfil” → current creator profile; “Entrar” when signed out. Never offer “seguir para desbloquear” or a demo purchase as access | KAR-154, KAR-156 |
| P09 · creator unavailable / absent page | Este perfil não está disponível. / Página não encontrada. | “Explorar criadores” → `/explore`; do not reveal hidden creator status or a private media URL | KAR-153, KAR-156 |

## Account entry and email recovery

| ID / state | Proposed visible copy | Next action / condition | Owner |
| --- | --- | --- | --- |
| A01 · `/login` | Entrar na Privana · Use o e-mail e a senha da sua conta. | “Entrar”; use current published brand name when customized. No promise of a return destination until repaired | KAR-152 |
| A02 · `/register` | Crie sua conta · Acompanhe criadores e salve publicações. Para publicar, envie uma candidatura pelo Studio. | “Criar conta”; no extra paid account or automatic creator approval | KAR-152 |
| A03 · registration disabled | Novos cadastros estão fechados. Já tem uma conta? Você pode entrar. | Existing “Entrar” → `/login`; do not add an unimplemented waitlist | KAR-152 |
| A04 · field requirement | Use uma senha com pelo menos 12 caracteres. / As senhas precisam ser iguais. | Password rule before submission; mismatch beside confirmation field. Keep email, name and nonsecret input during correction | KAR-152 |
| A05 · invalid credentials | E-mail ou senha incorretos. Confira os dados e tente novamente. | “Esqueci minha senha” → `/forgot-password`; do not identify which credential or whether an account exists | KAR-152 |
| A06 · unverified email | Confirme seu e-mail para entrar. Confira sua caixa de entrada e a pasta de spam. | “Solicitar novo link” → `/verify-email`; do not assert a fresh email was delivered from an error code alone | KAR-152 |
| A07 · `/forgot-password` | Recuperar acesso · Informe o e-mail usado na sua conta. | “Enviar link de recuperação”; pending “Solicitando link…” | KAR-152 |
| A08 · recovery request accepted | Se houver uma conta com este e-mail, você receberá instruções para criar uma nova senha. Confira também a pasta de spam. | Same account-existence-neutral outcome; provider acceptance is not inbox receipt. Allow retry subject to real rate limits | KAR-152 |
| A09 · `/verify-email`, resend accepted | Se a conta precisar de confirmação, você receberá um novo link. Confira também a pasta de spam. | “Reenviar confirmação”; pending “Solicitando confirmação…”; no email-address echo in shareable status text | KAR-152 |
| A10 · invalid / expired / used link | Este link não pode ser usado. Solicite um novo link para continuar. | Reset → `/forgot-password`; email confirmation → `/verify-email`. Do not claim a specific cause unless returned by the server | KAR-152 |
| A11 · `/reset-password` | Crie uma nova senha · Use pelo menos 12 caracteres. | “Salvar nova senha”; field labels “Nova senha” and “Confirme a nova senha”; never show or log tokens | KAR-152 |
| A12 · reset confirmed | Senha atualizada. Entre com sua nova senha. | “Entrar” → `/login`; no success until server confirmation | KAR-152 |
| A13 · email service unavailable | Não foi possível solicitar o e-mail agora. Tente novamente mais tarde. | Retain nonsecret fields; offer retry, not an unsupported fallback sender or invented support address | KAR-152 |
| A14 · rate limited | Muitas tentativas. Aguarde um pouco e tente novamente. | Show a precise duration only from a trusted current retry value; no hard-coded “um minuto” for every limiter | KAR-152 |
| A15 · auth-email content | Subjects: “Confirme seu e-mail na {marca}” / “Redefina sua senha na {marca}”. Actions: “Confirmar e-mail” / “Criar nova senha”. | Existing verification lifetime is 1 hour; reset is 30 minutes. Render only the matching configured lifetime. Footer: “Se você não pediu esta alteração, ignore este e-mail.” Avoid an absolute security assurance | KAR-153 |

For A15, the email contains a private expiring action link; never reuse it as screenshot content or a public help link. No Resend delivery is attempted or inferred in this documentation story.

## Shared feedback and recovery

| ID / context | Proposed copy | Recovery / contract | Owner |
| --- | --- | --- | --- |
| F01 · loading / incomplete history | Carregando publicações… / Carregando mensagens… / Carregando mais mensagens… | Name the actual operation; retain readable cached content. No invented percentage or finished state | KAR-149, KAR-154, KAR-157 |
| F02 · first-use following feed | Você ainda não segue criadores. Explore perfis para começar. | “Explorar criadores” → `/explore`; distinct from network failure | KAR-154 |
| F03 · search/filter no matches | Nenhum criador encontrado. Tente outro nome ou categoria. | Existing search/category edits; show “Limpar filtros” only when that action exists | KAR-155 |
| F04 · empty saved / inbox | Nenhuma publicação salva. / Suas conversas aparecem aqui. | Saved: explain the existing save action. Inbox: open a permitted profile, without promising subscriber-only rules already exist | KAR-157–158 |
| F05 · initial data failure | Não foi possível carregar suas publicações. Tente novamente. | Substitute the actual object (mensagens, assinaturas, configurações); inline “Tentar novamente” retries that query | Relevant screen + KAR-149 |
| F06 · failed next page | Não foi possível carregar mais publicações. | Keep existing items and cursor; “Tentar novamente” retries the page, not the entire journey | KAR-154, KAR-157, KAR-163 |
| F07 · unknown save/connection result | Não foi possível confirmar o salvamento. Confira sua conexão e tente novamente. | Retain the appropriate draft/attempt. Reuse idempotency where implemented; do not claim the server definitely saved nothing after a timeout | KAR-149, KAR-162, KAR-168 |
| F08 · social action pending / failed | Salvando publicação… / Não foi possível atualizar este item. Tente novamente. | Optimistic state is provisional. Targeted rollback must preserve other actions; use the actual action name for follow/like. No celebratory confirmation before response | KAR-149, KAR-154 |
| F09 · message pending / uncertain result | Enviando… / Não foi possível confirmar o envio. | Existing failed bubble: “Reenviar” with the same attempt ID. Preserve failure text and any newer composer draft; do not promise “não enviada” on an ambiguous timeout or “lida” from an accepted send | KAR-149, KAR-157 |
| F10 · session / permission | Entre na sua conta para continuar. / Você não tem permissão para esta ação. | Login link for unauthenticated state; relevant safe workspace navigation for denial. Do not retry a forbidden write or expose a hidden resource's details | Relevant screen + KAR-149 |
| F11 · known unsaved changes | Há alterações que ainda não foram salvas. | Keep visible while dirty. Gated exit prompt: “Sair sem salvar?” / “As alterações desta edição serão perdidas.” Actions “Continuar editando” and “Sair sem salvar” require a real guard and focus handling | KAR-149, KAR-162, KAR-168 |
| F12 · archived post confirmation | Arquivar esta publicação? Ela deixará de ficar disponível para os fãs. | “Arquivar publicação” / “Continuar editando”; success “Publicação arquivada.” only after server confirmation. Never “excluída para sempre” or a fake undo | KAR-163 |
| F13 · report form / success | Conte o que aconteceu. Sua denúncia será enviada à equipe, sem virar um comentário público. / Denúncia recebida. | Existing report form, minimum 10 characters. No guaranteed confidentiality beyond actual permissions, response SLA or promised decision | KAR-156, KAR-166 |

## Studio and owner decisions

| ID / state | Proposed copy | Boundary / next action | Owner |
| --- | --- | --- | --- |
| W01 · new application / disabled | Enviar candidatura / Novas candidaturas estão fechadas. | Existing profile form when enabled; closed state keeps fan navigation, without promised reopening date | KAR-161 |
| W02 · pending / active profile | Perfil em análise. Você pode editar suas informações enquanto aguarda a aprovação para publicar. / Perfil aprovado para publicar. | “Editar perfil” when permitted. No “identidade verificada”, age assurance or monetization activation | KAR-161 |
| W03 · suspended creator profile | Perfil suspenso. A edição e a publicação estão indisponíveis. | “Falar com o suporte” only with an approved configured channel; otherwise keep truthful status and existing permitted navigation | KAR-161, KAR-166 |
| W04 · upload / save / confirmed | Enviando arquivo… / Salvando rascunho… / Publicando… / Rascunho salvo. / Publicação publicada. | Select message from actual operation/result. Current generic “Publicação salva” must not hide whether it was published; completed upload can be reused on retry | KAR-162 |
| W05 · reference price | Valor mensal planejado (R$) · Apenas referência. Este valor não cria cobranças nem ativa pagamentos. | Existing numeric input and supported validation; no earnings estimate | KAR-161 |
| W06 · CMS dirty / saved / live | Alterações não salvas. / Rascunho salvo. A versão pública não mudou. / Versão {versão} publicada. | Distinct dirty/local, server draft and published states; publish only after authorization and confirmation | KAR-168 |
| W07 · CMS conflict | Outra pessoa alterou esta versão. Copie suas alterações antes de recarregar o rascunho e revisar a versão atual. | Warn before destructive reload; do not claim an automatic merge. Existing compare-and-swap rejection is authoritative | KAR-168 |
| W08 · CMS restore | Restaurar esta versão como rascunho? A versão pública só muda quando você publicar. | “Restaurar rascunho” / “Voltar”; current version/conflict checks still apply | KAR-168 |
| W09 · revoke local access | Revogar este acesso? Esta ação remove o acesso e registra o motivo. Ela não cancela cobranças nem faz reembolsos. | Existing reason/confirmation; “Confirmar revogação de acesso”. Only the permitted owner can act; no payout/refund button implied | KAR-167 |

## Interest, membership records and payment demonstration

| ID / state | Proposed copy | Action / distinction | Owner |
| --- | --- | --- | --- |
| M01 · interest offer / pending | Assinaturas ainda não disponíveis. Você pode registrar interesse, sem cobrança ou acesso exclusivo. / Registrando interesse… | “Registrar interesse”, not “Avise-me no lançamento”; the current endpoint only records interest | KAR-156 |
| M02 · interest confirmed / empty records | Interesse registrado. / Nenhuma assinatura ou interesse registrado. | No email-send claim. Empty → “Explorar criadores”; distinguish pending optimistic row from confirmed response | KAR-158 |
| M03 · membership record | Assinatura ativa / Assinatura expirada / Assinatura encerrada / Acesso revogado | Map exact effective server states, including REVOKED. Show recorded expiry as “Acesso até {data}”; no next charge, cancellation control or implied real purchase from seeded data | KAR-158, KAR-167 |
| M04 · demo entry / persistent notice | Testar simulação de pagamento · Use apenas os dados de teste indicados. Não haverá cobrança, nova assinatura ou liberação de conteúdo. | Existing browser demo only; do not ask for a real card, CPF or bank credential | KAR-160 |
| M05 · test-card fields / invalid | Número de teste; validade de teste; CVC de teste. / Use um dos números de teste indicados. | Match the actual fixture validator and field error; expose supplied examples beside persistent labels, not only placeholders | KAR-160 |
| M06 · review / method/currency | Revise a simulação · Valor de referência: {valor_com_moeda}. | “Simular aprovação”, “Simular recusa” or Pix example. Pix only with BRL. Selecting a demo currency is not FX conversion or live market support | KAR-160 |
| M07 · Pix illustration / copy | Pix ilustrativo. Este desenho e o código de exemplo não podem ser usados para pagar. / Código de exemplo copiado. | Existing non-payable illustration; “Copiar exemplo”. Clipboard failure: “Não foi possível copiar. Selecione o código de exemplo.” | KAR-160 |
| M08 · illustrative timer / expiry | Exemplo expira em {tempo} (simulação). / Exemplo expirado. Gere outro para continuar o teste. | “Gerar outro exemplo”; local illustrative timer, not commercial urgency or bank confirmation | KAR-160 |
| M09 · approval / decline | Simulação aprovada. / Recusa simulada. | Approval body: “O teste terminou. Não houve cobrança, nova assinatura ou alteração no seu acesso.” Decline: “Você testou uma recusa. Nenhuma cobrança foi feita.” | KAR-160 |
| M10 · result actions | Testar novamente / Voltar ao perfil | Sample profile uses `/explore`. No receipt, provider status, real balance, payment history or new entitlement is generated | KAR-160 |

## Source-supported limitations and adoption rules

1. **Return destination:** the feed guard adds `returnTo`; the shared Studio guard redirects to `/login` without it. `LoginPage` does not read it and `submitAuth` returns `/feed`. Never promise automatic continuation today. KAR-152, coordinated with KAR-148, must preserve only validated same-site destinations before the later public creator-entry journey claims that behavior.
2. **Unsaved work:** the current post editor closes/unmounts without a discard guard. F11 defines required behavior/copy for KAR-162, not an implemented safeguard. CMS has dirty/version state but a complete route/close guard must also be verified before using exit copy.
3. **Access and messaging:** restricted media stays server-authorized. Current conversation start/send uses active accounts/participant checks, not a subscription entitlement. Do not describe subscriber-only messaging as already implemented; that policy belongs to later commerce/community contracts.
4. **Real support/policies/assets:** [content-inputs.md](content-inputs.md) records the observed empty footer, actual route capabilities, owners and publication gates. No invented legal text, help route, email address, SLA, compliance certification, testimonials or stock-media rights.
5. **Content system:** published CMS values own existing brand/auth/discovery/navigation/footer/page fields. Hard-coded state messages stay in focused domain files when adopted. Do not promise that every string is editable in today's CMS or create a parallel translation/CMS system in this specification.

Implementation checks: use complete localized messages and structured values; match visible labels and accessible names; associate errors with fields and announce meaningful status changes; keep critical price/visibility/recovery text readable on 390px and at 200% zoom. Test long names, one/many records, both themes, keyboard and restored/failed states in the named screen PRs. No new rendered, screen-reader, mutation, delivery or provider pass is claimed by this catalogue.
