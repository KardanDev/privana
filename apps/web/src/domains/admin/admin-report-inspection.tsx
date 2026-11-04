"use client";

import { PostMedia } from "@/domains/posts/post-media";
import { QueryFeedback } from "@/shared/components/query-feedback";
import { formatDate } from "@/shared/formatting/format-date";
import { AdminStatus } from "./admin-status";
import { useAdminReportDetails } from "./use-admin-report-details";

const postStatusLabels: Record<string, string> = {
  ARCHIVED: "Arquivada",
  DRAFT: "Rascunho",
  PUBLISHED: "Publicada",
};

export function AdminReportInspection({ reportId }: { reportId: string }) {
  const query = useAdminReportDetails(reportId);
  if (query.isPending) {
    return (
      <p className="py-5 text-muted-foreground text-sm" role="status">
        Carregando conteúdo para análise…
      </p>
    );
  }
  if (query.isError) {
    return <QueryFeedback retry={query.refetch} />;
  }
  const { creator, post } = query.data;
  return (
    <div className="mt-4 flex min-w-0 flex-col gap-5 border-t pt-5">
      {creator ? (
        <section aria-label="Contexto do criador">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words font-semibold text-sm">
              {creator.displayName}{" "}
              <span className="font-normal text-muted-foreground">
                @{creator.handle}
              </span>
            </h3>
            <AdminStatus status={creator.status} />
          </div>
          <p className="mt-2 break-words text-muted-foreground text-xs">
            {creator.category} ·{" "}
            {creator.location || "Localização não informada"} · Conta{" "}
            {creator.user.status === "ACTIVE" ? "ativa" : "suspensa"}
          </p>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">
            {creator.bio || "Este criador ainda não adicionou uma descrição."}
          </p>
          <p className="mt-3 break-all text-muted-foreground text-xs">
            Criador: {creator.id} · Conta: {creator.userId}
          </p>
        </section>
      ) : (
        <p className="text-muted-foreground text-sm">
          O perfil vinculado não está mais disponível.
        </p>
      )}
      {post ? (
        <section
          aria-label="Publicação denunciada"
          className="flex min-w-0 flex-col gap-4 border-t pt-5"
        >
          <div>
            <div className="mb-2 flex flex-wrap gap-2 text-muted-foreground text-xs">
              <span>{postStatusLabels[post.status] ?? post.status}</span>
              <span>
                ·{" "}
                {post.visibility === "SUBSCRIBERS"
                  ? "Exclusiva para assinantes"
                  : "Pública"}
              </span>
              <time dateTime={post.createdAt}>
                · {formatDate(post.createdAt)}
              </time>
            </div>
            <h3 className="break-words font-semibold text-lg">{post.title}</h3>
          </div>
          <p className="whitespace-pre-wrap break-words rounded-xl border bg-card p-4 text-sm leading-relaxed [overflow-wrap:anywhere]">
            {post.body}
          </p>
          {post.mediaUrl ? (
            <div className="overflow-hidden rounded-xl border">
              <PostMedia
                locked={false}
                mediaType={post.mediaType}
                mediaUrl={post.mediaUrl}
                previewUrl={null}
                title={post.title}
              />
              <p className="bg-card p-3 text-muted-foreground text-xs">
                Mídia privada para análise. O acesso é verificado novamente ao
                carregar o arquivo.
              </p>
            </div>
          ) : null}
        </section>
      ) : (
        <p className="text-muted-foreground text-sm">
          Esta denúncia não possui uma publicação disponível. Analise o contexto
          do perfil e o motivo informado.
        </p>
      )}
    </div>
  );
}
