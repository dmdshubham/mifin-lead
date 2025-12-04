import LeadDetail from "@mifin/pages/Customer/Customer/LeadDetail";
import PersonalDetail from "./PersonalDetail";
import PropertyDetail from "@mifin/pages/Customer/Customer/PropertyDetail";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useSaveCustomerRecord,
  useCustomerDetail,
} from "@mifin/service/mifin-customerDetails";
import { useApiStore } from "@mifin/store/apiStore";
import CustomerAddress from "@mifin/components/Address/CustomerAddress";
import { formatdate } from "@mifin/utils/format-date";
import { updateLeadHeaderDetails } from "@mifin/redux/features/leadHeaderDetailSlice";
import { customerSchema } from "@mifin/schema/CustomerYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { listAddress } from "@mifin/ConstantData/newLeadApiBody";
import { toastSuccess, toastFail } from "@mifin/components/Toast";
import { useMemo } from "react";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { FormProvider } from "react-hook-form";
import ValidationComponent from "@mifin/components/ValidationComponent/ValidationComponent";
import { useLoanStatusForAllScreen } from "@mifin/store/useLoanStatusForAllScreen";
import PhoneAndEmail from "@mifin/pages/Lead/PhoneAndEmail";
import { dividerStyling } from "@mifin/theme/style";
import { Box, Divider } from "@chakra-ui/react";

