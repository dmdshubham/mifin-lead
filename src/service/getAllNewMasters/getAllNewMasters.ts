import { useQuery } from "react-query";
import { api } from "../service-api";
import { getAllMastersData } from "./api";
import { useApiStore } from "@mifin/store/apiStore";

const useGetTypeOfBusiness = (masterIdOfSegment: string) => {
  const { userDetails } = useApiStore();

  const requestBody = {
    userDetail: userDetails?.userDetail,
    deviceDetail: userDetails?.deviceDetail,
    requestData: [
      {
        //key: "GETTYPEOFBUSINESSLIST",
        depandentValue: masterIdOfSegment,
        name: "TYPEOFBUSINESSLIST",
      },
    ],
  };

  return useQuery(
    [api.getTypeOfBusiness, masterIdOfSegment],
    () => getAllMastersData(requestBody),
    {
      select: data => ({
        TYPEOFBUSINESSLIST:
          data?.responseData?.TYPEOFBUSINESSLIST?.returnParameter,
      }),
      enabled: !!masterIdOfSegment,
    }
  );
};

const useGetCluster = (masterIdOfSegment: string) => {
  const { userDetails } = useApiStore();

  const requestBody = {
    userDetail: userDetails?.userDetail,
    deviceDetail: userDetails?.deviceDetail,
    requestData: [
      {
        //key: "GET_CLUSTER_VAL",
        depandentValue: masterIdOfSegment,
        name: "CLUSTER",
      },
    ],
  };

  return useQuery(
    [api.getTypeOfBusiness, masterIdOfSegment],
    () => getAllMastersData(requestBody),
    {
      select: data => ({
        CLUSTER: data?.responseData?.CLUSTER?.returnParameter,
      }),
      enabled: !!masterIdOfSegment,
    }
  );
};

const useGetEmploymentTypeList = () => {
  const { userDetails } = useApiStore();

  const requestBody = {
    userDetail: userDetails?.userDetail,
    deviceDetail: userDetails?.deviceDetail,
    requestData: [
      {
       // key: "GETEMPLOYMENTTYPELIST",
        depandentValue: "",
        name: "EMPLOYMENTTYPELIST",
      },
    ],
  };

  return useQuery(
    [api.getTypeOfBusiness],
    () => getAllMastersData(requestBody),
    {
      select: data => ({
        EMPLOYMENTTYPELIST: data?.responseData?.EMPLOYMENTTYPELIST?.returnParameter,
      }),
    }
  );
};

export { useGetTypeOfBusiness, useGetCluster, useGetEmploymentTypeList };
