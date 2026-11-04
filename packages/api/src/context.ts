import type { Session } from "@privana/auth";
import type { Database } from "@privana/db";

export interface Context {
  db: Database;
  session: Session | null;
}
