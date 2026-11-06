import { Button } from "@privana/ui/components/button";
import { Input } from "@privana/ui/components/input";
import { LoaderCircle, Send } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";

export function ConversationComposer({
  body,
  disabled,
  pending,
  onChange,
  onSubmit,
}: {
  body: string;
  disabled: boolean;
  pending: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      aria-busy={pending}
      className="flex gap-3 border-t p-4"
      onSubmit={onSubmit}
    >
      <label className="sr-only" htmlFor="message-body">
        Sua mensagem
      </label>
      <Input
        autoComplete="off"
        id="message-body"
        maxLength={5000}
        onChange={onChange}
        placeholder="Escreva sua mensagem…"
        required
        value={body}
      />
      <Button
        aria-label={pending ? "Enviando mensagem" : "Enviar mensagem"}
        disabled={disabled || pending || !body.trim()}
        size="icon"
        type="submit"
      >
        {pending ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Send aria-hidden="true" />
        )}
      </Button>
    </form>
  );
}
