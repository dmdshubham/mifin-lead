import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail, toastFailOfflineAware } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

const showCustomerData = "get-showCustomer";

const getShowBulk = (body: any) => async () => {
  const result = await MifinHttpClient.post(api.customerDetails, body);
  return result.data;
};

const useCustomerDetail = (info: any) => {
  return useQuery(api.customerDetails, getShowBulk(info), {
    staleTime: 0,
    cacheTime: 0,
    onError: error => {
      console.error(error);
      toastFailOfflineAware("something wrong");
    },
  });
};

const ApplicantDetailKey = "get-applicantDetail";
const getCustomerDetail = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.customerDetails,
    body
  );
  return result.data;
};

const useGetCustomerDetailMutation = () => {
  const QueryClient = useQueryClient();

  return useMutation(getCustomerDetail, {
    onSuccess: data => {
      QueryClient.invalidateQueries(api.customerDetails);
      QueryClient.setQueryData(showCustomerData, data);
    },
    onError: err => {
      console.error(err);
      toastFailOfflineAware("something went wrong");
    },
  });
};

const useFetchCustomerDetail = () => {
  return useQuery<any>(ApplicantDetailKey);
};

const saveCustomerRecord = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.customerRecord,
    body
  );
  return result.data;
};

const useSaveCustomerRecord = () => {
  const queryClient = useQueryClient();

  return useMutation(saveCustomerRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.customerRecord);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

export {
  useGetCustomerDetailMutation,
  useFetchCustomerDetail,
  useSaveCustomerRecord,
  useCustomerDetail,
};
