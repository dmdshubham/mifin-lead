import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Button,
  Flex,
  Text,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import Profile from "@mifin/components/ContactProfile/profile";
import Contact from "@mifin/pages/Customer/Contact/Index";
import Customer from "@mifin/pages/Customer/Customer/Index";
import ConvertCustomerTable from "@mifin/pages/Customer/Product/ConvertCustomerTable";
import { fetchLeadDetails } from "@mifin/redux/service/worklistLeadDetails/api";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { getLeadDetails } from "@mifin/redux/service/worklistGetLeadDetails/api";
import { TfiAngleRight, TfiAngleLeft } from "react-icons/tfi";
import { getNextPrevLead } from "@mifin/redux/service/nextPrevLead/api";
import { toastFail } from "@mifin/components/Toast";
import { useForm, FormProvider } from "react-hook-form";
import { updateLeadId } from "@mifin/redux/features/updateLeadIdSlice";
import { useTranslation } from "react-i18next";
import LeadSearchForm from "@mifin/components/LeadSearch/LeadSearchForm";
import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomerAndProductSchema } from "@mifin/schema/CustomerAndProductSchema";
import {
  tabBoxStyling,
  nextPreviousButtonStyle,
  tabStyling,
  tabListStyling,
} from "@mifin/theme/style";
import { IndexProps } from "@mifin/Interface/Customer";
import { useProductDetails } from "@mifin/service/mifin-productDetails";
import { useApiStore } from "@mifin/store/apiStore";
import { updateLeadHeaderDetails } from "@mifin/redux/features/leadHeaderDetailSlice";

const defaultValues = {
  dob: "",
  gender: "",
  maritalStatus: "",
  branchId: "",
  EMI: "",
  productId: "",
  loanTenure: "",
  loanAmount: "",
  schemeId: "",
  puposeOfLoan: "",
  salutation: "",
};

