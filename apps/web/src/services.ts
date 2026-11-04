import { resolve } from "node:path";
import { createAuth } from "@privana/auth";
import { readAuthConfig } from "@privana/auth/read-auth-config";
import { createPrismaClient } from "@privana/db";

import { ENV } from "./env.server";

export const db = createPrismaClient(ENV);
export const auth = createAuth(
  readAuthConfig(ENV, resolve(process.cwd(), ".local-mail")),
  db
);
