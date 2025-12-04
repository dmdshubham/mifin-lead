import { useMutation, useQueryClient } from "react-query";
import { api, MifinResponse } from "./service-api";
import { toastFail } from "@mifin/components/Toast";
import { MifinHttpClient } from "./service-axios";

// api being fetch in the table
const dailyReport = "dailyReport";

const serchDailyReportData = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.searchDailyReport,
    body
  );
  return result.data;
};

const useSearchDailyReportMutation = () => {
  const QueryClient = useQueryClient();

  return useMutation(serchDailyReportData, {
    onSuccess: data => {
      QueryClient.invalidateQueries(api.searchDailyReport);
      QueryClient.setQueryData(dailyReport, data);
    },
    onError: err => {
      console.error(err);
      toastFail("something went wrong");
    },
  });
};

export { serchDailyReportData, useSearchDailyReportMutation };
