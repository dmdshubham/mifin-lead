import { Box, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import { getDependentMaster } from "@mifin/redux/service/getDependentMaster/api";
import SelectComponent from "@mifin/components/SelectComponent";
import TextInput from "@mifin/components/Input";
import { ILeadDetailsProps } from "@mifin/Interface/NewLead";
import { useTranslation } from "react-i18next";
import { headingStyling, formLabelStyling } from "@mifin/theme/style";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { useFormContext } from "react-hook-form";
import GridLayout from "@mifin/components/GridLayout";
import { userInfo } from "@mifin/utils/getLoginUserInfo";
import { useCurrencyToggle } from "@mifin/store/useCurrencyToggle";
import { removeCommas } from "@mifin/utils/removeCommas";

const LeadDetails: FC<ILeadDetailsProps> = () => {
  const { control, watch, setValue, trigger, setError, clearErrors } =
    useFormContext();
  const dispatch = useAppDispatch();
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const allocateDetails = mastersData?.allocateToList;
  const defaultValues = watch();
  const dependentApi: any = useAppSelector(
    state => state.getDependentMaster.data
  );
  const { t } = useTranslation();

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
    const getWorkListLeadDetails = () => {
      // call api only if the queueId is selected
      if (defaultValues?.queueId?.value) {
        dispatch(getDependentMaster(DEPENDENT_MASTERS));
      }
      // Reset scheme field when queueId changes
      setValue("scheme", "");
    };
    getWorkListLeadDetails();
  }, [defaultValues.queueId]);

  // const branchMaster = allMastersData?.branchMaster?.map(
  //   (el: ILeadDetailsProps) => {
  //     return {
  //       label: el?.geoName,
  //       value: el?.geoId,
  //     };
  //   }
  // );
  const branchMaster = useMemo(
    () =>
      allMastersData?.branchMaster?.map((el: ILeadDetailsProps) => ({
        label: el?.geoName,
        value: el?.geoId,
      })) || [],
    [allMastersData?.branchMaster]
  );

  const productMaster = allMastersData?.productMaster?.map(
    (el: ILeadDetailsProps) => {
      return {
        label: el?.prodName,
        value: el?.prodId,
      };
    }
  );

  // const uniqueData: { label: string; value: string }[] | undefined =
  //   allMastersData &&
  //   allMastersData.purposeOfLoanMaster &&
  //   getUniqueCombinations(allMastersData.purposeOfLoanMaster);
  const PurposeOfLoanMater2 = allMastersData?.purposeOfLoanMaster?.map(
    (el: ILeadDetailsProps) => {
      return {
        label: el?.purposeOfLoanName,
        value: el?.purposeOfLoanId,
      };
    }
  );

  const subQueueMaster = allMastersData?.subQueueMaster?.map(
    (el: ILeadDetailsProps) => {
      return {
        label: el?.subQueue,
        value: el?.subQueueId,
      };
    }
  );

  const sourceMaster = allMastersData?.sourceMaster?.map(
    (el: ILeadDetailsProps) => {
      return {
        label: el?.sourceName,
        value: el?.caseSourceId,
      };
    }
  );

  const campaignMaster = allMastersData?.campaignMaster?.map(
    (el: ILeadDetailsProps) => {
      return {
        label: el?.campaignName,
        value: el?.campaignId,
      };
    }
  );

  const allocateDetailsMaster = allocateDetails?.map(
    (el: ILeadDetailsProps) => {
      return {
        label: el?.userName,
        value: el?.userId,
      };
    }
  );

  const dependentApiMaster = dependentApi?.scheme?.map(
    (el: ILeadDetailsProps) => {
      return {
        label: el?.value,
        value: el?.id,
      };
    }
  );
  useEffect(() => {
    setValue("referenceName", userInfo());
    setValue("referenceNumber", userInfo());
  }, [userInfo(), mastersData]);
  useEffect(() => {
    if (branchMaster?.length === 1) {
      setValue("branch", branchMaster[0]);
    } else if (branchMaster?.length === 0) {
      setValue("branch", null);
    }
  }, [branchMaster, setValue]);
  const [maxminLoanErrorFlagMsg, setMaxminLoanErrorFlagMsg] = useState("");
  const [maxminLoanSchemeData, setmaxminLoanSchemeData] = useState({
    minScheme: 1000,
    maxScheme: 100000000,
  });

  const [affordableEmi, setAffordableEmi] = useState("");
  const [emiError, setEmiError] = useState("");

  const { isUsCurrency } = useCurrencyToggle();

  const [loanAmount, setLoanAmount] = useState("");

  const removeCommas = (val: string) => {
    return val.replace(/,/g, "");
  };

  // const handleLoanAmountFocus = (e: any) => {
  //   const afterComma = removeCommas(loanAmount);
  //   setLoanAmount(afterComma);
  //   if (!afterComma) {
  //     trigger("loanAmount");
  //   }
  // };
  const handleLoanAmountFocus = (e: any) => {
    const afterComma = removeCommas(loanAmount);
    setLoanAmount(afterComma);
    if (!afterComma) trigger("loanAmount");
  };
  // const convertLoanAmountToComma = (e: any) => {
  //   const value = e.target.value;
  //   const inputValue = value ? parseFloat(removeCommas(value)) : NaN;

  //   if (!isNaN(inputValue)) {
  //     const formattedValue = isUsCurrency
  //       ? inputValue.toLocaleString("en-US")
  //       : inputValue.toLocaleString("en-IN");
  //     setLoanAmount(formattedValue);
  //     // setValue("loanAmount", formattedValue);
  //     clearErrors("loanAmount");
  //     trigger("loanAmount");
  //   } else {
  //     setLoanAmount("");
  //     setValue("loanAmount", "");
  //     trigger("loanAmount");
  //   }
  // };
  const convertLoanAmountToComma = (e: any) => {
    const value = e.target.value;
    const numericValue = removeCommas(value);

    if (numericValue) {
      const inputValue = parseFloat(numericValue);
      const formattedValue = isUsCurrency
        ? inputValue.toLocaleString("en-US")
        : inputValue.toLocaleString("en-IN");

      setLoanAmount(formattedValue);
      setValue("loanAmount", formattedValue, { shouldValidate: true });
      clearErrors("loanAmount");
    } else {
      setLoanAmount("");
      setValue("loanAmount", "", { shouldValidate: true });
    }
  };

  // const handleLoanAmountChange = (e: any) => {
  //   const value = e.target.value;
  //   const re = /^[0-9\b]+$/;

  //   if (re.test(value) && value.length <= 13) {
  //     setLoanAmount(value);
  //     // Clear error only when we have sufficient input
  //     if (value.length > 0) {
  //       clearErrors("loanAmount");
  //     }
  //   } else if (value?.length === 0) {
  //     setLoanAmount("");
  //     trigger("loanAmount");
  //   }
  // };
  useEffect(() => {
    const subscription = watch(values => {
      if (values.loanAmount !== undefined && values.loanAmount !== loanAmount) {
        setLoanAmount(values.loanAmount || "");
      }
      if (
        values.affordableEmi !== undefined &&
        values.affordableEmi !== affordableEmi
      ) {
        setAffordableEmi(values.affordableEmi || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, loanAmount, affordableEmi]);
  const handleLoanAmountChange = (e: any) => {
    const value = e.target.value;
    const re = /^[0-9\b]+$/;

    if (re.test(value) && value.length <= 13) {
      setLoanAmount(value);
      if (value.length > 0) clearErrors("loanAmount");
    } else if (value?.length === 0) {
      setLoanAmount("");
    }
  };

  const handleEmiClick = (e: any) => {
    const afterComma = removeCommas(affordableEmi);
    setAffordableEmi(afterComma);
  };

  const convertEmiToComma = (e: any) => {
    const value = e.target.value;
    const inputValue = value ? parseFloat(value.replace(/,/g, "")) : NaN;
    if (!isNaN(inputValue)) {
      if (isUsCurrency) {
        setValue("affordableEmi", inputValue.toLocaleString("en-US"));
        setAffordableEmi(inputValue.toLocaleString("en-US"));
      } else {
        setAffordableEmi(inputValue.toLocaleString("en-IN"));
        setValue("affordableEmi", inputValue.toLocaleString("en-IN"));
      }
    } else {
      setAffordableEmi("");
      setValue("affordableEmi", "");
    }
  };

  const handleEmiChange = (e: any) => {
    setEmiError("");
    const value = e.target.value;
    const re = /^[0-9\b]+$/;
    const newValue = re.test(value);
    if (newValue) {
      setAffordableEmi(value);
    } else if (value?.length == 0) {
      setAffordableEmi("");
    }
  };
  return (
    <Box marginTop={{ base: "5", md: "40px" }} mx={1}>
      <Heading sx={headingStyling}>{t("newLead.heading.leadDetails")}</Heading>
      <GridLayout>
        <FormControl>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.branch")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="branch"
            options={branchMaster}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.product")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="queueId"
            options={productMaster}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.scheme")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="scheme"
            options={dependentApiMaster}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl>
          <FormLabel
            title={t("newLead.leadDetails.purposeOfLoan")}
            sx={formLabelStyling}
          >
            {t("newLead.leadDetails.purposeOfLoan")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="purposeOfLoan"
            options={PurposeOfLoanMater2}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.potential")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="subQueueId"
            options={subQueueMaster}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.source")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="source"
            options={sourceMaster}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.employeeName")}
          </FormLabel>
          <TextInput
            regex="alphabetspace"
            name="referenceName"
            control={control}
            type="text"
            isDisabled
            placeholder={t("common.enter")}
          />
        </FormControl>

        <FormControl>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.employeeCode")}
          </FormLabel>
          <TextInput
            regex="alphaNumeric"
            name="referenceNumber"
            control={control}
            type="text"
            placeholder={t("common.enter")}
            isDisabled
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.campaign")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="campaign"
            options={campaignMaster}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.allocateTo")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="allocateTo"
            options={allocateDetailsMaster}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.loanAmount")}
          </FormLabel>
          <TextInput
            // regex="numeric"
            type="text"
            name="loanAmount"
            control={control}
            maxLength={13}
            placeholder={t("common.enter")}
            // formatAsCommaSeparated
            value={loanAmount}
            onChange={handleLoanAmountChange}
            onFocus={handleLoanAmountFocus}
            onBlur={convertLoanAmountToComma}
          />
        </FormControl>

        <FormControl>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.tenure")}
          </FormLabel>
          <TextInput
            regex="numeric"
            name="tenure"
            control={control}
            type="text"
            maxLength={5}
            placeholder={t("common.enter")}
          />
        </FormControl>

        <FormControl>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.leadDetails.affordableEmi")}
          </FormLabel>
          <TextInput
            name="affordableEmi"
            control={control}
            type="text"
            // regex="numeric"
            placeholder={t("common.enter")}
            // formatAsCommaSeparated
            value={affordableEmi}
            onChange={handleEmiChange}
            onFocus={handleEmiClick}
            onBlur={convertEmiToComma}
          />
        </FormControl>
      </GridLayout>
      {/* <Divider sx={dividerStyling} /> */}
    </Box>
  );
};

export default LeadDetails;
