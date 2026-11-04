import { ZodError } from "zod";

export function cmsErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    const [issue] = error.issues;
    return issue
      ? `${issue.path.join(" / ")}: ${issue.message}`
      : "Revise os campos do rascunho.";
  }
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "CONFLICT"
  ) {
    return "Outra pessoa alterou esta versão. Copie suas alterações e recarregue o rascunho antes de salvar novamente.";
  }
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir esta ação.";
}
