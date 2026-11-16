"use client";

import type { PostDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { FileText, Plus } from "lucide-react";
import { useCallback, useRef } from "react";
import { EmptyState } from "@/shared/components/empty-state";
import { PostEditor } from "./post-editor";
import type { PostLeaveRef } from "./post-leave-guard";
import { StudioPostRow } from "./studio-post-row";

export function StudioPosts({
  active,
  filtered = false,
  editor,
  posts,
  onOpen,
  onClose,
  onEdit,
  leaveRef,
}: {
  active: boolean;
  filtered?: boolean;
  editor: PostDTO | "new" | null;
  posts: PostDTO[];
  onOpen: () => void;
  onClose: () => void;
  onEdit: (post: PostDTO) => void;
  leaveRef?: PostLeaveRef;
}) {
  const region = useRef<HTMLElement>(null);
  const closeEditor = useCallback(() => {
    onClose();
    requestAnimationFrame(() => region.current?.focus({ preventScroll: true }));
  }, [onClose]);
  const firstPostDescription = active
    ? "Crie sua primeira publicação ou salve uma ideia como rascunho."
    : "Suas publicações aparecerão aqui quando seu perfil estiver aprovado.";
  return (
    <section
      aria-label="Publicações do estúdio"
      className="flex flex-col gap-4 outline-none sm:gap-5"
      ref={region}
      tabIndex={-1}
    >
      {editor ? (
        <PostEditor
          canWrite={active}
          key={editor === "new" ? "new" : editor.id}
          leaveRef={leaveRef}
          onClose={closeEditor}
          post={editor === "new" ? undefined : editor}
        />
      ) : null}
      {posts.length > 0 ? (
        <section
          aria-label="Suas publicações"
          className="overflow-hidden rounded-xl border bg-card"
        >
          {posts.map((post) => (
            <StudioPostRow
              disabled={!active}
              key={post.id}
              onEdit={onEdit}
              post={post}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          description={
            filtered
              ? "Escolha outro filtro para ver suas publicações."
              : firstPostDescription
          }
          icon={FileText}
          title={
            filtered
              ? "Nenhuma publicação neste filtro"
              : "Nenhuma publicação ainda"
          }
        >
          {active && !filtered ? (
            <Button onClick={onOpen}>
              <Plus aria-hidden="true" data-icon="inline-start" />
              Criar primeira publicação
            </Button>
          ) : null}
        </EmptyState>
      )}
    </section>
  );
}
