import { Box, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { MifinColor } from "@mifin/theme/color";
import DateRange from "@mifin/components/Date";
import SelectComponent from "@mifin/components/SelectComponent";
import TextInput from "@mifin/components/Input";
import { Controller } from "react-hook-form";
import { formLabelStyling } from "@mifin/theme/style";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useSelectOptions from "../hook/useSelectOptions";
import { FC, useMemo, useState } from "react";
import { IndividualDetailsProps } from "@mifin/Interface/Customer";
import {
  useGetCluster,
  useGetEmploymentTypeList,
  useGetTypeOfBusiness,
} from "@mifin/service/getAllNewMasters/getAllNewMasters";

const IndividualDetails: FC<IndividualDetailsProps> = props => {
  const { allMastersData, age } = props;
  const { control, watch, setValue, trigger } = useFormContext();
  const { t } = useTranslation();
  const {
    stageMaster,
    sectorMaster,
    industryMaster,
    typeOfBusinessMaster,
    clusterMaster,
    maritalStatus,
    gender,
    nationality,
  } = useSelectOptions(allMastersData);

  const [aadhaarMasked, setAadhaarMasked] = useState(true);
  const handleAadhaarFocus = () => setAadhaarMasked(false);
  const handleAadhaarBlur = () => {
    setAadhaarMasked(true);
    trigger();
  };

  const maskAadhaar = (aadhaar: string) => aadhaar.replace(/.(?=.{4})/g, "X");

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (inputValue.length <= 12) {
      setValue("adhaarNumber", inputValue, { shouldDirty: true });
    }
  };

  const { data: typeOfBusinessKey } = useGetTypeOfBusiness(
    watch("industry")?.value ?? watch("industry")
  );
  const { data: typeOfClusterKey } = useGetCluster(
    watch("typeOfBusiness")?.value ?? watch("typeOfBusiness")
  );

  // const { data: getEmploymentTypeList } = useGetEmploymentTypeList();

  // const employmentTypeListMasters = useMemo(() => {
  //   return getEmploymentTypeList?.EMPLOYMENTTYPELIST?.map((ele: any, i: number) => {
  //     return { value: ele?.masterId, label: ele?.masterName };
  //   });
  // }, [getEmploymentTypeList?.EMPLOYMENTTYPELIST]);

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
          {t("newLead.personalDetails.firstName")}
        </FormLabel>
        <TextInput
          regex="alphabet"
          name="firstName"
          control={control}
          type="text"
          placeholder={t("common.enter")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.middleName")}
        </FormLabel>
        <TextInput
          regex="alphabet"
          name="middleName"
          control={control}
          type="text"
          placeholder={t("common.enter")}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.lastName")}
        </FormLabel>
        <TextInput
          regex="alphabet"
          name="lastName"
          control={control}
          type="text"
          placeholder={t("common.enter")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.maritalStatus")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="maritalStatus"
          options={maritalStatus}
          placeholder={t("common.select")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.dateOfBirth")}
        </FormLabel>
        <Controller
          control={control}
          name="dob"
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
                  name="dob"
                  popperPlacement="top-start"
                  date={value}
                  setDate={onChange}
                  placeholder={t("common.enter")}
                  showYear
                  showMonth
                  autoComplete="off"
                  showPopperArrow={false}
                  preventOverflow={true}
                />
              </Box>
            );
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.age")}
        </FormLabel>
        <Input
          name="Age"
          type="number"
          placeholder={t("common.select")}
          variant="flushed"
          color={MifinColor.gray_500}
          value={age}
          fontSize="12px" // Sets input text size
          _placeholder={{ fontSize: "12px" }} // Sets placeholder text s
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.gender")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="gender"
          options={gender}
          placeholder={t("common.select")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.nationality")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="nationality"
          options={nationality}
          placeholder={t("common.select")}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.dependants")}
        </FormLabel>
        <TextInput
          regex="numeric"
          name="noOfDependents"
          control={control}
          type="text"
          placeholder={t("common.enter")}
        />
      </FormControl>

      <FormControl isRequired={watch("lastName") != "" ? true : false}>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.panNo")}
        </FormLabel>
        <TextInput
          name="pan"
          control={control}
          type="text"
          regex="alphanumeric"
          placeholder={t("common.enter")}
          // onChange={handlePanChange}
        />
      </FormControl>

      {/* <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.aadhaarNo")}
        </FormLabel>
        <TextInput
          regex="numeric"
          name="adhaarNumber"
          control={control}
          type="text"
          placeholder={t("common.enter")}
          maxLength={12}
        />
      </FormControl> */}
      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.aadhaarNo")}
        </FormLabel>
        <Controller
          control={control}
          name="adhaarNumber"
          render={({ field: { value } }) => (
            <Input
              type="text"
              value={aadhaarMasked ? maskAadhaar(value || "") : value || ""}
              onFocus={handleAadhaarFocus}
              onBlur={handleAadhaarBlur}
              onChange={handleAadhaarChange}
              maxLength={12}
              placeholder={t("common.enter")}
              autoComplete="off"
              fontWeight={600}
              fontSize={"14px"}
              _placeholder={{
                fontWeight: 500,
                fontSize: "12px",
              }}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.stage")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="stage"
          options={stageMaster}
          placeholder={t("common.select")}
        />
      </FormControl>

      {/* <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.sector")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="sector"
          // options={sectorMaster}
          options={employmentTypeListMasters}
          placeholder={t("common.select")}
        />
      </FormControl> */}

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.industry")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="industry"
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
        />
      </FormControl>

      <FormControl>
        <FormLabel sx={formLabelStyling}>
          {t("newLead.personalDetails.typeOfBusiness")}
        </FormLabel>
        <SelectComponent
          control={control}
          name="typeOfBusiness"
          onCustomChange={() => {
            // clear nature of business and cluster
            setValue("cluster", null, {
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
          name="cluster"
          // options={clusterMaster}
          options={clusterMasters}
          placeholder={t("common.select")}
        />
      </FormControl>
    </>
  );
};

export default IndividualDetails;
