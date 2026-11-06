"use client";
import type { SettingsDTO, ViewerDTO } from "@privana/api/contracts/product";
import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { type ChangeEvent, type FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { client, orpc } from "@/utils/orpc";
import { rollbackSettingsUpdate } from "./rollback-settings-update";

const SETTINGS_KEY = ["settings"] as const;
const SETTINGS_UPDATE_KEY = ["settings", "update"] as const;
interface SettingsInput {
  emailNotifications: boolean;
  locale: "pt-BR";
  name: string;
}
interface SettingsContext {
  previous: SettingsDTO | undefined;
  viewers: [QueryKey, ViewerDTO | null | undefined][];
}

export function useSettingsForm(settings: SettingsDTO) {
  const [name, setName] = useState(settings.name);
  const [emailNotifications, setEmailNotifications] = useState(
    settings.emailNotifications
  );
  const queryClient = useQueryClient();
  const update = useMutation<
    Awaited<ReturnType<typeof client.settings.update>>,
    Error,
    SettingsInput,
    SettingsContext
  >({
    mutationFn: (input: SettingsInput) => client.settings.update(input),
    mutationKey: SETTINGS_UPDATE_KEY,
    onError: (error, input, context) => {
      if (context) {
        queryClient.setQueryData<SettingsDTO>(SETTINGS_KEY, (current) =>
          rollbackSettingsUpdate(current, context.previous, input)
        );
        for (const [key, viewer] of context.viewers) {
          queryClient.setQueryData<ViewerDTO | null>(key, (current) =>
            current && viewer && current.name === input.name
              ? { ...current, name: viewer.name }
              : current
          );
        }
      }
      handleActionError(error);
    },
    onMutate: async (input) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: SETTINGS_KEY }),
        queryClient.cancelQueries({ queryKey: orpc.viewer.get.key() }),
        queryClient.cancelQueries({ queryKey: ["viewer"] }),
      ]);
      const previous = queryClient.getQueryData<SettingsDTO>(SETTINGS_KEY);
      const viewers = [
        ...queryClient.getQueriesData<ViewerDTO | null>({
          queryKey: orpc.viewer.get.key(),
        }),
        ...queryClient.getQueriesData<ViewerDTO | null>({
          queryKey: ["viewer"],
        }),
      ];
      queryClient.setQueryData<SettingsDTO>(SETTINGS_KEY, (current) =>
        current ? { ...current, ...input } : current
      );
      for (const [key, viewer] of viewers) {
        if (viewer) {
          queryClient.setQueryData<ViewerDTO>(key, {
            ...viewer,
            name: input.name,
          });
        }
      }
      return { previous, viewers };
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SETTINGS_KEY }),
        queryClient.invalidateQueries({ queryKey: orpc.viewer.get.key() }),
        queryClient.invalidateQueries({ queryKey: ["viewer"] }),
      ]);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(SETTINGS_KEY, saved);
      queryClient.setQueriesData<ViewerDTO | null>(
        { queryKey: orpc.viewer.get.key() },
        (viewer) =>
          viewer ? { ...viewer, image: saved.image, name: saved.name } : viewer
      );
      queryClient.setQueriesData<ViewerDTO | null>(
        { queryKey: ["viewer"] },
        (viewer) =>
          viewer ? { ...viewer, image: saved.image, name: saved.name } : viewer
      );
      toast.success("Suas preferências foram salvas.");
    },
  });
  const submitSettings = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (
        name.trim().length < 2 ||
        queryClient.isMutating({ mutationKey: SETTINGS_UPDATE_KEY }) > 0
      ) {
        return;
      }
      update.mutate({ emailNotifications, locale: "pt-BR", name: name.trim() });
    },
    [emailNotifications, name, queryClient, update]
  );
  const changeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value),
    []
  );
  const changeEmailNotifications = useCallback(
    (checked: boolean) => setEmailNotifications(checked),
    []
  );
  const dirty =
    name.trim() !== settings.name ||
    emailNotifications !== settings.emailNotifications;
  return {
    changeEmailNotifications,
    changeName,
    dirty,
    emailNotifications,
    name,
    submitSettings,
    update,
  };
}
