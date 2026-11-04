"use client";

import { useCallback, useState } from "react";

export function useAvatarImage(src?: string | null) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const onError = useCallback(() => setFailedSource(src ?? null), [src]);
  return { onError, showImage: Boolean(src && src !== failedSource) };
}
