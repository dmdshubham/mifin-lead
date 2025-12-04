import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import LeadStatus from "@mifin/pages/Customer/Contact/LeadStatus";
import EscalationHistoryTable from "@mifin/pages/Customer/Contact/EscalationHistoryTable";
import ActionHistoryTable from "@mifin/pages/Customer/Contact/ActionHistoryTable";
import AllocationHistoryTable from "@mifin/pages/Customer/Contact/AllocationHistoryTable";
import DunningHistoryTable from "@mifin/pages/Customer/Contact/DunningHistory";
import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@mifin/redux/hooks";
import { useOfflineSaveContact } from "@mifin/hooks/useOfflineSaveContact";
import { FormProvider, useForm } from "react-hook-form";
import { useApiStore } from "@mifin/store/apiStore";
import { formatdate } from "@mifin/utils/format-date";
import { formatTime } from "@mifin/utils/format-time";
import { useNavigate } from "react-router-dom";
import { useOfflineContactDetail } from "@mifin/hooks/useOfflineContactDetail";
import { toastFail, toastSuccess } from "@mifin/components/Toast";
import { useTranslation } from "react-i18next";
import { updateLeadHeaderDetails } from "@mifin/redux/features/leadHeaderDetailSlice";
import { useAppDispatch } from "@mifin/redux/hooks";
import EscalatedLeadStatus from "@mifin/pages/Customer/Contact/EscalatedLeadStatus";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { saveEscalatedLead } from "@mifin/redux/service/saveEscalatedLead/api";
import { useMemo } from "react";
import { tabStyle } from "@mifin/theme/style";
import { IndexProps } from "@mifin/Interface/Customer";
import ValidationComponent from "@mifin/components/ValidationComponent/ValidationComponent";
import { getNotificationDetails } from "@mifin/redux/service/getNotificationDetails/api";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import AllocationHistoryCards from "./AllocationHistoryCards";
import DunningHistoryCards from "./DunningHistoryCards";
import ActionCards from "./ActionCards";
import EscalationReferralHistoryCards from "./EscalationReferralHistoryCards";
import {
  ContactYupSchema,
  escalatedLeadYupSchema,
} from "@mifin/schema/ContactYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";

const NOTIFICATION_REQUEST_BODY = {
  ...MASTER_PAYLOAD,
  requestData: {
    notificationId: "show",
  },
};

