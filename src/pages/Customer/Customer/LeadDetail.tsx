import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Divider,
  useBreakpoint,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAppSelector } from "@mifin/redux/hooks";
import SelectComponent from "@mifin/components/SelectComponent";
import TextInput from "@mifin/components/Input";
import { useTranslation } from "react-i18next";
import { dividerStyling } from "@mifin/theme/style";
import { ILeadDetailsProps } from "@mifin/Interface/Customer";
import { leadDetailsHeadingStyling } from "@mifin/theme/style";
import { FC, useEffect } from "react";
import LeadDetailCustomerDetailGrid from "@mifin/components/LeadDetailCustomerDetailGrid";
import { userInfo } from "@mifin/utils/getLoginUserInfo";

const LeadDetail: FC<ILeadDetailsProps> = props => {
  const { defaultValues, control, setValue, isConvertedToCustomer } = props;
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const sourceMaster = allMastersData?.sourceMaster?.map(
    (el: ILeadDetailsProps) => {
      const source = {
        label: el?.sourceName,
        value: el?.caseSourceId,
      };

      if (defaultValues?.source === el?.caseSourceId) {
        setValue("source", source);
      }

      return source;
    }
  );

  useEffect(() => {
    setValue("referenceName", userInfo());
    setValue("referenceNumber", userInfo());
  }, [userInfo(), mastersData]);

  return (
    <Box mt="8" mx={-4}>
      <Heading
        as="h3"
        sx={leadDetailsHeadingStyling}
        mb={{ base: -4, md: 0 }}
        color={"#3e4954"}
      >
        {t("customer.heading.leadDetails")}
      </Heading>
      <LeadDetailCustomerDetailGrid>
        <FormControl isRequired>
          <FormLabel color={"#000000B3"} fontSize={"14px"}>
            {t("customer.leadDetails.source")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="source"
            options={sourceMaster}
            placeholder={t("common.select")}
            isDisabled={isConvertedToCustomer}
          />
        </FormControl>

        <FormControl>
          <FormLabel color={"#000000B3"} fontSize={"14px"}>
            {t("customer.leadDetails.employmentCode")}
          </FormLabel>
          <TextInput
            name="referenceNumber"
            control={control}
            type="text"
            placeholder={t("common.enter")}
            isDisabled
          />
        </FormControl>

        <FormControl>
          <FormLabel color={"#000000B3"} fontSize={"14px"}>
            {t("customer.leadDetails.employeeName")}
          </FormLabel>
          <TextInput
            regex="alphabet"
            name="referenceName"
            control={control}
            type="text"
            placeholder={t("common.enter")}
            isDisabled
          />
        </FormControl>
      </LeadDetailCustomerDetailGrid>
      {!isMobile && <Divider sx={dividerStyling} mt={"50px"} />}
    </Box>
  );
};
export default LeadDetail;
