export function authError(error: {
  code?: string;
  message?: string;
  status?: number;
}): string {
  if (error.status === 429) {
    return "Muitas tentativas. Aguarde um minuto antes de tentar novamente.";
  }
  if (error.status === 503) {
    return (
      error.message ??
      "O serviço de e-mail está indisponível. Tente novamente mais tarde."
    );
  }
  if (error.code === "EMAIL_NOT_VERIFIED") {
    return "Confirme seu e-mail antes de entrar. Enviamos um novo link; você também pode solicitar outro abaixo.";
  }
  if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
    return "E-mail ou senha incorretos. Confira seus dados e tente novamente.";
  }
  if (error.code === "INVALID_TOKEN" || error.code === "TOKEN_EXPIRED") {
    return "Este link expirou ou já foi usado. Solicite um novo link.";
  }
  if (error.code === "PASSWORD_TOO_SHORT") {
    return "Use uma senha com pelo menos 12 caracteres.";
  }
  return "Não foi possível concluir. Confira os dados ou tente novamente em alguns instantes.";
}
