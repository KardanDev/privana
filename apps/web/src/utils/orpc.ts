"use client";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouterClient } from "@privana/api/routers/index";

const link = new RPCLink({ url: () => `${window.location.origin}/api/rpc` });
export const client: AppRouterClient = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
