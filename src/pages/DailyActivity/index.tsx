import {
  Box,
  Flex,
  Spacer,
  FormControl,
  FormLabel,
  HStack,
  Text,
  useColorModeValue,
  Button,
  CardBody,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Card,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Divider, Table } from "antd";
import PrimaryButton from "@mifin/components/Button";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { ReactComponent as Arrow } from "@mifin/assets/svgs/arrow.svg";
import { ReactComponent as DArrow } from "@mifin/assets/svgs/downArrow.svg";
import { useTranslation } from "react-i18next";
import "../MyWorkList/WorkListTable/WorkList.css";
import { FieldValues, useForm, Controller } from "react-hook-form";
import LeadSearchForm from "@mifin/components/LeadSearch/LeadSearchForm";
import SearchFormControlGrid from "@mifin/components/SearchFormControlGrid";
import { useMasterDataMutation } from "@mifin/service/services-masterData";
import { useQueryClient } from "react-query";
import { toastFail } from "@mifin/components/Toast";
import SelectComponent from "@mifin/components/SelectComponent";
import { useDailyReportMutation } from "@mifin/service/services-dailyActivity";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import { getDependentMaster } from "@mifin/redux/service/getDependentMaster/api";
import DateRange from "@mifin/components/Date";
import { useSearchDailyReportMutation } from "@mifin/service/services-searchDailyReport";
import Map from "@mifin/pages/DailyActivity/Map";
import { useLocation } from "react-router-dom";
import SingleCard from "@mifin/components/common";
import CardPagination from "@mifin/components/common/CardPagination";

