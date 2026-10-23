import { createAuth } from "@privana/auth";
import { createPrismaClient } from "@privana/db";

import { ENV } from "./env.server";

export const db = createPrismaClient(ENV);
export const auth = createAuth(ENV, db);
