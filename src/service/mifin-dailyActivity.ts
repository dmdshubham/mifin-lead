import { api } from "./service-api";
import { MifinResponse } from "./service-api";
import { useQuery } from "react-query";
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

const getDailyActivity = (formData: any) => async () => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.dailyActivity,
    formData
  );
  return result.data;
};

const useFetchDailyReport = (formdata: any) => {
  return useQuery(api.dailyActivity, getDailyActivity(formdata), {
    enabled: !!formdata,
    onError: () => {
      toastFail("Something Went Wrong");
    },
  });
};

export { useFetchDailyReport };
