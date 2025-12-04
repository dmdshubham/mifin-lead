import { useQuery } from "react-query";
import { api } from "../service-api";
import { getNewTehsilByCity, getNewPincodeByTehsil } from "./api";
import { useApiStore } from "@mifin/store/apiStore";

const useGetNewTehsilByCity = (cityId: any) => {
  const { userDetails } = useApiStore();

  const requestBody = {
    userDetail: userDetails?.userDetail,
    deviceDetail: userDetails?.deviceDetail,
    requestData: {
      cityId: cityId,
    },
  };

  return useQuery(
    [api.getNewTehsilByCity, cityId],
    () => getNewTehsilByCity(requestBody),
    {
      select: data => ({
        tehsilList: data?.responseData?.tehsilList,
      }),
      enabled: !!cityId,
    }
  );
};

const useGetNewPincodeByTehsil = (tehsilId: string) => {
  const { userDetails } = useApiStore();

  const requestBody = {
    userDetail: userDetails?.userDetail,
    deviceDetail: userDetails?.deviceDetail,
    requestData: {
      tehsilId: tehsilId,
    },
  };

  return useQuery(
    [api.getNewPincodeByTehsil, tehsilId],
    () => getNewPincodeByTehsil(requestBody),
    {
      select: data => ({
        pincodeList: data?.responseData?.pincodeList,
      }),
      enabled: !!tehsilId,
    }
  );
};

export { useGetNewTehsilByCity, useGetNewPincodeByTehsil };
