import { Flex, Spinner } from "@chakra-ui/react";
import LayoutWrapper from "@mifin/components/LayoutWrapper";
import Customer from "@mifin/pages/Customer/Index";
import Dashboard from "@mifin/pages/Dashboard";
import Lead from "@mifin/pages/Lead";
import DailyActivity from "@mifin/pages/DailyActivity";
import Login from "@mifin/pages/Login";
import MyWorkList from "@mifin/pages/MyWorkList";
import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SearchAndAllocate from "@mifin/pages/SearchAndAllocate";
import { NAVIGATION_ROUTES } from "@mifin/routes/routes.constant";

export const AppInit = () => {
  const adminProtectedRoutes = [
    {
      path: NAVIGATION_ROUTES.DASHBOARD,
      element: <Dashboard />,
    },
    {
      path: NAVIGATION_ROUTES.WORKLIST,
      element: <MyWorkList />,
    },
    {
      path: NAVIGATION_ROUTES.CONTACT,
      element: <Customer />,
    },
    {
      path: NAVIGATION_ROUTES.LEAD,
      element: <Lead />,
    },
    {
      path: NAVIGATION_ROUTES.LOGIN,
      element: <Login />,
    },
    {
      path: NAVIGATION_ROUTES.SEARCH_AND_ALLOCATE,
      element: <SearchAndAllocate />,
    },
    {
      path: NAVIGATION_ROUTES.DAILYREPORT,
      element: <DailyActivity />,
    },
  ];

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
        {adminProtectedRoutes.map(
          route =>
            route && (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <>
                    <LayoutWrapper>{route.element}</LayoutWrapper>
                  </>
                }
              />
            )
        )}

        <Route
          path="*"
          element={<Navigate to={NAVIGATION_ROUTES.WORKLIST} replace />}
        />
      </Routes>
    </Suspense>
  );
};
