"use client";
import type { ConversationDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { Avatar } from "@/shared/components/avatar";
import { ConversationComposer } from "./conversation-composer";
import { ConversationHistory } from "./conversation-history";
import { useConversation } from "./use-conversation";

export function ConversationPanel({
  conversation,
  onBack,
}: {
  conversation: ConversationDTO;
  onBack: () => void;
}) {
  const state = useConversation(conversation.id);
  const { messages } = state;
  return (
    <section
      aria-label={`Conversa com ${conversation.otherUser.name}`}
      className="flex h-[calc(100dvh-18rem)] min-h-64 min-w-0 flex-col md:h-[calc(100dvh-11rem)]"
    >
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Button
          aria-label="Voltar às conversas"
          className="md:hidden"
          onClick={onBack}
          size="icon"
          variant="ghost"
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        <Avatar
          name={conversation.otherUser.name}
          src={conversation.otherUser.image}
        />
        <div className="min-w-0">
          <h2 className="truncate font-semibold">
            {conversation.otherUser.name}
          </h2>
          <p className="text-muted-foreground text-xs">Conversa privada</p>
        </div>
      </header>
      <div className="min-h-0 flex-1">
        {messages.isLoading ? (
          <p className="p-6 text-muted-foreground text-sm" role="status">
            Carregando mensagens…
          </p>
        ) : null}
        {messages.isError && !messages.data ? (
          <QueryFeedback error={messages.error} retry={state.retryMessages} />
        ) : null}
        {messages.data ? (
          <ConversationHistory
            hasOlder={messages.hasNextPage}
            history={state.history}
            loadingOlder={messages.isFetchingNextPage}
            olderError={messages.isFetchNextPageError}
            onLoadOlder={state.loadOlderMessages}
            onRetry={state.retryMessage}
            sending={state.pending}
            viewerId={state.viewerId}
          />
        ) : null}
      </div>
      <ConversationComposer
        body={state.body}
        disabled={!(state.viewerId && messages.data)}
        onChange={state.changeMessage}
        onSubmit={state.submitMessage}
        pending={state.pending}
      />
    </section>
  );
}
