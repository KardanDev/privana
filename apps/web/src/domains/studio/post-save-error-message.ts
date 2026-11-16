export function postSaveErrorMessage(error: Error): string {
  if (error instanceof TypeError || !error.message.trim()) {
    return "Não foi possível confirmar o salvamento. Suas alterações continuam no editor. Tente novamente.";
  }
  return error.message;
}
