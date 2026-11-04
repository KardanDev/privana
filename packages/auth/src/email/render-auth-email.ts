import { escapeHtml } from "./escape-html";

export function renderAuthEmail({
  kind,
  name,
  url,
  brandName = "Privana",
}: {
  kind: "verify" | "reset";
  name: string;
  url: string;
  brandName?: string;
}) {
  if (
    !brandName.trim() ||
    brandName.length > 80 ||
    [...brandName].some(
      (character) =>
        character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127
    )
  ) {
    throw new Error("Nome da plataforma inválido para e-mail.");
  }
  const parsed = new URL(url);
  if (
    parsed.protocol !== "https:" &&
    !(
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
    )
  ) {
    throw new Error(
      "O link do e-mail precisa usar HTTPS (ou localhost no desenvolvimento)."
    );
  }
  const title =
    kind === "verify"
      ? "Confirme seu e-mail"
      : "Uma nova senha, um novo começo";
  const description =
    kind === "verify"
      ? "Falta só confirmar seu endereço para entrar na sua comunidade. Este link é válido por 1 hora."
      : `Recebemos um pedido para alterar a senha da sua conta ${brandName}. Este link é válido por 30 minutos.`;
  const action =
    kind === "verify" ? "Confirmar meu e-mail" : "Criar nova senha";
  const subject =
    kind === "verify"
      ? `Confirme seu e-mail na ${brandName}`
      : `Redefina sua senha na ${brandName}`;
  return {
    html: `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head><body style="margin:0;background:#f7f5fa;color:#252035;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px"><table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:20px" cellpadding="32" cellspacing="0"><tr><td><p style="color:#6534d9;font-size:25px;font-weight:700">${escapeHtml(brandName)}</p><h1 style="font-size:28px;line-height:1.3">${title}</h1><p>Olá, ${escapeHtml(name)}.</p><p style="line-height:1.7">${escapeHtml(description)}</p><p style="padding:20px 0"><a href="${escapeHtml(url)}" style="display:inline-block;padding:15px 24px;background:#6534d9;border-radius:10px;color:#fff;text-decoration:none;font-weight:700">${action}</a></p><p style="font-size:13px;line-height:1.7;color:#62596f">Se você não fez esta solicitação, ignore este e-mail. Sua conta continua segura.</p><p style="font-size:12px;line-height:1.7;word-break:break-all">Se o botão não funcionar, copie o link no navegador:<br>${escapeHtml(url)}</p></td></tr></table><p style="font-size:12px;color:#62596f">${escapeHtml(brandName)}</p></td></tr></table></body></html>`,
    subject,
    text: `Olá, ${name}.\n\n${description}\n\n${action}: ${url}\n\nSe você não fez esta solicitação, ignore este e-mail.\n${brandName}`,
  };
}
