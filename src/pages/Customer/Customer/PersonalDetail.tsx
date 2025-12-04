import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import SelectComponent from "@mifin/components/SelectComponent";
import TextInput from "@mifin/components/Input";
import DateRange from "@mifin/components/Date";
import { Controller } from "react-hook-form";
import { FC, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@mifin/redux/hooks";
import { formatdate } from "@mifin/utils/format-date";
import { useTranslation } from "react-i18next";
import { IPersonalDetailProps } from "@mifin/Interface/Customer";
import {
  dividerStyling,
  formLabelStyling,
  personalDetailsHeadingStyling,
} from "@mifin/theme/style";
import PersonalDetailCustomerDetailGrid from "@mifin/components/PersonalDetailCustomerDetailGrid";
import { useFormContext } from "react-hook-form";
import {
  useGetCluster,
  useGetTypeOfBusiness,
} from "@mifin/service/getAllNewMasters/getAllNewMasters";

const PersonalDetail: FC<IPersonalDetailProps> = props => {
  const {
    defaultValues,
    control,
    setValue,
    customerDetail,
    isConvertedToCustomer,
  } = props;
  const {
    trigger,
    formState: { isDirty },
    watch,
  } = useFormContext();
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const [age, setAge] = useState<any>(null);
  const [doi, setDoi] = useState<any>(null);
  const constitutionList = mastersData?.constitutionList;
  const [startDate, setStartDate] = useState<any>(null);
  const { t } = useTranslation();
  const customerDetailSalutation =
    customerDetail?.responseData?.customerDetail?.title;
  const entityType: any = allMastersData?.entityTypeMaster?.map(
    (el: IPersonalDetailProps) => {
      const entity = {
        label: el.displayName,
        value: el.custEntityTypeId,
      };
      if (defaultValues?.custEntityTypeId === el.custEntityTypeId) {
        setValue("custEntityTypeId", entity);
      }
      return entity;
    }
  );
  const constitutionArray =
    defaultValues?.custEntityTypeId?.value == "1000000001"
      ? constitutionList[0]?.map((el: IPersonalDetailProps) => {
          if (defaultValues?.constitution == el.Occupationid) {
            setValue("constitution", {
              label: el?.Occupationname,
              value: el?.Occupationid,
            });
          }
          return {
            label: el?.Occupationname,
            value: el?.Occupationid,
          };
        })
      : defaultValues?.custEntityTypeId?.value == "1000000002"
      ? constitutionList[1]?.map((el: IPersonalDetailProps) => {
          if (defaultValues?.constitution == el.Occupationid) {
            setValue("constitution", {
              label: el?.Occupationname,
              value: el?.Occupationid,
            });
          }
          return {
            label: el?.Occupationname,
            value: el?.Occupationid,
          };
        })
      : [];

  const salutation = allMastersData?.titleMaster?.map(
    (el: IPersonalDetailProps) => {
      const status = {
        label: el?.titleName,
        value: el?.titleId,
      };

      if (defaultValues?.title === el?.titleId) {
      setValue("title", status);
    }

      return status;
    }
  );
  const entityType1 = defaultValues?.custEntityTypeId?.value === "1000000002";
  const { data: typeOfBusinessKey } = useGetTypeOfBusiness(
    entityType1
      ? watch("industryForNI")?.value ?? watch("industryForNI")
      : watch("industryId")?.value ?? watch("industryId")
  );
  const { data: typeOfClusterKey } = useGetCluster(
    entityType1
      ? watch("typeOfBusinessForNI")?.value ?? watch("typeOfBusinessForNI")
      : watch("typeOfBusiness")?.value ?? watch("typeOfBusiness")
  );
  //console.log(typeOfBusinessKey, "typeOfBusinessKey", watch("industryId"));

  // useEffect(() => {
  //   if (salutation && customerDetailSalutation) {
  //     const selectedSalutation =
  //       salutation.find(el => el.value == customerDetailSalutation) || null;
  //
  //     if (selectedSalutation?.value !== watch("salutation")?.value) {
  //       setValue("salutation", selectedSalutation);
  //     }
  //   }
  // }, [salutation, customerDetailSalutation, setValue, watch]);

  const industryMaster = allMastersData?.industryMaster?.map(
    (el: IPersonalDetailProps) => {
      const industry = {
        label: el?.displayName,
        value: el?.industryId,
      };

      if (defaultValues?.industryForNI === el?.industryId) {
        setValue("industryForNI", industry);
      }
      if (defaultValues?.industryId === el?.industryId) {
        setValue("industryId", industry);
      }
      return industry;
    }
  );

  // const typeOfBusinessMaster = useMemo(
  //   () =>
  //     typeOfBusinessKey?.TYPEOFBUSINESSLIST?.map(el => ({
  //       label: el?.typeOfBusiness,
  //       value: el?.id,
  //     })) || [],
  //   [typeOfBusinessKey?.TYPEOFBUSINESSLIST]
  // );

  // console.log(watch("typeOfBusiness"),"typeOfBusiness",allMastersData?.typeOfBusinessMaster)
  // const clusterMaster = useMemo(
  //   () =>
  //     allMastersData?.clusterMaster?.map(el => ({
  //       label: el?.clusterName,
  //       value: el?.clusterId,
  //     })) || [],
  //   [allMastersData?.clusterMaster]
  // );
  const typeOfBusinessMaster = useMemo(() => {
    return typeOfBusinessKey?.TYPEOFBUSINESSLIST?.map((ele: any, i: number) => {
      return { value: ele?.masterId, label: ele?.masterName };
    });
  }, [typeOfBusinessKey?.TYPEOFBUSINESSLIST]);

  const clusterMaster = useMemo(() => {
    return typeOfClusterKey?.CLUSTER?.map((ele: any, i: number) => {
      return { value: ele.masterId, label: ele.masterName };
    });
  }, [typeOfClusterKey?.CLUSTER]);

  useEffect(() => {
    if (!defaultValues) return;

    const isEntityTypeNI =
      defaultValues?.custEntityTypeId?.value === "1000000002";
    const isEntityTypeIndividual =
      defaultValues?.custEntityTypeId?.value === "1000000001";

    const typeOfBusinessKey = isEntityTypeNI
      ? "typeOfBusinessForNI"
      : isEntityTypeIndividual
      ? "typeOfBusiness"
      : null;
    const clusterKey = isEntityTypeNI
      ? "clusterForNI"
      : isEntityTypeIndividual
      ? "cluster"
      : null;
    if (typeOfBusinessKey && typeOfBusinessMaster?.length) {
      const selectedTypeOfBusiness = typeOfBusinessMaster.find(
        el => el.value === defaultValues?.[typeOfBusinessKey]
      );
      if (selectedTypeOfBusiness) {
        setValue(typeOfBusinessKey, selectedTypeOfBusiness, {
          shouldValidate: true,
        });
      }
    }

    if (clusterKey && clusterMaster?.length) {
      const selectedCluster = clusterMaster.find(
        el => el.value === defaultValues?.[clusterKey]
      );

      if (selectedCluster) {
        setValue(clusterKey, selectedCluster, {
          shouldValidate: true,
        });
      }
    }
  }, [defaultValues, typeOfBusinessMaster, clusterMaster, setValue]);

  const maritalStatus = allMastersData?.maritalStatus?.map(
    (el: IPersonalDetailProps) => {
      const status = {
        label: el?.maritalStatusname,
        value: el?.maritalStatusid,
      };

      if (defaultValues?.maritalStatus === el?.maritalStatusid) {
        setValue("maritalStatus", status);
      }

      return status;
    }
  );
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const gender = allMastersData?.gender?.map((el: IPersonalDetailProps) => {
    const genderObj = {
      label: el?.genderName,
      value: el?.genderId,
    };

    if (defaultValues?.gender === el?.genderId) {
      setValue("gender", genderObj);
    }

    return genderObj;
  });

  const nationality = allMastersData?.nationality?.map(
    (el: IPersonalDetailProps) => {
      const nation = {
        label: el?.nationName,
        value: el?.nationalityId,
      };

      if (defaultValues?.nationality === el?.nationalityId) {
        setValue("nationality", nation);
      }

      return nation;
    }
  );
  // useEffect(() => {
  //   if (defaultValues.dob || defaultValues.incorporationDate) {
  //     const startingDate = new Date(defaultValues.dob);
  //     const dateOfInco = new Date(defaultValues.incorporationDate);
  //     const currentDate = new Date();
  //     const currentYear = currentDate.getFullYear();
  //     const particularYear = startingDate.getFullYear();
  //     setAge(currentYear - particularYear);
  //     setStartDate(startingDate);
  //     setDoi(dateOfInco);
  //   } else {
  //     setStartDate(null);
  //     setAge(null);
  //     setDoi(null);
  //     setValue("age", "", { shouldDirty: true });
  //   }
  // }, [defaultValues, setValue]);
  useEffect(() => {
    if (defaultValues?.dob || defaultValues?.incorporationDate) {
      const startingDate = defaultValues?.dob ? new Date(defaultValues.dob) : null;
      const dateOfInco = defaultValues?.incorporationDate ? new Date(defaultValues.incorporationDate) : null;
      
      if (startingDate) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const particularYear = startingDate.getFullYear();
        setAge(currentYear - particularYear);
        setStartDate(startingDate);
      }
      
      if (dateOfInco) {
        setDoi(dateOfInco);
      }
    } else {
      setStartDate(null);
      setAge(null);
      setDoi(null);
      setValue("age", "", { shouldDirty: true });
    }
  }, [defaultValues?.dob, defaultValues?.incorporationDate, setValue]);

  const handleDateChange = (date: any) => {
    // setStartDate(date);
    // const currentDate = new Date();
    // const currentYear = currentDate.getFullYear();
    // const particularYear = date.getFullYear();
    // setAge(currentYear - particularYear);
    // const updatedDate = formatdate(date);
    // setValue("dob", updatedDate, { shouldDirty: true });
    // trigger("dob");
    // setValue("incorporationDate", updatedDate, { shouldDirty: true });
    // trigger("incorporationDate");

    if (date) {
      setStartDate(date);
      setDoi(date);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const particularYear = date.getFullYear();
      const calculatedAge = currentYear - particularYear;
      setAge(calculatedAge);
      const updatedDate = formatdate(date);
      setValue("dob", updatedDate, { shouldDirty: true });
      setValue("age", calculatedAge.toString(), { shouldDirty: true });
      if(defaultValues?.custEntityTypeId?.value === "1000000002"){
        setValue("incorporationDate", updatedDate, { shouldDirty: true });
      }
    } else {
      setStartDate(null);
      setAge(null);
      setDoi(null);
      // setValue("dob", "", { shouldDirty: true });
      setValue("age", "", { shouldDirty: true });
      setValue("incorporationDate", "", { shouldDirty: true });
    }
    trigger();
  };
  const [rawAadhaar, setRawAadhaar] = useState(""); // Store raw Aadhaar number
  const [aadhaarFormatted, setAadhaarFormatted] = useState(""); // Store masked Aadhaar
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  // Function to format Aadhaar number
  const formatAadhaarNumber = (value: string) => {
    const cleanedValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    const limitedValue = cleanedValue.slice(0, 12); // Limit to 12 digits

    if (limitedValue.length === 12) {
      return "XXXXXXXX" + limitedValue.slice(8);
    }
    return limitedValue;
  };

  const handleAadhaarChange = (e: any) => {
    const value = e.target.value;

    if (value.length <= 12) {
      setAadhaarFormatted(value); // Store raw value
      setRawAadhaar(value);
      setValue("adhaarNumber", value); // Update form state
      setValue("adhaarNumber", value, { shouldDirty: true });
    }
    trigger();
  };
  // Handle focus event
  const handleFocus = () => {
    setIsEditing(true); // User starts editing
    // setAadhaarFormatted(rawAadhaar); // Show raw value
  };

  // Handle blur event
  const handleBlur = () => {
    setIsEditing(false); // User finished editing
    const isNumericValueOnly = /^\d+$/.test(rawAadhaar);

    if (rawAadhaar && isNumericValueOnly) {
      setAadhaarFormatted(formatAadhaarNumber(rawAadhaar)); // Mask the Aadhaar number
    } else if (rawAadhaar && !isNumericValueOnly) {
      setAadhaarFormatted("");
      setValue("adhaarNumber", "", { shouldDirty: true });
      // setValue("adhaarNumber", "");
    } else {
      setValue("adhaarNumber", ""); // Clear form value if empty
    }
    trigger();
  };
  // Handle API data
  useEffect(() => {
    if (!isEditing) {
      if (defaultValues?.adhaarNumber) {
        const maskedAadhaar = formatAadhaarNumber(defaultValues.adhaarNumber);
        setRawAadhaar(defaultValues.adhaarNumber);
        setAadhaarFormatted(maskedAadhaar);
        setValue("adhaarNumber", defaultValues.adhaarNumber, {
          shouldDirty: true,
        });
      } else {
        setRawAadhaar("");
        setAadhaarFormatted("");
        setValue("adhaarNumber", "", { shouldDirty: true });
      }

      trigger();
    }
  }, [defaultValues?.adhaarNumber, setValue, isEditing]);
 
  return (
    <>
      <Box mx={-4}>
        <Heading
          as={"h3"}
          sx={personalDetailsHeadingStyling}
          mb={{ base: 0, md: -5 }}
          color={"#3E4954"}
        >
          {t("customer.heading.personalDetails")}
        </Heading>

        <PersonalDetailCustomerDetailGrid>
          <FormControl isRequired>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.personalDetails.entityType")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="custEntityTypeId"
              options={entityType}
              placeholder={t("common.select")}
              isDisabled={true}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.personalDetails.constitution")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="constitution"
              options={constitutionArray}
              placeholder={t("common.select")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          {defaultValues?.custEntityTypeId?.value === "1000000002" && (
            <>
              <FormControl isRequired>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("newLead.personalDetails.companyName")}
                </FormLabel>
                <TextInput
                  name="companyName"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("newLead.personalDetails.authSignatory")}
                </FormLabel>
                <TextInput
                  name="authSignatoryFName"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("newLead.personalDetails.authSignatoryMiddleName")}
                </FormLabel>
                <TextInput
                  name="authSignatoryMName"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("newLead.personalDetails.authSignatoryMidLabel")}
                </FormLabel>
                <TextInput
                  name="authSignatoryLName"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              {/* <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("newLead.personalDetails.dateofIncorporation")}
                </FormLabel>
                <Controller
                  control={control}
                  name="incorporationDate"
                  render={({ field: { onChange, value } }) => {
                    return (
                      <DateRange
                        date={value}
                        setDate={onChange}
                        placeholder={t("common.select")}
                        dateFormatCalendar="dd-MM-yyyy"
                        disabled={isConvertedToCustomer}
                      />
                    );
                  }}
                />
              </FormControl> */}

              <FormControl>
                <FormLabel sx={formLabelStyling}>
                  {t("newLead.personalDetails.dateofIncorporation")}
                </FormLabel>
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
                    id="incorporationDate"
                    date={doi}
                    setDate={handleDateChange}
                    placeholder={t("common.date")}
                    autoComplete="off"
                    showPopperArrow={false}
                    preventOverflow={true}
                    showYear
                    showMonth
                    disabled={isConvertedToCustomer}
                  />
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("newLead.personalDetails.industry")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="industryForNI"
                  options={industryMaster}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("newLead.personalDetails.typeOfBusiness")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="typeOfBusinessForNI"
                  options={typeOfBusinessMaster}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("newLead.personalDetails.cluster")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="clusterForNI"
                  options={clusterMaster}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>
            </>
          )}
          {defaultValues?.custEntityTypeId?.value === "1000000001" && (
            <>
              <FormControl isRequired>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.salutation")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="title"
                  options={salutation}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.firstName")}
                </FormLabel>
                <TextInput
                  regex="alphabet"
                  name="fName"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.middleName")}
                </FormLabel>
                <TextInput
                  regex="alphabet"
                  name="mName"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.lastName")}
                </FormLabel>
                <TextInput
                  regex="alphabet"
                  name="lName"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.maritalStatus")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="maritalStatus"
                  options={maritalStatus}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.dateOfBirth")}
                </FormLabel>
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
                    // name="dob"
                    id="dob"
                    date={startDate}
                    setDate={handleDateChange}
                    placeholder={t("common.date")}
                    autoComplete="off"
                    showPopperArrow={false}
                    preventOverflow={true}
                    showYear
                    showMonth
                    disabled={isConvertedToCustomer}
                  />
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.age")}
                </FormLabel>
                <TextInput
                  regex="numeric"
                  name="age"
                  type="number"
                  control={control}
                  placeholder={t("common.enter")}
                  value={age || ""}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.gender")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="gender"
                  options={gender}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.nationality")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="nationality"
                  options={nationality}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.dependents")}
                </FormLabel>
                <TextInput
                  regex="numeric"
                  name="noOfDependents"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.panNo")}
                </FormLabel>
                <TextInput
                  name="pan"
                  control={control}
                  type="text"
                  placeholder={t("common.enter")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.adhaarNo")}
                </FormLabel>
                <TextInput
                  // regex="numeric"
                  name="adhaarNumber"
                  control={control}
                  type="text"
                  placeholder="Enter"
                  value={aadhaarFormatted} // Show raw value during editing, masked otherwise
                  onChange={handleAadhaarChange} // Handle input changes
                  onFocus={handleFocus} // Unmask value on focus
                  onBlur={handleBlur} // Mask value on blur
                  maxLength={12}
                  autoComplete="off"
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              {/* <FormControl isRequired> */}
              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.industry")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="industryId"
                  onCustomChange={() => {
                    // clear nature of business and cluster
                    setValue("typeOfBusiness", null, {
                      shouldValidate: true,
                    });
                    setValue("cluster", null, {
                      shouldValidate: true,
                    });
                  }}
                  options={industryMaster}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              {/* <FormControl isRequired> */}
              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.typeOfBusiness")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="typeOfBusiness"
                  // options={typeOfBusinessMaster}
                  onCustomChange={() => {
                    // clear nature of business and cluster
                    setValue("cluster", null, {
                      shouldValidate: true,
                    });
                  }}
                  options={typeOfBusinessMaster || []}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  {t("customer.personalDetails.cluster")}
                </FormLabel>
                <SelectComponent
                  control={control}
                  name="cluster"
                  options={clusterMaster || []}
                  placeholder={t("common.select")}
                  isDisabled={isConvertedToCustomer}
                />
              </FormControl>
            </>
          )}
        </PersonalDetailCustomerDetailGrid>
      </Box>
      {!isMobile && <Divider sx={dividerStyling} />}
    </>
  );
};
export default PersonalDetail;
