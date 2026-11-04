"use client";

import { type MouseEvent, useCallback, useState } from "react";
import {
  type OperationsSection,
  operationsNavigation,
} from "./operations-navigation";

export function useOperationsNavigation(role: string) {
  const allowed = operationsNavigation.filter((item) =>
    item.roles.some((candidate) => candidate === role)
  );
  const [selectedSection, setSection] = useState<OperationsSection>(
    allowed[0]?.id ?? "overview"
  );
  const select = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const selected = operationsNavigation.find(
        (item) =>
          item.id === event.currentTarget.value &&
          item.roles.some((candidate) => candidate === role)
      );
      if (selected) {
        setSection(selected.id);
      }
    },
    [role]
  );
  const section =
    allowed.find((item) => item.id === selectedSection)?.id ??
    allowed[0]?.id ??
    "overview";
  return { allowed, section, select };
}
