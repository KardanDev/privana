import type { RefObject } from "react";

export interface PostLeaveGuard {
  cancel: () => void;
  defer: (proceed: () => void, restoreFocus?: () => void) => boolean;
  request: (proceed: () => void) => void;
}

export type PostLeaveRef = RefObject<PostLeaveGuard | null>;
