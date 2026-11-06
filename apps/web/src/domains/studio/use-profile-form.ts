"use client";
import type { CreatorDTO } from "@privana/api/contracts/product";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";
import { invalidateStudioContent } from "./invalidate-studio-content";
import { profileFields } from "./profile-fields";
import { readProfileForm } from "./read-profile-form";
import { STUDIO_WRITE_KEY } from "./studio-cache-types";
import { updateStudioProfileCache } from "./update-studio-profile-cache";

interface ProfileMutationContext {
  id: string;
  previous: ReturnType<typeof profileFields>;
}

export function useProfileForm(profile: CreatorDTO | null) {
  const queryClient = useQueryClient();
  const writes = useIsMutating({ mutationKey: STUDIO_WRITE_KEY });
  const mutation = useMutation(
    orpc.studio.saveProfile.mutationOptions({
      mutationKey: [...STUDIO_WRITE_KEY, "profile"],
      onError: (
        error,
        _variables,
        context: ProfileMutationContext | null | undefined
      ) => {
        if (context) {
          updateStudioProfileCache(
            queryClient,
            orpc.studio.overview.key(),
            context.id,
            context.previous
          );
        }
        toast.error(
          error.message ||
            "Não foi possível salvar seu perfil. Suas alterações continuam no formulário."
        );
      },
      onMutate: async (changes): Promise<ProfileMutationContext | null> => {
        if (profile?.status !== "ACTIVE") {
          return null;
        }
        await Promise.all([
          queryClient.cancelQueries({ queryKey: orpc.studio.overview.key() }),
          queryClient.cancelQueries({ queryKey: ["creator"] }),
        ]);
        const previous = profileFields(profile);
        updateStudioProfileCache(
          queryClient,
          orpc.studio.overview.key(),
          profile.id,
          {
            ...previous,
            ...changes,
            avatarUrl: changes.avatarUrl ?? null,
            coverUrl: changes.coverUrl ?? null,
          }
        );
        return { id: profile.id, previous };
      },
      onSettled: () =>
        invalidateStudioContent(
          queryClient,
          orpc.studio.overview.key(),
          profile?.id
        ),
      onSuccess: async (saved) => {
        updateStudioProfileCache(
          queryClient,
          orpc.studio.overview.key(),
          saved.id,
          profileFields(saved)
        );
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: orpc.viewer.get.key() }),
          queryClient.invalidateQueries({ queryKey: ["viewer"] }),
        ]);
        toast.success("Seu perfil foi salvo.");
      },
      retry: false,
    })
  );
  return {
    error: mutation.error?.message,
    onSubmit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (queryClient.isMutating({ mutationKey: STUDIO_WRITE_KEY }) > 0) {
        return;
      }
      const data = new FormData(event.currentTarget);
      mutation.mutate(readProfileForm(data));
    },
    pending: mutation.isPending || writes > 0,
  };
}
