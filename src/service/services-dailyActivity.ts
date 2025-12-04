import { useMutation, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

// api being fetch in the table
const dailyReport = "dailyReport";

const getDailyReportData = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.dailyReport,
    body
  );
  return result.data;
};

const useDailyReportMutation = () => {
  const QueryClient = useQueryClient();

  return useMutation(getDailyReportData, {
    onSuccess: data => {
      QueryClient.invalidateQueries(api.dailyReport);
      QueryClient.setQueryData(dailyReport, data);
    },
    onError: err => {
      console.error(err);
      toastFail("something went wrong");
    },
  });
};

export { getDailyReportData, useDailyReportMutation };
