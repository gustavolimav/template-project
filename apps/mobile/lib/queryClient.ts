import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client with sensible defaults.
 * - staleTime: 5 minutes (data considered fresh)
 * - gcTime: 30 minutes (garbage collection)
 * - retry: 2 attempts on failure
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
