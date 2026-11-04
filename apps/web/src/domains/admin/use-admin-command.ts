"use client";

import { useCallback } from "react";
import type { AdminActionProps, AdminCommand } from "./admin-types";

export function useAdminCommand(
  command: AdminCommand,
  onAction: AdminActionProps["onAction"]
) {
  return useCallback(() => onAction(command), [command, onAction]);
}
