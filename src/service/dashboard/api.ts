import { MifinResponse, api } from "../service-api";
import { MifinHttpClient } from "../service-axios";

export const getDashboardMastersData = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getDashboardMasters,
    body
  );
  return result.data;
};

export const getDashboardData = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getDashboardData,
    body
  );
  return result.data;
};