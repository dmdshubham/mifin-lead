import { MifinResponse, api } from "../service-api";
import { MifinHttpClient } from "../service-axios";

export const getNewTehsilByCity = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getNewTehsilByCity,
    body
  );
  return result.data;
};

export const getNewPincodeByTehsil = async (body: any) => {
  const result = await MifinHttpClient.post<MifinResponse>(
    api.getNewPincodeByTehsil,
    body
  );
  return result.data;
};