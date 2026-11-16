import type { RefObject } from "react";

export interface PostLeaveGuard {
  cancel: () => void;
  request: (proceed: () => void) => void;
}

export type PostLeaveRef = RefObject<PostLeaveGuard | null>;
