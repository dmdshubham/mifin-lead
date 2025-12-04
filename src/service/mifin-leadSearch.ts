import { useMutation, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

const leadSearch = "get-lead-search";

const getLeadSearch = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.leadSearch,
    body
  );
  return result.data;
};

const useLeadSearchMutation = () => {
  const QueryClient = useQueryClient();

  return useMutation(getLeadSearch, {
    onSuccess: data => {
      QueryClient.invalidateQueries(api.leadSearch);
      QueryClient.setQueryData(leadSearch, data);
    },
    onError: err => {
      console.error(err);
      toastFail("something went wrong");
    },
  });
};

export { getLeadSearch, useLeadSearchMutation };