const Index: FC<IndexProps> = ({ setCurrentIndex }) => {
  const navigate = useNavigate();
  const [navigateFocus, setNavigateFocus] = useState<string>("");
  const [errorNavigateId, setErrorNavigateId] = useState<string>("");
  const ref = useRef<Record<string, HTMLElement | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const particularLeadId: { leadId: string } = useAppSelector(
    state => state.getLeadId
  );

  const [buttonClickStatus, setButtonClickStatus] = useState({
    save: true,
    saveAndExit: false,
  });

  const pathName = useMemo(() => {
    const pathnameArray = window.location.pathname.split("/");
    return pathnameArray[pathnameArray.length - 1];
  }, []);

  const { userDetails } = useApiStore();
  const { mutateAsync: saveActionRecord, isLoading: isContactSave, isOnline: isSaveOnline } =
    useOfflineSaveContact();
  const dispatch = useAppDispatch();
  const isEscalated = useAppSelector<boolean>(state => state.isEscalated.value);
  const isReferred = useAppSelector<boolean>(state => state.isRefered.value);
  const contactData = useAppSelector(state => state.contactData.data);
  const { data: ContactDetails, refetch, isOnline } = useOfflineContactDetail({
    ...MASTER_PAYLOAD,
    requestData: {
      leadDetail: {
        caseId: particularLeadId.leadId,
      },
    },
  });

  useEffect(() => {
    return () => setNavigateFocus("");
  }, [navigateFocus]);

  const initialDefaultValue = isEscalated
    ? {
        actionName: contactData?.contactDetail?.actionName,
        initiatedBy: contactData?.contactDetail?.initiatedBy,
        initiatedDateTime: contactData?.contactDetail?.initiatedDateTime,
        initialRemarks: contactData?.contactDetail?.initialRemarks,
        resolve: false,
        resolvedRemarks: null,
      }
    : isReferred
    ? {
        actionName: contactData?.contactDetail?.actionName,
        initiatedBy: contactData?.contactDetail?.initiatedBy,
        initiatedDateTime: contactData?.contactDetail?.initiatedDateTime,
        initialRemarks: contactData?.contactDetail?.initialRemarks,
        resolve: false,
        resolvedRemarks: null,
      }
    : {
        action: null as null,
        actionDate: new Date(),
        actionTime: new Date(),
        followupAction: null as null,
        followupDate: "",
        followupTime: "",
        leadStage: null as null,
        potential: null as null,
        remarks: "",
      };

  const [initialFormData, setInitialFormData] = useState(initialDefaultValue);

  useEffect(() => {
    const initDefaultValue =
      isEscalated || isReferred
        ? {
            actionName: contactData?.contactDetail?.actionName,
            initiatedBy: contactData?.contactDetail?.initiatedBy,
            initiatedDateTime: contactData?.contactDetail?.initiatedDateTime,
            initialRemarks: contactData?.contactDetail?.initialRemarks,
            resolve: false,
            resolvedRemarks: null,
          }
        : {
            action: null as null,
            actionDate: new Date(),
            actionTime: new Date(),
            followupAction: null as null,
            followupDate: "",
            followupTime: "",
            leadStage: null as null,
            potential: null as null,
            remarks: "",
          };
    setInitialFormData(initDefaultValue);
  }, [isEscalated, contactData]);

  //const yupValidationSchema = useMemo(() => ContactYupSchema(t), [t]);
  const yupValidationSchema = useMemo(() => {
    return isEscalated ? escalatedLeadYupSchema(t) : ContactYupSchema(t);
  }, [t]);

  const methods = useForm({
    defaultValues: initialFormData,
    mode: "onChange",
    resolver: yupResolver<any>(yupValidationSchema),
  });
  const {
    reset,
    control,
    handleSubmit,
    watch,
    register,
    trigger,
    setFocus,
    setValue,
    formState: { isDirty, errors },
  } = methods;
  const defaultValues = watch();

  useEffect(() => {
    if (isDirty) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  useEffect(() => {
    if (!watch("action") || watch("action") == null) {
      setValue("followupAction", null);
    }
  }, [watch("action")]);
  // useEffect(() => {
  //   if (!watch("remarks") || watch("potential") == null) {
  //     trigger();
  //   }
  // }, [pathName, watch("remarks"), watch("potential")]);

  useEffect(() => {
    const element = document.getElementById(errorNavigateId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    errorNavigateId && setFocus(errorNavigateId);
    return () => setErrorNavigateId("");
  }, [errorNavigateId]);

  // setting table data based on props
  const actionHistoryTableData: Array<any> = isEscalated
    ? contactData?.contactDetail?.caseActionHistory
    : defaultValues?.responseData?.contactDetail?.caseActionHistory;
  const escalationHistoryTableData: Array<any> = isEscalated
    ? contactData?.contactDetail?.caseEscalationHistory
    : defaultValues?.responseData?.contactDetail?.caseEscalationHistory;
  const allocationHistoryTable: Array<any> = isEscalated
    ? contactData?.contactDetail?.caseAllocationHistory
    : defaultValues?.responseData?.contactDetail?.caseAllocationHistory;

  // useEffect(() => {
  //   trigger();
  // }, [isDirty]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // useEffect(() => {
  //   // run only if we have non esclated case
  //   if (
  //     !isEscalated &&
  //     ContactDetails?.responseData?.contactDetail?.caseActionHistory?.length > 0
  //   ) {
  //     const latestAction =
  //       ContactDetails.responseData.contactDetail.caseActionHistory[0];

  //     dispatch(
  //       updateLeadHeaderDetails(ContactDetails?.responseData?.leadHeaderDetail)
  //     );

  //     methods.setValue(
  //       "action",
  //       {
  //         label: latestAction.action,
  //         value: latestAction.dispositionId,
  //       },
  //       { shouldValidate: true }
  //     );

  //     methods.setValue(
  //       "followupAction",
  //       {
  //         label: latestAction.followupAction,
  //         value: latestAction.followupAction,
  //       },
  //       { shouldValidate: true }
  //     );

  //     methods.setValue(
  //       "leadStage",
  //       {
  //         label: latestAction.leadStage,
  //         value: latestAction.leadStage,
  //       },
  //       { shouldValidate: true }
  //     );

  //     methods.setValue(
  //       "potential",
  //       {
  //         label: latestAction.potential,
  //         value: latestAction.potential,
  //       },
  //       { shouldValidate: true }
  //     );

  //     methods.setValue("remarks", latestAction.remarks || "", {
  //       shouldValidate: true,
  //     });

  //     refetch();
  //   }
  // }, [ContactDetails, particularLeadId.leadId]);
  useEffect(() => {
    // run only if we have non escalated case and ContactDetails is available
    if (!isEscalated && ContactDetails) {
      dispatch(updateLeadHeaderDetails(ContactDetails?.responseData?.leadHeaderDetail));
      refetch();
      reset(ContactDetails);
      setTimeout(() => {
        trigger();
      }, 0);
    }
  }, [ContactDetails, particularLeadId.leadId]);

  // const isMobile = useBreakpointValue({
  //   base: true,
  //   md: false,
  // });

  useEffect(() => {
    if (localStorage.getItem("leadSearch") === "true") {
      setCurrentIndex(1);
      localStorage.setItem("leadSearch", "false");
    }
  }, [localStorage.getItem("leadSearch") === "true"]);

  const getNotification = () => {
    dispatch(getNotificationDetails(NOTIFICATION_REQUEST_BODY));
  };
  const onSaveActionRecord = (shouldNavigate: boolean) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      saveActionRecord(
        {
          ...userDetails,
          requestData: {
            ...userDetails.requestData,
            leadDetail: {
              caseId: particularLeadId?.leadId,
            },
            contactDetail: {
              actionDate: defaultValues.actionDate
                ? formatdate(defaultValues.actionDate)
                : "",
              actionId: defaultValues?.action?.value ?? "",
              actionTime: defaultValues.actionTime
                ? formatTime(defaultValues.actionTime)
                : "",
              caseId: particularLeadId.leadId,
              followupAction: defaultValues.followupAction?.value ?? "",
              followupDate: defaultValues.followupDate
                ? formatdate(defaultValues.followupDate)
                : "",
              followupTime: defaultValues.followupTime
                ? formatTime(defaultValues.followupTime)
                : "",
              leadStage: defaultValues.leadStage?.value ?? "",
              potential: defaultValues.potential?.value ?? "",
              remarks: defaultValues.remarks ?? "",
            },
          },
        },
        {
          onSuccess: data => {
            if (data?.statusInfo?.statusCode === "200") {
              toastSuccess("Contact Saved Successfully");

              if (shouldNavigate) {
                // Navigate to /worklist route only shouldNavigate is true
                navigate("/worklist");
              }
            } else {
              toastFail("Contact Failed");
            }
            refetch();
            setIsSaving(false);
            getNotification();
          },
        }
      );
    } catch (error) {
      toastFail("Something went wrong");
      throw new Error(`An Error occured ${error}`);
    }
  };

  const saveLeadEscalation = (shouldNavigate: boolean) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    const SAVE_ESCLATED_LEAD_BODY = {
      ...MASTER_PAYLOAD,
      requestData: {
        leadDetail: {
          caseId: particularLeadId?.leadId,
        },
        contactDetail: {
          actionName: defaultValues.actionName,
          caseRefEscId: contactData?.contactDetail?.caseRefEscId,
          resolutionCheck: defaultValues.resolve ? "resolve" : "Not resolved",
          initialRemarks: defaultValues.initialRemarks,
          initiatedDateTime: defaultValues.initiatedDateTime,
          initiatedBy: defaultValues.initiatedBy,
          resolvedRemarks: defaultValues.resolvedRemarks,
        },
      },
    };

    dispatch(saveEscalatedLead(SAVE_ESCLATED_LEAD_BODY))
      .then((res: any) => {
        if (res.payload.statusInfo.statusCode === "200") {
          toastSuccess("Sucesss");
          if (shouldNavigate) {
            // Navigate to /worklist route only shouldNavigate is true
            //navigate("/worklist");
          }
          navigate("/worklist");
        }
        setIsSaving(false);
        getNotification();
      })
      .catch((err: any) => {
        toastFail("Failed to save");
        throw new Error(`An Error occured ${err}`);
      });
  };

  const isConvertedToCustomer =
    sessionStorage.getItem("isConverted") === "true";

  return (
    <>
      {!isOnline && (
        <Alert status="warning" mb={4} borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Viewing cached data</AlertTitle>
            <AlertDescription>
              {`You are offline. Viewing cached lead details. Changes will be synced when you're back online.`}
            </AlertDescription>
          </Box>
        </Alert>
      )}
      <FormProvider {...methods}>
        <Box>
          {isEscalated ? (
            <EscalatedLeadStatus
              defaultValues={defaultValues}
              control={control}
              register={register}
              errors={errors}
            />
          ) : (
            <LeadStatus
              defaultValues={defaultValues}
              control={control}
              watch={watch}
              isConvertedToCustomer={isConvertedToCustomer}
            />
          )}

          {isMobile ? (
            <Accordion
              mt={5}
              allowToggle
              w="100vw" 
              maxW="100%" 
              mx="auto"
            >
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton paddingY={2}>
                        <Text
                          fontWeight={700}
                          fontSize={{ base: "16px", md: "10px" }}
                          flex="1"
                          textAlign="left"
                        >
                          {t("contact.heading.actionHistory")}
                        </Text>
                        {isExpanded ? (
                          <ChevronDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel p={0} pt={1} pb={1}>
                      <Box>
                        {/* <PtpCard
                        data={ptpInfo?.responseData?.cpufullHistory || []}
                      /> */}
                        <ActionCards data={actionHistoryTableData} />
                      </Box>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton paddingY={2}>
                        <Text
                          fontWeight={700}
                          fontSize={{ base: "16px", md: "20px" }}
                          flex="1"
                          textAlign="left"
                        >
                          {t("contact.heading.escalationReferralHistory")}
                        </Text>
                        {isExpanded ? (
                          <ChevronDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel p={0} pt={1} pb={1}>
                      <EscalationReferralHistoryCards
                        data={escalationHistoryTableData}
                      />
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>

              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                    <h2>
                      <AccordionButton paddingY={2}>
                        <Text
                          fontWeight={700}
                          fontSize={{ base: "16px", md: "20px" }}
                          flex="1"
                          textAlign="left"
                        >
                          {t("contact.heading.allocationHistory")}
                        </Text>
                        {isExpanded ? (
                          <ChevronDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </AccordionButton>
                    </h2>
                    <AccordionPanel p={0} pt={1} pb={1}>
                      <Box>
                        <AllocationHistoryCards data={allocationHistoryTable} />
                      </Box>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
              <AccordionItem>
                {({ isExpanded }) => (
                  <>
                  {/* dunning history comment for mobile view */}
                    {/* <h2>
                      <AccordionButton paddingY={2}>
                        <Text
                          fontWeight={700}
                          fontSize={{ base: "16px", md: "20px" }}
                          flex="1"
                          textAlign="left"
                        >
                          {t("contact.heading.dunningHistory")}
                        </Text>
                        {isExpanded ? (
                          <ChevronDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </AccordionButton>
                    </h2> */}
                    {/* <AccordionPanel p={0} pt={1} pb={1}>
                      <DunningHistoryCards />
                    </AccordionPanel> */}
                  </>
                )}
              </AccordionItem>
            </Accordion>
          ) : (
            <Tabs variant="unstyled" mt="8" mb={"45px"}>
              <TabList display="flex" gap="2">
                <Tab sx={tabStyle.base} _selected={tabStyle.selected}>
                  {t("contact.heading.actionHistory")}
                </Tab>
                <Tab sx={tabStyle.base} _selected={tabStyle.selected}>
                  {t("contact.heading.escalationReferralHistory")}
                </Tab>
                <Tab sx={tabStyle.base} _selected={tabStyle.selected}>
                  {t("contact.heading.allocationHistory")}
                </Tab>
                {/* {isEscalated ? (
                  <></>
                ) : (
                  <Tab sx={tabStyle.base} _selected={tabStyle.selected}>
                    {t("contact.heading.dunningHistory")}
                  </Tab>
                )} */}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ActionHistoryTable ContactDetail={actionHistoryTableData} />
                </TabPanel>
                <TabPanel>
                  <EscalationHistoryTable
                    ContactDetail={escalationHistoryTableData}
                  />
                </TabPanel>
                <TabPanel>
                  <AllocationHistoryTable
                    ContactDetail={allocationHistoryTable}
                  />
                </TabPanel>
                {/* <TabPanel>{!isEscalated && <DunningHistoryTable />}</TabPanel> */}
              </TabPanels>
            </Tabs>
          )}
          <ValidationComponent
            isSubmitting={isContactSave}
            buttonClickStatus={buttonClickStatus}
            setButtonClickStatus={setButtonClickStatus}
            onClick={() =>
              handleSubmit(
                isEscalated
                  ? saveLeadEscalation(false)
                  : onSaveActionRecord(false)
              )
            }
            onInputNavigate={(fieldName: string) => {
              ref.current[fieldName]?.focus();
              setErrorNavigateId(fieldName);
              setNavigateFocus(fieldName);
            }}
            pathName={pathName}
            onCancel={() => reset()}
          />
        </Box>
      </FormProvider>
    </>
  );
};

export default Index;
