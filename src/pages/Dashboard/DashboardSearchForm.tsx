import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import PrimaryButton from "@mifin/components/Button/index";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as Arrow } from "@mifin/assets/svgs/arrow.svg";
import { ReactComponent as DArrow } from "@mifin/assets/svgs/downArrow.svg";
import { fetchLeadDetails } from "@mifin/redux/service/worklistLeadDetails/api";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import SelectComponent from "@mifin/components/SelectComponent";
import { useForm } from "react-hook-form";
import { useGetLeadListMutation } from "@mifin/service/mifin-getLeadDetails";
import { DashboardSearchFormProps, ISearchFormProps } from "@mifin/Interface/dashboard";
import { useEffect } from "react";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { sortOrderData, sortByData } from "@mifin/ConstantData/dopdownData";
import { searchFormBoxStyling } from "@mifin/theme/style";
import getFlattenArray from "@mifin/utils/getFlattenArray";
import SearchFormControlGrid from "@mifin/components/SearchFormControlGrid";
import TextInput from "@mifin/components/Input";
import { useLocation } from "react-router-dom";
import { toastFail } from "@mifin/components/Toast";
import { ILeadStatusProps } from "@mifin/Interface/Customer";
import {
  useGetDashboardMastersMutation,
  getDasboardMasterdata,
} from "@mifin/service/dashboard/getDashboardMasters";
import { useQueryClient } from "react-query";

const formDefaultValues = {
  leadCode: "",
  product: "",
  potential: "",
  source: "",
  campaign: "",
  teamMember: "",
  branch: "",
};

