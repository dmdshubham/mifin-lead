import { useMutation, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

const nextPrevLead = "next-prev-lead";

const getNextPrevData = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.nextPrevLead,
    body
  );
  return result.data;
};

const useNextPrevLeadMutation = () => {
  const QueryClient = useQueryClient();

  return useMutation(nextPrevLead, {
    onSuccess: data => {
      QueryClient.invalidateQueries(api.nextPrevLead);
      QueryClient.setQueryData(nextPrevLead, data);
    },
    onError: err => {
      toastFail("something went wrong");
      throw new Error(`An Error occured ${err}`);
    },
  });
};

export { getNextPrevData, useNextPrevLeadMutation };
