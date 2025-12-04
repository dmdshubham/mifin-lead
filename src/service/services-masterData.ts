import { useMutation, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

export interface IAllocatedList {
  userId: string;
  userName: string;
  designationName: string;
}

const masterData = "get-master-data";

const getMasterList = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getMasterList,
    body
  );
  return result.data;
};

const useMasterDataMutation = () => {
  const QueryClient = useQueryClient();

  return useMutation(getMasterList, {
    onSuccess: data => {
      QueryClient.invalidateQueries(api.getMasterList);
      QueryClient.setQueryData(masterData, data);
    },
    onError: err => {
      console.error(err);
      toastFail("something went wrong");
    },
  });
};

export { getMasterList, useMasterDataMutation };
