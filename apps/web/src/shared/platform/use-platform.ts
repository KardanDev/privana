"use client";

import { useContext } from "react";
import { PlatformContext } from "./platform-context";

export function usePlatform() {
  return useContext(PlatformContext);
}
