import { MifinResponse, api } from "../service-api";
import { MifinHttpClient } from "../service-axios";

export const getAllMastersData = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getAllNewMasters,
    body
  );
  return result.data;
};