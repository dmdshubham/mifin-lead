import { Fragment, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Flex,
  Drawer,
  DrawerBody,
  Input,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Text,
  Grid,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import PrimaryButton from "@mifin/components/Button/index";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { fetchLeadDetails } from "@mifin/redux/service/worklistLeadDetails/api";
import { manageNewLead } from "@mifin/redux/service/manageNewLead/api";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import { toastSuccess, toastFail } from "@mifin/components/Toast";
import { useTranslation } from "react-i18next";
import SelectComponent from "@mifin/components/SelectComponent";
import quickLeadschema from "@mifin/schema/QuickLeadYupSchema";
import { useMemo, useState } from "react";
import { errorTextStyle } from "@mifin/theme/style";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { AddressProps } from "@mifin/Interface/Customer";
import RequiredMark from "@mifin/components/RequiredMark";
import { getNotificationDetails } from "@mifin/redux/service/getNotificationDetails/api";
import { getLeadDetails } from "@mifin/redux/service/worklistGetLeadDetails/api";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { sanitizedInput} from "@mifin/utils/sanitizedInput";
import { useOffline } from "@mifin/hooks/OfflineContext";
import { saveLead, addPendingAction } from "@mifin/utils/indexedDB";

const NOTIFICATION_REQUEST_BODY = {
  ...MASTER_PAYLOAD,
  requestData: {
    notificationId: "show",
  },
};

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

const formDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  mobile_no2: "",
  queueId: null as null | { label: string; value: string },
  source: null as null | { label: string; value: string },
  potential: null as null | { label: string; value: string },
  campaign: null as null | { label: string; value: string },
  allocateTo: null as null | { label: string; value: string },
};
const QuickLead = () => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const { t } = useTranslation();
  const { isOnline, refreshPendingCount } = useOffline();
  const yupValidationSchema: any = useMemo(() => quickLeadschema(t), [t]);
  const dispatch = useAppDispatch();
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const [isSavedAttempted, setIsSaveAttempted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    trigger,
    reset,
    watch,
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: formDefaultValues,
    mode: "onChange",
    resolver: yupResolver(yupValidationSchema),
  });
  const defaultValues: any = watch();

  useEffect(() => {
    if (isDirty || isSavedAttempted) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  useEffect(() => {
    if (isDirty) trigger();
  }, [isDirty]);

  const getAllLeadList = () => {
    dispatch(getLeadDetails(GET_LEAD_DETAILS_BODY));
  };

  const productMaster = mastersData?.Masters?.productMaster.map(
    (el: AddressProps) => {
      return {
        label: el?.prodName,
        value: el?.prodId,
      };
    }
  );

  const subQueueMaster = mastersData?.Masters?.subQueueMaster.map(
    (el: AddressProps) => {
      return {
        label: el?.subQueue,
        value: el?.subQueueId,
      };
    }
  );

  const sourceMaster = mastersData?.Masters?.sourceMaster.map(
    (el: AddressProps) => {
      return {
        label: el?.sourceName,
        value: el?.caseSourceId,
      };
    }
  );

  const campaignMaster = mastersData?.Masters?.campaignMaster.map(
    (el: AddressProps) => {
      return {
        label: el?.campaignName,
        value: el?.campaignId,
      };
    }
  );

  const allocateToList =
    mastersData?.allocateToList &&
    mastersData?.allocateToList.map((el: AddressProps) => {
      return {
        label: el?.userName,
        value: el?.userId,
      };
    });

  useEffect(() => {
    const getWorkListLeadDetails = () => {
      // Fetch master data - works both online and offline (with cache)
      dispatch(fetchLeadDetails({ ...MASTER_PAYLOAD })).catch(err => {
        console.log('Master data fetch issue (may be using cache):', err);
      });
    };
    getWorkListLeadDetails();
  }, []);

  const getNotification = () => {
    dispatch(getNotificationDetails(NOTIFICATION_REQUEST_BODY));
  };

  const [mobileArray, setMobileArray] = useState<any>([]);
  const [emailArray, setEmailArray] = useState<any>([]);

  const handleFormSubmit = async () => {
    if (isSaving) return;

    setIsSaving(true);
    const tempMobileArray =
      mobileArray?.length > 0
        ? mobileArray.map((item: any) => ({
            caseMobileId: "",
            contactNo: item?.applicantMobileNo,
            primaryContact: item?.defaultFlag,
            mobileContactTypeId: item?.applicantMobileType?.value,
            dndFlag: item?.dnsFlag,
            verified: item?.verified,
          }))
        : defaultValues?.mobile_no2
        ? [
            {
              caseMobileId: "",
              contactNo: defaultValues.mobile_no2,
              primaryContact: "Y",
              mobileContactTypeId: "1000000001",
              dndFlag: "N",
              verified: "N",
            },
          ]
        : [];

    const tempEmailArray =
      emailArray?.length > 0
        ? emailArray.map((item: any) => ({
            caseEmailId: "",
            email: item?.applicantEmailId,
            primaryEmail: item?.defaultFlag,
            emailContactTypeId: item?.applicantEmailType?.value,
            verified: item?.Verified,
          }))
        : defaultValues?.email
        ? [
            {
              caseEmailId: "",
              email: defaultValues.email,
              primaryEmail: "Y",
              emailContactTypeId: "1000000001",
              verified: "N",
            },
          ]
        : [];

    const QUICK_LEAD_BODY = {
      ...MASTER_PAYLOAD,
      requestData: {
        requestType: "SaveandContinue",
        newLeadDetail: {
          adhaarNumber: "",
          affordableEmi: "",
          allocateTo: defaultValues?.allocateTo?.value ?? "",
          annualIncome: "",
          annualSalesTurnOver: "",
          authSignatoryFName: "",
          authSignatoryLName: "",
          authSignatoryMName: "",
          bonusIncentive: "",
          branch: "-1",
          campaign: defaultValues?.campaign?.value ?? "",
          cluster: "1",
          clusterForNI: "-1",
          companyName: "",
          constitution: "-1",
          corpSalaryAcount: "N",
          dateOfIncorparation: "",
          depreciation: "",
          designation: "",
          directorSalary: "",
          dob: "",
          entityType: "1000000001",
          firstName: defaultValues?.firstName ?? "",
          gender: "-1",
          grossMonthlyIncome: "",
          grossProfit: "",
          industry: "-1",
          industryForNI: "-1",
          interesrPaidOnLoan: "",
          lastName: defaultValues?.lastName ?? "",
          listAddress: [
            {
              addressFlag: "add",
              addressId: "1000001058",
              personalDtlId: "1000000566",
              caseId: "",
              addressType: "1000000001",
              address: "",
              officeaddress: "",
              city: "",
              buildingName: "",
              landmark: "",
              state: "",
              zipcode: "",
              //email: defaultValues?.email ?? "",
              stdIsd: "",
              // mobile_no1: "8765445432",
              // mobile_no2: defaultValues?.mobile_no2 ?? "",
              phone1: "",
              ext1: "",
              ext2: "",
              fax: "",
              std1: "",
              landLine1: "",
              std2: "",
              landLine2: "",
              mailingAddress: "Y",
              destinationAddress: "Y",
              occupancyMm: "1",
              occupancyYr: "1",
              occupancyStatus: "",
              sameas: "",
              active: "",
              cityName: "",
              bussinessestbyr: "",
              oldaddress: "",
              marketvalue: "",
              gstinno: "",
              currentareaYr: "",
              phone2: "",
              flatNo: "",
              floorNo: "",
              locality: "",
              company_name: "",
            },
            {
              addressFlag: "add",
              addressId: "1000001059",
              personalDtlId: "1000000566",
              caseId: "",
              addressType: "1000000002",
              address: "",
              city: "",
              buildingName: "",
              landmark: "",
              state: "",
              zipcode: "",
              email: "",
              stdIsd: "",
              mobile_no1: "",
              mobile_no2: "",
              phone1: "",
              ext1: "",
              ext2: "",
              fax: "",
              std1: "",
              landLine1: "",
              std2: "",
              landLine2: "",
              mailingAddress: "N",
              destinationAddress: "N",
              occupancyMm: "1",
              occupancyYr: "1",
              occupancyStatus: "",
              sameas: "",
              active: "",
              cityName: "",
              bussinessestbyr: "",
              oldaddress: "",
              marketvalue: "",
              gstinno: "",
              currentareaYr: "",
              phone2: "",
              flatNo: "",
              floorNo: "",
              locality: "",
              company_name: "",
            },
            {
              addressFlag: "add",
              addressId: "1000001060",
              personalDtlId: "1000000566",
              caseId: "",
              addressType: "1000000003",
              address: "",
              city: "",
              buildingName: "",
              landmark: "",
              state: "",
              zipcode: "",
              email: "",
              stdIsd: "",
              mobile_no1: "",
              mobile_no2: "",
              phone1: "",
              ext1: "",
              ext2: "",
              fax: "",
              std1: "",
              landLine1: "",
              std2: "",
              landLine2: "",
              mailingAddress: "N",
              destinationAddress: "N",
              occupancyMm: "1",
              occupancyYr: "1",
              occupancyStatus: "",
              sameas: "",
              active: "",
              cityName: "",
              bussinessestbyr: "",
              oldaddress: "",
              marketvalue: "",
              gstinno: "",
              currentareaYr: "",
              phone2: "",
              flatNo: "",
              floorNo: "",
              locality: "",
              company_name: "",
            },
          ],
          listMobile: tempMobileArray || [],
          listEmail: tempEmailArray || [],
          listKeyContact: [
            {
              address: "",
              buildingName: null,
              caseId: null,
              city: null,
              contactTypeId: "1",
              createdBy: null,
              createdDate: null,
              createdSysDate: null,
              email: "",
              ext1: null,
              ext2: null,
              firmName: "",
              flatNo: null,
              floorNo: null,
              fname: "",
              keyContactId: null,
              landmark: null,
              lname: null,
              locality: null,
              mname: null,
              mobile: "",
              personalDtlId: null,
              phone1: null,
              phone2: null,
              state: null,
              zipcode: null,
            },
          ],
          loanAmount: "",
          maritalStatus: "-1",
          middleName: "",
          modeOfSalary: "-1",
          monthlyRentalIncome: "",
          nationality: "-1",
          netMonthlyIncome: "600000",
          netProfitAtTax: "",
          netWorth: "",
          noOfDependents: "",
          occupationType: "",
          otherAnnualIncome: "",
          otherCompanyName: "",
          pan: "",
          productId: defaultValues?.queueId?.value ?? "",
          purposeOfLoan: "-1",
          queueId: defaultValues?.potential?.value ?? "",
          referenceName: "",
          referenceNumber: "",
          scheme: "-1",
          sector: "-1",
          sectorForNI: "-1",
          source: defaultValues?.source?.value ?? "",
          stage: "-1",
          stageForNI: "",
          tenure: "",
          typeOfBusiness: "-1",
          typeOfBusinessForNI: "-1",
          userId: "",
          workExperiance: "",
          yearOfCurrJob: "",
        },
      },
    };

    if (isOnline) {
      // Online: Submit directly to API
      dispatch(manageNewLead(QUICK_LEAD_BODY))
        .then(res => {
          if (
            res?.payload.statusInfo.statusCode === "200" &&
            res?.payload.responseData.error.toLowerCase() === "s"
          ) {
            reset();
            onClose();
            toastSuccess(`Lead ${res.payload.responseData.leadid} is generated`);
            getNotification();
            navigate(
              location?.pathname + `?id=${Math.floor(Math.random() * 10) + 1}`
            );
          } else if (
            res?.payload.statusInfo.statusCode === "200" &&
            res?.payload.responseData.error.toLowerCase() === "f"
          ) {
            toastFail(res?.payload?.responseData?.errorMessage);
            setIsSaving(false);
          }
        })
        .catch(err => {
          toastFail("Failed to generate lead");
          console.error(err);
        })
        .finally(() => {
          setIsSaving(false);
        });
    } else {
      // Offline: Save to IndexedDB
      try {
        const localLeadId = `offline-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        await saveLead(localLeadId, QUICK_LEAD_BODY, false);
        await addPendingAction('CREATE_LEAD', {
          ...QUICK_LEAD_BODY,
          localLeadId,
        });
        
        // Refresh pending count to trigger worklist update
        await refreshPendingCount();
        
        reset();
        onClose();
        toastSuccess("Lead saved offline. Will be synced when you're back online.");
        navigate(
          location?.pathname + `?id=${Math.floor(Math.random() * 10) + 1}`
        );
      } catch (err) {
        toastFail("Failed to save lead offline");
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  useEffect(() => {
    setIsSaving(false);
  }, [onClose]);

  return (
    <Fragment>
      <AddIcon onClick={onOpen} ml="3" _hover={{ cursor: "pointer" }} />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DrawerContent
            maxW={{
              base: "90vw",
              sm: "100vw",
              md: "calc(100vw - 300px)",
              lg: "30vw",
            }}
            borderRadius={"8px"}
          >
            <DrawerCloseButton />
            <DrawerHeader ml={"-10px"}>
              <Flex alignItems="center" gap={2}>
                {t("quickLead.createQuicklead")}
                {!isOnline && (
                  <Badge colorScheme="orange" fontSize="sm">
                    Offline Mode
                  </Badge>
                )}
              </Flex>
            </DrawerHeader>
            <Divider />
            <DrawerBody mx={-2}>
              <Flex flexDirection="column" gap="6">
                {[
                  {
                    label: t("quickLead.firstName"),
                    name: "firstName",
                    type: "text",
                    placeholder: "Enter",
                  },
                  {
                    label: t("quickLead.lastName"),
                    name: "lastName",
                    type: "text",
                    placeholder: t("quickLead.lastNamePlaceholder"),
                  },
                  {
                    label: t("quickLead.emailId"),
                    name: "email",
                    type: "email",
                    placeholder: t("quickLead.emailIdPlaceholder"),
                  },
                  {
                    label: t("quickLead.mobileNo"),
                    name: "mobile_no2",
                    type: "tel",
                    placeholder: t("quickLead.mobileNoPlaceholder"),
                  },
                ].map(({ label, name, type, placeholder }) => (
                  <FormControl key={name}>
                    <Grid
                      templateColumns={{ base: "1fr", md: "150px 1fr" }}
                      alignItems="center"
                      gap={2}
                    >
                      <FormLabel
                        htmlFor={`quickLead${name}`}
                        fontSize={"14px"}
                        color={"#000000B3"}
                        m={0}
                      >
                        {label}
                        <RequiredMark />
                      </FormLabel>
                      <Input
                        type={type}
                        id={`quickLead${name}`}
                        placeholder={placeholder}
                        {...register(name, {
    onChange: (e) => {
      e.target.value = sanitizedInput(e.target.value);
    },
  })}
                        variant="flushed"
                        sx={{
                          px: 3,
                          fontSize: "12px",
                          textTransform: "uppercase",
                          fontWeight: "600",
                          bg: "white",
                          borderRadius: "4px",
                          "::placeholder": {
                            fontSize: "12px",
                            textTransform: "none",
                            fontWeight: "500",
                          },
                          "&:hover": {
                            border: "1px solid #D3D3D3",
                            borderBottom: "1px solid #D3D3D3",
                          },
                          "&:focus, &:focus-visible": {
                            border: "1px solid #2684FF",
                            borderBottom: "1px solid #2684FF",
                            boxShadow: "0 0 0 1px #2684FF",
                            outline: "none",
                          },
                          "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active":
                            {
                              boxShadow:
                                "0 0 0px 1000px white inset !important",
                              WebkitTextFillColor: "black !important",
                            },
                        }}
                      />
                    </Grid>
                    {errors?.[name] && (
                      <Text sx={errorTextStyle}>{errors?.[name]?.message}</Text>
                    )}
                  </FormControl>
                ))}

                {[
                  {
                    label: t("quickLead.product"),
                    name: "queueId",
                    options: productMaster,
                  },
                  {
                    label: t("quickLead.potential"),
                    name: "potential",
                    options: subQueueMaster,
                  },
                  {
                    label: t("quickLead.source"),
                    name: "source",
                    options: sourceMaster,
                  },
                  {
                    label: t("quickLead.campaign"),
                    name: "campaign",
                    options: campaignMaster,
                  },
                  {
                    label: t("quickLead.allocatedTo"),
                    name: "allocateTo",
                    options: allocateToList,
                  },
                ].map(({ label, name, options }) => (
                  <FormControl key={name} isRequired>
                    <Grid
                      templateColumns={{ base: "1fr", md: "150px 1fr" }}
                      alignItems="center"
                      gap={2}
                    >
                      <FormLabel
                        htmlFor={`quickLead${name}`}
                        fontSize={"14px"}
                        color={"#000000B3"}
                        m={0}
                      >
                        {label}
                      </FormLabel>
                      <SelectComponent
                        control={control}
                        name={name}
                        options={options}
                        placeholder={t("common.select")}
                      />
                    </Grid>
                    {errors?.[name] && (
                      <Text sx={errorTextStyle}>{errors?.[name]?.message}</Text>
                    )}
                  </FormControl>
                ))}
              </Flex>
            </DrawerBody>

            <DrawerFooter display="flex" gap="4">
              <PrimaryButton
                title={t("common.cancel")}
                onClick={() => {
                  reset();
                  onClose();
                }}
                tertiary
              />
              <PrimaryButton
                type="submit"
                title={t("common.save")}
                onClick={() => setIsSaveAttempted(true)}
                isLoading={isSaving}
                isDisabled={isSaving || !isDirty}
              />
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </Fragment>
  );
};

export default QuickLead;
