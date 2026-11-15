import { Button } from "@privana/ui/components/button";
import { ConversationComposer } from "../../src/domains/messages/conversation-composer";
import { ConversationHistory } from "../../src/domains/messages/conversation-history";
import type { ChangeMessageDraft } from "../../src/domains/messages/message-types";
import { useConversation } from "../../src/domains/messages/use-conversation";

export function MessageConversationReview({
  conversationId,
  onBack,
  body,
  onDraftChange,
}: {
  conversationId: string;
  onBack: () => void;
  body: string;
  onDraftChange: ChangeMessageDraft;
}) {
  const state = useConversation(conversationId, body, onDraftChange);
  return (
    <section
      aria-label={conversationId}
      className="flex min-h-96 flex-col rounded-lg border bg-card"
    >
      <Button className="self-start" onClick={onBack} variant="ghost">
        Voltar às conversas
      </Button>
      <div className="h-64 min-h-0">
        <ConversationHistory
          hasOlder={false}
          history={state.history}
          loadingOlder={false}
          olderError={false}
          onLoadOlder={state.loadOlderMessages}
          onRetry={state.retryMessage}
          sending={state.pending}
          viewerId={state.viewerId}
        />
      </div>
      <ConversationComposer
        body={state.body}
        disabled={!(state.viewerId && state.messages.data)}
        onChange={state.changeMessage}
        onSubmit={state.submitMessage}
        pending={state.pending}
      />
    </section>
  );
}
