"use client";

import React, { useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              success: "bg-green-50 text-green-800",
              toast:
                "group flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 text-green-900 p-4 shadow-lg shadow-green-100",
              title: "font-semibold text-green-800 text-sm",
              description: "text-green-700 text-xs",
              actionButton:
                "bg-green-600 text-white hover:bg-green-700 transition-colors text-xs rounded-md px-2 py-1",
              cancelButton:
                "bg-transparent border border-green-400 text-green-700 hover:bg-green-100 text-xs rounded-md px-2 py-1",
              icon: "text-green-600",
            },
          }}
        />
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
