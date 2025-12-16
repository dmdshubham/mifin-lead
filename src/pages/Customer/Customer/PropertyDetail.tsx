import { Box, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import { useEffect, ChangeEvent, FC, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import { getCitiesByState } from "@mifin/redux/service/getCitiesByState/api";
import { getPincodeByCity } from "@mifin/redux/service/getPinCodeByCity/api";
import { useTranslation } from "react-i18next";
import {
  AddressProps,
  IPropertyDetailProps,
  PropertyDetailItem,
} from "@mifin/Interface/Customer";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import LeadDetailCustomerDetailGrid from "@mifin/components/LeadDetailCustomerDetailGrid";
import SelectComponent from "@mifin/components/SelectComponent";
import { useFormContext } from "react-hook-form";
import TextInput from "@mifin/components/Input";
import { usePincodeData } from "@mifin/hooks/usePincodeData";

const PropertyDetail: FC<IPropertyDetailProps> = props => {
  const {
    defaultValues,
    developerType,
    propertCollateralDetails,
    setPropertyDetail,
    propertyDetail,
    isConvertedToCustomer,
    control,
    saveCount,
  } = props;
  const { t } = useTranslation();
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const { setValue, watch: watchAddress } = useFormContext();

  const prevDefaultValues = useRef<string>("");
  const prevDefaultValuesForCity = useRef<string>("");
  const prevDefaultValuesForProjectName = useRef<string>("");

  useEffect(() => {
    prevDefaultValues.current = "";
    prevDefaultValuesForCity.current = "";
    prevDefaultValuesForProjectName.current = "";
  }, [saveCount]);

  const particularState = watchAddress("state");
  const particularCity = watchAddress("city");

  // Use the pincode database hook
  const { 
    isLoading: isPincodeLoading, 
    isInitialized: isPincodeInitialized,
    getCitiesByState: fetchCitiesByState,
    getPincodesByCity: fetchPincodesByCity 
  } = usePincodeData();

  // State to store cities and pincodes
  const [allCities, setAllCities] = useState<any[]>([]);
  const [allPincode, setAllPincode] = useState<any[]>([]);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (particularState?.value && isPincodeInitialized) {
        const cities = await fetchCitiesByState(particularState.value);
        setAllCities(cities);
      } else {
        setAllCities([]);
      }
    };

    fetchCities();
  }, [particularState?.value, isPincodeInitialized, fetchCitiesByState]);

  // Fetch pincodes when city changes
  useEffect(() => {
    const fetchPincodes = async () => {
      if (particularCity?.value && isPincodeInitialized) {
        const pincodes = await fetchPincodesByCity(particularCity.value);
        setAllPincode(pincodes);
      } else {
        setAllPincode([]);
      }
    };

    fetchPincodes();
  }, [particularCity?.value, isPincodeInitialized, fetchPincodesByCity]);

  console.log("allCities", allCities);
  console.log("allPincode", allPincode);

  useEffect(() => {
    if (defaultValues?.listProperty?.length === 0) {
      setPropertyDetail([
        {
          address: defaultValues?.listProperty?.propertyAddress ?? "",
          city: defaultValues?.listProperty?.city ?? "",
          cityName: defaultValues?.listProperty?.cityName ?? "",
          devloperId: defaultValues?.listProperty?.devloperId ?? "",
          developerName: defaultValues?.listProperty?.developerName ?? "",
          estimatedValue: defaultValues?.listProperty?.estimatedValue ?? "",
          landMark: defaultValues?.listProperty?.landMark ?? "",
          occupancyStatus: defaultValues?.listProperty?.occupancyStatus ?? "",
          otherDeploperName:
            defaultValues?.listProperty?.otherDeploperName ?? "",
          otherProjectName: defaultValues?.listProperty?.otherProjectName ?? "",
          projectId: defaultValues?.listProperty?.projectId ?? "",
          propStatus: defaultValues?.listProperty?.propStatus ?? "",
          propTypeId: defaultValues?.listProperty?.propTypeId ?? "",
          state: defaultValues?.listProperty?.state ?? "",
          zipcode: defaultValues?.listProperty?.zipcode ?? "",
          remarks: defaultValues?.listProperty?.remarks ?? "",
          projectName: defaultValues?.listProperty?.projectName ?? "",
        },
      ]);
    } else {
      setPropertyDetail(defaultValues.listProperty);
    }
  }, [defaultValues.listProperty]);

  const GET_CITIES_BY_STATE = (stateId: any) => ({
    ...MASTER_PAYLOAD,
    requestData: {
      id: stateId ?? "",
      action: "city",
    },
  });

  const GET_PINCODE_BY_CITY = (cityId: any) => ({
    ...MASTER_PAYLOAD,
    requestData: {
      id: cityId ?? "",
      action: "pincode",
    },
  });

  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (!particularState) {
  //     dispatch(getCitiesByState(GET_CITIES_BY_STATE));

  //     // Clear city and pincode fields
  //     setValue("city", "");
  //     setValue("zipcode", "");
  //   }
  // }, [particularState]);

  // useEffect(() => {
  //   const getWorkListLeadDetails = () => {
  //     dispatch(getCitiesByState(GET_CITIES_BY_STATE));
  //   };
  //   getWorkListLeadDetails();
  // }, [particularState]);

  // useEffect(() => {
  //   const getWorkListLeadDetails = () => {
  //     dispatch(getPincodeByCity(GET_PINCODE_BY_CITY));
  //   };
  //   getWorkListLeadDetails();
  // }, [particularCity]);

  const handleState = (selectedState: any) => {
    if (selectedState) {
      // No need to dispatch API call - using local JSON data
      // const stateId = selectedState?.e?.value;
      // dispatch(getCitiesByState(GET_CITIES_BY_STATE(stateId)));
      
      // Clear city and zipcode when state changes
      setValue("city", null);
      setValue("zipcode", null);
    }
  };

  const handleCity = (selectedCity: any) => {
    if (selectedCity) {
      // No need to dispatch API call - using local JSON data
      // const cityId = selectedCity?.e?.value;
      // dispatch(getPincodeByCity(GET_PINCODE_BY_CITY(cityId)));
      
      // Clear zipcode when city changes
      setValue("zipcode", null);
    }
  };

  const propType: any = allMastersData?.propType?.map((el: any) => {
    return {
      label: el.propTypeName,
      value: el.propTypeId,
    };
  });
  const setPropType = propType?.find((item: any) => {
    if (defaultValues?.listProperty?.[0]?.propTypeId == item?.value)
      return item;
  });

  const propStatus = allMastersData?.propStatus?.map((el: any) => {
    return {
      label: el?.propStatusName,
      value: el?.propStatusId,
    };
  });
  const setPropStatus = propStatus?.find((item: any) => {
    if (defaultValues?.listProperty?.[0]?.propStatus == item?.value)
      return item;
  });

  const devloperMasters = allMastersData?.devloperMasters?.map((el: any) => {
    return {
      label: el?.devloperName,
      value: el?.devloperId,
    };
  });

  const occupancyStatus = allMastersData?.occupancyStatus?.map((el: any) => {
    return {
      label: el?.occupancyStName,
      value: el?.occupancyStId,
    };
  });
  const setOccupancy = occupancyStatus?.find((item: any) => {
    if (defaultValues?.listProperty?.[0]?.occupancyStatus == item?.value)
      return item;
  });

  const projectName = developerType?.map(el => {
    return {
      label: el?.projectName,
      value: el?.projectId,
    };
  });
  const setProjectName = projectName?.find(item => {
    if (defaultValues?.listProperty?.[0]?.projectId == item?.value) return item;
  });

  const setDeveloperName = devloperMasters?.find((item: any) => {
    if (defaultValues?.listProperty?.[0]?.devloperId == item?.value)
      return item;
  });

  const state = allMastersData?.stateList?.map((el: AddressProps) => {
    const myState = {
      label: el?.displayName,
      value: el?.stateMasterId,
    };
    return myState;
  });
  const setState = state?.find((item: any) => {
    if (defaultValues?.listProperty?.[0]?.state == item?.value) return item;
  });
  const cities = allCities
    ?.filter((el: AddressProps) => el.stateId === particularState?.value)
    .map((el: { displayName: string; cityMasterId: string }) => ({
      label: el?.displayName,
      value: el?.cityMasterId,
    }));

  const setCities = cities?.find((item: any) => {
    if (defaultValues?.listProperty?.[0]?.city == item?.value) return item;
  });

  const pincode =
    allPincode &&
    allPincode?.map((el: AddressProps) => {
      const zipcode = {
        label: `${el?.pincode} - ${el?.divisionName}`,
        value: el?.pincode,
      };
      return zipcode;
    });
  // useEffect(() => {
  //   if (defaultValues?.listProperty) {
  //     if (setProjectName) {
  //       setValue("projectId", {
  //         label: setProjectName?.label,
  //         value: setProjectName?.value,
  //       });
  //     }

  //     if (setPropStatus) {
  //       setValue("propStatus", {
  //         label: setPropStatus?.label,
  //         value: setPropStatus?.value,
  //       });
  //     }

  //     if (setPropType) {
  //       setValue("propTypeId", {
  //         label: setPropType?.label,
  //         value: setPropType?.value,
  //       });
  //     }

  //     if (setOccupancy) {
  //       setValue("occupancyStatus", {
  //         label: setOccupancy?.label,
  //         value: setOccupancy?.value,
  //       });
  //     }

  //     if (setState) {
  //       setValue("state", {
  //         label: setState?.label,
  //         value: setState?.value,
  //       });
  //     }

  //     if (setCities) {
  //       setValue("city", {
  //         label: setCities?.label,
  //         value: setCities?.value,
  //       });
  //     }

  //     if (defaultValues?.listProperty?.[0]?.zipcode) {
  //       setValue("zipcode", {
  //         label: defaultValues?.listProperty?.[0]?.zipcode,
  //         value: defaultValues?.listProperty?.[0]?.zipcode,
  //       });
  //     }

  //     if (setDeveloperName) {
  //       setValue("devloperId", {
  //         label: setDeveloperName?.label,
  //         value: setDeveloperName?.value,
  //       });
  //     }
  //   }
  // }, [
  //   defaultValues?.listProperty,
  //   setProjectName,
  //   setPropStatus,
  //   setPropType,
  //   setOccupancy,
  //   setValue,
  //   setCities,
  //   devloperMasters,
  // ]);
  //const prevDefaultValues = useRef<string>("");
  useEffect(() => {
    const defaultValuesString = JSON.stringify(defaultValues?.listProperty);
    if (prevDefaultValues.current === defaultValuesString) return;
    prevDefaultValues.current = defaultValuesString;
    if (defaultValues?.listProperty) {
      // if (setProjectName) {
      //   setValue("projectId", {
      //     label: setProjectName?.label,
      //     value: setProjectName?.value,
      //   });
      // }

      if (setPropStatus) {
        setValue("propStatus", {
          label: setPropStatus?.label,
          value: setPropStatus?.value,
        });
      }

      if (setPropType) {
        setValue("propTypeId", {
          label: setPropType?.label,
          value: setPropType?.value,
        });
      }

      if (setOccupancy) {
        setValue("occupancyStatus", {
          label: setOccupancy?.label,
          value: setOccupancy?.value,
        });
      }

      if (setState) {
        setValue("state", {
          label: setState?.label,
          value: setState?.value,
        });
      }

      // if (setCities) {
      //   setValue("city", {
      //     label: setCities?.label,
      //     value: setCities?.value,
      //   });
      // }

      if (defaultValues?.listProperty?.[0]?.zipcode) {
        setValue("zipcode", {
          label: defaultValues?.listProperty?.[0]?.zipcode,
          value: defaultValues?.listProperty?.[0]?.zipcode,
        });
      }

      if (setDeveloperName) {
        setValue("devloperId", {
          label: setDeveloperName?.label,
          value: setDeveloperName?.value,
        });
      }
    }
  }, [
    //setProjectName,
    setPropStatus,
    setPropType,
    setOccupancy,
    setValue,
    // setCities,
    devloperMasters,
    saveCount,
  ]);
  useEffect(() => {
    setValue(
      "otherProjectName",
      propertCollateralDetails?.[0]?.otherProjectName
    );
    setValue(
      "otherDeploperName",
      propertCollateralDetails?.[0]?.otherDeploperName
    );
    setValue("estimatedValue", propertCollateralDetails?.[0]?.estimatedValue);
    setValue("remarks", propertCollateralDetails?.[0]?.remarks);
    setValue("propertyAddress", propertCollateralDetails?.[0]?.address);
    setValue("landMark", propertCollateralDetails?.[0]?.landMark);
  }, [propertCollateralDetails]);

  useEffect(() => {
    const defaultValuesString = JSON.stringify(defaultValues?.listProperty);
    if (setCities) {
      if (prevDefaultValuesForCity.current === defaultValuesString) return;
      prevDefaultValuesForCity.current = defaultValuesString;
      if (setCities) {
        setValue("city", {
          label: setCities?.label,
          value: setCities?.value,
        });
      }
    }
  }, [setCities, saveCount]);

  useEffect(() => {
    const defaultValuesString = JSON.stringify(defaultValues?.listProperty);

    if (prevDefaultValuesForProjectName.current === defaultValuesString) return;
    prevDefaultValuesForProjectName.current = defaultValuesString;

    if (setProjectName) {
      setValue("projectId", {
        label: setProjectName?.label,
        value: setProjectName?.value,
      });
    }
  }, [setProjectName, saveCount]);

  const handlePropertyChange = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setPropertyDetail((prevItems: any) =>
      prevItems.map((item: any, i: any) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  return (
    <Box mt="8" mx={-4}>
      <Heading
        as="h3"
        fontSize={{ base: "18px", md: "18px" }}
        mb={-4}
        color={"#3e4954"}
        marginBottom={{ base: "5px", md: "9px" }}
      >
        {t("customer.heading.propertyCollateralDetails")}
      </Heading>

      <LeadDetailCustomerDetailGrid>
        <>
          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.propertyType")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="propTypeId"
              options={propType}
              placeholder={t("common.select")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>
          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.propertyStatus")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="propStatus"
              options={propStatus}
              //   value={watchAddress("propStatus")}
              placeholder={t("common.select")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>
          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.developerName")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="devloperId"
              options={devloperMasters}
              placeholder={t("common.select")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>
          <FormControl>
            <FormLabel
              htmlFor="other-developer"
              color={"#000000B3"}
              fontSize={"14px"}
            >
              {t("customer.collateralDetails.otherDeveloper")}
            </FormLabel>
            <TextInput
              name="otherDeploperName"
              type="text"
              placeholder={t("common.enter")}
              // variant="flushed"
              id="other-developer"
              control={control}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.projectName")}
            </FormLabel>
            <SelectComponent
              //  value={projectName}
              control={control}
              name="projectId"
              options={projectName}
              placeholder={t("common.select")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="other-project"
              color={"#000000B3"}
              fontSize={"14px"}
            >
              {t("customer.collateralDetails.otherProject")}
            </FormLabel>
            <TextInput
              name="otherProjectName"
              type="text"
              placeholder={t("common.enter")}
              // variant="flushed"
              id="other-project"
              control={control}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="estimated-value"
              color={"#000000B3"}
              fontSize={"14px"}
            >
              {t("customer.collateralDetails.estimatedValue")}
            </FormLabel>
            <TextInput
              regex="numeric"
              name="estimatedValue"
              control={control}
              type="text"
              placeholder={t("common.enter")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              htmlFor="property-add"
              color={"#000000B3"}
              fontSize={"14px"}
            >
              {t("customer.collateralDetails.propertyAdd")}
            </FormLabel>
            <TextInput
              name="propertyAddress"
              type="text"
              placeholder={t("common.enter")}
              // variant="flushed"
              id="property-add"
              control={control}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="landmark" color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.landmark")}
            </FormLabel>
            <TextInput
              name="landMark"
              type="text"
              placeholder={t("common.enter")}
              // variant="flushed"
              id="landmark"
              control={control}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>
          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.state")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="state"
              options={state}
              onCustomChange={handleState}
              placeholder={t("common.select")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.city")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="city"
              options={cities}
              onCustomChange={handleCity}
              placeholder={t("common.select")}
              id="city"
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.pincode")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="zipcode"
              options={pincode}
              placeholder={t("common.select")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.occupancy")}
            </FormLabel>
            <SelectComponent
              control={control}
              name="occupancyStatus"
              options={occupancyStatus}
              placeholder={t("common.select")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>

          <FormControl>
            <FormLabel color={"#000000B3"} fontSize={"14px"}>
              {t("customer.collateralDetails.remarks")}
            </FormLabel>
            <TextInput
              control={control}
              name="remarks"
              type="text"
              // variant="flushed"
              id="remarks"
              placeholder={t("common.enter")}
              isDisabled={isConvertedToCustomer}
            />
          </FormControl>
        </>
      </LeadDetailCustomerDetailGrid>
    </Box>
  );
};

export default PropertyDetail;
