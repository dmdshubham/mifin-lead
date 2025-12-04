import { ChakraProvider } from "@chakra-ui/react";
import { globalStyles, theme } from "@mifin/theme";
import { FC, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import StoreProvider from "@mifin/redux/StoreProvider";
import ErrorFallback from "@mifin/components/FallbackUI";
import { OfflineProvider } from "@mifin/hooks/OfflineContext";

interface IProvider {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 30 * 1000,
    },
  },
});

const Provider: FC<IProvider> = props => {
  const { children } = props;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter basename={"/mifinLead"}>
        <ChakraProvider theme={theme}>
        
          <QueryClientProvider client={queryClient}>
            <StoreProvider>
              <OfflineProvider>
                <Toaster position="bottom-right" />
                <HelmetProvider>{children}</HelmetProvider>
              </OfflineProvider>
            </StoreProvider>
          </QueryClientProvider>
          {globalStyles}
        </ChakraProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default Provider;
