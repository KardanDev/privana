"use client";

import { defaultPlatformConfig } from "@privana/api/contracts/platform";
import { createContext } from "react";

export const PlatformContext = createContext(defaultPlatformConfig);
