"use client";
import type { PostDTO } from "@privana/api/contracts/product";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { type FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadMedia } from "@/domains/media/upload-media";
import { client, orpc } from "@/utils/orpc";
import { commitStudioPost } from "./commit-studio-post";
import { invalidateStudioContent } from "./invalidate-studio-content";
import { readPostForm } from "./read-post-form";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";
export function usePostForm(post: PostDTO | undefined, onSaved: () => void) {
  const [error, setError] = useState<string | null>(null);
  const [clientPostId] = useState(() => crypto.randomUUID());
  const [phase, setPhase] = useState<"uploading" | "saving">("saving");
  const completedUpload = useRef<{
    file: File;
    ownerId: string;
    media: Awaited<ReturnType<typeof uploadMedia>>;
  } | null>(null);
  const queryClient = useQueryClient();
  const writes = useIsMutating({ mutationKey: STUDIO_WRITE_KEY });
  const mutation = useMutation({
    mutationFn: async ({
      data,
      status,
    }: {
      data: FormData;
      status: "DRAFT" | "PUBLISHED";
    }) => {
      const file = data.get("media");
      const content = readPostForm(data, status, post?.id, clientPostId);
      if (file instanceof File && file.size > 0) {
        setPhase("uploading");
        // Only fetch the owner for uploads; the save API authorizes all writes itself.
        const viewer = await queryClient.fetchQuery(
          orpc.viewer.get.queryOptions()
        );
        if (!viewer) {
          throw new Error("Entre na sua conta para publicar.");
        }
        const previousUpload = completedUpload.current;
        const media =
          previousUpload?.file === file && previousUpload.ownerId === viewer.id
            ? previousUpload.media
            : await uploadMedia(file, viewer.id);
        completedUpload.current = { file, media, ownerId: viewer.id };
        setPhase("saving");
        const saved = await client.studio.savePost({ ...content, ...media });
        return { ...saved, content, mediaType: media.mediaType };
      }
      setPhase("saving");
      const saved = await client.studio.savePost(content);
      return { ...saved, content };
    },
    mutationKey: [...STUDIO_WRITE_KEY, "post", post?.id ?? "new"],
    onError: (failure) => setError(failure.message),
    onSettled: () =>
      invalidateStudioContent(
        queryClient,
        orpc.studio.overview.key(),
        post?.creator.id
      ),
    onSuccess: (saved) => {
      completedUpload.current = null;
      commitStudioPost(queryClient, orpc.studio.overview.key(), saved, post);
      toast.success("Publicação salva.");
      onSaved();
    },
    retry: false,
  });
  return {
    error,
    onSubmit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
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
    pending: mutation.isPending || writes > 0,
    preview:
      mutation.isPending && mutation.variables
        ? {
            phase,
            published: mutation.variables.status === "PUBLISHED",
            title: String(mutation.variables.data.get("title") ?? ""),
          }
        : null,
  };
}
