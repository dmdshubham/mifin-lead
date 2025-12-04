import { toastFail } from "@mifin/components/Toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { MifinHttpClient } from "./service-axios";

const getCPUList = (info: any) => async () => {
  const result = await MifinHttpClient.post<MifinResponse>(api.getcpu, info);
  return result.data;
};

const usegetCpuList = (info: any) => {
  return useQuery(api.getcpu, getCPUList(info), {
    enabled: !!info,
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

const saveCpu = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(api.savecpu, body);
  return result.data;
};

const useSaveCpuList = () => {
  const queryClient = useQueryClient();

  return useMutation(saveCpu, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.getcpu);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

export { usegetCpuList, useSaveCpuList };
