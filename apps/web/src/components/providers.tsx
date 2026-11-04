"use client";

import type { PlatformConfig } from "@privana/api/contracts/platform";
import { Toaster } from "@privana/ui/components/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PlatformProvider } from "@/shared/platform/platform-provider";
import { getQueryClient } from "@/shared/query/get-query-client";

import { ThemeProvider } from "./theme-provider";

export default function Providers({
  children,
  platformConfig,
}: {
  children: React.ReactNode;
  platformConfig: PlatformConfig;
}) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <PlatformProvider initialConfig={platformConfig}>
          {children}
        </PlatformProvider>
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
