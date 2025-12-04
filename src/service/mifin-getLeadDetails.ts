import { api, MifinResponse } from "./service-api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

export interface IDoucment {
  documentTypeMaster: Array<{
    documentTypeId: string;
    documentTypeName: string;
  }>;
  documentForm: {
    documentList: {
      documentTypeId: string;
      documentTypeName: string;
      receivingDate: string;
      remarks: string;
      targetDate: string;
      createdDate: string;
      docCreatedByName: string;
      docUpdatedByName: string;
      updatedDate: string;
      documentName: string;
      documentId: string;
      docUpdatedById: string;
      docCreatedById: string;
      docStatusId: string;
      docStatusName: string;
      docId: string;
      docAlreadyExits: string;
      isRecdWaived: string;
    }[];
  };
  documentStatusMaster: Array<{
    docStatusId: string;
    docStatusName: string;
  }>;
  documentName: Array<{
    documentTypeId: string;
    documentName: string;
    documentId: string;
  }>;
}

const getLeadDetails = (formData: any) => async () => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.dailyActivity,
    formData
  );
  return result.data;
};

const useFetchLeadDetails = (formdata: any) => {
  return useQuery(api.dailyActivity, getLeadDetails(formdata), {
    enabled: !!formdata,
    onError: () => {
      toastFail("Something Went Wrong");
    },
  });
};

const getLeaddata = "get-lead-list";
const getLeadList = async (body: any) => {
  // mifinHttps client needs to be used and reomve hard coaded url

  const result = await MifinHttpClient.post<MifinResponse>(
    api.getLeadList,
    body
  );
  return result.data;
};

const useGetLeadListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(getLeadList, {
    onSuccess: result => {
      queryClient.setQueryData(getLeaddata, result.responseData);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

//for storing data in cache
const useFetchleadList = (reqBodyAllMaster: any) => {
  // return useQuery(getLeaddata);

  return useQuery(["get-lead-list"], () => getLeadList(reqBodyAllMaster), {
    select: data => {
      return data.responseData ? data.responseData : data;
    },
    onError: (e: any) => {
      console.warn(e);
    },
  });
};

export { useFetchLeadDetails, useGetLeadListMutation, useFetchleadList };
