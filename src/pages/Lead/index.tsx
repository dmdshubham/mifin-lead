import { Box, Divider, Flex, Spacer } from "@chakra-ui/react";
import { manageNewLead } from "@mifin/redux/service/manageNewLead/api";
import { fetchLeadDetails } from "@mifin/redux/service/worklistLeadDetails/api";
import { useAppDispatch } from "@mifin/redux/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IncomeDetails from "@mifin/pages/Lead/IncomeDetails";
import LeadDetails from "@mifin/pages/Lead/LeadDetails";
import PersonalDetail from "@mifin/pages/Lead/PersonalDetails/PersonalDetail";
import { useForm, FormProvider } from "react-hook-form";
import newLeadSchema from "@mifin/schema/NewLeadYupSchema";
import Address from "@mifin/components/Address/Address";
// import KeyContactsTable from "@mifin/components/KeyContacts/KeyContactsTable";
import { yupResolver } from "@hookform/resolvers/yup";
import { toastFail, toastSuccess } from "@mifin/components/Toast";
import LeadSearchForm from "@mifin/components/LeadSearch/LeadSearchForm";
import { formatdate } from "@mifin/utils/format-date";
import { useTranslation } from "react-i18next";
import {
  listAddress,
  defaultValuesOfLead,
} from "@mifin/ConstantData/newLeadApiBody";
import { useMemo, useRef } from "react";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import ValidationComponent from "@mifin/components/ValidationComponent/ValidationComponent";
import { NAVIGATION_ROUTES } from "@mifin/routes/routes.constant";
import { getNotificationDetails } from "@mifin/redux/service/getNotificationDetails/api";
import { useLocation } from "react-router-dom";
import PhoneAndEmail from "./PhoneAndEmail";

const NOTIFICATION_REQUEST_BODY = {
  ...MASTER_PAYLOAD,
  requestData: {
    notificationId: "show",
  },
};

