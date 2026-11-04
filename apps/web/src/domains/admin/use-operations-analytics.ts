"use client";

import { useQuery } from "@tanstack/react-query";
import { type ChangeEvent, useCallback, useState } from "react";
import { client } from "@/utils/orpc";

export function useOperationsAnalytics() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const query = useQuery({
    queryFn: () => client.admin.analytics.overview({ days }),
    queryKey: ["admin-analytics", days],
    retry: false,
  });
  const changeDays = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
    if (value === "7") {
      setDays(7);
    } else if (value === "90") {
      setDays(90);
    } else {
      setDays(30);
    }
  }, []);
  return { changeDays, days, query };
}
