import { useMutation, useQuery, useQueryClient } from "react-query";
// import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { getDashboardMastersData } from "@mifin/service/dashboard/api";


const getDasboardMasterdata = "get-dashboard-masters-list";
const useGetDashboardMastersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(getDashboardMastersData, {
    onSuccess: result => {
      queryClient.setQueryData(getDasboardMasterdata, result.responseData);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

export { useGetDashboardMastersMutation, getDasboardMasterdata };