import { useMutation, useQuery, useQueryClient } from "react-query";
// import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { getDashboardData } from "@mifin/service/dashboard/api";

const dashboardData = "get-dashboard-data";
const useGetDashboardDataMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(getDashboardData, {
    onSuccess: result => {
      queryClient.setQueryData(dashboardData, result.responseData);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

const useGetDashboardDataQuery = (body: any) => {
  return useQuery(
    [dashboardData, body],
    () => getDashboardData(body),
    {
      select: data => data.responseData,
      onError: () => {
        toastFail("Something went wrong");
      },
      enabled: false,
    }
  );
};

export { useGetDashboardDataMutation, useGetDashboardDataQuery, dashboardData };
