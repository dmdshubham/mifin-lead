import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  FormHelperText,
} from "@chakra-ui/react";
import TextInput from "@mifin/components/Input";
import { useTranslation } from "react-i18next";
import { escalatedLeadStatusBoxStyling } from "@mifin/theme/style";
import { FC } from "react";
import { EscalatedLeadStatusProps } from "@mifin/Interface/Customer";
import LeadDetailCustomerDetailGrid from "@mifin/components/LeadDetailCustomerDetailGrid";

const EscalatedLeadStatus: FC<EscalatedLeadStatusProps> = props => {
  const { defaultValues, control, register, errors } = props;
  const { t } = useTranslation();

  return (
    <Box mb="22">
      <Flex
        sx={escalatedLeadStatusBoxStyling}
        flexDirection={{ sm: "column", md: "row" }}
        gap={{ sm: 8, md: 0 }}
      >
        <Heading as="h3" fontSize="24px">
          {t("contact.heading.leadStatus")}
        </Heading>
      </Flex>

      <LeadDetailCustomerDetailGrid>
        <FormControl isReadOnly >
          <FormLabel>{t("escalatedLeadStatus.escalate")}</FormLabel>
          <TextInput
            name="actionName"
            control={control}
            type="text"
            value={defaultValues.actionName}
            placeholder={t("common.enter")}
            isReadOnly
          />
        </FormControl>

        <FormControl isReadOnly>
          <FormLabel>{t("escalatedLeadStatus.initiatedBy")}</FormLabel>
          <TextInput
            name="initiatedBy"
            control={control}
            type="text"
            placeholder={t("common.enter")}
            isReadOnly
          />
        </FormControl>

        <FormControl isReadOnly>
          <FormLabel>{t("escalatedLeadStatus.initiatedDateTime")}</FormLabel>
          <TextInput
            name="initiatedDateTime"
            control={control}
            type="text"
            placeholder={t("common.enter")}
            isReadOnly
          />
        </FormControl>

        <FormControl isReadOnly>
          <FormLabel>{t("escalatedLeadStatus.initialRemarks")}</FormLabel>
          <TextInput
            name="initialRemarks"
            control={control}
            type="text"
            placeholder={t("common.enter")}
            isReadOnly
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t("escalatedLeadStatus.resolve")}</FormLabel>
          <Checkbox {...register("resolve")}></Checkbox>
          <FormHelperText color="red">
            {errors?.resolve?.message}
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>{t("escalatedLeadStatus.resolveRemarks")}</FormLabel>
          <TextInput
            mb="10"
            name="resolvedRemarks"
            control={control}
            type="text"
            placeholder={t("common.enter")}
          />
        </FormControl>
      </LeadDetailCustomerDetailGrid>
    </Box>
  );
};

export default EscalatedLeadStatus;
