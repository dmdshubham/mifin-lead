import AppRoutes from "@mifin/routes/AppRoutes";
import ProtectedLogin from "./ProtectedLogin";
import ExpireLoggedInSession from "./ExpireLoggedInSession";
import ApiInterceptorSetup from "./AppInterceptorSetup";
import { ErrorProvider } from "@mifin/hooks/ErrorContext";
import { queryClient } from "@mifin/libs/reactQueryClient";
import { QueryClientProvider } from "react-query";

function App() {
  return (
    <ProtectedLogin>
      <ErrorProvider>
        <QueryClientProvider client={queryClient}>
          <ApiInterceptorSetup />
          <ExpireLoggedInSession />
          <AppRoutes />
        </QueryClientProvider>
      </ErrorProvider>
    </ProtectedLogin>
  );
}

export default App;
