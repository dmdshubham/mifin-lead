import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  Heading,
} from "@chakra-ui/react";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import SelectComponent from "@mifin/components/SelectComponent";
import { useAppSelector } from "@mifin/redux/hooks";
import { IPersonalDetailsProps } from "@mifin/Interface/NewLead";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import {
  headingStyling,
  formLabelStyling,
  dividerStyling,
} from "@mifin/theme/style";
import NonIndividualDetails from "./NonIndividualDetails";
import IndividualDetails from "./IndividualDetails";
import PersonalDetailGrid from "@mifin/components/PersonalDetailGrid";

const PersonalDetail: FC<IPersonalDetailsProps> = props => {
  const { navigateFocus } = props;
  const [age, setAge] = useState(0);
  const { t } = useTranslation();
  const {
    setFocus,
    setValue,
    control,
    formState: { isDirty },
    watch,
    trigger,
    reset,
  } = useFormContext();
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const constitutionList = mastersData?.constitutionList;
  const fieldValues = watch();
  const isNonIndividual = fieldValues.entityType?.value === "1000000002";

  // useEffect(() => {
  //   if (
  //     errors?.pan?.message ===
  //       "5th letter of PAN should be equal to the first letter of the last name" ||
  //     errors?.pan?.message === "4th letter must be P"
  //   ) {
  //     // setValue("pan", "");
  //   }
  // }, [errors?.pan]);

  useEffect(() => {
    const twoDigitValue = fieldValues?.dependent?.slice(0, 2);
    setValue("noOfDependents", twoDigitValue);
  }, [fieldValues.dependent]);

  useEffect(() => {
    navigateFocus && setFocus(navigateFocus);
  }, [navigateFocus]);

  useEffect(() => {
    const todaysDate = moment(new Date());
    const choosenDate = moment(fieldValues.dob);
    const duration = moment.duration(todaysDate.diff(choosenDate));
    setAge(duration.years());
  }, [fieldValues.dob]);

  useEffect(() => {
    if (isNonIndividual) {
      setValue("promiseTaken", true, { shouldValidate: true });
    } else {
      setValue("promiseTaken", false, { shouldValidate: true });
    }

    if (isDirty) {
      setTimeout(() => trigger(), 0);
    }
  }, [fieldValues.entityType, isDirty]);

  const data = allMastersData?.entityTypeMaster?.map(
    (el: IPersonalDetailsProps) => {
      return {
        label: el?.displayName,
        value: el?.custEntityTypeId,
      };
    }
  );

  const constitution = !isNonIndividual
    ? constitutionList?.[0]?.map((el: IPersonalDetailsProps) => {
        return {
          label: el?.Occupationname,
          value: el?.Occupationid,
        };
      })
    : isNonIndividual
    ? constitutionList?.[1]?.map((el: IPersonalDetailsProps) => {
        return {
          label: el?.Occupationname,
          value: el?.Occupationid,
        };
      })
    : [];

  return (
    <Box ml="-5px" marginTop={{ md: 6, base: 2 }} mx={1}>
      <Heading sx={headingStyling}>
        {t("newLead.heading.personalDetails")}
      </Heading>

      <PersonalDetailGrid>
        <FormControl
          isRequired
          //isInvalid={errors.entityType && touchedFields.entityType}
          mb={"-5px"}
        >
         <FormLabel sx={formLabelStyling}> 
            {t("newLead.personalDetails.entityType")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="entityType"
            options={data}
            placeholder={t("common.select")}
          />
        </FormControl>

        <FormControl isRequired mb={"-5px"}>
          <FormLabel sx={formLabelStyling}>
            {t("newLead.personalDetails.constitution")}
          </FormLabel>
          <SelectComponent
            control={control}
            name="constitution"
            options={constitution}
            placeholder={t("common.select")}
          />
        </FormControl>

        {isNonIndividual ? (
          <NonIndividualDetails
            allMastersData={allMastersData}
            constitutionList={constitutionList}
          />
        ) : (
          <IndividualDetails
            allMastersData={allMastersData}
            age={age}
            constitutionList={constitutionList}
          />
        )}
      </PersonalDetailGrid>
      <Divider sx={dividerStyling} mt={"-20px"} />
    </Box>
  );
};

export default PersonalDetail;
