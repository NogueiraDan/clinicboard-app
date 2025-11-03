import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000,
            refetchOnWindowFocus: false,
            retry: false,
            gcTime: 10 * 60 * 1000, // 10 minutes
          },
          mutations: {},
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default TanstackQueryProvider;
