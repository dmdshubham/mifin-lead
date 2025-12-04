import { toastFail } from "@mifin/components/Toast";
import { api, MifinResponse } from "./service-api";
import { useQuery } from "react-query";
import { MifinHttpClient } from "./service-axios";

export interface INotifications {
  notification: {
    caseid: string;
    notification: string;
    customerName: string;
    notificationDate: string;
    NotificationTime: string;
    action: string;
  }[];
}

const getNotification = (info: any) => async () => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getNotification,
    info
  );
  return result.data;
};

const useFetchNotificationList = (info: any) => {
  return useQuery(api.getNotification, getNotification(info), {
    enabled: !!info,
    onError: () => {
      toastFail("Something went wrong");
    },
  });
};

export { useFetchNotificationList };
