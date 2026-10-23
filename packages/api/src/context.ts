import type { Session } from "@privana/auth";
import type { Database } from "@privana/db";

export type Context = {
  session: Session | null;
  db: Database;
};
