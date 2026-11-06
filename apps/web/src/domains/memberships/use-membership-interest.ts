"use client";

import type { MembershipDTO } from "@privana/api/contracts/product";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { handleActionError } from "@/domains/feed/handle-action-error";
import { client, orpc } from "@/utils/orpc";
import { findCachedCreator } from "./find-cached-creator";

export function useMembershipInterest(creatorId: string) {
  const queryClient = useQueryClient();
  const lock = useRef(false);
  const viewer = useQuery(orpc.viewer.get.queryOptions());
  const memberships = useQuery({
    enabled: Boolean(viewer.data),
    queryFn: () => client.memberships.list(),
    queryKey: ["memberships"],
  });
  const mutationKey = ["membership-interest", creatorId];
  const pending = useIsMutating({ mutationKey }) > 0;
  const interest = useMutation<
    { status: "INTEREST_REGISTERED" },
    Error,
    void,
    string
  >({
    mutationFn: () => client.memberships.request({ creatorId }),
    mutationKey,
    onError: (error, _variables, pendingId) => {
      queryClient.setQueryData<MembershipDTO[]>(["memberships"], (old) =>
        old?.filter((entry) => entry.id !== pendingId)
      );
      handleActionError(error);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["memberships"] });
      const creator = findCachedCreator(queryClient, creatorId);
      const id = `pending-interest-${crypto.randomUUID()}`;
      if (creator) {
        queryClient.setQueryData<MembershipDTO[]>(["memberships"], (old) => {
          if (!old || old.some((entry) => entry.creator.id === creatorId)) {
            return old;
          }
          return [
            { creator, expiresAt: null, id, status: "INTEREST_REGISTERED" },
            ...old,
          ];
        });
      }
      return id;
    },
    onSettled: async () => {
      if (
        queryClient.isMutating({ mutationKey: ["membership-interest"] }) <= 1
      ) {
        await queryClient.invalidateQueries({ queryKey: ["memberships"] });
      }
      lock.current = false;
    },
    onSuccess: () =>
      toast.success(
        "Interesse registrado. Você está na lista para o lançamento."
      ),
    retry: false,
  });
  const registered =
    memberships.data?.some(
      (entry) =>
        entry.creator.id === creatorId && entry.status === "INTEREST_REGISTERED"
    ) || interest.isSuccess;
  const request = useCallback(() => {
    if (
      registered ||
      lock.current ||
      queryClient.isMutating({
        mutationKey: ["membership-interest", creatorId],
      })
    ) {
      return;
    }
    lock.current = true;
    interest.mutate();
  }, [creatorId, interest, queryClient, registered]);
  return { pending, registered, request };
}
