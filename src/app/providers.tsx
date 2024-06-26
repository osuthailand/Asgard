"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode; }) {
    return (
        <SessionProvider refetchInterval={0}>
            <QueryClientProvider client={queryClient}>
                <NextUIProvider>
                    {children}
                </NextUIProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}