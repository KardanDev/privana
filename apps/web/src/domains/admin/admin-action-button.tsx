"use client";

import { Button } from "@privana/ui/components/button";
import type { ReactNode } from "react";
import type { AdminActionProps, AdminCommand } from "./admin-types";
import { useAdminCommand } from "./use-admin-command";

export function AdminActionButton({
  command,
  onAction,
  pending,
  children,
  variant = "outline",
}: AdminActionProps & {
  command: AdminCommand;
  children: ReactNode;
  variant?: "outline" | "destructive" | "default";
}) {
  const onClick = useAdminCommand(command, onAction);
  return (
    <Button disabled={pending} onClick={onClick} size="sm" variant={variant}>
      {children}
    </Button>
  );
}
