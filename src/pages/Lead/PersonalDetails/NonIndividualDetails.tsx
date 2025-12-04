import { Box, FormControl, FormLabel } from "@chakra-ui/react";
import DateRange from "@mifin/components/Date";
import SelectComponent from "@mifin/components/SelectComponent";
import TextInput from "@mifin/components/Input";
import { Controller } from "react-hook-form";
import { formLabelStyling } from "@mifin/theme/style";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import useSelectOptions from "../hook/useSelectOptions";
import { NonIndividualDetailsProps } from "@mifin/Interface/Customer";
import { FC, useMemo } from "react";
import {
  useGetTypeOfBusiness,
  useGetCluster,
} from "@mifin/service/getAllNewMasters/getAllNewMasters";

const NonIndividualDetails: FC<NonIndividualDetailsProps> = props => {
  const { allMastersData } = props;
  const { t } = useTranslation();
  // const { control } = useFormContext();
  const { control, watch, setValue, trigger } = useFormContext();
  const {
    stageMaster,
    sectorMaster,
    industryMaster,
    typeOfBusinessMaster,
    clusterMaster,
  } = useSelectOptions(allMastersData);

  const { data: typeOfBusinessKey } = useGetTypeOfBusiness(
    watch("industryForNI")?.value ?? watch("industryForNI")
  );
  const { data: typeOfClusterKey } = useGetCluster(
    watch("typeOfBusinessForNI")?.value ?? watch("typeOfBusinessForNI")
  );

  const typeOfBusinessMasters = useMemo(() => {
    return typeOfBusinessKey?.TYPEOFBUSINESSLIST?.map((ele: any, i: number) => {
      return { value: ele?.masterId, label: ele?.masterName };
    });
  }, [typeOfBusinessKey?.TYPEOFBUSINESSLIST]);

  const clusterMasters = useMemo(() => {
    return typeOfClusterKey?.CLUSTER?.map((ele: any, i: number) => {
      return { value: ele.masterId, label: ele.masterName };
    });
  }, [typeOfClusterKey?.CLUSTER]);

  return (
    <>
      <FormControl isRequired>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.companyName")}
        </FormLabel>
        <TextInput
          name="companyName"
          control={control}
          type="text"
          hideError={true}
          placeholder={t("common.enter")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.authSignatory")}
        </FormLabel>
        <TextInput
          name="authSignatoryFName"
          control={control}
          type="text"
          placeholder={t("common.enter")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.authSignatoryMidLabel")}
        </FormLabel>
        <TextInput
          name="authSignatoryMName"
          control={control}
          type="text"
          placeholder={t("common.enter")}
          // maxLength={3}
          regex="alphabet"
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.authSignatoryLastNameLabel")}
        </FormLabel>
        <TextInput
          name="authSignatoryLName"
          control={control}
          type="text"
          placeholder={t("common.enter")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.dateofIncorporationLabel")}
        </FormLabel>
        <Controller
          control={control}
          name="dateOfIncorparation"
          render={({ field: { onChange, value } }) => {
            return (
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
                  name="dateOfIncorparation"
                  popperPlacement="top-start"
                  date={value}
                  setDate={onChange}
                  placeholder="Select"
                  showYear
                  showMonth
                />
              </Box>
            );
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.stage")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="stageForNI"
          options={stageMaster}
          placeholder={t("common.select")}
        />
      </FormControl>

      {/* <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.control")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="sectorForNI"
          options={sectorMaster}
          placeholder={t("common.select")}
        />
      </FormControl> */}

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.industry")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="industryForNI"
          onCustomChange={() => {
            // clear nature of business and cluster
            setValue("typeOfBusinessForNI", null, {
              shouldValidate: true,
            });
            setValue("clusterForNI", null, {
              shouldValidate: true,
            });
          }}
          options={industryMaster}
          placeholder={t("common.select")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.typeOfBusiness")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="typeOfBusinessForNI"
          onCustomChange={() => {
            // clear nature of business and cluster
            setValue("clusterForNI", null, {
              shouldValidate: true,
            });
          }}
          // options={typeOfBusinessMaster}
          options={typeOfBusinessMasters}
          placeholder={t("common.select")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.cluster")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="clusterForNI"
          // options={clusterMaster}
          options={clusterMasters}
          placeholder={t("common.select")}
        />
      </FormControl>
    </>
  );
};

export default NonIndividualDetails;
