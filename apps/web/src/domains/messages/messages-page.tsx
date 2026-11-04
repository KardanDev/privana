"use client";

import { Button } from "@privana/ui/components/button";
import { cn } from "@privana/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { ContentSkeleton } from "@/domains/feed/components/content-skeleton";
import { QueryFeedback } from "@/domains/feed/components/query-feedback";
import { SocialHeading } from "@/domains/feed/social-heading";
import { ConversationPanel } from "@/domains/messages/conversation-panel";
import { Avatar } from "@/shared/components/avatar";
import { EmptyState } from "@/shared/components/empty-state";
import { formatDate } from "@/shared/formatting/format-date";
import { usePlatform } from "@/shared/platform/use-platform";
import { client } from "@/utils/orpc";
export function MessagesPage({
  initialConversation,
}: {
  initialConversation?: string;
}) {
  const [selectedId, setSelectedId] = useState(initialConversation);
  const platform = usePlatform();
  const conversations = useQuery({
    enabled: platform.features.messaging,
    queryFn: () => client.messages.list(),
    queryKey: ["conversations"],
    refetchInterval: 30_000,
  });
  const selected = conversations.data?.find(
    (conversation) => conversation.id === selectedId
  );
  const retryConversations = useCallback(
    () => conversations.refetch(),
    [conversations]
  );
  const closeConversation = useCallback(() => {
    setSelectedId(undefined);
    window.history.replaceState(null, "", "/messages");
  }, []);
  const selectConversation = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const id = event.currentTarget.value;
      setSelectedId(id);
      window.history.replaceState(
        null,
        "",
        `/messages?conversation=${encodeURIComponent(id)}`
      );
    },
    []
  );
  if (!platform.features.messaging) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        <SocialHeading title={platform.navigation.messages} />
        <EmptyState
          description="As mensagens estão desativadas nesta comunidade no momento."
          icon={MessageCircle}
          title="Mensagens indisponíveis"
        />
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <SocialHeading title={platform.navigation.messages} />
      {conversations.isLoading ? <ContentSkeleton /> : null}
      {conversations.isError ? (
        <QueryFeedback error={conversations.error} retry={retryConversations} />
      ) : null}
      {conversations.data?.length === 0 ? (
        <EmptyState
          description="Encontre um criador e envie uma mensagem pelo perfil. Suas conversas ficam guardadas aqui."
          icon={MessageCircle}
          title="Uma boa conversa começa com um olá"
        >
          <Button nativeButton={false} render={<Link href="/explore" />}>
            Encontrar criadores
          </Button>
        </EmptyState>
      ) : null}
      {conversations.data && conversations.data.length > 0 ? (
        <div className="grid overflow-hidden rounded-lg border bg-card md:grid-cols-[280px_minmax(0,1fr)]">
          <nav
            aria-label="Conversas"
            className={cn(
              "flex max-h-[calc(100dvh-18rem)] flex-col overflow-y-auto border-r md:max-h-[calc(100dvh-11rem)]",
              selected && "hidden md:flex"
            )}
          >
            <h2 className="border-b px-4 py-3 font-semibold text-sm">
              Conversas
            </h2>
            {conversations.data.map((conversation) => (
              <button
                aria-current={
                  selectedId === conversation.id ? "true" : undefined
                }
                className={cn(
                  "flex items-center gap-3 border-b px-4 py-3.5 text-left transition-colors hover:bg-muted focus-visible:bg-secondary focus-visible:outline-none",
                  selectedId === conversation.id && "bg-secondary/60"
                )}
                key={conversation.id}
                onClick={selectConversation}
                type="button"
                value={conversation.id}
              >
                <Avatar
                  name={conversation.otherUser.name}
                  src={conversation.otherUser.image}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-sm">
                    {conversation.otherUser.name}
                  </span>
                  <span className="mt-1 block truncate text-muted-foreground text-xs">
                    {conversation.lastMessage ?? "Comece uma conversa"}
                  </span>
                  <time
                    className="mt-2 block text-[11px] text-muted-foreground"
                    dateTime={conversation.updatedAt}
                  >
                    {formatDate(conversation.updatedAt)}
                  </time>
                </span>
              </button>
            ))}
          </nav>
          {selected ? (
            <ConversationPanel
              conversation={selected}
              key={selected.id}
              onBack={closeConversation}
            />
          ) : (
            <div className="hidden h-[calc(100dvh-11rem)] min-h-64 md:flex">
              <EmptyState
                description="Escolha uma conversa ao lado para continuar de onde parou."
                icon={MessageCircle}
                title="Suas mensagens"
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
