import React, { useEffect } from "react";
import { MifinHttpClient } from "@mifin/service/service-axios";
import { useError } from "@mifin/hooks/ErrorContext";

const ApiInterceptorSetup: React.FC = () => {
  const { handleError } = useError();

  useEffect(() => {
    const responseInterceptor = MifinHttpClient.interceptors.response.use(
      response => response,
      error => {
        handleError(error);
        return Promise.reject(error);
      }
    );

    return () => {
      MifinHttpClient.interceptors.response.eject(responseInterceptor);
    };
  }, [handleError]);

  return null;
};

export default ApiInterceptorSetup;
