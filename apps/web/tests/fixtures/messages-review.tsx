import { Button } from "@privana/ui/components/button";
import { type MouseEvent, useCallback, useState } from "react";
import { useMessageDrafts } from "../../src/domains/messages/use-message-drafts";
import { MessageConversationReview } from "./message-conversation-review";

export function MessagesReview() {
  const [selected, setSelected] = useState("");
  const { drafts, changeDraft } = useMessageDrafts();
  const select = useCallback(
    (event: MouseEvent<HTMLButtonElement>) =>
      setSelected(event.currentTarget.value),
    []
  );
  const close = useCallback(() => setSelected(""), []);
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <h1 className="font-heading text-2xl">Mensagens em revisão</h1>
      <p className="text-muted-foreground text-sm">
        Conversas fictícias; hooks e controles reais. Nenhuma mensagem real é
        enviada.
      </p>
      <nav aria-label="Conversas" className="flex gap-2">
        <Button onClick={select} value="conversation-a" variant="outline">
          Conversa A
        </Button>
        <Button onClick={select} value="conversation-b" variant="outline">
          Conversa B
        </Button>
      </nav>
      {selected ? (
        <MessageConversationReview
          body={drafts[selected] ?? ""}
          conversationId={selected}
          key={selected}
          onBack={close}
          onDraftChange={changeDraft}
        />
      ) : null}
    </main>
  );
}
