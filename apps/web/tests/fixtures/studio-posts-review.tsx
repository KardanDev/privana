import type { PostDTO } from "@privana/api/contracts/product";
import { useCallback, useState } from "react";
import { StudioPosts } from "../../src/domains/studio/studio-posts";
import { post } from "../posts/social-fixtures";

export function StudioPostsReview({ mode }: { mode: string }) {
  const [editor, setEditor] = useState<PostDTO | "new" | null>(() => {
    if (mode === "new") {
      return "new";
    }
    return mode === "edit" ? post : null;
  });
  const close = useCallback(() => setEditor(null), []);
  const open = useCallback(() => setEditor("new"), []);
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 p-4">
      <h1 className="font-heading text-2xl">Publicações em revisão</h1>
      <p className="text-muted-foreground text-sm">
        Editor real com dados fictícios. Nenhuma publicação ou arquivo real será
        salvo.
      </p>
      <StudioPosts
        active={mode === "new" || mode === "edit"}
        editor={editor}
        onClose={close}
        onEdit={setEditor}
        onOpen={open}
        posts={mode === "new" ? [] : [post]}
      />
    </main>
  );
}
