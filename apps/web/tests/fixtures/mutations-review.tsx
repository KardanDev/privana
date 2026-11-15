import { Button } from "@privana/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { FollowButton } from "../../src/domains/creators/follow-button";
import { InterestButton } from "../../src/domains/memberships/interest-button";
import { useNotifications } from "../../src/domains/notifications/use-notifications";
import { PostActions } from "../../src/domains/posts/post-actions";
import { client } from "../../src/utils/orpc";
import { SettingsMutationReview } from "./settings-mutation-review";

export function MutationsReview() {
  const feed = useQuery({
    queryFn: () => client.feed.list({ following: false, saved: false }),
    queryKey: ["social-stream", "latest"],
  });
  const settings = useQuery({
    queryFn: () => client.settings.get(),
    queryKey: ["settings"],
  });
  const memberships = useQuery({
    queryFn: () => client.memberships.list(),
    queryKey: ["memberships"],
  });
  const notifications = useNotifications();
  const post = feed.data?.items[0];
  const showComments = useCallback(() => undefined, []);
  const refresh = useCallback(() => feed.refetch(), [feed]);
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-4">
      <h1 className="font-heading text-2xl">Retornos em revisão</h1>
      <p className="text-muted-foreground text-sm">
        Dados fictícios; hooks e controles reais. Nenhuma ação real é enviada.
      </p>
      <section aria-label="Publicação" className="rounded-lg border bg-card">
        {post ? (
          <>
            <PostActions
              commentsOpen={false}
              onComments={showComments}
              post={post}
            />
            <PostActions
              commentsOpen={false}
              onComments={showComments}
              post={post}
            />
            <div className="flex flex-wrap gap-2 p-4">
              <FollowButton creator={post.creator} />
              <FollowButton creator={post.creator} />
              <Button onClick={refresh} variant="outline">
                Atualizar publicação
              </Button>
            </div>
          </>
        ) : null}
      </section>
      <section aria-label="Interesses" className="flex flex-wrap gap-2">
        {post ? (
          <>
            <InterestButton creatorId={post.creator.id} />
            <InterestButton creatorId={post.creator.id} />
          </>
        ) : null}
        <output aria-label="Situação dos interesses">
          {memberships.data?.map((entry) => entry.status).join(", ") ||
            "Nenhum interesse"}
        </output>
      </section>
      <section
        aria-label="Leitura"
        className="flex flex-wrap items-center gap-2"
      >
        <Button
          disabled={notifications.markRead.isPending}
          onClick={notifications.markAllRead}
        >
          Ler notificações
        </Button>
        <output aria-label="Não lidas">
          {notifications.notifications.data?.filter((entry) => !entry.readAt)
            .length ?? 0}
        </output>
      </section>
      {settings.data ? (
        <SettingsMutationReview settings={settings.data} />
      ) : null}
    </main>
  );
}