const Lead = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [allAddress, setAllAddress] = useState(listAddress);
  const yupValidationSchema: any = useMemo(
    () => newLeadSchema(t, allAddress),
    [t, allAddress]
  );
  const ref = useRef<Record<string, HTMLElement | null>>({});
  const [leadSaveLoader, setLeadSaveLoader] = useState(false);
  const [contactType, setContactType] = useState<any>([]);
  const [mobileArray, setMobileArray] = useState<any>([]);
  const [emailArray, setEmailArray] = useState<any>([]);
  const [clearMobileValue, setClearMobileValue] = useState<boolean>(false);
  const [resetMobileValidate, setResetMobileValidate] = useState(false);
  const [defaultMobileChangeFlag, setDefaultMobileChangeFlag] = useState(false);

  const location = useLocation();

  const [buttonClickStatus, setButtonClickStatus] = useState({
    save: false,
    saveAndExit: false,
  });
  const [errorNavigateId, setErrorNavigateId] = useState<string>("");
  const methods = useForm({
    defaultValues: defaultValuesOfLead,
    mobileArray: [],
    emailArray: [],
    mode: "onChange",
    resolver: yupResolver(yupValidationSchema),
  });

  const {
    formState: { isDirty },
    watch,
    reset,
    trigger,
    handleSubmit,
    setFocus,
  } = methods;

  const defaultValues = watch();

  const [navigateFocus, setNavigateFocus] = useState<string>("");

  useEffect(() => {
    if (mobileArray?.length > 0 || emailArray?.length > 0) {
      methods.setValue("mobileArray", mobileArray);
      methods.setValue("emailArray", emailArray);
      trigger(["mobileArray", "emailArray"]);
    }
  }, [mobileArray, emailArray]);

  // useEffect(() => {
  //   setNavigateFocus("");
  // }, [navigateFocus]);

  const getNotification = () => {
    dispatch(getNotificationDetails(NOTIFICATION_REQUEST_BODY));
  };

  useEffect(() => {
    return () => setNavigateFocus("");
  }, [navigateFocus]);

  useEffect(() => {
    if (isDirty) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  useEffect(() => {
    if (isDirty) trigger();
  }, [isDirty]);

  useEffect(() => {
    trigger();
  }, [watch("lastName")]);

  const handleReset = () => {
    reset();
    setAllAddress(listAddress);
    setContactType();
    // setMobileArray([]);
    // setEmailArray([]);
    // setClearMobileValue(true)
  };

  const pathName = useMemo(() => {
    const pathnameArray = window.location.pathname.split("/");
    return pathnameArray[pathnameArray.length - 1];
  }, []);

  useEffect(() => {
    const getWorkListLeadDetails = () => {
      dispatch(fetchLeadDetails({ ...MASTER_PAYLOAD }));
    };
    getWorkListLeadDetails();
  }, []);

  useEffect(() => {
    const element = document.getElementById(errorNavigateId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    errorNavigateId && setFocus(errorNavigateId);
    return () => setErrorNavigateId("");
  }, [errorNavigateId]);

  const handleSaveLead = () => {
    if (leadSaveLoader) return;
    setLeadSaveLoader(true);
    let tempMobileArray = [];
    tempMobileArray =
      mobileArray?.length > 0 &&
      mobileArray.map((item: any) => {
        return {
          caseMobileId: "",
          contactNo: item?.applicantMobileNo,
          primaryContact: item?.defaultFlag,
          mobileContactTypeId: item?.applicantMobileType?.value,
          dndFlag: item?.dnsFlag,
          verified: item?.verified,
        };
      });
    let tempEmailArray = [];
    tempEmailArray =
      emailArray?.length > 0 &&
      emailArray.map((item: any) => {
        return {
          caseEmailId: "",
          email: item?.applicantEmailId,
          primaryEmail: item?.defaultFlag,
          emailContactTypeId: item?.applicantEmailType?.value,
          verified: item?.Verified,
        };
      });

    const reqBody = {
      ...MASTER_PAYLOAD,
      requestData: {
        requestType: "SaveandContinue",
        newLeadDetail: {
          adhaarNumber: defaultValues?.adhaarNumber ?? "",
          affordableEmi: defaultValues?.affordableEmi ?? "",
          allocateTo: defaultValues?.allocateTo?.value ?? "",
          annualIncome: defaultValues?.annualIncome ?? "",
          annualSalesTurnOver: defaultValues?.annualSalesTurnOver ?? "",
          authSignatoryFName: defaultValues?.authSignatoryFName ?? "",
          authSignatoryLName: defaultValues?.authSignatoryLName ?? "",
          authSignatoryMName: defaultValues?.authSignatoryMName ?? "",
          bonusIncentive: defaultValues?.bonusIncentive ?? "",
          branch: defaultValues?.branch?.value ?? "",
          campaign: defaultValues?.campaign?.value ?? "",
          cluster: defaultValues?.cluster?.value ?? "",
          clusterForNI: defaultValues?.clusterForNI?.value ?? "",
          companyName: defaultValues?.companyName ?? "",
          constitution: defaultValues?.constitution?.value.toString(),
          corpSalaryAcount: "N",
          dateOfIncorparation: defaultValues?.dateOfIncorparation
            ? formatdate(defaultValues?.dateOfIncorparation)
            : null,
          depreciation: defaultValues?.depreciation ?? "",
          designation: "",
          directorSalary: defaultValues?.directorSalary ?? "",
          dob: defaultValues?.dob ? formatdate(defaultValues?.dob) : null,
          entityType: defaultValues?.entityType?.value,
          firstName: defaultValues?.firstName ?? "",
          gender: defaultValues?.gender?.value ?? "",
          grossMonthlyIncome: defaultValues?.grossMonthlyIncome ?? "",
          grossProfit: defaultValues?.grossProfit ?? "",
          industry: defaultValues?.industry?.value ?? "",
          industryForNI: defaultValues?.industryForNI?.value ?? "",
          interesrPaidOnLoan: defaultValues?.interesrPaidOnLoan ?? "",
          lastName: defaultValues?.lastName ?? "",
          listAddress: allAddress ?? [],
          listKeyContact: contactType,
          loanAmount: defaultValues?.loanAmount ?? "",
          maritalStatus: defaultValues?.maritalStatus?.value ?? "",
          middleName: defaultValues?.middleName ?? "",
          modeOfSalary: "",
          monthlyRentalIncome: defaultValues?.monthlyRentalIncome ?? "",
          nationality: defaultValues?.nationality?.value ?? "",
          netMonthlyIncome: defaultValues?.netMonthlyIncome ?? "",
          netProfitAtTax: defaultValues?.netProfitAtTax ?? "",
          netWorth: defaultValues?.netWorth ?? "",
          noOfDependents: defaultValues?.noOfDependents ?? "",
          occupationType: (defaultValues?.constitution?.value as string) ?? "",
          otherAnnualIncome: defaultValues?.otherAnnualIncome ?? "",
          otherCompanyName: defaultValues?.otherCompanyName ?? "",
          pan: defaultValues?.pan ?? "",
          productId: defaultValues?.queueId?.value ?? "",
          purposeOfLoan: (defaultValues?.purposeOfLoan?.value as string) ?? "",
          queueId: defaultValues?.subQueueId?.value ?? "",
          referenceName: defaultValues?.referenceName ?? "",
          referenceNumber: defaultValues?.referenceNumber ?? "",
          scheme: defaultValues?.scheme?.value ?? "",
          sector: defaultValues?.sector?.value ?? "",
          sectorForNI: defaultValues?.sectorForNI?.value ?? "",
          source: defaultValues?.source?.value ?? "",
          stage: defaultValues?.stage?.value ?? "",
          stageForNI: defaultValues?.stageForNI?.value ?? "",
          tenure: defaultValues?.tenure ?? "",
          typeOfBusiness: defaultValues?.typeOfBusiness?.value ?? "",
          typeOfBusinessForNI: defaultValues?.typeOfBusinessForNI?.value ?? "",
          subQueueId: defaultValues?.subQueueId?.value ?? "",
          userId: "",
          workExperiance: "",
          yearOfCurrJob: "",
          listMobile: tempMobileArray,
          listEmail: tempEmailArray,
        },
      },
    };

    dispatch(manageNewLead(reqBody))
      .then(data => {
        const { error, leadid, errorMessage } = data.payload.responseData;
        if (error.toLowerCase() === "s") {
          toastSuccess(`Lead id has been generated ${leadid}`);
          handleReset();
          setMobileArray([]);
          setEmailArray([]);
          getNotification();
          buttonClickStatus.saveAndExit
            ? navigate(NAVIGATION_ROUTES.WORKLIST)
            : null;
        } else {
          toastFail(errorMessage);
          setLeadSaveLoader(false);
        }
      })
      .catch(err => {
        toastFail("Something Went Wrong");
        throw new Error(
          `An Error occurred ${err}` || "An Unknow Error occured"
        );
      });
  };

  useEffect(() => {
    handleReset();
    trigger();
  }, [location]);

  const handleCancel = () => {
    reset(defaultValuesOfLead); // Reset the form to default values
    setAllAddress(listAddress); // Reset addresses if needed
    setContactType([]); // Reset contact types if needed
  };

  return (
    <Box mt={{ sm: 2, md: 6 }}>
      <Flex gap="17px">
        <Spacer />
        <Flex>
          <LeadSearchForm />
        </Flex>
      </Flex>

      <FormProvider {...methods}>
        <PersonalDetail />
        <IncomeDetails />
        <Address allAddress={allAddress} setAllAddress={setAllAddress} />
        {/* <KeyContactsTable
          contactType={contactType}
          setContactType={setContactType}
        /> */}
        <PhoneAndEmail
          id="emailMobile"
          // activeLink={activeLink}
          // allMasterKey={allMastersData}
          mobile={[]}
          email={[]}
          setMobileArray={setMobileArray}
          setEmailArray={setEmailArray}
          mobileArray={mobileArray}
          emailArray={emailArray}
          navigateFocus={navigateFocus}
          checkNewLoanOrApplicant="newLoan"
          setClearMobileValue={setClearMobileValue}
          // isNewSelected={isNewSelected}
          setResetMobileValidate={setResetMobileValidate}
          setDefaultMobileChangeFlag={setDefaultMobileChangeFlag}
        />
        {/* <Divider sx={dividerStyling} mt={"20px"} /> */}
        <LeadDetails />
        <ValidationComponent
          isSubmitting={leadSaveLoader}
          setButtonClickStatus={setButtonClickStatus}
          onClick={handleSubmit(handleSaveLead)}
          onInputNavigate={(fieldName: string) => {
            ref.current[fieldName]?.focus();
            setErrorNavigateId(fieldName);
            setNavigateFocus(fieldName);
          }}
          pathName={pathName}
          onCancel={handleCancel}
          initialValues={defaultValuesOfLead}
          onReset={() => {
            setMobileArray([]);
            setEmailArray([]);
            setClearMobileValue(true);
          }}
        />
      </FormProvider>
    </Box>
  );
};

export default Lead;