const DailyActivity = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showAdvance, setShowAdvance] = useState(false);
  const handleToggle = () => setShowAdvance(!showAdvance);
  const { handleSubmit, control, watch, reset } = useForm();
  const [isExpanded, setIsExpanded] = useState(false);
  const [masterList, setMasterList] = useState({});
  const { mutateAsync: MasterList } = useMasterDataMutation();
  const queryClient = useQueryClient();
  const { mutateAsync: ReportMutateList } = useDailyReportMutation();
  const [reportMutateList, setReportMutateList] = useState([]);
  const [dailyReportList, setDailyReportList] = useState([]);
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const defaultValues = watch();
  const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = JSON.parse(userInfoString);
  const userId = userInfo?.userId;
  const { mutateAsync: SearchDailyReport } = useSearchDailyReportMutation();
  const [searchDailyReport, setSearchDailyReport] = useState([]);
  const [searchLocationList, setSearchLocationList] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const blueColor = useColorModeValue("#0000FF");
  const teamMemberId = watch("teamMember")?.value ?? "";
  const [isMapOpen, setIsMapOpen] = useState(false);
  const location = useLocation();

  const allocateToList = masterList?.allocateToList?.map((el: any) => {
    return {
      label: el?.userName,
      value: el?.userId,
    };
  });

  const QueueMaster = allMastersData?.productMaster?.map((el: any) => {
    return {
      label: el?.prodName,
      value: el?.prodId,
    };
  });

  const PotentialMaster = mastersData?.Masters?.subQueueMaster.map(
    (el: any) => {
      return {
        label: el?.subQueue,
        value: el?.subQueueId,
      };
    }
  );

  const ActionMaster = allMastersData?.caseActionMaster?.map((el: any) => {
    return {
      label: el?.actionName,
      value: el?.actionId,
    };
  });

  const tableData = useMemo(() => {
    if (isSearchActive && searchDailyReport) {
      return searchDailyReport;
    } else if (reportMutateList) {
      return reportMutateList;
    } else {
      return [];
    }
  }, [isSearchActive, searchDailyReport, reportMutateList]);

  const DEPENDENT_MASTERS = {
    ...MASTER_PAYLOAD,
    requestData: {
      idColumnName: "PRODUCTID",
      valueColumnName: "PRODNAME",
      dependentTableName: "QM_PRODUCT",
      crossTableName: "QM_PRODUCT",
      crossTableDependentId: "PRODUCTID",
      crossTableMasterId: "1000000020",
      masterValue: defaultValues?.queueId?.value,
    },
  };

  useEffect(() => {
    const getDailyReportDetails = () => {
      if (defaultValues?.queueId?.value) {
        dispatch(getDependentMaster(DEPENDENT_MASTERS));
      }
    };
    getDailyReportDetails();
  }, [defaultValues.queueId]);

  const DAILY_REPORT_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      actionName: "DAILY",
      actionFromDate: "",
      actionToDate: "",
      identifier: "",
      userId: userId,
    },
  };

  const fetchMasterData = () => {
    const data = queryClient.getQueryData("get-master-list") as any;
    if (data) {
      setMasterList(data);
      return;
    }

    try {
      MasterList({ ...MASTER_PAYLOAD }).then(res => {
        setMasterList(res.responseData);
      });
    } catch {
      (err: any) => {
        toastFail("something went wrong");
        throw new Error(`An Error occured ${err}`);
      };
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchDailyReortData = () => {
    try {
      ReportMutateList(DAILY_REPORT_BODY).then((res: any) => {
        setReportMutateList(res?.list);
        setDailyReportList(res);
      });
    } catch {
      (err: any) => {
        toastFail("something went wrong");
        console.error(err);
      };
    }
  };

  useEffect(() => {
    fetchDailyReortData();
  }, []);

  const SEARCH_DAILY_REPORT_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      actionName: "SEARCH",
      actionFromDate: watch("from-date") ?? "",
      actionToDate: watch("to-date") ?? "",
      identifier: "",
      userId: teamMemberId ?? userId,
    },
  };

  const SearchDailyReportData = () => {
    try {
      SearchDailyReport(SEARCH_DAILY_REPORT_BODY).then(res => {
        if (res?.status?.toString() === "F") {
          toastFail(res?.message);
          setSearchDailyReport([]);
        } else if (Array.isArray(res?.dailyAgentSummary)) {
          setSearchDailyReport(res?.dailyAgentSummary);
          setSearchLocationList(res);
        }
      });
      setIsSearchActive(true);
    } catch (err: any) {
      toastFail("Something went wrong");
      console.error(err);
    }
  };

  // const handleAgentClick = () => {
  //   setIsMapOpen(true);
  // };
  const [mapKey, setMapKey] = useState(0);
  const handleAgentClick = () => {
    setIsMapOpen(true);
    setMapKey(prevKey => prevKey + 1);
  };

  // const columns = [
  //   {
  //     title: t("dailyReport.dailyReportTable.agentName"),
  //     dataIndex: "userName",
  //     key: "key",
  //     render: (userName: any) => (
  //       <Button
  //         style={{ color: blueColor }}
  //         onClick={() => handleAgentClick()}
  //         _hover={{ textDecoration: "underline" }}
  //         variant="link"
  //       >
  //         {userName}
  //       </Button>
  //     ),
  //   },
  //   {
  //     title: t("dailyReport.dailyReportTable.customerInteraction"),
  //     dataIndex: "noOfCustomer",
  //     key: "key",
  //   },
  //   {
  //     title: t("dailyReport.dailyReportTable.loginTime"),
  //     dataIndex: "loginTime",
  //     key: "key",
  //   },
  //   {
  //     title: t("dailyReport.dailyReportTable.logoutTime"),
  //     dataIndex: "logoutTime",
  //     key: "key",
  //   },
  //   {
  //     title: t("dailyReport.dailyReportTable.distanceTravelled"),
  //     dataIndex: "distanceTravelled",
  //     key: "key",
  //   },
  //   {
  //     title: t("dailyReport.dailyReportTable.actionDate"),
  //     dataIndex: "actionDate",
  //     key: "key",
  //   },
  // ];
  const customTextStyles = {
    fontSize: "12px",
    color: "#1A202C",
  };

  const columns = [
    {
      title: (
        <span style={customTextStyles}>
          {t("dailyReport.dailyReportTable.agentName")}
        </span>
      ),
      dataIndex: "userName",
      key: "key",
      render: (userName: any) => (
        <Button
          style={{ color: blueColor, fontSize: "12px" }}
          onClick={() => handleAgentClick()}
          _hover={{ textDecoration: "underline" }}
          variant="link"
        >
          {userName}
        </Button>
      ),
    },
    {
      title: (
        <span style={customTextStyles}>
          {t("dailyReport.dailyReportTable.customerInteraction")}
        </span>
      ),
      dataIndex: "noOfCustomer",
      key: "key",
      render: (text: any) => <span style={customTextStyles}>{text}</span>,
    },
    {
      title: (
        <span style={customTextStyles}>
          {t("dailyReport.dailyReportTable.loginTime")}
        </span>
      ),
      dataIndex: "loginTime",
      key: "key",
      render: (text: any) => <span style={customTextStyles}>{text}</span>,
    },
    {
      title: (
        <span style={customTextStyles}>
          {t("dailyReport.dailyReportTable.logoutTime")}
        </span>
      ),
      dataIndex: "logoutTime",
      key: "key",
      render: (text: any) => <span style={customTextStyles}>{text}</span>,
    },
    {
      title: (
        <span style={customTextStyles}>
          {t("dailyReport.dailyReportTable.distanceTravelled")}
        </span>
      ),
      dataIndex: "distanceTravelled",
      key: "key",
      render: (text: any) => <span style={customTextStyles}>{text}</span>,
    },
    {
      title: (
        <span style={customTextStyles}>
          {t("dailyReport.dailyReportTable.actionDate")}
        </span>
      ),
      dataIndex: "actionDate",
      key: "key",
      render: (text: any) => <span style={customTextStyles}>{text}</span>,
    },
  ];

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  useEffect(() => {
    reset();
  }, [location]);

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Box>
      <Flex gap="17px" mt={{ base: "2", md: "6" }}>
        <Spacer />
        <Flex>
          <LeadSearchForm />
        </Flex>
      </Flex>
      {!isMapOpen && (
        <>
          <Box
            my={{ sm: 6, md: 8 }}
            p={{ sm: 4, md: 6 }}
            bg="#F7F8F9"
            borderRadius="12"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <SearchFormControlGrid>
                <FormControl>
                  <FormLabel
                    htmlFor="from-date"
                    color={"#000000B3"}
                    fontSize={"14px"}
                  >
                    {t("dailyReport.fromDate")}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="from-date"
                    render={({ field: { onChange, value } }) => (
                      <Box
                        sx={{
                          ".react-datepicker-wrapper input": {
                            fontWeight: 600,
                            fontSize: "12px",
                          },
                          ".react-datepicker-wrapper input::placeholder": {
                            fontSize: "12px",
                            fontWeight: 100,
                            // opacity: 0.9,
                          },
                        }}
                      >
                        <DateRange
                          name="from-date"
                          popperPlacement="top-start"
                          date={value}
                          setDate={onChange}
                          placeholder={t("common.enter")}
                          showYear
                          showMonth
                          autoComplete="off"
                          showPopperArrow={false}
                          preventOverflow={true}
                        />
                      </Box>
                    )}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="to-date"
                    color={"#000000B3"}
                    fontSize={"14px"}
                  >
                    {t("dailyReport.toDate")}
                  </FormLabel>
                  <Controller
                    control={control}
                    name="to-date"
                    render={({ field: { onChange, value } }) => (
                      <Box
                        sx={{
                          ".react-datepicker-wrapper input": {
                            fontWeight: 600,
                            fontSize: "12px",
                          },
                          ".react-datepicker-wrapper input::placeholder": {
                            fontSize: "12px",
                            fontWeight: 100,
                            // opacity: 0.9,
                          },
                        }}
                      >
                        <DateRange
                          name="to-date"
                          popperPlacement="top-start"
                          date={value}
                          setDate={onChange}
                          placeholder={t("common.enter")}
                          showYear
                          showMonth
                          autoComplete="off"
                          showPopperArrow={false}
                          preventOverflow={true}
                        />
                      </Box>
                    )}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="Team_Member"
                    color={"#000000B3"}
                    fontSize={"14px"}
                  >
                    {t("dailyReport.teamMember")}
                  </FormLabel>
                  <SelectComponent
                    control={control}
                    name="teamMember"
                    options={allocateToList}
                    placeholder={t("common.select")}
                  />
                </FormControl>
              </SearchFormControlGrid>

              <HStack
                justifyContent="space-between"
                alignItems="center"
                mt="26px"
              >
                <Flex gap={4} alignItems="center" mt="16px">
                  <Text
                    size="xs"
                    color="blue"
                    onClick={handleToggle}
                    cursor="pointer"
                    _active={{ bg: "transparent" }}
                  >
                    {showAdvance
                      ? t("common.hideAdvance")
                      : t("common.showAdvance")}
                  </Text>
                  <Text onClick={handleToggle} cursor="pointer">
                    {showAdvance ? <DArrow /> : <Arrow />}
                  </Text>
                </Flex>

                <PrimaryButton
                  type="submit"
                  title={t("worklist.searchForm.search")}
                  onClick={() => {
                    handleSubmit(SearchDailyReportData());
                  }}
                />
              </HStack>

              <Box mt="8">
                {showAdvance ? (
                  <Box>
                    <SearchFormControlGrid>
                      <FormControl>
                        <FormLabel color={"#000000B3"} fontSize={"14px"}>
                          {t("dailyReport.showAdvance.queue")}
                        </FormLabel>
                        <SelectComponent
                          control={control}
                          name="queue"
                          options={QueueMaster}
                          placeholder={t("common.select")}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel color={"#000000B3"} fontSize={"14px"}>
                          {t("dailyReport.showAdvance.potential")}
                        </FormLabel>
                        <SelectComponent
                          control={control}
                          name="potential"
                          options={PotentialMaster}
                          placeholder={t("common.select")}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel color={"#000000B3"} fontSize={"14px"}>
                          {t("dailyReport.showAdvance.action")}
                        </FormLabel>
                        <SelectComponent
                          control={control}
                          name="action"
                          options={ActionMaster}
                          placeholder={t("common.select")}
                        />
                      </FormControl>
                    </SearchFormControlGrid>
                  </Box>
                ) : null}
              </Box>
            </form>
          </Box>
        </>
      )}
      {isMapOpen && (
        <Button
          onClick={() => setIsMapOpen(false)}
          colorScheme="white"
          bg="#2F4CDD"
          color="white"
          mb={4}
          px="15px"
          py="18px"
          height="32px"
          _hover={{ bg: "#2F4CDD" }}
          fontSize={"14px"}
          mt={4}
        >
          Back
        </Button>
      )}

      <Box display={{ base: "none", md: "block" }}>
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={false}
          className="report_table"
          locale={{ emptyText: "Data not found" }}
        />
      </Box>
      <Box display={{ base: "block", md: "none" }}>
        {tableData?.length > 0 ? (
          <CardPagination
            data={tableData}
            itemsPerPage={3}
            renderComponent={({ userId, ...single }, index) => {
              const dataEntries = Object.entries(single);

              return (
                <Card
                  key={index}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.300"
                  bgGradient="linear(to-r, white, gray.50)"
                  mb="12px"
                  boxShadow="lg"
                  overflow="hidden"
                >
                  <CardBody bg={"white"}>
                    <SimpleGrid
                      columns={2}
                      spacing={5}
                      fontSize="15px"
                      color="gray.800"
                      flex="1"
                    >
                      {dataEntries
                        .slice(0, isExpanded ? dataEntries.length : 5)
                        .map(([key, value], index) => (
                          <Flex
                            key={index}
                            flexDirection="column"
                            borderRadius="md"
                          >
                            <Box
                              color="#1A202C"
                              fontWeight="600"
                              // textTransform="uppercase"
                              fontSize={"14px"}
                            >
                              {formatKey(key)}
                            </Box>
                            {formatKey(key).toLowerCase() !== "user name" ? (
                              <Box
                                color="#4A5568"
                                fontWeight="100"
                                fontSize={"14px"}
                              >
                                {value}
                              </Box>
                            ) : (
                              <Text
                                onClick={e => {
                                  e.stopPropagation();
                                  handleAgentClick();
                                }}
                                color="#0000FF"
                                fontWeight="semibold"
                                cursor="pointer"
                                _hover={{
                                  textDecoration: "underline",
                                  color: "blue.700",
                                }}
                              >
                                {value}
                              </Text>
                            )}
                          </Flex>
                        ))}
                    </SimpleGrid>
                  </CardBody>

                  {/* Expand Button */}
                  {dataEntries.length > 6 && (
                    <Flex justifyContent="flex-end" p={3}>
                      <Accordion allowToggle>
                        <AccordionItem border="none">
                          <AccordionButton
                            borderRadius="full"
                            h="28px"
                            w="28px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            _hover={{ bg: "blue.600" }}
                            bg="blue.500"
                            color="white"
                            transition="all 0.2s"
                            onClick={e => {
                              e.stopPropagation();
                              setIsExpanded(!isExpanded);
                            }}
                          >
                            <AccordionIcon fontSize="20px" />
                          </AccordionButton>
                        </AccordionItem>
                      </Accordion>
                    </Flex>
                  )}
                </Card>
              );
            }}
          />
        ) : (
          <Text textAlign={"center"}>No Data found</Text>
        )}
      </Box>

      {isMapOpen && (
        <Map
          key={mapKey}
          className="leaflet-container"
          searchDailyReport={searchLocationList?.locationList}
          dailyReportList={dailyReportList?.locationList}
        />
      )}
    </Box>
  );
};

export default DailyActivity;
