import { Bubble, BubbleContent } from "@privana/ui/components/bubble";
import { Button } from "@privana/ui/components/button";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@privana/ui/components/message";
import { MessageScrollerItem } from "@privana/ui/components/message-scroller";
import { Check, Clock3, RotateCcw } from "lucide-react";
import { useCallback } from "react";
import { formatDate } from "@/shared/formatting/format-date";
import type { ConversationMessage as ConversationMessageData } from "./message-types";

export function ConversationMessage({
  message,
  own,
  onRetry,
  sending,
}: {
  message: ConversationMessageData;
  own: boolean;
  onRetry: (id: string) => void;
  sending: boolean;
}) {
  const retry = useCallback(() => onRetry(message.id), [message.id, onRetry]);
  return (
    <MessageScrollerItem messageId={message.id}>
      <Message align={own ? "end" : "start"}>
        <MessageContent>
          <Bubble variant={own ? "default" : "muted"}>
            <BubbleContent className="whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm">
              {message.body}
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            {message.delivery === "pending" ? (
              <span className="flex items-center gap-1" role="status">
                <Clock3 aria-hidden="true" className="size-3" />
                Enviando…
              </span>
            ) : null}
            {message.delivery === "failed" ? (
              <span
                className="flex flex-col items-end gap-1 text-destructive"
                role="alert"
              >
                <span>Não foi possível confirmar o envio.</span>
                <Button
                  disabled={sending}
                  onClick={retry}
                  size="sm"
                  variant="ghost"
                >
                  <RotateCcw aria-hidden="true" className="size-3" />
                  Reenviar
                </Button>
              </span>
            ) : null}
            {message.delivery ? null : (
              <span className="flex items-center gap-1">
                <time dateTime={message.createdAt}>
                  {formatDate(message.createdAt)}
                </time>
                {own ? <Check aria-label="Enviada" className="size-3" /> : null}
              </span>
            )}
          </MessageFooter>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  );
}
