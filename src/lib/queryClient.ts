import { QueryClient } from '@tanstack/react-query';

// Tanstack Query client with taskflow-optimized defaults
// "Tanstack Query does in 5 lines what my useFetch did in 50"
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 30s — board data changes infrequently
      staleTime: 30_000,
      // Cache time: 5m — keep boards in memory while navigating
      gcTime: 5 * 60_000,
      // Retry failed requests 2 times
      retry: 2,
      // Refetch on window focus — always see latest board state
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Retry mutations once on network failure
      retry: 1,
    },
  },
});