const Index = () => {
  const { userDetails } = useApiStore();
  const customerInfo = useAppSelector(state => state.getLeadId);
  const dispatch = useAppDispatch();
  const [developerType, setDeveloperType] = useState();
  const { mutateAsync: saveActionRecord, isLoading: isCustomerSave } =
    useSaveCustomerRecord();
  const [allAddress, setAllAddress] = useState();
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const { updateHideValidationComponent } = useLoanStatusForAllScreen();

  const yupValidationSchema: any = useMemo(
    () => customerSchema(t, allAddress),
    [t, allAddress]
  );
  const [errorNavigateId, setErrorNavigateId] = useState<string>("");
  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(yupValidationSchema),
  });

  const {
    setValue,
    watch,
    reset,
    control,
    trigger,
    handleSubmit,
    setFocus,
    formState: { errors, isDirty },
  } = methods;

  const [navigateFocus, setNavigateFocus] = useState<string>("");
  const ref = useRef<Record<string, HTMLElement | null>>({});
  const [buttonClickStatus, setButtonClickStatus] = useState({
    save: true,
    saveAndExit: false,
  });
  const [showValidation, setShowValidation] = useState(true);
  const [saveCount, setSaveCount] = useState(0);
  const [isShowValComp, setIsShowValComp] = useState(false);

  useEffect(() => {
    return () => setNavigateFocus("");
  }, [navigateFocus]);

  useEffect(() => {
    const element = document.getElementById(errorNavigateId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    errorNavigateId && setFocus(errorNavigateId);
    return () => setErrorNavigateId("");
  }, [errorNavigateId]);

  const pathName = useMemo(() => {
    const pathnameArray = window.location.pathname.split("/");
    return pathnameArray[pathnameArray.length - 1];
  }, []);

  const {
    data: CustomerDetail,
    refetch,
    isLoading: isCustomerLoading,
  } = useCustomerDetail({
    // deviceDetail: userDetails.deviceDetail,
    // userDetail: userDetails.userDetail,
    ...MASTER_PAYLOAD,
    requestData: {
      leadDetail: {
        caseId: customerInfo.leadId,
      },
    },
  });

  useEffect(() => {
    if (
      CustomerDetail?.responseData?.customerDetail?.custEntityTypeId ===
      "1000000001"
    ) {
      methods.setValue("entityTypeFlag", true, { shouldValidate: true });
    } else {
      methods.setValue("entityTypeFlag", false, { shouldValidate: true });
    }
    if (methods.formState.isDirty) {
      setTimeout(() => methods.trigger(), 0);
    }
  }, [CustomerDetail, methods.formState.isDirty]);

  const propertCollateralDetails =
    CustomerDetail?.responseData?.customerDetail?.listProperty;

  useEffect(() => {
    if (
      CustomerDetail?.responseData?.customerDetail?.caseId ===
      customerInfo.leadId
    ) {
      Object?.entries(CustomerDetail?.responseData?.customerDetail).forEach(
        ([fieldName, defaultValue]: any) => {
          if (fieldName === "keyContacts") {
            setValue("listKeyContact", defaultValue);
          } else {
            setValue(fieldName, defaultValue);
          }
        }
      );

      // Handle listAddress
      if (CustomerDetail.responseData.customerDetail.listAddress) {
        const updatedArray =
          CustomerDetail.responseData.customerDetail.listAddress.map(
            (item: any) => ({ ...item, addressFlag: "add" })
          );
        setAllAddress(updatedArray);
      } else {
        setAllAddress(listAddress);
      }
      if (CustomerDetail.responseData.customerDetail.listMobile?.length > 0) {
        const mobileData =
          CustomerDetail.responseData.customerDetail.listMobile.map(
            (item: any) => {
              return {
                // applicantMobileNo: item?.LEAD_MOBILE_NO,
                // defaultFlag: item?.DEFAULT_FLAG === "Y" ? "Y" : "N",
                // applicantMobileType: {
                //   label:
                //     item?.LEAD_MOBILE_TYPE === 1000000001 ? "HOME" : "OFFICE",
                //   value: item?.LEAD_MOBILE_TYPE,
                // },
                // dnsFlag: item?.DNS_FLAG === "Y" ? "Y" : "N",
                // verified: "N",
                // caseMobileId: item?.ID,
                applicantMobileNo: item?.contactNo,
                defaultFlag: item?.primaryContact === "Y" ? "Y" : "N",
                applicantMobileType: {
                  label:
                    item?.mobileContactTypeId === 1000000001
                      ? "HOME"
                      : "OFFICE",
                  value: item?.mobileContactTypeId,
                },
                dnsFlag: item?.dndFlag === "Y" ? "Y" : "N",
                verified: "N",
                caseMobileId: item?.caseMobileId,
              };
            }
          );
        setMobileArray(mobileData);
      }
      if (CustomerDetail.responseData.customerDetail.listEmail?.length > 0) {
        const emailData =
          CustomerDetail.responseData.customerDetail.listEmail.map(
            (item: any) => ({
              applicantEmailId: item?.email?.toString() || "",
              defaultFlag: item?.primaryEmail === "Y" ? "Y" : "N",
              applicantEmailType: {
                label:
                  item?.emailContactTypeId === "1000000001" ? "HOME" : "OFFICE",
                value: item?.emailContactTypeId,
              },
              verified: "N",
              caseEmailId: item?.caseEmailId,
            })
          );
        setEmailArray(emailData);
      }
      dispatch(
        updateLeadHeaderDetails({
          ...CustomerDetail?.responseData?.leadHeaderDetail,
          listEmail:
            CustomerDetail?.responseData?.customerDetail?.listEmail || [],
          listMobile:
            CustomerDetail?.responseData?.customerDetail?.listMobile || [],
        })
      );

      setDeveloperType(JSON.parse(CustomerDetail?.responseData?.listOfProject));
    }
  }, [CustomerDetail, saveCount]);

  const handleAddressReset = () => {
    if (CustomerDetail?.responseData?.customerDetail?.listAddress) {
      const originalAddresses =
        CustomerDetail.responseData.customerDetail.listAddress.map(
          (item: any) => ({
            ...item,
            addressFlag: "add",
            state: item.state || "",
            city: item.city || "",
            zipcode: item.zipcode || "",
            stateName: item.stateName || "",
            cityName: item.cityName || "",
            divisionName: item.divisionName || "",
            stateDisplay: item.stateName || "",
            cityDisplay: item.cityName || "",
            zipcodeDisplay: item.zipcode
              ? `${item.zipcode} - ${item.divisionName || ""}`
              : "",
          })
        );
      setAllAddress(originalAddresses);
      reset({
        ...CustomerDetail.responseData.customerDetail,
        listAddress: originalAddresses,
      });
    }
  };

  useEffect(() => {
    if (isDirty) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  useEffect(() => {
    trigger();
  }, [CustomerDetail]);
  // useEffect(() => {
  //   const subscription = watch(() => {
  //     if (!showValidation) {
  //       setShowValidation(true);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, [watch, showValidation]);

  const defaultValues: any = watch();
  const [propertyDetail, setPropertyDetail] = useState<any>([]);

  const [mobileArray, setMobileArray] = useState<any>([]);
  const [emailArray, setEmailArray] = useState<any>([]);
  const [clearMobileValue, setClearMobileValue] = useState<boolean>(false);
  const [resetMobileValidate, setResetMobileValidate] = useState(false);
  const [defaultMobileChangeFlag, setDefaultMobileChangeFlag] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("leadSearch") === "true") {
      refetch();
      localStorage.setItem("leadSearch", "false");
    }
  }, [localStorage.getItem("leadSearch") === "true"]);
  const propStatus = watch("propStatus");
  const propTypeId = watch("propTypeId");
  const devloperId = watch("devloperId");
  const projectId = watch("projectId");
  const state = watch("state");
  const city = watch("city");
  const zipcode = watch("zipcode");
  const occupancyStatus = watch("occupancyStatus");
  const developerName = watch("developerName");
  useEffect(() => {
    if (isDirty) trigger();
  }, [isDirty]);
  const handleCustomerDetails = () => {
    event?.preventDefault();
    const filteredArray = defaultValues?.listKeyContact?.filter((obj: any) =>
      Object.prototype.hasOwnProperty.call(obj, "key")
    );

    const mykeycontactarray: Array<any> = filteredArray?.map((item: any) => ({
      ...item,
      keyContactId: "Active",
    }));

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    const tempMobileArray =
      mobileArray?.length > 0
        ? mobileArray.map((item: any) => {
            return {
              caseMobileId: item?.caseMobileId?.toString() || "",
              contactNo: item?.applicantMobileNo?.toString() || "",
              primaryContact: item?.defaultFlag?.toString() || "",
              mobileContactTypeId:
                item?.applicantMobileType?.value?.toString() || "",
              dndFlag: item?.dnsFlag,
              verified: item?.verified?.toString() || "",
            };
          })
        : [];

    const tempEmailArray =
      emailArray?.length > 0
        ? emailArray.map((item: any) => {
            return {
              caseEmailId: item?.caseEmailId?.toString() || "",
              email: item?.applicantEmailId?.toString() || "",
              primaryEmail: item?.defaultFlag?.toString() || "",
              emailContactTypeId:
                item?.applicantEmailType?.value?.toString() || "",
              verified: item?.Verified?.toString() || "",
            };
          })
        : [];

    try {
      saveActionRecord(
        {
          ...MASTER_PAYLOAD,
          requestData: {
            requestType: "save",
            customerDetail: {
              caseId: defaultValues?.caseId ?? "",
              industryForNI: defaultValues?.industryForNI?.value ?? "",
              companyPanNo: "",
              constitution: defaultValues?.constitution?.value
                ? defaultValues.constitution.value.toString()
                : "",
              //title: defaultValues?.salutation?.value ?? "",
              title: defaultValues?.title?.value ?? "",
              sectorForNI: defaultValues?.sectorForNI ?? "",
              stageForNI: defaultValues?.stageForNI ?? "",
              personalDetailId: defaultValues?.personalDetailId ?? "",
              custEntityTypeId: defaultValues?.custEntityTypeId?.value ?? "",
              age: defaultValues?.age ?? "",
              adhaarNumber: defaultValues?.adhaarNumber ?? "",
              annualIncome: defaultValues?.annualIncome ?? "",
              annualRentalIncome: defaultValues?.annualRentalIncome ?? "",
              annualSalesTurnover: defaultValues?.annualSalesTurnover ?? "",
              authSignatoryFName: defaultValues?.authSignatoryFName ?? "",
              authSignatoryLName: defaultValues?.authSignatoryLName ?? "",
              authSignatoryMName: defaultValues?.authSignatoryMName ?? "",
              bonusIncentive: "",
              cluster: defaultValues?.cluster?.value ?? "",
              clusterForNI: defaultValues?.clusterForNI?.value ?? "",
              dob: defaultValues.dob ? formatdate(defaultValues.dob) : "",
              companyName: defaultValues?.company_name ?? "",
              companyType: "",
              corporateSalaryAccount: "N",
              custCategory: "",
              customerUpdateFlag: "",
              depreciation: "",
              desig: "",
              directorSalary: defaultValues?.directorSalary ?? "",
              drivingLicenseNo: "",
              fName: defaultValues?.fName ?? "",
              gender: defaultValues?.gender?.value ?? "",
              grossMonthlyIncome: defaultValues?.grossMonthlyIncome ?? "",
              grossProfit: defaultValues?.grossProfit ?? "",
              incorporationDate: defaultValues?.incorporationDate
                ? formatdate(defaultValues.incorporationDate)
                : "",
              industryId: defaultValues?.industryId?.value ?? "",
              interesrPaidOnLoan: defaultValues?.interesrPaidOnLoan ?? "",
              lName: defaultValues?.lName ?? "",
              maritalStatus: defaultValues?.maritalStatus?.value ?? "",
              mName: defaultValues?.mName ?? "",
              monthlyRentalIncome: defaultValues?.monthlyRentalIncome ?? "",
              nationality: defaultValues?.nationality?.value ?? "",
              netMonthlyIncome: defaultValues?.netMonthlyIncome ?? "",
              netProfitAfterTax: defaultValues?.netProfitAfterTax ?? "",
              netWorth: defaultValues?.netWorth ?? "",
              noOfDependents: defaultValues?.noOfDependents ?? "",
              // occupationType: defaultValues?.occupationType ?? "",
              occupationType: defaultValues?.occupationType
                ? defaultValues.occupationType
                : defaultValues?.constitution?.value
                ? defaultValues.constitution.value.toString()
                : "",
              otherAnnualIncome: defaultValues?.otherAnnualIncome ?? "",
              otherCompanyName: defaultValues?.otherCompanyName ?? "",
              otherMonthlyIncome: defaultValues?.otherMonthlyIncome ?? "",
              pan: defaultValues?.pan ?? "",
              passportNo: "",
              referenceName: defaultValues?.referenceName ?? "",
              referenceNumber: defaultValues?.referenceNumber ?? "",
              result: "",
              salaryMode: "",
              sectorId: "",
              source: defaultValues?.source?.value?.toString() ?? "",
              stageId: "",
              tagA: "",
              tagB: "",
              typeOfBusiness: defaultValues?.typeOfBusiness?.value ?? "",
              typeOfBusinessForNI:
                defaultValues?.typeOfBusinessForNI?.value ?? "",
              listAddress: [
                {
                  destinationAddress:
                    defaultValues.listAddress[0]?.destinationAddress ?? "",
                  mailingAddress:
                    defaultValues.listAddress[0]?.mailingAddress ?? "",
                  addressType: "1000000001",
                  address: defaultValues.listAddress[0]?.address ?? "",
                  flatNo: defaultValues.listAddress[0]?.flatNo ?? "",
                  addressId: defaultValues.listAddress[0]?.addressId ?? "",
                  officeaddress: defaultValues.listAddress[0]?.address ?? "",
                  company_name: "",
                  floorNo: defaultValues.listAddress[0]?.floorNo ?? "",
                  state:
                    defaultValues.listAddress?.[0]?.state ||
                    allAddress?.[0]?.state ||
                    "",
                  city:
                    defaultValues.listAddress[0]?.city ||
                    allAddress?.[0]?.city ||
                    "",
                  zipcode:
                    defaultValues.listAddress[0]?.zipcode ||
                    allAddress?.[0]?.zipcode ||
                    "",
                  zipcodeId:
                    defaultValues.listAddress[0]?.zipcodeId ||
                    allAddress?.[0]?.zipcodeId ||
                    "",
                  //locality: defaultValues.listAddress[0]?.locality ?? "",
                  locality:
                    defaultValues.listAddress[0]?.locality ||
                    allAddress?.[0]?.locality ||
                    "",
                  landmark: defaultValues.listAddress[0]?.landmark ?? "",
                  mobile_no1: defaultValues.listAddress[0]?.mobile_no1 ?? "",
                  mobile_no2: "",
                  email: "",
                  landLine1: "",
                  landLine2: "",
                  fax: "",
                  phone1: "",
                  phone2: "",
                  occupancyStatus: allAddress?.[0]?.occupancyStatus ?? "",
                  occupancyMm: "1",
                  occupancyYr: "1",
                  ext1: "",
                  ext2: "",
                  marketvalue: "",
                  currentareaYr: "",
                  gstinno: "",
                  oldaddress: "",
                  bussinessestbyr: "1950",
                  std1: "11",
                  std2: "",
                },
                {
                  destinationAddress:
                    defaultValues.listAddress[1]?.destinationAddress ?? "",
                  mailingAddress:
                    defaultValues.listAddress[1]?.mailingAddress ?? "",
                  addressType: "1000000002",
                  address: defaultValues.listAddress[1]?.address ?? "",
                  flatNo: defaultValues.listAddress[1]?.flatNo ?? "",
                  addressId: defaultValues.listAddress[1]?.addressId ?? "",
                  officeaddress: defaultValues.listAddress[1]?.address ?? "",
                  company_name: "",
                  floorNo: defaultValues.listAddress[1]?.floorNo ?? "",
                  state:
                    defaultValues.listAddress?.[1]?.state ||
                    allAddress?.[1]?.state ||
                    "",
                  city:
                    defaultValues.listAddress?.[1]?.city ||
                    allAddress?.[1]?.city ||
                    "",
                  zipcode:
                    defaultValues.listAddress?.[1]?.zipcode ||
                    allAddress?.[1]?.zipcode ||
                    "",
                  zipcodeId:
                    defaultValues.listAddress[1]?.zipcodeId ||
                    allAddress?.[1]?.zipcodeId ||
                    "",

                  //locality: defaultValues.listAddress[1]?.locality ?? "",
                  locality:
                    defaultValues.listAddress[1]?.locality ||
                    allAddress?.[1]?.locality ||
                    "",
                  landmark: defaultValues.listAddress[1]?.landmark ?? "",
                  mobile_no1: defaultValues.listAddress[1]?.mobile_no1 ?? "",
                  mobile_no2: "",
                  email: "",
                  landLine1: "",
                  landLine2: "",
                  fax: "",
                  phone1: "",
                  phone2: "",
                  occupancyStatus: allAddress?.[1]?.occupancyStatus ?? "",
                  occupancyMm: "1",
                  occupancyYr: "1",
                  ext1: "",
                  ext2: "",
                  marketvalue: "100000",
                  currentareaYr: "",
                  gstinno: "",
                  oldaddress: "1",
                  bussinessestbyr: "1950",
                  std1: "11",
                  std2: "22",
                },
                {
                  destinationAddress:
                    defaultValues.listAddress[2]?.destinationAddress ?? "",
                  mailingAddress:
                    defaultValues.listAddress[2]?.mailingAddress ?? "",
                  addressType: "1000000003",
                  address: defaultValues.listAddress[2]?.address ?? "",
                  flatNo: defaultValues.listAddress[2]?.flatNo ?? "",
                  addressId: defaultValues.listAddress[2]?.addressId ?? "",
                  officeaddress: defaultValues.listAddress[2]?.address ?? "",
                  company_name:
                    defaultValues.listAddress[2]?.company_name ?? "",
                  floorNo: defaultValues.listAddress[2]?.floorNo ?? "",
                  state:
                    defaultValues.listAddress?.[2]?.state ||
                    allAddress?.[2]?.state ||
                    "",
                  city:
                    defaultValues.listAddress?.[2]?.city ||
                    allAddress?.[2]?.city ||
                    "",
                  zipcode:
                    defaultValues.listAddress?.[2]?.zipcode ||
                    allAddress?.[2]?.zipcode ||
                    "",
                  zipcodeId:
                    defaultValues.listAddress[2]?.zipcodeId ||
                    allAddress?.[2]?.zipcodeId ||
                    "",
                  //locality: defaultValues.listAddress[2]?.locality ?? "",
                  locality:
                    defaultValues.listAddress[2]?.locality ||
                    allAddress?.[2]?.locality ||
                    "",
                  landmark: defaultValues.listAddress[2]?.landmark ?? "",
                  mobile_no1: defaultValues.listAddress[2]?.mobile_no1 ?? "",
                  mobile_no2: "",
                  email: "",
                  landLine1: "",
                  landLine2: "",
                  fax: "",
                  phone1: "",
                  phone2: "",
                  occupancyStatus: allAddress?.[2]?.occupancyStatus ?? "",
                  occupancyMm: "1",
                  occupancyYr: "1",
                  ext1: "",
                  ext2: "",
                  marketvalue: "",
                  currentareaYr: "",
                  gstinno: "",
                  oldaddress: "add",
                  bussinessestbyr: "1950",
                  std1: "11",
                  std2: "",
                },
              ],
              listProperty: [
                {
                  address:
                    defaultValues?.propertyAddress ??
                    propertyDetail?.[0]?.propertyAddress ??
                    "",
                  city: city?.value ?? "",
                  cityName: city?.label ?? "",
                  developerName: developerName?.value ?? "",
                  devloperId: devloperId?.value ?? "",
                  estimatedValue:
                    defaultValues?.estimatedValue ??
                    propertyDetail?.[0]?.estimatedValue ??
                    "",
                  landMark:
                    defaultValues?.landMark ??
                    propertyDetail?.[0]?.landMark ??
                    "",
                  occupancyStatus: occupancyStatus?.value ?? "",
                  otherDeploperName:
                    defaultValues?.otherDeploperName ??
                    propertyDetail?.[0]?.otherDeploperName ??
                    "",
                  otherProjectName:
                    defaultValues?.otherProjectName ??
                    propertyDetail?.[0]?.otherProjectName ??
                    "",
                  projectId: projectId?.value ?? "",
                  projectName: projectId?.label ?? "",
                  // propertyId: "active",
                  propertyId: propertyDetail?.[0]?.propertyId ?? "active",
                  propStatus: propStatus?.value
                    ? propStatus.value.toString()
                    : "",
                  propTypeId: propTypeId?.value
                    ? propTypeId?.value.toString()
                    : "",
                  remarks:
                    defaultValues?.remarks ??
                    propertyDetail?.[0]?.remarks ??
                    "",
                  state: state?.value ?? "",
                  updatedBy: "",
                  zipcode: zipcode?.value ?? "",
                },
              ],
              listMobile: tempMobileArray,
              listEmail: tempEmailArray,
              // keyContacts: mykeycontactarray,
              keyContacts: mykeycontactarray || [],
            },
          },
        },

        {
          onSuccess: (data: any) => {
            if (data?.statusInfo?.statusCode === "200") {
              toastSuccess("Customer Details have been saved");
              // reset({});
              // navigate("/worklist");
              refetch();
              setIsSaving(false);
              setShowValidation(false);
              setIsShowValComp(false);
              setSaveCount(prevCount => prevCount + 1);
            } else {
              toastFail("Customer failed successfully");
              setIsSaving(false);
              setSaveCount(prevCount => prevCount + 1);
            }
          },
        }
      );
    } catch (error) {
      toastFail("Something went wrong");
      setIsSaving(false);
      throw new Error(`An Error occured ${error}`);
    }
  };

  useEffect(() => {
    setValue("address", allAddress);
  }, [allAddress]);

  const isConvertedToCustomer =
    sessionStorage.getItem("isConverted") === "true";

  useEffect(() => {
    if (isConvertedToCustomer) updateHideValidationComponent(true);
    else updateHideValidationComponent(false);
  }, [isConvertedToCustomer]);

  useEffect(() => {
    methods.trigger("address");
  }, [allAddress]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (saveCount > 0) {
        setIsShowValComp(true);
      }
    }, 1000);
    return () => clearTimeout(timer); // cleanup if deps change or unmount
  }, [saveCount]);

  useEffect(() => {
    const subscription = watch(() => {
      if (isShowValComp) {
        setShowValidation(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDirty, watch, defaultValues]);

  return (
    <form>
      <FormProvider {...methods}>
        <PersonalDetail
          errors={errors}
          defaultValues={defaultValues}
          control={control}
          setValue={setValue}
          customerDetail={CustomerDetail}
          isConvertedToCustomer={isConvertedToCustomer}
        />
        <Box mt={7} allowToggle="true" w="100vw" maxW="100%" mx="auto" position={{ base: "relative" }} ml="auto" px="auto">
        {/* <Box
          mt={7}
          allowToggle="true"
          width="100vw"
          w={{ base: "100vw", md: "100%" }}
          maxW="100vw"
          position={{ base: "relative", md: "static" }}
          left={{ base: "50%", md: "0" }}
          ml={{ base: "-50vw", md: "0" }}
          px={{ base: 4, md: 8 }}
        > */}
          <PhoneAndEmail
            id="emailMobile"
            // activeLink={activeLink}
            // allMasterKey={allMastersData}
            mobile={[]}
            email={[]}
            setMobileArray={setMobileArray} /// pi ka data set krwa na
            setEmailArray={setEmailArray}
            mobileArray={mobileArray}
            emailArray={emailArray}
            checkNewLoanOrApplicant="newLoan"
            setClearMobileValue={setClearMobileValue}
            // isNewSelected={isNewSelected}
            setResetMobileValidate={setResetMobileValidate}
            setDefaultMobileChangeFlag={setDefaultMobileChangeFlag}
            customerDetail={CustomerDetail}
          />
        </Box>
        <Divider sx={dividerStyling} mt={"40px"} />
        <LeadDetail
          errors={errors}
          defaultValues={defaultValues}
          control={control}
          setValue={setValue}
          isConvertedToCustomer={isConvertedToCustomer}
        />

        <CustomerAddress
          allAddress={allAddress}
          setAllAddress={setAllAddress}
          customerDetail={CustomerDetail}
          isConvertedToCustomer={isConvertedToCustomer}
          onReset={handleAddressReset}
        />

        {/* <KeyContactsTable
          register={register}
          control={control}
          errors={errors}
          touched={touchedFields}
          defaultValues={defaultValues}
          setValue={setValue}
          keyContactData={keyContactData}
          contactType={contactType}
          setContactType={setContactType}
        /> */}

        <PropertyDetail
          errors={errors}
          defaultValues={defaultValues}
          control={control}
          setValue={setValue}
          propertyDetail={propertyDetail}
          setPropertyDetail={setPropertyDetail}
          developerType={developerType}
          propertCollateralDetails={propertCollateralDetails}
          isConvertedToCustomer={isConvertedToCustomer}
          saveCount={saveCount}
        />
        {/* <ValidationComponent
          isSubmitting={isCustomerSave}
          buttonClickStatus={buttonClickStatus}
          setButtonClickStatus={setButtonClickStatus}
          onClick={handleSubmit(handleCustomerDetails)}
          onInputNavigate={(fieldName: string) => {
            ref.current[fieldName]?.focus();
            setErrorNavigateId(fieldName);
            setNavigateFocus(fieldName);
          }}
          pathName={pathName}
          initialValues={CustomerDetail?.responseData?.customerDetail}
          onReset={handleAddressReset}
        /> */}
        {showValidation && (
          <ValidationComponent
            isSubmitting={isCustomerSave}
            buttonClickStatus={buttonClickStatus}
            setButtonClickStatus={setButtonClickStatus}
            onClick={handleSubmit(handleCustomerDetails)}
            onInputNavigate={(fieldName: string) => {
              ref.current[fieldName]?.focus();
              setErrorNavigateId(fieldName);
              setNavigateFocus(fieldName);
            }}
            pathName={pathName}
            initialValues={CustomerDetail?.responseData?.customerDetail}
            onReset={handleAddressReset}
          />
        )}
      </FormProvider>
    </form>
  );
};

export default Index;
