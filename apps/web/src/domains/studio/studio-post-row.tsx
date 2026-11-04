"use client";
import type { PostDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { Archive, FileText, LockKeyhole, Pencil } from "lucide-react";
import { formatDate } from "@/shared/formatting/format-date";
import { useStudioPostActions } from "./use-studio-post-actions";

const STATUS_LABELS: Record<string, string> = {
  ARCHIVED: "Arquivada",
  DRAFT: "Rascunho",
  PUBLISHED: "Publicada",
};
export function StudioPostRow({
  disabled = false,
  post,
  onEdit,
}: {
  disabled?: boolean;
  post: PostDTO;
  onEdit: (post: PostDTO) => void;
}) {
  const actions = useStudioPostActions(post, onEdit);
  const { confirm } = actions;
  return (
    <article className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 border-b p-4 last:border-0 sm:grid-cols-[44px_minmax(0,1fr)_auto_auto] sm:gap-4 sm:p-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
        {post.visibility === "SUBSCRIBERS" ? (
          <LockKeyhole aria-hidden="true" className="size-5" />
        ) : (
          <FileText aria-hidden="true" className="size-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-semibold text-sm leading-snug">
          {post.title}
        </h3>
        <p className="mt-1 text-muted-foreground text-xs">
          {formatDate(post.createdAt)} · {post.likeCount}{" "}
          {post.likeCount === 1 ? "curtida" : "curtidas"} · {post.commentCount}{" "}
          {post.commentCount === 1 ? "comentário" : "comentários"}
        </p>
      </div>
      <span className="col-start-2 w-fit rounded-md bg-muted px-2 py-1 font-medium text-xs sm:col-start-auto">
        {STATUS_LABELS[post.status] ?? post.status}
      </span>
      <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-auto">
        <Button
          aria-label={`Editar ${post.title}`}
          disabled={disabled || actions.pending}
          onClick={actions.edit}
          size="icon"
          variant="ghost"
        >
          <Pencil aria-hidden="true" className="size-4" />
        </Button>
        {post.status === "ARCHIVED" ? null : (
          <Button
            aria-label={
              confirm
                ? `Confirmar arquivamento de ${post.title}`
                : `Arquivar ${post.title}`
            }
            disabled={disabled || actions.pending}
            onClick={actions.archive}
            size={confirm ? "sm" : "icon"}
            variant={confirm ? "destructive" : "ghost"}
          >
            {confirm ? (
              "Confirmar"
            ) : (
              <Archive aria-hidden="true" className="size-4" />
            )}
          </Button>
        )}
        {confirm ? (
          <Button
            disabled={actions.pending}
            onClick={actions.cancelArchive}
            size="sm"
            variant="ghost"
          >
            Cancelar
          </Button>
        ) : null}
      </div>
    </article>
  );
}
