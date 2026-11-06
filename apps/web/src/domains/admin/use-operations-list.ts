"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type FormEvent, useCallback, useState } from "react";
import type {
  OperationsFilters,
  OperationsListSection,
} from "./operations-types";
import { readOperations } from "./read-operations";

export function useOperationsList(section: OperationsListSection) {
  const [filters, setFilters] = useState<OperationsFilters>({
    currency: "",
    kind: "",
    page: 0,
    role: "",
    search: "",
    status: "",
  });
  const query = useQuery({
    gcTime: 60_000,
    placeholderData: keepPreviousData,
    queryFn: () => readOperations(section, filters),
    queryKey: ["admin-operations", section, filters],
    retry: false,
  });
  const search = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFilters({
      currency: String(data.get("currency") ?? "")
        .trim()
        .toUpperCase(),
      kind: String(data.get("kind") ?? ""),
      page: 0,
      role: String(data.get("role") ?? ""),
      search: String(data.get("search") ?? "").trim(),
      status: String(data.get("status") ?? ""),
    });
  }, []);
  const previous = useCallback(
    () =>
      setFilters((current) => ({
        ...current,
        page: Math.max(0, current.page - 1),
      })),
    []
  );
  const next = useCallback(
    () => setFilters((current) => ({ ...current, page: current.page + 1 })),
    []
  );
  const reset = useCallback(() => {
    setFilters({
      currency: "",
      kind: "",
      page: 0,
      role: "",
      search: "",
      status: "",
    });
  }, []);
  return { filters, next, previous, query, reset, search };
}
