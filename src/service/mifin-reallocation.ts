import { useMutation, useQuery } from "react-query";
import { toastFail, toastSuccess } from "@mifin/components/Toast";
import { AxiosError } from "axios";
import { MifinResponse, api } from "./service-api";
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

const reallocate = "reallocation";
const getReallocation = async (body: any) => {
  try {
    const response = await MifinHttpClient.post<MifinResponse>(
      api.reallocation,
      body
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    toastFail("Something went wrong");
    //throw new Error(`An Error occured ${error}`);
    throw new Error(axiosError.message || `An Error occured ${error}`);
  }
};

const useReallocationMutation = () => {
  return useMutation(getReallocation, {
    onSuccess: result => {
      toastSuccess(result.statusInfo.message);
    },
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

//for storing data in cache
const useFetchReallocation = () => {
  return useQuery(reallocate);
};

export { useReallocationMutation, useFetchReallocation };
