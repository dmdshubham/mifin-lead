import { Flex, Spinner } from "@chakra-ui/react";
import { Suspense, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { AppInit } from "./App.init";
import { NAVIGATION_ROUTES } from "./routes.constant";
import Login from "@mifin/pages/Login";
import {
  useAuthentication,
  useLogoutMutation,
} from "@mifin/service/mifin-auth";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { data: isAuthenticated, isLoading } = useAuthentication();
  const { mutate: logoutUser } = useLogoutMutation();
  
  useEffect(() => {
    if (typeof isAuthenticated === "boolean" && !isAuthenticated) {
      logoutUser();
      navigate(NAVIGATION_ROUTES.LOGIN);
    }
  }, [isAuthenticated, logoutUser]);

  const signInRoutes = [
    {
      path: NAVIGATION_ROUTES.LOGIN,
      element: <Login />,
    },
  ];

  if (isLoading) {
    return (
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }

  return (
    <Suspense
      fallback={
        <Flex h="100vh" alignItems="center" justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      }
    >
      <Routes>
        <Route
          path={NAVIGATION_ROUTES.LOGIN}
          element={
            <Navigate to={NAVIGATION_ROUTES.WORKLIST} />
            // ) : (
            //   <Login />
            // )
          }
        />
        {signInRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<AppInit />} />
        <Route
          path="*"
          element={<Navigate to={NAVIGATION_ROUTES.WORKLIST} replace />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
