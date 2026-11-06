export type SyncTarget = "development" | "preview" | "production";
export interface SyncOptions {
  dryRun: boolean;
  files: string[];
  scope?: string;
  target: SyncTarget;
}
export interface SyncEntry {
  key: string;
  value: string;
}
export interface SyncPlan {
  entries: SyncEntry[];
  skippedCount: number;
}
