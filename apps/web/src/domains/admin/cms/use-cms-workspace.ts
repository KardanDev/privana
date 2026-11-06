"use client";

import type {
  CmsDocumentDTO,
  PlatformConfig,
} from "@privana/api/contracts/platform";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type FormEvent,
  type MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";
import { cmsErrorMessage } from "./cms-error-message";
import { executeCmsCommand } from "./execute-cms-command";
import { readCmsForm } from "./read-cms-form";

export function useCmsWorkspace(document: CmsDocumentDTO) {
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PlatformConfig | null>(null);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const mutation = useMutation({
    mutationFn: executeCmsCommand,
    mutationKey: ["admin-cms-write"],
    onError: (failure) => setError(cmsErrorMessage(failure)),
    onMutate: (command) => {
      if (command.kind === "save") {
        setPreview(command.config);
      }
    },
    onSuccess: async (next, command) => {
      queryClient.setQueryData(["admin-cms"], next);
      await queryClient.invalidateQueries({ queryKey: ["admin-cms-history"] });
      if (command.kind === "publish") {
        await queryClient.invalidateQueries({
          queryKey: orpc.platform.get.key(),
        });
      }
      toast.success(
        command.kind === "publish"
          ? "Versão publicada na plataforma."
          : "Rascunho salvo. A versão pública continua independente."
      );
    },
    retry: false,
  });
  const changed = useCallback(() => {
    setDirty(true);
    setConfirmPublish(false);
  }, []);
  const save = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (queryClient.isMutating({ mutationKey: ["admin-cms-write"] }) > 0) {
        return;
      }
      setError(null);
      try {
        mutation.mutate({
          config: readCmsForm(event.currentTarget),
          expectedVersion: document.version,
          kind: "save",
        });
      } catch (failure) {
        setError(cmsErrorMessage(failure));
      }
    },
    [document.version, mutation, queryClient]
  );
  const showPreview = useCallback(() => {
    if (!formRef.current) {
      return;
    }
    try {
      setPreview(readCmsForm(formRef.current));
      setError(null);
    } catch (failure) {
      setError(cmsErrorMessage(failure));
    }
  }, []);
  const requestPublish = useCallback(() => {
    if (!dirty) {
      setConfirmPublish(true);
    }
  }, [dirty]);
  const cancelPublish = useCallback(() => setConfirmPublish(false), []);
  const publish = useCallback(() => {
    if (
      !dirty &&
      confirmPublish &&
      queryClient.isMutating({ mutationKey: ["admin-cms-write"] }) === 0
    ) {
      setError(null);
      mutation.mutate({ expectedVersion: document.version, kind: "publish" });
    }
  }, [confirmPublish, dirty, document.version, mutation, queryClient]);
  const restore = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (
        !dirty &&
        queryClient.isMutating({ mutationKey: ["admin-cms-write"] }) === 0
      ) {
        setError(null);
        mutation.mutate({
          expectedVersion: document.version,
          kind: "restore",
          revisionId: event.currentTarget.value,
        });
      }
    },
    [dirty, document.version, mutation, queryClient]
  );
  return {
    cancelPublish,
    changed,
    confirmPublish,
    dirty,
    error,
    formRef,
    pending: mutation.isPending,
    pendingKind: mutation.isPending ? mutation.variables.kind : undefined,
    preview,
    publish,
    requestPublish,
    restore,
    save,
    showPreview,
  };
}