const Index = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isMobile: boolean | undefined = useBreakpointValue({
    base: true,
    md: false,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const particularLeadId: { leadId: string } = useAppSelector(
    state => state.getLeadId
  );
  const leadList: any = useAppSelector(state => state.getLeadDetails);
  const [leadIdList, setLeadIdList] = useState<string>("");
  const [, setCase] = useSearchParams();
  const navigate = useNavigate();
  const { userDetails } = useApiStore();

  const { data } = useProductDetails({
    // deviceDetail: userDetails.deviceDetail,
    // userDetail: userDetails.userDetail,
    ...MASTER_PAYLOAD,
    requestData: {
      leadDetail: {
        caseId: particularLeadId.leadId,
      },
    },
  });

  const yupValidationSchema: any = useMemo(
    () => CustomerAndProductSchema(t),
    [t]
  );

  const methods = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupValidationSchema),
  });
  const {
    trigger,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (isDirty) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  const GET_LEAD_DETAILS_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      iDisplayStart: "0",
      iDisplayLength: "10",
      sEcho: "1",
      leadsSearchDetail: {
        requestType: "myLead",
        mobile: "",
        email: "",
        name: "",
        caseId: "",
        leadState: "",
        escalationRef: "MYLEAD",
        queue: "",
        subqueue: "",
        disposition: "",
        actionId: "",
        allocate: "",
        amountTo: "",
        amountFrom: "",
        source: "",
        sort1: "-1",
        sort2: "-1",
        sort3: "-1",
        currentPosition: 10,
        maxResult: 0,
        sortOrder: "-1",
        caseCode: "",
        company: "",
        id: "",
        campaign: "",
        team: "",
        syncDate: "",
        branch: "",
      },
    },
  };

  useEffect(() => {
    if (localStorage.getItem("leadSearch") === "true") {
      setCurrentIndex(1);
      localStorage.setItem("leadSearch", "false");
    }
    const getAllLeadList = () => {
      dispatch(getLeadDetails(GET_LEAD_DETAILS_BODY));
    };
    getAllLeadList();
  }, []);

  const storeAllLead = () => {
    const allList = leadList?.data?.leadData?.aaData.map(
      (item: IndexProps) => item.leadId
    );
    if (allList && allList.length) {
      setLeadIdList(allList);
    }
  };

  useEffect(() => {
    storeAllLead();
  }, [leadList]);

  const NEXT_API_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      lead: "next",
      worklistLeads: `${leadIdList}`,
      leadDetail: {
        caseId: particularLeadId.leadId,
      },
    },
  };

  const PREV_API_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      lead: "previous",
      worklistLeads: `${leadIdList}`,
      leadDetail: {
        caseId: particularLeadId.leadId,
      },
    },
  };

  const fetchNextPrevLead = (
    e: React.MouseEvent<HTMLElement | SVGAElement>
  ) => {
    // set api body based on the next or button is clicked
    const apiBody =
      e.currentTarget.id === "nextLead" ? PREV_API_BODY : NEXT_API_BODY;

    dispatch(getNextPrevLead(apiBody))
      .then(res => {
        if (
          res.payload.statusInfo.statusCode == "200" &&
          Object.keys(res.payload.responseData).length !== 0
        ) {
          // Checking if any of the flags are present
          if (
            "escalate" in res.payload.responseData.leadDetails ||
            "coAllocate" in res.payload.responseData.leadDetails ||
            "refer" in res.payload.responseData.leadDetails
          ) {
            toastFail(`Next lead has escalated, co-allocated, or referred`);
          } else {
            dispatch(
              updateLeadId({
                leadId: res.payload.responseData?.leadDetails?.caseId,
              })
            );
          }
          setCase({ case: "Contact" });
          navigate(
            `/contact/${res.payload.responseData?.leadDetails?.caseCode}?case=Contact`
          );
          setCurrentIndex(0);
        } else if (Object.keys(res.payload.responseData).length === 0) {
          toastFail("Next or Prev Lead Does not exits");
        } else {
          toastFail("SomeThing went wrong.....");
        }
      })
      .catch((err: string) => {
        toastFail("Something went wrong");
        throw new Error(`An Error occured ${err}`);
      });
  };

  useEffect(() => {
    const getWorkListLeadDetails = () => {
      // Fetch master data - works both online and offline (with cache)
      dispatch(fetchLeadDetails({ ...MASTER_PAYLOAD })).catch(err => {
        console.log('Master data fetch issue (may be using cache):', err);
      });
    };
    getWorkListLeadDetails();
  }, []);

  useEffect(() => {
    dispatch(updateLeadHeaderDetails(data?.responseData?.leadHeaderDetail));
    sessionStorage.setItem(
      "isConverted",
      data?.responseData?.leadHeaderDetail?.disposition === "CONVERTED"
    );
  }, [data]);

  return (
    <Box>
      <FormProvider {...methods}>
        <form>
          <Box sx={tabBoxStyling} mt={{ md: 8 }}>
            <HStack gap="2">
              <Button
                sx={nextPreviousButtonStyle}
                _hover={{ backgroundColor: "#F2F1F1" }}
                id="prevLead"
                value={currentIndex}
                onClick={e => fetchNextPrevLead(e)}
              >
                <TfiAngleLeft size="22" color="black" />
              </Button>
              <Text as="p">{t("common.prev")}</Text>
            </HStack>

            <HStack gap="3" alignItems="flex-start">
              <LeadSearchForm />

              <HStack gap="2">
                <Text as="p">{t("common.next")}</Text>
                <Button
                  sx={nextPreviousButtonStyle}
                  _hover={{ backgroundColor: "#F2F1F1" }}
                  id="nextLead"
                  onClick={e => fetchNextPrevLead(e)}
                >
                  <TfiAngleRight size="22" color="black" />
                </Button>
              </HStack>
            </HStack>
          </Box>
          <Box
            flexDirection={"column"}
            gap={"10px"}
            display={{ base: "flex", md: "none" }}
            mt={{ md: 8 }}
          >
            <LeadSearchForm />
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <HStack gap="2">
                <Button
                  sx={nextPreviousButtonStyle}
                  _hover={{ backgroundColor: "#F2F1F1" }}
                  id="prevLead"
                  value={currentIndex}
                  onClick={e => fetchNextPrevLead(e)}
                >
                  <TfiAngleLeft size="22" color="black" />
                </Button>
                <Text as="p">{t("common.prev")}</Text>
              </HStack>
              <HStack gap="2">
                <Text as="p">{t("common.next")}</Text>
                <Button
                  sx={nextPreviousButtonStyle}
                  _hover={{ backgroundColor: "#F2F1F1" }}
                  id="nextLead"
                  onClick={e => fetchNextPrevLead(e)}
                >
                  <TfiAngleRight size="22" color="black" />
                </Button>
              </HStack>
            </Box>
          </Box>
          <Flex alignItems="center" justifyContent="flex-start">
            <Tabs
             mt={5}  allowToggle w="100vw"  maxW="100%"  mx="auto"  
              isLazy
              index={currentIndex}
              onChange={index => setCurrentIndex(index)}
            >
              <TabList sx={tabListStyling}>
                <Box display="flex" gap="3">
                  <Tab
                    sx={tabStyling}
                    _selected={{ color: "white", bg: "#3E4954" }}
                    onClick={() => {
                      setCase({ case: "Contact" });
                    }}
                  >
                    {t("common.contact")}
                  </Tab>
                  <Tab
                    sx={tabStyling}
                    _selected={{ color: "white", bg: "#3E4954" }}
                    onClick={() => {
                      setCase({ case: "Customer" });
                    }}
                  >
                    {t("common.customer")}
                  </Tab>
                  <Tab
                    sx={tabStyling}
                    _selected={{ color: "white", bg: "#3E4954" }}
                    onClick={() => {
                      setCase({ case: "Product" });
                    }}
                  >
                    {t("common.product")}
                  </Tab>
                </Box>

                {/* <Box display="flex" gap="3">
                  <Tab
                    sx={tabStyling}
                    _selected={{ color: "white", bg: "#3E4954" }}
                    onClick={() => {
                      setCase({ case: "Notepad" });
                    }}
                  >
                    {t("common.notepad")}
                  </Tab>
                  <Tab
                    sx={tabStyling}
                    _selected={{ color: "white", bg: "#3E4954" }}
                    onClick={() => {
                      setCase({ case: "Document" });
                    }}
                  >
                    {t("common.document")}
                  </Tab>
                  <Tab
                    sx={tabStyling}
                    _selected={{ color: "white", bg: "#3E4954" }}
                    onClick={() => {
                      setCase({ case: "Dunning" });
                    }}
                  >
                    {t("common.dunning")}
                  </Tab>
                </Box> */}
              </TabList>
              <Box w={"100%"}>
                <Profile />
              </Box>

              <TabPanels>
                <TabPanel padding={isMobile ? "16px 0" : 4}>
                  <Contact setCurrentIndex={setCurrentIndex} />
                </TabPanel>
                <TabPanel>
                  <Customer setCurrentIndex={setCurrentIndex} />
                </TabPanel>
                <TabPanel>
                  <Box w="100%">
                    <ConvertCustomerTable setCurrentIndex={setCurrentIndex} />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </form>
      </FormProvider>
    </Box>
  );
};

export default Index;
