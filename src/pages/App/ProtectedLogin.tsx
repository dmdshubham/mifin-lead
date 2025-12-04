import {
  useAuthentication,
  useLogoutMutation,
} from "@mifin/service/mifin-auth";
import { FC, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrepareLogin from "@mifin/pages/App/PrepareLogin";
import { NAVIGATION_ROUTES } from "@mifin/routes/routes.constant";
import { protectedLoginProps } from "@mifin/Interface/app";

const LOUGOUT_REDIRECT_URL = "../mifin/userAuthAction.do?dispatchMethod=logout";

const ProtectedLogin: FC<protectedLoginProps> = props => {
  const { children } = props;
  const { data: isAuthenticated } = useAuthentication();
  const { mutate: logoutUser } = useLogoutMutation();
  const navigate = useNavigate();

  const isLoginInValid = () => {
    const isAuthenticatedTypeBoolean = typeof isAuthenticated === "boolean";
    
    const isAuthTokenAvailable = true;
    const hostName = window.location.hostname;
    const isLocalHost =
      hostName === "localhost" || hostName === "127.0.0.1" || hostName === "";

    if (
      (isAuthenticatedTypeBoolean && !isAuthenticated) ||
      (!isAuthTokenAvailable && !isLocalHost)
    ) {
      return true;
    }

    return false;
  };

  const clearBrowserData = () => {
    sessionStorage.clear();
    localStorage.clear();
  };

  const processAutomaticLogout = () => {
    logoutUser();
    navigate(NAVIGATION_ROUTES?.WORKLIST);
    window.location.href = LOUGOUT_REDIRECT_URL;
    setTimeout(() => {
      clearBrowserData();
    }, 1000);
  };

  useEffect(() => {
    if (isLoginInValid()) {
      processAutomaticLogout();
    }
  }, []);

  return (
    <Fragment>
      <PrepareLogin />
      {children}
    </Fragment>
  );
};

export default ProtectedLogin;
