import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // ⬆️ 2min (era 5s)
            gcTime: 10 * 60 * 1000, // ✅ Mantém 10min
            refetchOnWindowFocus: false, // ✅ Já correto
            refetchOnMount: false, // ✨ NOVO - evita re-fetch desnecessário
            retry: 1, // ⬆️ 1 retry (era 0)
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000), // ✨ Exponential backoff
          },
          mutations: {
            retry: 1, // ✨ NOVO - retry em mutations
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;
