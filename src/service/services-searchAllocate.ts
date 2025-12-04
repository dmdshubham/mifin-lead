import { useMutation, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

// api being fetch in the table
const searchAllocateData = "get-searchAllocate-data";

const getCaseData = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getAllocateCase,
    body
  );
  return result.data;
};

const useAllocatedCaseMutation = () => {
  const QueryClient = useQueryClient();

  return useMutation(getCaseData, {
    onSuccess: data => {
      QueryClient.invalidateQueries(api.getAllocateCase);
      QueryClient.setQueryData(searchAllocateData, data);
    },
    onError: err => {
      console.error(err);
      toastFail("something went wrong");
    },
  });
};

export { getCaseData, useAllocatedCaseMutation };
