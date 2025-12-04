import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

const ContactDetailKey = "get-contactDetail";

const getContactDetail = (body: any) => async () => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.contactDetail,
    body
  );
  return result.data;
};

const useContactDetail = (info: any) => {
  return useQuery(api.contactDetail, getContactDetail(info), {
    onError: error => {
      console.error(error);
      toastFail("Something went wrong");
      throw new Error(`An Error occured ${error}`);
    },
  });
};

const useGetContactDetailMutation = (info: any) => {
  const queryClient = useQueryClient();

  return useQuery(api.contactDetail, getContactDetail(info), {
    onSuccess: result => {
      queryClient.setQueryData(ContactDetailKey, result);
    },
    enabled: !!info,
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

const useFetchContactDetail = () => {
  return useQuery<any>(ContactDetailKey);
};

const saveContactRecord = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.contactRecord,
    body
  );
  return result.data;
};

const useSaveContactRecord = () => {
  const queryClient = useQueryClient();

  return useMutation(saveContactRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.contactRecord);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

export {
  useSaveContactRecord,
  useGetContactDetailMutation,
  useFetchContactDetail,
  useContactDetail,
};
