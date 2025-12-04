import { useMutation, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

const getDunning = "get-Dunning";

const getDunningData = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getDunning,
    body
  );
  return result.data;
};

const useGetDunningMutation = () => {
  const QueryClient = useQueryClient();

  return useMutation(getDunning, {
    onSuccess: data => {
      QueryClient.invalidateQueries(api.getDunning);
      QueryClient.setQueryData(getDunning, data);
    },
    onError: err => {
      console.error(err);
      toastFail("something went wrong");
    },
  });
};

export { getDunning, getDunningData, useGetDunningMutation };
