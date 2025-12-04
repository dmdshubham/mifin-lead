import { useMutation, useQuery, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail, toastSuccess } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

const getShowBulk = (body: any) => async () => {
  const result = await MifinHttpClient.post(api.productDetail, body);
  return result.data;
};

const useProductDetails = (info: any) => {
  return useQuery(api.productDetail, getShowBulk(info), {
    staleTime: 0,
    cacheTime: 0,
    onError: error => {
      console.error(error);
      toastFail("something wrong");
    },
  });
};

const saveProductRecord = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.saveProduct,
    body
  );
  return result.data;
};

const useSaveProductRecord = () => {
  const queryClient = useQueryClient();

  return useMutation(saveProductRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.saveProduct);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

const convertToCustomer = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.convertToCustomer,
    body
  );
  return result.data;
};

const useConvertToCustomer = () => {
  return useMutation(convertToCustomer);
};

export { useSaveProductRecord, useProductDetails, useConvertToCustomer };
