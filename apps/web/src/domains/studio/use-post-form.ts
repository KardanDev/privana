"use client";
import type { PostDTO } from "@privana/api/contracts/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { uploadMedia } from "@/domains/media/upload-media";
import { client, orpc } from "@/utils/orpc";
export function usePostForm(post: PostDTO | undefined, onSaved: () => void) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      data,
      status,
    }: {
      data: FormData;
      status: "DRAFT" | "PUBLISHED";
    }) => {
      const viewer = await client.viewer.get();
      if (!viewer) {
        throw new Error("Entre na sua conta para publicar.");
      }
      const file = data.get("media");
      const media =
        file instanceof File && file.size > 0
          ? await uploadMedia(file, viewer.id)
          : {};
      return await client.studio.savePost({
        body: String(data.get("body")),
        excerpt: String(data.get("excerpt")),
        id: post?.id,
        previewUrl: String(data.get("previewUrl") || "") || null,
        status,
        title: String(data.get("title")),
        visibility:
          data.get("visibility") === "SUBSCRIBERS" ? "SUBSCRIBERS" : "PUBLIC",
        ...media,
      });
    },
    onError: (failure) => setError(failure.message),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: orpc.studio.overview.key() }),
        queryClient.invalidateQueries({ queryKey: orpc.feed.list.key() }),
        queryClient.invalidateQueries({ queryKey: orpc.creators.key() }),
      ]);
      toast.success("Publicação salva.");
      onSaved();
    },
  });
  return {
    error,
    onSubmit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (mutation.isPending) {
        return;
      }
      setError(null);
      const { submitter } = event.nativeEvent as SubmitEvent;
      const status =
        submitter instanceof HTMLButtonElement &&
        submitter.value === "PUBLISHED"
          ? "PUBLISHED"
          : "DRAFT";
      mutation.mutate({ data: new FormData(event.currentTarget), status });
    },
    pending: mutation.isPending,
  };
}
