import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, HStack, Flex, Select, Text } from "@chakra-ui/react";
import CountUp from "react-countup";
import Charts from "./Charts";
import LeadSearchForm from "@mifin/components/LeadSearch/LeadSearchForm";
import { useTranslation } from "react-i18next";
import DashboardSearchForm from "@mifin/pages/Dashboard/DashboardSearchForm";
import { useAppDispatch } from "@mifin/redux/hooks";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { useGetDashboardDataQuery } from "@mifin/service/dashboard/getDashboardData";
import { useLocation } from "react-router-dom";

const GET_DASHBOARD_DATA_BODY = {
  ...MASTER_PAYLOAD,
  requestData: {
    dashboardSearchDetails: {
      leadCode: "",
      product: "",
      potential: "",
      source: "",
      campaign: "",
      teamMember: "",
      branch: "",
    },
  },
};
const Dashboard = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchData, setSearchData] = useState({});
  const [allID, setAllID] = useState([]);
  const [dashboardMasterList, setDashboardMasterList] = useState<any>({});
  const [dashboardData, setDashboarData] = useState<any>({});
  const [
    dashboardApiFetchWhileLocationChange,
    setDashboardApiFetchWhileLocationChange,
  ] = useState<boolean>(false);
  const [dashboardRequestBody, setDashboardRequestBody] = useState<any>(
    GET_DASHBOARD_DATA_BODY
  );
  const [resetDropValue, setResetDropValue] = useState(0);
  const {
    data: dashboardDetails,
    isLoading,
    isError,
    refetch: dashboardDataRefetch,
    isFetching,
  } = useGetDashboardDataQuery(dashboardRequestBody);

  useEffect(() => {
    setDashboardRequestBody(GET_DASHBOARD_DATA_BODY);
    setDashboardApiFetchWhileLocationChange(true);
  }, [location]);

  useEffect(() => {
    dashboardDataRefetch();
  }, [dashboardRequestBody]);

  useEffect(() => {
    if (dashboardApiFetchWhileLocationChange) {
      dashboardDataRefetch();
      setDashboardApiFetchWhileLocationChange(false);
    }
  }, [dashboardApiFetchWhileLocationChange]);

  useEffect(() => {
    setDashboarData(dashboardDetails);
  }, [dashboardDetails]);

  return (
    <Box mt={{ sm: 2, md: 7 }}>
      <Flex justifyContent="flex-end" mb="6">
        <LeadSearchForm />
      </Flex>
      <DashboardSearchForm
        setSearchData={setSearchData}
        setAllID={setAllID}
        setDashboardMasterList={setDashboardMasterList}
        dashboardMasterList={dashboardMasterList}
        setDashboarData={setDashboarData}
        setDashboardRequestBody={setDashboardRequestBody}
        dashboardDataRefetch={dashboardDataRefetch}
        setResetDropValue={setResetDropValue}
      />
      <Charts
        dashboardData={dashboardData}
        dashboardMasterList={dashboardMasterList}
        resetDropValue={resetDropValue}
      />
    </Box>
  );
};

export default Dashboard;
