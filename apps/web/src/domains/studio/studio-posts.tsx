import type { PostDTO } from "@privana/api/contracts/product";
import { Button } from "@privana/ui/components/button";
import { FileText, Plus } from "lucide-react";
import { EmptyState } from "@/shared/components/empty-state";
import { PostEditor } from "./post-editor";
import { StudioPostRow } from "./studio-post-row";

export function StudioPosts({
  active,
  filtered = false,
  editor,
  posts,
  onOpen,
  onClose,
  onEdit,
}: {
  active: boolean;
  filtered?: boolean;
  editor: PostDTO | "new" | null;
  posts: PostDTO[];
  onOpen: () => void;
  onClose: () => void;
  onEdit: (post: PostDTO) => void;
}) {
  const firstPostDescription = active
    ? "Crie sua primeira publicação ou salve uma ideia como rascunho."
    : "Suas publicações aparecerão aqui quando seu perfil estiver aprovado.";
  return (
    <>
      {editor && active ? (
        <PostEditor
          key={editor === "new" ? "new" : editor.id}
          onClose={onClose}
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
    </>
  );
}