const DashboardSearchForm: FC<DashboardSearchFormProps> = props => {
  const {
    setSearchData,
    setAllID,
    setDashboardMasterList,
    dashboardMasterList,
    setDashboarData,
    setDashboardRequestBody,
    dashboardDataRefetch,
    setResetDropValue,
  } = props;
  const { t } = useTranslation();
  const [showAdvance, setShowAdvance] = useState(false);
  const masterData: any = useAppSelector(state => state.leadDetails);
  const dispatch = useAppDispatch();
  const location = useLocation();
  // const [searchButton, setSearchButton] = useState("");
  const { register, handleSubmit, control, watch, reset } = useForm({
    defaultValues: formDefaultValues,
  });
  const defaultValues = watch();
  const allMastersData = { ...masterData?.data?.Masters };
  const allocateDetails = masterData?.data?.allocateToList;
  // const [dashboardMasterList, setDashboardMasterList] = useState<any>({});
  // const trimmedCaseCode = defaultValues?.caseCode.trim();
  const { mutateAsync: mutateDashboardMastersList } =
    useGetDashboardMastersMutation();

  const dashboardMastersDataList = async () => {
    const reqBody = {
      ...MASTER_PAYLOAD,
      requestData: {},
    };
    const response = await mutateDashboardMastersList(reqBody);

    setDashboardMasterList(response?.responseData);
    //   const queryClient = useQueryClient();
    // const dashboardMasterList1 = queryClient.getQueryData(getDasboardMasterdata);
    // console.log("MasterList", dashboardMasterList1);
  };
  // const queryClient = useQueryClient();
  // const dashboardMasterList1 = queryClient.getQueryData(getDasboardMasterdata);
  // console.log("MasterList", dashboardMasterList1);

  useEffect(() => {
    dashboardMastersDataList();
  }, []);

  const productMaster =
    dashboardMasterList?.productMaster?.returnParameter?.map(
      (el: ISearchFormProps) => {
        return {
          label: el?.productName,
          value: el?.productId,
        };
      }
    );

  const potencialMaster =
    dashboardMasterList?.potencialMaster?.returnParameter?.map(
      (el: ISearchFormProps) => {
        return {
          label: el?.potencialName,
          value: el?.potencialId,
        };
      }
    );

  const sourceMaster = dashboardMasterList?.sourceMaster?.returnParameter?.map(
    (el: ISearchFormProps) => {
      return {
        label: el?.sourceName,
        value: el?.sourceId,
      };
    }
  );

  const campaignMaster =
    dashboardMasterList?.campaignMaster?.returnParameter?.map(
      (el: ISearchFormProps) => {
        return {
          label: el?.campaignName,
          value: el?.campaignId,
        };
      }
    );

  const teamMembersMaster =
    dashboardMasterList?.teamMembersMaster?.returnParameter?.map(
      (el: ISearchFormProps) => {
        return {
          label: el?.teamMemberName,
          value: el?.teamMemberId,
        };
      }
    );

  const branchMaster = dashboardMasterList?.branchMaster?.returnParameter?.map(
    (el: ISearchFormProps) => {
      return {
        label: el?.branchName,
        value: el?.branchId,
      };
    }
  );

  const handleToggle = () => setShowAdvance(!showAdvance);

  // const getMaterData = () => {
  //   dispatch(fetchLeadDetails({ ...MASTER_PAYLOAD }));
  // };
  const fetchDashboardData = () => {
    const data = getFlattenArray(defaultValues);
    const searchProduct = watch("product");
    const searchPotential = watch("potential");
    const searchSource = watch("source");
    const searchCampaign = watch("campaign");
    const searchTeamMember = watch("teamMember");
    const searchBranch = watch("branch");

    const isAllFieldsEmpty =
      !searchProduct &&
      !searchPotential &&
      !searchSource &&
      !searchCampaign &&
      !searchTeamMember &&
      !searchBranch;

    // console.log("isAllFieldsEmpty", isAllFieldsEmpty, showAdvance);

    if (showAdvance && isAllFieldsEmpty) {
      toastFail("Please fill at least one of the fields to search.");
      return;
    }

    //const data = getFlattenArray(defaultValues);
    const reqBody = {
      ...MASTER_PAYLOAD,
      requestData: {
        dashboardSearchDetails: {
          leadCode: "",
          scheme: "",
          potential: "",
          source: "",
          campaign: "",
          teamMember: "",
          branch: "",
          ...data,
        },
      },
    };
    // setSearchData(data);
    // setAllID([]);
    setDashboardRequestBody(reqBody);
    //dashboardDataRefetch();
    reset();
    setResetDropValue((prev: number) => prev + 1);
  };

  const onSubmit = () => {
    fetchDashboardData();
  };

  // useEffect(() => {
  //   fetchTableData();
  // }, [location]);

  useEffect(() => {
    reset();
  }, []);

  return (
    <Box my={{ sm: 6, md: 8 }} p={{ sm: 4, md: 6 }} sx={searchFormBoxStyling}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack justifyContent="space-between" alignItems="center">
          <Flex gap={4} alignItems="center" mt="16px">
            <Text
              size="xs"
              color="blue"
              onClick={() => {
                handleToggle();
                // getMaterData();
              }}
              cursor="pointer"
              _active={{ bg: "transparent" }}
            >
              {showAdvance ? t("common.hideAdvance") : t("common.showAdvance")}
            </Text>
            <Text onClick={() => handleToggle()} cursor="pointer">
              {showAdvance ? <DArrow /> : <Arrow />}
            </Text>
          </Flex>
        </HStack>

        <Box mt={{ base: "1", md: "8" }}>
          {showAdvance ? (
            <Box>
              <SearchFormControlGrid mt="6">
                <Box mt={{ base: 2, md: 0 }}>
                  <FormControl>
                    <FormLabel fontSize={"14px"}>
                      {t("Dashboard.DashboardAdvanceSearch.product")}
                    </FormLabel>
                    <SelectComponent
                      control={control}
                      name="product"
                      options={productMaster}
                      placeholder={t("common.select")}
                      // isMulti
                    />
                  </FormControl>
                </Box>
                <Box mt={{ base: 2, md: 0 }}>
                  <FormControl>
                    <FormLabel fontSize={"14px"}>
                      {t("Dashboard.DashboardAdvanceSearch.potential")}
                    </FormLabel>
                    <SelectComponent
                      control={control}
                      name="potential"
                      options={potencialMaster}
                      placeholder={t("common.select")}
                      // isMulti
                    />
                  </FormControl>
                </Box>
                <Box mt={{ base: 2, md: 0 }}>
                  <FormControl>
                    <FormLabel fontSize={"14px"}>
                      {t("Dashboard.DashboardAdvanceSearch.source")}
                    </FormLabel>
                    <SelectComponent
                      control={control}
                      name="source"
                      options={sourceMaster}
                      placeholder={t("common.select")}
                      // isMulti
                    />
                  </FormControl>
                </Box>
              </SearchFormControlGrid>
              <Box mt={8}></Box>
              <SearchFormControlGrid mt="8">
                <Box mt={{ base: 2, md: 0 }}>
                  <FormControl>
                    <FormLabel fontSize={"14px"}>
                      {t("Dashboard.DashboardAdvanceSearch.campaign")}
                    </FormLabel>
                    <SelectComponent
                      control={control}
                      name="campaign"
                      options={campaignMaster}
                      placeholder={t("common.select")}
                      // isMulti
                    />
                  </FormControl>
                </Box>
                <Box mt={{ base: 2, md: 0 }}>
                  <FormControl>
                    <FormLabel fontSize={"14px"}>
                      {t("Dashboard.DashboardAdvanceSearch.teamMember")}
                    </FormLabel>
                    <SelectComponent
                      control={control}
                      name="teamMember"
                      options={teamMembersMaster}
                      placeholder={t("common.select")}
                      // isMulti
                    />
                  </FormControl>
                </Box>
                <Box mt={{ base: 2, md: 0 }}>
                  <FormControl>
                    <FormLabel fontSize={"14px"}>
                      {t("Dashboard.DashboardAdvanceSearch.branch")}
                    </FormLabel>
                    <SelectComponent
                      control={control}
                      name="branch"
                      options={branchMaster}
                      placeholder={t("common.select")}
                      // isMulti
                    />
                  </FormControl>
                </Box>
              </SearchFormControlGrid>

              <Box mt={8}></Box>

              <Box mt="20px" display="flex" justifyContent="flex-end">
                <PrimaryButton
                  type="submit"
                  title={t("common.search")}
                  // onClick={() => {
                  //   setSearchButton("search");
                  // }}
                />
              </Box>
            </Box>
          ) : null}
        </Box>
      </form>
    </Box>
  );
};

export default DashboardSearchForm;
