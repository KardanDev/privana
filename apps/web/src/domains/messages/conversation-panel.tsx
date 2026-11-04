"use client";

import type {
  ConversationDTO,
  MessageDTO,
} from "@privana/api/contracts/product";
import { Bubble, BubbleContent } from "@privana/ui/components/bubble";
import { Button } from "@privana/ui/components/button";
import { Input } from "@privana/ui/components/input";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@privana/ui/components/message";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@privana/ui/components/message-scroller";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { mergeMessagePages } from "@/domains/messages/merge-message-pages";
import { Avatar } from "@/shared/components/avatar";
import { formatDate } from "@/shared/formatting/format-date";
import { client, orpc } from "@/utils/orpc";

const MESSAGES_PER_PAGE = 50;

export function ConversationPanel({
  conversation,
  onBack,
}: {
  conversation: ConversationDTO;
  onBack: () => void;
}) {
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();
  const viewer = useQuery({
    queryFn: () => client.viewer.get(),
    queryKey: ["viewer"],
  });
  const messages = useInfiniteQuery({
    getNextPageParam: (lastPage: MessageDTO[]) =>
      lastPage.length === MESSAGES_PER_PAGE ? lastPage[0]?.id : undefined,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      client.messages.get({
        before: pageParam,
        conversationId: conversation.id,
      }),
    queryKey: ["conversation", conversation.id],
    refetchInterval: 15_000,
  });
  const history = mergeMessagePages(messages.data?.pages ?? []);
  const send = useMutation(
    orpc.messages.send.mutationOptions({
      onError: handleActionError,
      onSuccess: async () => {
        setBody("");
        await queryClient.invalidateQueries();
      },
    })
  );
  const retryMessages = useCallback(() => messages.refetch(), [messages]);
  const loadOlderMessages = useCallback(
    () => messages.fetchNextPage(),
    [messages]
  );
  const submitMessage = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (body.trim() && !send.isPending) {
        send.mutate({ body: body.trim(), conversationId: conversation.id });
      }
    },
    [body, send, conversation]
  );
  const changeMessage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setBody(event.target.value),
    []
  );
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
          <ArrowLeft />
        </Button>
        <Avatar
          name={conversation.otherUser.name}
          src={conversation.otherUser.image}
        />
        <div>
          <h2 className="font-semibold">{conversation.otherUser.name}</h2>
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
          <QueryFeedback error={messages.error} retry={retryMessages} />
        ) : null}
        {messages.data ? (
          <MessageScrollerProvider autoScroll defaultScrollPosition="end">
            <MessageScroller>
              <MessageScrollerViewport
                aria-label="Histórico de mensagens"
                preserveScrollOnPrepend
              >
                <MessageScrollerContent className="gap-4 p-5">
                  {messages.isFetchNextPageError ? (
                    <p
                      className="text-center text-muted-foreground text-sm"
                      role="status"
                    >
                      Não foi possível carregar o histórico anterior. Tente
                      novamente pelo botão abaixo.
                    </p>
                  ) : null}
                  {messages.hasNextPage ? (
                    <MessageScrollerItem>
                      <Button
                        className="mx-auto flex"
                        disabled={messages.isFetchingNextPage}
                        onClick={loadOlderMessages}
                        variant="outline"
                      >
                        {messages.isFetchingNextPage
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
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                    >
                      <Message
                        align={
                          message.senderId === viewer.data?.id ? "end" : "start"
                        }
                      >
                        <MessageContent>
                          <Bubble
                            variant={
                              message.senderId === viewer.data?.id
                                ? "default"
                                : "muted"
                            }
                          >
                            <BubbleContent className="whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm">
                              {message.body}
                            </BubbleContent>
                          </Bubble>
                          <MessageFooter>
                            <time dateTime={message.createdAt}>
                              {formatDate(message.createdAt)}
                            </time>
                          </MessageFooter>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        ) : null}
      </div>
      <form className="flex gap-3 border-t p-4" onSubmit={submitMessage}>
        <label className="sr-only" htmlFor="message-body">
          Sua mensagem
        </label>
        <Input
          autoComplete="off"
          id="message-body"
          maxLength={5000}
          onChange={changeMessage}
          placeholder="Escreva sua mensagem…"
          required
          value={body}
        />
        <Button
          aria-label="Enviar mensagem"
          disabled={send.isPending || !body.trim()}
          size="icon"
          type="submit"
        >
          <Send />
        </Button>
      </form>
    </section>
  );
}
