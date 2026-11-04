import type { AuthMode } from "./auth-mode";

export const authCopy: Record<
  AuthMode,
  { title: string; description: string; submit: string }
> = {
  forgot: {
    description: "Enviaremos um link seguro para você criar uma nova senha.",
    submit: "Enviar link de recuperação",
    title: "Vamos recuperar seu acesso.",
  },
  login: {
    description: "Entre para ficar perto de quem inspira você.",
    submit: "Entrar na minha conta",
    title: "Seu lugar está aqui.",
  },
  register: {
    description: "Crie sua conta e descubra um universo mais próximo.",
    submit: "Criar minha conta",
    title: "Conexões começam aqui.",
  },
  reset: {
    description: "Escolha uma senha exclusiva com pelo menos 12 caracteres.",
    submit: "Salvar nova senha",
    title: "Um novo começo.",
  },
  verify: {
    description:
      "Abra a mensagem da Privana e clique no link. Não chegou? Solicite um novo envio abaixo.",
    submit: "Reenviar confirmação",
    title: "Confirme seu e-mail.",
  },
};
