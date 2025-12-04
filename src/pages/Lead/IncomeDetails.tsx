import { Box, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import TextInput from "@mifin/components/Input";
import { IIncomeDetailsProps } from "@mifin/Interface/NewLead";
import { useTranslation } from "react-i18next";
import { headingStyling, formLabelStyling } from "@mifin/theme/style";
import { FC, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import IncomeDetailGrid from "@mifin/components/IncomeDetailGrid";
import { useCurrencyToggle } from "@mifin/store/useCurrencyToggle";

const IncomeDetails: FC<IIncomeDetailsProps> = () => {
  const { t } = useTranslation();
  const { control, watch, trigger, setValue } = useFormContext();
  const defaultValues = watch();
  const { isUsCurrency } = useCurrencyToggle();

  // Single state object for all displays
  const [displays, setDisplays] = useState({
    annualIncome: '',
    grossMonthlyIncome: '',
    netMonthlyIncome: '',
    monthlyRentalIncome: '',
    otherAnnualIncome: '',
    interesrPaidOnLoan: ''
  });

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    const number = parseInt(numericValue);
    return isUsCurrency 
      ? number.toLocaleString('en-US')
      : new Intl.NumberFormat('en-IN').format(number);
  };
  useEffect(() => {
    const subscription = watch((values) => {
      setDisplays(prev => ({
        annualIncome: values.annualIncome ? formatCurrency(values.annualIncome) : '',
        grossMonthlyIncome: values.grossMonthlyIncome ? formatCurrency(values.grossMonthlyIncome) : '',
        netMonthlyIncome: values.netMonthlyIncome ? formatCurrency(values.netMonthlyIncome) : '',
        monthlyRentalIncome: values.monthlyRentalIncome ? formatCurrency(values.monthlyRentalIncome) : '',
        otherAnnualIncome: values.otherAnnualIncome ? formatCurrency(values.otherAnnualIncome) : '',
        interesrPaidOnLoan: values.interesrPaidOnLoan ? formatCurrency(values.interesrPaidOnLoan) : ''
      }));
    });
    return () => subscription.unsubscribe();
  }, [watch, formatCurrency]);

  // Generic handler function
  const createHandlers = (fieldName) => ({
    onChange: (e) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, '');
      setDisplays(prev => ({ ...prev, [fieldName]: rawValue }));
      setValue(fieldName, rawValue, { shouldValidate: true });
    },
    onFocus: (e) => {
      const rawValue = e.target.value.replace(/,/g, '');
      setDisplays(prev => ({ ...prev, [fieldName]: rawValue }));
      e.target.value = rawValue;
    },
    onBlur: (e) => {
      const value = e.target.value;
      if (value) {
        const formatted = formatCurrency(value);
        setDisplays(prev => ({ ...prev, [fieldName]: formatted }));
        e.target.value = formatted;
      }
    }
  });

  return (
    <Box marginTop={{ base: "2", md: "40px" }} mx={1}>
      <Heading sx={headingStyling}>
        {t("newLead.heading.incomeDetails")}
      </Heading>

      <IncomeDetailGrid>
        {defaultValues.entityType?.value === "1000000002 " ? (
          <>
            <FormControl>
              <FormLabel sx={formLabelStyling}>
                {t("newLead.incomeDetails.annualIncome")}
              </FormLabel>
              <TextInput
                name="monthlyRentalIncome"
                control={control}
                type="text"
                placeholder={t("common.enter")}
                value={displays.monthlyRentalIncome}
                {...createHandlers('monthlyRentalIncome')}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={formLabelStyling}>
                {t("newLead.incomeDetails.annualSalesTurnover")}
              </FormLabel>
              <TextInput
                name="annualSalesTurnOver"
                control={control}
                regex="numeric"
                placeholder={t("common.enter")}
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={formLabelStyling}>
                {t("newLead.incomeDetails.otherAnnualIncome")}
              </FormLabel>
              <TextInput
                name="otherAnnualIncome"
                control={control}
                type="text"
                placeholder={t("common.enter")}
                value={displays.otherAnnualIncome}
                {...createHandlers('otherAnnualIncome')}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={formLabelStyling}>
                {t("newLead.incomeDetails.interestPaidOnLoan")}
              </FormLabel>
              <TextInput
                name="interestPaidOnLoan"
                control={control}
                type="text"
                placeholder={t("common.enter")}
                value={displays.interesrPaidOnLoan}
                {...createHandlers('interesrPaidOnLoan')} 
              />
            </FormControl>
          </>
        ) : (
          <>
            <FormControl mx={-1}>
              <FormLabel sx={formLabelStyling} mb={{ base: -1, md: 1 }}>
                {t("newLead.incomeDetails.annualIncome")}
              </FormLabel>
              <TextInput
                name="annualIncome"
                control={control}
                type="text"
                placeholder={t("common.enter")}
                value={displays.annualIncome}
                {...createHandlers('annualIncome')}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={formLabelStyling} mb={{ base: -1, md: 1 }}>
                {t("newLead.incomeDetails.grossMonthlyIncome")}
              </FormLabel>
              <TextInput
                type="text"
                name="grossMonthlyIncome"
                control={control}
                placeholder={t("common.enter")}
                value={displays.grossMonthlyIncome}
                {...createHandlers('grossMonthlyIncome')}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={formLabelStyling} mb={{ base: -1, md: 1 }}>
                {t("newLead.incomeDetails.netMonthlyIncome")}
              </FormLabel>
              <TextInput
                name="netMonthlyIncome"
                control={control}
                type="text"
                placeholder={t("common.enter")}
                value={displays.netMonthlyIncome}
                {...createHandlers('netMonthlyIncome')}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={formLabelStyling} mb={{ base: -1, md: 1 }}>
                {t("newLead.incomeDetails.monthlyRentalIncome")}
              </FormLabel>
              <TextInput
                name="monthlyRentalIncome"
                control={control}
                type="text"
                placeholder={t("common.enter")}
                value={displays.monthlyRentalIncome}
                {...createHandlers('monthlyRentalIncome')}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={formLabelStyling} mb={{ base: -1, md: 1 }}>
                {t("newLead.incomeDetails.otherAnnualIncome")}
              </FormLabel>
              <TextInput
                name="otherAnnualIncome"
                control={control}
                type="text"
                placeholder={t("common.enter")}
                value={displays.otherAnnualIncome}
                {...createHandlers('otherAnnualIncome')}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={formLabelStyling} mb={{ base: -1, md: 1 }}>
                {t("newLead.incomeDetails.interestPaidOnLoan")}
              </FormLabel>
              <TextInput
                name="interestPaidOnLoan"
                control={control}
                type="text"
                placeholder={t("common.enter")}
                value={displays.interestPaidOnLoan}
                {...createHandlers('interestPaidOnLoan')}
              />
            </FormControl>
          </>
        )}
      </IncomeDetailGrid>
    </Box>
  );
};

export default IncomeDetails;
