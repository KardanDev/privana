import { toast } from "sonner";

export function handleActionError(error: unknown) {
  if (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "UNAUTHORIZED"
  ) {
    window.location.assign(
      `/login?returnTo=${encodeURIComponent(window.location.pathname)}`
    );
    return;
  }
  toast.error("Não foi possível concluir. Tente novamente em instantes.");
}
