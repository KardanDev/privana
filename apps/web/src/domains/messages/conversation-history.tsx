import { Button } from "@privana/ui/components/button";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@privana/ui/components/message-scroller";
import { ConversationMessage } from "./conversation-message";
import type { ConversationMessage as ConversationMessageData } from "./message-types";

export function ConversationHistory({
  history,
  hasOlder,
  loadingOlder,
  olderError,
  onLoadOlder,
  onRetry,
  sending,
  viewerId,
}: {
  history: ConversationMessageData[];
  hasOlder: boolean;
  loadingOlder: boolean;
  olderError: boolean;
  onLoadOlder: () => void;
  onRetry: (id: string) => void;
  sending: boolean;
  viewerId?: string;
}) {
  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="end">
      <MessageScroller>
        <MessageScrollerViewport
          aria-label="Histórico de mensagens"
          preserveScrollOnPrepend
        >
          <MessageScrollerContent className="gap-4 p-4 sm:p-5">
            {olderError ? (
              <p
                className="text-center text-muted-foreground text-sm"
                role="status"
              >
                Não foi possível carregar o histórico anterior. Tente novamente
                pelo botão abaixo.
              </p>
            ) : null}
            {hasOlder ? (
              <MessageScrollerItem>
                <Button
                  className="mx-auto flex"
                  disabled={loadingOlder}
                  onClick={onLoadOlder}
                  variant="outline"
                >
                  {loadingOlder
                    ? "Carregando histórico…"
                    : "Ver mensagens anteriores"}
                </Button>
              </MessageScrollerItem>
            ) : null}
            {history.length === 0 ? (
              <p className="m-auto max-w-xs text-center text-muted-foreground text-sm">
                Um olá pode ser o começo de uma boa conversa.
              </p>
            ) : null}
            {history.map((message) => (
              <ConversationMessage
                key={message.id}
                message={message}
                onRetry={onRetry}
                own={message.senderId === viewerId}
                sending={sending}
              />
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
