import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useToast } from "@chakra-ui/react";

import { AxiosError } from "axios";
import { getErrorMessageWithErrorCode } from "@mifin/utils/getErrorMessageWithErrorCode";
import { handleSessionClose } from "@mifin/utils/handleSessionClose";

interface ErrorState {
  error: Error | null;
  setError: (error: Error | null) => void;
  handleError: (error: unknown) => void;
}

const defaultErrorState: ErrorState = {
  error: null,
  setError: () => {
    // TODO: Implement setError function
  },
  handleError: () => {
    // TODO: Implement handleError function
  },
};
const getEndpoint = (url: string) => {
  const urlObject = new URL(url);
  const pathSegments = urlObject.pathname.split("/");
  return pathSegments[pathSegments.length - 1];
};

const ErrorContext = createContext<ErrorState>(defaultErrorState);

export const useError = () => useContext(ErrorContext);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  const invalidToastShown = useRef(false);
  const sessionToastShown = useRef(false);
  const apiToastShown = useRef(false);

  const handleError = useCallback(
    (error: unknown) => {
      const axiosError = error as AxiosError;

      // Skip showing error toast if user is offline
      if (!navigator.onLine || axiosError?.message === 'Network Error' || !axiosError?.response) {
        console.log('Network error detected - user is offline, skipping error toast');
        return;
      }

      // Check if error has suppressToast flag from axios interceptor
      if ((axiosError as any)?.suppressToast) {
        return;
      }

      const hasNoToastVisible =
        !sessionToastShown.current &&
        !invalidToastShown.current &&
        !apiToastShown.current;

      if (
        axiosError?.response?.status === 401 &&
        getEndpoint(axiosError?.request?.responseURL) ===
          "JwtTokenRefresherServlet"
      ) {
        // toast({
        //   title: "Session Expired",
        //   description: getErrorMessageWithErrorCode(axiosError),
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
        if (hasNoToastVisible) {
          toast({
            title: "Session Expired",
            description: getErrorMessageWithErrorCode(axiosError),
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          sessionToastShown.current = true;
        }
        setTimeout(() => {
          handleSessionClose();
        }, 5000);
      } else if (
        axiosError?.response?.status === 400 &&
        getEndpoint(axiosError?.request?.responseURL) ===
          "JwtTokenRefresherServlet"
      ) {
        // toast({
        //   title: "Invalid User ID",
        //   description: getErrorMessageWithErrorCode(axiosError),
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
        if (hasNoToastVisible) {
          toast({
            title: "Session Invalid!",
            description: getErrorMessageWithErrorCode(axiosError),
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          invalidToastShown.current = true;
        }
        setTimeout(() => {
          handleSessionClose();
        }, 5000);
      } else {
        // toast({
        //   title: "Api stopped! Refresh page.",
        //   description: getErrorMessageWithErrorCode(axiosError),
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
        if (hasNoToastVisible) {
          toast({
            title: "Api stopped! Refresh page.",
            description: getErrorMessageWithErrorCode(axiosError),
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          apiToastShown.current = true;
          setTimeout(() => {
            apiToastShown.current = false;
          }, 5000);
        }
      }

      setError(axiosError);
    },
    [toast]
  );

  return (
    <ErrorContext.Provider value={{ error, setError, handleError }}>
      {children}
    </ErrorContext.Provider>
  );
};
