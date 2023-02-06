import { QueryClient } from "react-query";

import { createStandaloneToast } from "@chakra-ui/react";
import { theme } from "../theme";

const toast = createStandaloneToast({ theme });

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const title =
    error instanceof Error ? error.message : "error connecting to server";

  // prevent duplicate toasts
  toast.closeAll();
  toast({ title, status: "error", variant: "subtle", isClosable: true });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
      // re-fetch 제한, 네트워크 호출에 보수적으로 적용
      staleTime: 60 * 10000, // 10 minutes
      cacheTime: 90 * 10000, // 15 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});
