import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  Text,
  DrawerOverlay,
  GridItem,
  FormLabel,
  Grid,
  DrawerCloseButton,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useAppSelector } from "@mifin/redux/hooks";
import {
  IKeyContactsDrawerProps,
  ILeadDetailsProps,
} from "@mifin/Interface/NewLead";
import { useTranslation } from "react-i18next";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "@mifin/components/Input";
import SelectComponent from "@mifin/components/SelectComponent";
import { getUniqueCombinations } from "@mifin/utils/getUniqueCombinations";
import { CustomerAndProductSchema } from "@mifin/schema/CustomerAndProductSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toastFail } from "@mifin/components/Toast";
import RequiredMark from "@mifin/components/RequiredMark";
import { useCurrencyToggle } from "@mifin/store/useCurrencyToggle"; // Add this import

const formDefaultValues = {
  branchId: null,
  productId: null,
  schemeId: null,
  puposeOfLoan: null,
  loanAmount: "",
  loanTenure: "",
  EMI: "",
};

const ConvertCustomerDrawer: FC<
  IKeyContactsDrawerProps & { onAddData: (data: any) => void }
> = props => {
  const { isOpen, onClose, drawerData, setUpdatedTableData } = props;
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const { isUsCurrency } = useCurrencyToggle();

  const { t } = useTranslation();
  const [editedData, setEditedData] = useState({});

  const yupValidationSchema: any = useMemo(
    () => CustomerAndProductSchema(t),
    [t]
  );
  const dependentApi: any = useAppSelector(
    state => state.getDependentMaster.data
  );

  const methods = useForm({
    defaultValues: formDefaultValues,
    mode: "onSubmit",
    resolver: yupResolver(yupValidationSchema),
  });

  const { watch, reset, trigger, control, handleSubmit, setValue } = methods;
  const [loanAmountDisplay, setLoanAmountDisplay] = useState('');
  const [emiDisplay, setEmiDisplay] = useState('');

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    const number = parseInt(numericValue);
    return isUsCurrency 
      ? number.toLocaleString('en-US')
      : new Intl.NumberFormat('en-IN').format(number);
  };

  const removeCommas = (value) => {
    if (!value) return '';
    return value.toString().replace(/,/g, '');
  };

 
  const handleLoanAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setLoanAmountDisplay(rawValue);
    setValue('loanAmount', rawValue, { shouldValidate: true, shouldTouch: true });
    trigger('loanAmount');
  };

  const handleLoanAmountFocus = (e) => {
    const rawValue = removeCommas(loanAmountDisplay);
    setLoanAmountDisplay(rawValue);
    e.target.value = rawValue;
  };

  const handleLoanAmountBlur = (e) => {
    const value = e.target.value;
    const numericValue = removeCommas(value);
    
    if (numericValue) {
      const formatted = formatCurrency(numericValue);
      setLoanAmountDisplay(formatted);
      e.target.value = formatted;
    }
  };
  const handleEmiChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setEmiDisplay(rawValue);
    setValue('EMI', rawValue, { shouldValidate: true, shouldTouch: true });
    trigger('EMI');
  };

  const handleEmiFocus = (e) => {
    const rawValue = removeCommas(emiDisplay);
    setEmiDisplay(rawValue);
    e.target.value = rawValue;
  };

  const handleEmiBlur = (e) => {
    const value = e.target.value;
    const numericValue = removeCommas(value);
    
    if (numericValue) {
      const formatted = formatCurrency(numericValue);
      setEmiDisplay(formatted);
      e.target.value = formatted;
    }
  };

  
  useEffect(() => {
    reset(drawerData);
    trigger();
  }, [drawerData, reset, trigger]);

  useEffect(() => {
    trigger();
  }, [watch("branchId"), watch("puposeOfLoan"), trigger]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        setEditedData(prev => ({ ...prev, [name]: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  
  const fieldsToSet = ["loanAmount", "loanTenure", "EMI"];
  useEffect(() => {
    fieldsToSet.forEach((fieldName: any) => {
      const value = drawerData?.[fieldName] ?? "";
      
      if (fieldName === 'loanAmount') {
        setLoanAmountDisplay(value ? formatCurrency(value) : '');
        setValue(fieldName, removeCommas(value), { shouldValidate: true });
      } else if (fieldName === 'EMI') {
        setEmiDisplay(value ? formatCurrency(value) : '');
        setValue(fieldName, removeCommas(value), { shouldValidate: true });
      } else {
        setValue(fieldName, value);
      }
    });

    
    if (drawerData?.branchId) {
      setValue("branchId", {
        label: allMastersData?.branchMaster?.find((item: any) => {
          return item?.geoId === drawerData?.branchId;
        })?.geoName,
        value: drawerData?.branchId,
      });
    } else {
      setValue("branchId", null);
    }

    if (drawerData?.schemeId) {
      setValue("schemeId", {
        label: dependentApi?.scheme?.find((item: any) => {
          return item?.id === drawerData?.schemeId;
        })?.value,
        value: drawerData?.schemeId,
      });
    } else {
      setValue("schemeId", null);
    }

    if (drawerData?.productId) {
      setValue("productId", {
        label: allMastersData?.productMaster?.find((item: any) => {
          return item?.prodId === drawerData?.productId;
        })?.prodName,
        value: drawerData?.productId,
      });
    } else {
      setValue("productId", null);
    }

    if (drawerData?.puposeOfLoan) {
      setValue("puposeOfLoan", {
        label: allMastersData?.purposeOfLoanMaster?.find((item: any) => {
          return item?.purposeOfLoanId === drawerData?.puposeOfLoan;
        })?.purposeOfLoanName,
        value: drawerData?.puposeOfLoan,
      });
    } else {
      setValue("puposeOfLoan", null);
    }
  }, [allMastersData, drawerData, dependentApi]);

  
  const onSubmit = async (data: any) => {
    const isValid = await trigger();
    if (isValid) {
      const allFieldsUnchanged =
        drawerData?.EMI === editedData?.EMI &&
        drawerData?.loanTenure === editedData?.loanTenure &&
        drawerData?.branchId === editedData?.branchId?.value &&
        drawerData?.productId === editedData?.productId?.value &&
        drawerData?.loanAmount === editedData?.loanAmount &&
        drawerData?.puposeOfLoan === editedData?.puposeOfLoan?.value &&
        drawerData?.schemeId === editedData?.schemeId?.value;

      if (allFieldsUnchanged) {
        toastFail("Please do some changes in the data");
        return;
      }
      const combinedData = { ...data, ...editedData };
      setUpdatedTableData(combinedData);
      onClose();
    }
  };

  
  const brancMaster = allMastersData?.branchMaster?.map(
    (item: { geoId: string; geoName: string }) => {
      return {
        value: item.geoId,
        label: item.geoName,
      };
    }
  );

  const productMaster = allMastersData?.productMaster?.map(
    (el: ILeadDetailsProps) => {
      return {
        label: el?.prodName,
        value: el?.prodId,
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

  const uniqueData: { label: string; value: string }[] | undefined =
    allMastersData &&
    allMastersData.purposeOfLoanMaster &&
    getUniqueCombinations(allMastersData.purposeOfLoanMaster);

  const handleOnClose = () => {
    onClose();
  };

  const isConvertedToCustomer = sessionStorage.getItem("isConverted") === "true";

  return (
    <Fragment>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={handleOnClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Convert to Customer</DrawerHeader>
          <Divider />
          <DrawerBody>
            <form onSubmit={handleSubmit(onSubmit)} id="manualForm">
              <Grid
                as="form"
                templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
                rowGap={{ base: "-6", md: "2" }}
                mx={-1}
              >
               
                <GridItem>
                  <FormLabel color={"#000000B3"} fontSize={"14px"}>
                    {t("product.convertCustomerTable.branch")}
                    <RequiredMark />
                  </FormLabel>
                </GridItem>
                <GridItem>
                  <SelectComponent
                    name="branchId"
                    options={brancMaster}
                    hideError={false}
                    control={control}
                    isDisabled={isConvertedToCustomer}
                  />
                </GridItem>
                <GridItem>
                  <FormLabel color={"#000000B3"} fontSize={"14px"}>
                    <Text mt={4}>
                      {t("product.convertCustomerTable.product")}
                      <RequiredMark />
                    </Text>
                  </FormLabel>
                </GridItem>
                <GridItem>
                  <SelectComponent
                    options={productMaster}
                    name="productId"
                    hideError={false}
                    control={control}
                    isDisabled={isConvertedToCustomer}
                  />
                </GridItem>
                <FormLabel color={"#000000B3"} fontSize={"14px"}>
                  <Text mt={4}>
                    {t("product.convertCustomerTable.scheme")}
                    <RequiredMark />
                  </Text>
                </FormLabel>
                <GridItem>
                  <SelectComponent
                    control={control}
                    name="schemeId"
                    hideError={false}
                    options={dependentApiMaster}
                    placeholder={t("common.select")}
                    isDisabled={isConvertedToCustomer}
                  />
                </GridItem>
                <GridItem>
                  <FormLabel color={"#000000B3"} fontSize={"14px"}>
                    <Text mt={4}>
                      {t("product.convertCustomerTable.purposeOfLoan")}
                      <RequiredMark />
                    </Text>
                  </FormLabel>
                </GridItem>
                <GridItem>
                  <SelectComponent
                    name="puposeOfLoan"
                    hideError={false}
                    options={uniqueData}
                    control={control}
                    isDisabled={isConvertedToCustomer}
                  />
                </GridItem>
                <GridItem>
                  <FormLabel color={"#000000B3"} fontSize={"14px"} mb={-1}>
                    <Text mt={4}>
                      {t("product.convertCustomerTable.loanAmount")}
                      <RequiredMark />
                    </Text>
                  </FormLabel>
                </GridItem>
                <GridItem>
                  <TextInput
                    type="text"
                    name="loanAmount"
                    control={control}
                    hideError={false}
                    placeholder={t("common.enter")}
                    isDisabled={isConvertedToCustomer}
                    value={loanAmountDisplay}
                    onChange={handleLoanAmountChange}
                    onFocus={handleLoanAmountFocus}
                    onBlur={handleLoanAmountBlur}
                    maxLength={13}
                  />
                </GridItem>
                <GridItem>
                  <FormLabel color={"#000000B3"} fontSize={"14px"} mb={-1}>
                    <Text mt={4}>
                      {t("product.convertCustomerTable.tenure")}
                      <RequiredMark />
                    </Text>
                  </FormLabel>
                </GridItem>
                <GridItem>
                  <TextInput
                    type="text"
                    name="loanTenure"
                    hideError={false}
                    regex="numeric"
                    control={control}
                    placeholder={t("common.enter")}
                    isDisabled={isConvertedToCustomer}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={e => {
                      const raw = e.target.value;
                      const filtered = raw.replace(/\D/g, "");
                      setValue("loanTenure", filtered, {
                        shouldValidate: true,
                        shouldTouch: true,
                      });
                      trigger("loanTenure");
                    }}
                  />
                </GridItem>
                <GridItem>
                  <FormLabel color="#000000B3" fontSize="14px" mb={-1}>
                    <Text mt={4}>
                      {t("product.convertCustomerTable.affordableEmi")}
                      <RequiredMark />
                    </Text>
                  </FormLabel>
                </GridItem>
                <GridItem>
                  <TextInput
                    type="text"
                    name="EMI"
                    hideError={false}
                    control={control}
                    placeholder={t("common.enter")}
                    isDisabled={isConvertedToCustomer}
                    value={emiDisplay}
                    onChange={handleEmiChange}
                    onFocus={handleEmiFocus}
                    onBlur={handleEmiBlur}
                  />
                </GridItem>
              </Grid>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="manualForm"
              onSubmit={handleSubmit(onSubmit)}
              isDisabled={isConvertedToCustomer}
            >
              Add
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
};

export default ConvertCustomerDrawer;

