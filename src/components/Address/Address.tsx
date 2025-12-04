import { FC, useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { FiMenu } from "react-icons/fi";
import {
  Box,
  IconButton,
  Divider,
  Flex,
  Heading,
  FormLabel,
  Grid,
  GridItem,
  Text,
  Radio,
  Stack,
  Card,
  CardBody,
  RadioGroup,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import DrawerComponent from "@mifin/components/Drawer";
import SelectComponent from "@mifin/components/SelectComponent";
import TextInput from "@mifin/components/Input";
import { convertingSelectValues } from "@mifin/utils/convertingSelectValues";
import { useAppSelector, useAppDispatch } from "@mifin/redux/hooks";
import { getCitiesByState } from "@mifin/redux/service/getCitiesByState/api";
import { getPincodeByCity } from "@mifin/redux/service/getPinCodeByCity/api";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@mifin/components/Button";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { dividerStyling } from "@mifin/theme/style";
import { AddressProps } from "@mifin/Interface/Customer";
import AddressSchema from "@mifin/schema/AddressSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import getAdressType from "@mifin/utils/getAdressType";
import FormCheckbox from "../FormCheckBox";
import RequiredMark from "@mifin/components/RequiredMark";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { useLocation } from "react-router-dom";
import { listAddress, offAddress } from "@mifin/ConstantData/newLeadApiBody";
import { getTehsilByCity } from "@mifin/redux/service/getTehsilByCity/api";
import { getPincodeByTehsil } from "@mifin/redux/service/getPincodeByTehsil/api";
import {
  useGetNewPincodeByTehsil,
  useGetNewTehsilByCity,
} from "@mifin/service/getAllNewDependentMasters/getAllNewDependentMasters";

const formDefaultValues = {
  mobile_no1: "",
  company_name: "",
  state: null as null | { label: string; value: string },
  city: null as null | { label: string; value: string },
  zipcode: null as null | { label: string; value: string; id: string },
  sameAsDropdown: null as null | { label: string; value: string },
  locality: null as null | { label: string; value: string },
};

const Address: FC<AddressProps> = props => {
  const { setAllAddress, allAddress } = props;
  const destinationAddress2 = allAddress?.[0]?.destinationAddress ?? "";
  const destinationAddress3 = allAddress?.[1]?.destinationAddress ?? "";
  const destinationAddress4 = allAddress?.[2]?.destinationAddress ?? "";
  const mailigAddress2 = allAddress?.[0]?.mailingAddress ?? "";
  const mailigAddress3 = allAddress?.[1]?.mailingAddress ?? "";
  const mailigAddress4 = allAddress?.[2]?.mailingAddress ?? "";
  const { watch, setValue } = useFormContext();
  const entity = watch("entityType");
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [addressType, setAddressType] = useState("");
  // for mailing and destination stat
  const [radioCheckedMailing, setRadioCheckedMailing] = useState<string | null>(
    ""
  );
  const [radioCheckedDestination, setRadioCheckedDestination] = useState<
    string | null
  >("");
  const yupValidationSchema: any = useMemo(
    () => AddressSchema(t, addressType),
    [t, addressType]
  );

  const handleRadioChangeMailing = (addressType: string) => {
    setRadioCheckedMailing(addressType);
    const upDatedAddress = allAddress?.map((item: any) => {
      if (item?.addressType === addressType) {
        return {
          ...item,
          mailingAddress: "Y",
        };
      }
      return {
        ...item,
        mailingAddress: "N",
      };
    });
    setAllAddress(upDatedAddress);
  };

  const handleRadioChangeDestination = (addressType: string) => {
    setRadioCheckedDestination(addressType);
    const upDatedAddress = allAddress?.map((item: any) => {
      if (item?.addressType === addressType) {
        return {
          ...item,
          destinationAddress: "Y",
        };
      }
      return {
        ...item,
        destinationAddress: "N",
      };
    });
    setAllAddress(upDatedAddress);
  };
  const allCities: any = useAppSelector(
    (state: any) => state.getCitiesByState?.data?.city
  );

  // const allPincode: any = useAppSelector(
  //   (state: any) => state.getPincodeByCity?.data?.pincode
  // );
  const allPincode: any = useAppSelector(
    (state: any) => state.getPincodeByTehsil?.data?.pincodeList
  );

  const allTehsil: any = useAppSelector(
    (state: any) => state.getTehsilByCity?.data?.tehsilList
  );

  const [isCheckedMailing, setIsCheckedMailing] = useState(false);
  const [isCheckedDestination, setIsCheckedDestination] = useState(false);

  const {
    control,
    trigger,
    handleSubmit,
    reset: resetAddress,
    watch: watchAddress,
    setValue: setAddressValue,
  } = useForm({
    defaultValues: formDefaultValues,
    mode: "onChange",
    resolver: yupResolver(yupValidationSchema),
  });

  const particularState = watchAddress("state");
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editRecord, setEditRecord] = useState<any>({});
  const [headerChecked, setHeaderChecked] = useState<boolean>(false);
  const [officeChecked, setOfficeChecked] = useState<boolean>(false);
  const [isStateFocused, setIsStateFocused] = useState<boolean>(false);
  const [cityDropDownOptions, setCityDropDownOptions] = useState<Array<any>>(
    []
  );
  const [pinCodeDropDownOptions, setPinCodeDropDownOptions] = useState<
    Array<any>
  >([]);
  const [stateOptionChangeCounter, setStateOptionChangeCounter] =
    useState<number>(0);
  const [tehsilDropDownOptions, setTehsilDropDownOptions] = useState<
    Array<any>
  >([]);

  const [resPinCodeOptions, setResPinCodeOptions] = useState<Array<any>>([]);
  const [perPinCodeOptions, setPerPinCodeOptions] = useState<Array<any>>([]);
  const [offcPinCodeOptions, setOffcPinCodeOptions] = useState<Array<any>>([]);

  const [resTehsilOptions, setResTehsilOptions] = useState<Array<any>>([]);
  const [perTehsilOptions, setPerTehsilOptions] = useState<Array<any>>([]);
  const [offcTehsilOptions, setOffcTehsilOptions] = useState<Array<any>>([]);

  const [isSameAsSelected, setIsSameAsSelected] = useState<boolean>(false);
  const [renderAfterUpdateSameAsAddress, setRenderAfterUpdateSameAsAddress] =
    useState(0);

  // useEffect(() => {
  //   const getWorkListLeadDetails = () => {
  //     const GET_CITIES_BY_STATE = {
  //       userDetail: {
  //         userId: "1100000421",
  //         companyId: "1000000001",
  //         actionId: "1000000002",
  //       },
  //       deviceDetail: {
  //         platform: "win32",
  //         OSName: "",
  //         OSVers: "",
  //         browserName: "",
  //         browserVer: "",
  //         IP: "192.168.1.1",
  //         city: "1000000001",
  //         countrycode: "",
  //         date: "",
  //         time: "",
  //       },
  //       requestData: {
  //         id: particularState?.value ?? "",
  //         action: "city",
  //       },
  //     };
  //     dispatch(getCitiesByState(GET_CITIES_BY_STATE));
  //   };
  //   getWorkListLeadDetails();
  // }, [particularState]);

  const GET_CITIES_BY_STATE = (stateId: any) => ({
    ...MASTER_PAYLOAD,
    requestData: {
      id: stateId ?? "",
      action: "city",
    },
  });

  const handleState = (selectedState: any) => {
    if (selectedState) {
      const stateId = selectedState?.e?.value;
      //dispatch(getCitiesByState(GET_CITIES_BY_STATE(stateId)));
      setAddressValue("city", null);
      setAddressValue("locality", null);
      setAddressValue("zipcode", null);
      setStateOptionChangeCounter((prev: number) => prev + 1);
    }
  };

  useEffect(() => {
    dispatch(getCitiesByState(GET_CITIES_BY_STATE("")));
  }, []);

  useEffect(() => {
    trigger();
  }, [watch("mobile_no1"), trigger]);

  // useEffect(() => {
  //   const getWorkListLeadDetails = () => {
  //     const GET_PINCODE_BY_CITY = {
  //       userDetail: {
  //         userId: "1100000421",
  //         companyId: "1000000001",
  //         actionId: "1000000002",
  //       },
  //       deviceDetail: {
  //         platform: "win32",
  //         OSName: "",
  //         OSVers: "",
  //         browserName: "",
  //         browserVer: "",
  //         IP: "192.168.1.1",
  //         city: "1000000001",
  //         countrycode: "",
  //         date: "",
  //         time: "",
  //       },
  //       requestData: {
  //         id: particularCity?.value ?? "",
  //         action: "pincode",
  //       },
  //     };
  //     dispatch(getPincodeByCity(GET_PINCODE_BY_CITY));
  //   };
  //   getWorkListLeadDetails();
  // }, [particularCity]);
  // const GET_PINCODE_BY_CITY = (cityId: any) => ({
  //   ...MASTER_PAYLOAD,
  //   requestData: {
  //     id: cityId ?? "",
  //     action: "pincode",
  //   },
  // });

  // useEffect(() => {
  //   const cityId = watchAddress("city")?.value;
  //   if (cityId) {
  //     dispatch(getPincodeByCity(GET_PINCODE_BY_CITY(cityId)));
  //   }
  // }, [watchAddress("city")]);

  // const handleCity = (selectedCity: any) => {
  //   if (selectedCity) {
  //     const cityId = selectedCity?.e?.value;
  //     dispatch(getPincodeByCity(GET_PINCODE_BY_CITY(cityId)));
  //   }
  // };

  const GET_PINCODE_BY_TEHSIL = (tehsilId: any) => ({
    ...MASTER_PAYLOAD,
    requestData: {
      tehsilId: tehsilId ?? "",
    },
  });

  useEffect(() => {
    const tehsilId = watchAddress("locality")?.value;
    if (tehsilId) {
      dispatch(getPincodeByTehsil(GET_PINCODE_BY_TEHSIL(tehsilId)));
      // setAddressValue("zipcode", null);
    }
  }, [watchAddress("locality")]);

  const handleTehsil = (selectedTehsil: any) => {
    if (selectedTehsil) {
      const tehsilId = selectedTehsil?.e?.value;
      dispatch(getPincodeByTehsil(GET_PINCODE_BY_TEHSIL(tehsilId)));
      setAddressValue("zipcode", null);
    }
  };

  const GET_TEHSIL_BY_CITY = (cityId: any) => ({
    ...MASTER_PAYLOAD,
    requestData: {
      cityId: cityId ?? "",
    },
  });

  useEffect(() => {
    const cityId = watchAddress("city")?.value;
    if (cityId) {
      dispatch(getTehsilByCity(GET_TEHSIL_BY_CITY(cityId)));
      // setAddressValue("locality", null);
      // setAddressValue("zipcode", null);
    }
  }, [watchAddress("city")]);

  const handleTehesilByCity = (selectedCity: any) => {
    if (selectedCity) {
      const cityId = selectedCity?.e?.value;
      dispatch(getTehsilByCity(GET_TEHSIL_BY_CITY(cityId)));
      setAddressValue("locality", null);
      setAddressValue("zipcode", null);
    }
  };

  useEffect(() => {
    if (allTehsil) {
      const OPTIONS = allTehsil?.map((el: AddressProps) => {
        const tehsil = {
          label: el?.tehsilMasterName,
          value: el?.tehsilMasterId,
        };
        return tehsil;
      });
      setTehsilDropDownOptions(OPTIONS);
    }
  }, [allTehsil, isOpen]);

  const state = allMastersData?.stateList?.map((el: AddressProps) => {
    const myState = {
      label: el?.displayName,
      value: el?.stateMasterId,
    };
    return myState;
  });

  const occupancyMaster = allMastersData?.occupancyStatus?.map(
    (el: AddressProps) => {
      return {
        label: el?.occupancyStName,
        value: el?.occupancyStId,
      };
    }
  );

  useEffect(() => {
    if (allPincode) {
      const OPTIONS = allPincode?.map((el: AddressProps) => {
        const zipcode = {
          label: `${el?.pincode} - ${el?.divisionName}`,
          value: el?.pincode,
          id: el?.pincodeMasterId,
        };
        return zipcode;
      });
      setPinCodeDropDownOptions(OPTIONS);
    }
  }, [allPincode, isOpen]);

  useEffect(() => {
    if (!particularState?.value) return;
    const OPTIONS = allCities
      ?.filter((el: AddressProps) => el.stateId === particularState?.value)
      .map((el: { displayName: string; cityMasterId: string }) => ({
        label: el?.displayName,
        value: el?.cityMasterId,
      }));
    setCityDropDownOptions(OPTIONS);
  }, [allCities, particularState?.value]);

  useEffect(() => {
    const filteredState = allMastersData?.stateList?.find(
      (el: { stateMasterId: any }) => el.stateMasterId === editRecord?.state
    );

    const filteredOccupancy = allMastersData?.occupancyStatus?.find(
      (el: { occupancyStId: any }) =>
        el.occupancyStId === editRecord?.occupancyStatus
    );
    if (editRecord) {
      if (
        (editRecord.state ||
          editRecord.city ||
          editRecord.zipcode ||
          editRecord.occupancyStatus) &&
        editRecord.addressFlag === "add"
      ) {
        resetAddress({
          ...editRecord,
          state: {
            label: filteredState?.displayName,
            value: filteredState?.stateMasterId,
          },
          city: {
            label: editRecord.cityName ?? "",
            value: editRecord?.city ?? "",
          },
          occupancyStatus: {
            label: filteredOccupancy?.occupancyStName ?? "",
            value: filteredOccupancy?.occupancyStId ?? "",
          },
        });
      } else {
        resetAddress(editRecord);
      }
    }
  }, [editRecord, isOpen]);

  useEffect(() => {
    if (
      !isSameAsSelected &&
      (editRecord.state ||
        editRecord.city ||
        editRecord.zipcode ||
        editRecord.occupancyStatus)
    ) {
      // const toPass = selState != "" ? selState : editRecord?.state;
      // const filterState = state?.find((el: any) => {
      //   return el.value === toPass;
      // });

      const filterState = state?.find((el: any) => {
        return el.value === editRecord?.state;
      });

      const filteredOccupancy = allMastersData?.occupancyStatus?.find(
        (el: { occupancyStId: any }) =>
          el.occupancyStId === editRecord?.occupancyStatus
      );

      setAddressValue("state", {
        label: filterState?.label ?? null,
        value: filterState?.value ?? null,
      });
      setAddressValue("occupancyStatus", {
        label: filteredOccupancy?.occupancyStName ?? null,
        value: filteredOccupancy?.occupancyStId ?? null,
      });
    }
  }, [
    editRecord,
    allMastersData,
    pinCodeDropDownOptions,
    isSameAsSelected,
    isOpen,
    onClose,
  ]);

  useEffect(() => {
    if (!isSameAsSelected && editRecord && editRecord.city) {
      const filteredCity = cityDropDownOptions?.find((el: any) => {
        return el?.value === editRecord?.city;
      });

      if (filteredCity && stateOptionChangeCounter < 1) {
        setAddressValue("city", {
          label: filteredCity?.label,
          value: filteredCity?.value,
        });
      }
    }
  }, [
    cityDropDownOptions,
    editRecord,
    stateOptionChangeCounter,
    isSameAsSelected,
    isOpen,
    onClose,
  ]);

  useEffect(() => {
    if (!isSameAsSelected && editRecord && editRecord.locality) {
      const filteredTehsil = tehsilDropDownOptions?.find((el: any) => {
        return el?.value === editRecord?.locality;
      });
      if (filteredTehsil && stateOptionChangeCounter < 1) {
        setAddressValue("locality", {
          label: filteredTehsil?.label,
          value: filteredTehsil?.value,
        });
        // editRecord.cityName = filteredCity?.label;
      }
    }
  }, [
    tehsilDropDownOptions,
    editRecord,
    stateOptionChangeCounter,
    isSameAsSelected,
    isOpen,
    onClose,
  ]);

  useEffect(() => {
    if (
      !isSameAsSelected &&
      (editRecord.state ||
        editRecord.city ||
        editRecord.locality ||
        editRecord.zipcode ||
        editRecord.occupancyStatus)
    ) {
      // const filteredPincode = pinCodeDropDownOptions?.find((el: any) => {
      //   return el.value === editRecord.zipcode;
      // });
      const filteredPincode = pinCodeDropDownOptions?.find((el: any) => {
        return el.id === editRecord.zipcodeId;
      });

      if (filteredPincode) {
        setAddressValue("zipcode", {
          label: filteredPincode.label,
          value: filteredPincode.value,
          id: filteredPincode?.id,
        });

        const tehsilId = watchAddress("locality")?.value;
        if (!tehsilId) {
          setAddressValue("zipcode", null);
        }
      }
    }
  }, [
    editRecord,
    allMastersData,
    pinCodeDropDownOptions,
    isSameAsSelected,
    isOpen,
    onClose,
  ]);

  // reset the city and pincode when state is empty
  useEffect(() => {
    if (particularState == null && isStateFocused) {
      // setAddressValue("city", "");
      // setAddressValue("locality", "");
      // setAddressValue("zipcode", "");
      setAddressValue("city", null);
      setAddressValue("locality", null);
      setAddressValue("zipcode", null);
    }
  }, [particularState, isStateFocused]);

  useEffect(() => {
    if (isOpen) setAddressValue("company_name", watchAddress("company_name"));
    else {
      setStateOptionChangeCounter(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (allAddress) {
      const finalAddress = allAddress?.map(
        (data: {
          state: { value: string };
          city: { value: string };
          zipcode: { value: string };
          occupancyStatus: { value: string };
          locality: { value: string };
          //zipcodeId: { id: string };
        }) => {
          return {
            ...data,
            state: (data.state as { value: string })?.value ?? "",
            city: (data.city as { value: string })?.value ?? "",
            zipcode: (data.zipcode as { value: string })?.value ?? "",
            occupancyStatus:
              (data.occupancyStatus as { value: string })?.value ?? "",
            locality: (data.locality as { value: string })?.value ?? "",
            //zipcodeId: (data.zipcodeId as { id: string })?.id ?? "",
          };
        }
      );
      setValue("listAddress", finalAddress, {
        shouldDirty: true,
      });
      resetAddress();
    }
  }, [allAddress]);
  const OpenAddressMenu = (record: any) => {
    setEditRecord(record);
  };
  const sameAsAddressOptionList = [
    {
      name: "Permanent Address",
      id: 1,
    },
    {
      name: "Residence Address",
      id: 2,
    },
    {
      name: "Office Address",
      id: 3,
    },
  ];
  const filteredOptions = sameAsAddressOptionList.filter(option => {
    if (editRecord.addressType === "1000000002") {
      return option.id === 2;
    } else if (editRecord.addressType === "1000000003") {
      return option.id === 1 || option.id === 2;
    }
  });
  useEffect(() => {
    if (editRecord?.sameAsDropdown) {
      const sameAsDropdownLabel = filteredOptions?.find(
        e => e?.id == editRecord.sameAsDropdown
      )?.name;
      setAddressValue("sameAsDropdown", {
        label: sameAsDropdownLabel,
        value: editRecord.sameAsDropdown,
      });
    }
  }, [editRecord]);

  const mappedOptions = filteredOptions.map(option => ({
    label: option.name,
    value: option.id,
  }));

  const columns = [
    {
      title: t("newLead.addressDetails.addressType"),
      dataIndex: "addressType",
      key: "addressType",
      render: (type: any) => {
        if (type == "1000000002")
          return (
            <p
              style={{ fontWeight: "600", color: "#4A5568", fontSize: "12px" }}
            >
              Permanent Address
            </p>
          );
        if (type == "1000000001")
          return (
            <p
              style={{ fontWeight: "600", color: "#4A5568", fontSize: "12px" }}
            >
              Residence Address
            </p>
          );
        if (type == "1000000003")
          return (
            <p
              style={{ fontWeight: "600", color: "#4A5568", fontSize: "12px" }}
            >
              Office Address
            </p>
          );
      },
    },
    {
      title: t("newLead.addressDetails.addressDetails"),
      dataIndex: "details",
      render: (type: any, record: any) =>
        convertingSelectValues(
          record,
          "address",
          allMastersData,
          allPincode,
          allCities,
          allTehsil,
          resPinCodeOptions,
          perPinCodeOptions,
          offcPinCodeOptions,
          resTehsilOptions,
          perTehsilOptions,
          offcTehsilOptions
        ),
    },
    {
      title: t("newLead.addressDetails.mailing"),
      dataIndex: "mailingAddress",
      size: 15,
      render: (_: any, record: any, rowIndex: any) => {
        let isDisabled = false;
        entity?.value === "1000000002" && record.addressType !== "1000000003"
          ? (isDisabled = true)
          : isDisabled;
        return (
          <>
            <Radio
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onChange={() => handleRadioChangeMailing(record.addressType)}
              name={`mailingAddress${rowIndex}`}
              isChecked={
                entity?.value === "1000000002"
                  ? record.addressType === radioCheckedMailing ||
                    (!radioCheckedMailing &&
                      record.addressType === "1000000003")
                  : record.addressType === radioCheckedMailing ||
                    (!radioCheckedMailing &&
                      record.addressType === "1000000001")
              }
              size={"lg"}
              isDisabled={isDisabled}
            />
          </>
        );
      },
    },
    {
      title: t("newLead.addressDetails.destination"),
      dataIndex: "destinationAddress",
      size: 20,
      render: (_: any, record: any, rowIndex: any) => {
        let isDisabled = false;
        entity?.value === "1000000002" && record.addressType !== "1000000003"
          ? (isDisabled = true)
          : isDisabled;
        return (
          <>
            <Radio
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onChange={() => handleRadioChangeDestination(record.addressType)}
              name={`destinationAddress${rowIndex}`}
              isChecked={
                entity?.value === "1000000002"
                  ? record.addressType === radioCheckedDestination ||
                    (!radioCheckedDestination &&
                      record.addressType === "1000000003")
                  : record.addressType === radioCheckedDestination ||
                    (!radioCheckedDestination &&
                      record.addressType === "1000000001")
              }
              size={"lg"}
              isDisabled={isDisabled}
            />
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "",
      render: (record: any) => {
        let isDisabled = false;
        entity?.value === "1000000002" && record.addressType !== "1000000003"
          ? (isDisabled = true)
          : isDisabled;
        return (
          <>
            <Flex justify={"space-between"} align={"center"}>
              <IconButton
                icon={<FiMenu></FiMenu>}
                onClick={() => {
                  onOpen();
                  OpenAddressMenu(record);
                  setAddressType(record.addressType);
                }}
                aria-label="menu"
                variant={"outline"}
                colorScheme="MifinColor?.black_opacity_black_70"
                isRound
                size={"xs"}
                isDisabled={isDisabled}
              ></IconButton>
            </Flex>
          </>
        );
      },
    },
  ];

  const saveAddress = (data: any) => {
    // Create the payload
    const payload = {
      ...data,
      addressFlag: "update",
      state: data.state?.value || "", // Ensure `state.value` is handled correctly
      city: data.city?.value || "",
      zipcode: data.zipcode?.value || "",
      occupancyStatus: data.occupancyStatus?.value || "",
      sameAsDropdown:
        data?.addressType !== "1000000001"
          ? data?.sameAsDropdown?.value ?? ""
          : "", // Set `sameAsDropdown` only if addressType is not "1000000002"
      locality: data.locality?.value || "",
      zipcodeId: data.zipcode?.id || "",
    };

    // Update the allAddress state
    setAllAddress((prevItems: any) =>
      prevItems.map((item: any) =>
        item.addressType === data.addressType ? payload : item
      )
    );

    const addressTypes = {
      "1000000001": setResPinCodeOptions,
      "1000000002": setPerPinCodeOptions,
      "1000000003": setOffcPinCodeOptions,
    };

    if (data?.addressType && addressTypes[data?.addressType] && allPincode) {
      const OPTIONS = allPincode.map((el: AddressProps) => ({
        label: `${el?.pincode} - ${el?.divisionName}`,
        value: el?.pincode,
        id: el?.pincodeMasterId,
        divisionName: el?.divisionName,
      }));
      addressTypes[data?.addressType](OPTIONS);
    }

    const addressTypesForTehsil = {
      "1000000001": setResTehsilOptions,
      "1000000002": setPerTehsilOptions,
      "1000000003": setOffcTehsilOptions,
    };

    if (
      data?.addressType &&
      addressTypesForTehsil[data?.addressType] &&
      allTehsil
    ) {
      const OPTIONS = allTehsil.map((el: AddressProps) => ({
        label: el?.tehsilMasterName,
        value: el?.tehsilMasterId,
      }));
      addressTypesForTehsil[data?.addressType](OPTIONS);
    }

    // Close the modal or form
    onClose();
  };

  const sameAsAddressDropddown = watchAddress("sameAsDropdown");
  useEffect(() => {
    if (isOpen && sameAsAddressDropddown) {
      setIsSameAsSelected(true);
    } else {
      setIsSameAsSelected(false);
    }
  }, [isOpen, sameAsAddressDropddown]);

  const sameAsCityId = useMemo(() => {
    const filteredAddress = allAddress?.find((el: any) => {
      return el.addressType === getAdressType(sameAsAddressDropddown?.label);
    });
    return filteredAddress?.city;
  }, [allAddress, sameAsAddressDropddown]);

  const sameAsLocalityId = useMemo(() => {
    const filteredAddress = allAddress?.find((el: any) => {
      return el.addressType === getAdressType(sameAsAddressDropddown?.label);
    });
    return filteredAddress?.locality;
  }, [allAddress, sameAsAddressDropddown]);

  const { data: getSameAsNewTehsilByCity, refetch: refetchSameAsTehsil } =
    useGetNewTehsilByCity(sameAsCityId);

  const { data: getSameAsNewPincodeByTehsil, refetch: refetchSameAsPincode } =
    useGetNewPincodeByTehsil(sameAsLocalityId);

  useEffect(() => {
    const sameAsDropDown = watchAddress("sameAsDropdown");
    const filtredAdress = allAddress?.find((el: any) => {
      return el.addressType === getAdressType(sameAsDropDown?.label);
    });
    const matchedOccupancy = occupancyMaster?.find(
      (occupancy: any) => occupancy?.value === filtredAdress?.occupancyStatus
    );

    const matchedState = state?.find(
      (st: any) => st?.value === filtredAdress?.state
    );

    const matchedCity = cityDropDownOptions?.find((city: any) => {
      return city?.value === filtredAdress?.city;
    });

    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.value === filtredAdress?.zipcode
    // );
    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.id === filtredAdress?.zipcodeId
    // );
    // const matchedTehsil = tehsilDropDownOptions?.find(
    //   (tehsil: any) => tehsil?.value === filtredAdress?.locality
    // );

    const matchedTehsil = getSameAsNewTehsilByCity?.tehsilList?.find(
      (tehsil: any) => tehsil?.tehsilMasterId === filtredAdress?.locality
    );

    const matchedPincode = getSameAsNewPincodeByTehsil?.pincodeList?.find(
      (pin: any) => pin?.pincodeMasterId === filtredAdress?.zipcodeId
    );

    if (headerChecked && editRecord?.addressType === "1000000002") {
      if (matchedState) {
        setAddressValue("state", {
          label: matchedState?.label,
          value: matchedState?.value,
        });
      }

      if (matchedCity) {
        setAddressValue("city", {
          label: matchedCity?.label,
          value: matchedCity?.value,
        });
      }

      // if (matchedTehsil) {
      //   setAddressValue("locality", {
      //     label: matchedTehsil?.label,
      //     value: matchedTehsil?.value,
      //   });
      // }

      // if (matchedPincode) {
      //   setAddressValue("zipcode", {
      //     label: matchedPincode?.label,
      //     value: matchedPincode?.value,
      //     id: matchedPincode?.id,
      //   });
      // }

      if (matchedTehsil) {
        setAddressValue("locality", {
          label: matchedTehsil?.tehsilMasterName,
          value: matchedTehsil?.tehsilMasterId,
        });
      }

      if (matchedPincode) {
        setAddressValue("zipcode", {
          label: `${matchedPincode?.pincode} - ${matchedPincode?.divisionName}`,
          value: matchedPincode?.pincode,
          id: matchedPincode?.pincodeMasterId,
        });
      }

      setAddressValue("landmark", filtredAdress?.landmark);
      setAddressValue("company_name", watchAddress("company_name"));
      setAddressValue("address", filtredAdress?.address);
      setAddressValue("flatNo", filtredAdress?.flatNo);
      setAddressValue("floorNo", filtredAdress?.floorNo);
      setAddressValue("mobile_no1", filtredAdress?.mobile_no1);
      //setAddressValue("locality", filtredAdress?.locality);

      if (matchedOccupancy) {
        setAddressValue("occupancyStatus", {
          label: matchedOccupancy?.label,
          value: matchedOccupancy?.value,
        });
      }
      setTimeout(() => {
        setRenderAfterUpdateSameAsAddress(prev => prev + 1);
      }, 0);
    }
  }, [
    headerChecked,
    watchAddress("sameAsDropdown"),
    editRecord?.addressType === "1000000002",
    stateOptionChangeCounter,
    cityDropDownOptions,
    getSameAsNewTehsilByCity,
    getSameAsNewPincodeByTehsil,
    isSameAsSelected,
  ]);

  useEffect(() => {
    const sameAsDropDown = watchAddress("sameAsDropdown");
    const filtredAdress = allAddress?.find((el: any) => {
      return el.addressType === getAdressType(sameAsDropDown?.label);
    });
    const matchedCity = cityDropDownOptions?.find((city: any) => {
      return city?.value === filtredAdress?.city;
    });
    if (matchedCity) {
      setAddressValue("city", {
        label: matchedCity?.label,
        value: matchedCity?.value,
      });
    }
  }, [
    headerChecked,
    watchAddress("sameAsDropdown"),
    editRecord?.addressType === "1000000001",
    cityDropDownOptions,
    isSameAsSelected,
  ]);

  useEffect(() => {
    const sameAsDropDown = watchAddress("sameAsDropdown");
    const filtredAdress = allAddress?.find((el: any) => {
      return el.addressType === getAdressType(sameAsDropDown?.label);
    });
    const matchedOccupancy = occupancyMaster?.find(
      (occupancy: any) => occupancy?.value === filtredAdress?.occupancyStatus
    );

    const matchedState = state?.find(
      (st: any) => st?.value === filtredAdress?.state
    );
    const matchedCity = cityDropDownOptions?.find(
      (city: any) => city?.value === filtredAdress?.city
    );

    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.value === filtredAdress?.zipcode
    // );
    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.id === filtredAdress?.zipcodeId
    // );
    // const matchedTehsil = tehsilDropDownOptions?.find(
    //   (tehsil: any) => tehsil?.value === filtredAdress?.locality
    // );
    // if (getSameAsNewPincodeByTehsil?.pincodeList) {
    //   const OPTIONS = getSameAsNewPincodeByTehsil?.pincodeList?.map((el: AddressProps) => {
    //     const tehsil = {
    //       label: el?.tehsilMasterName,
    //       value: el?.tehsilMasterId,
    //     };
    //     return tehsil;
    //   });
    //   setTehsilDropDownOptions(OPTIONS);
    // }
    const matchedTehsil = getSameAsNewTehsilByCity?.tehsilList?.find(
      (tehsil: any) => tehsil?.tehsilMasterId === filtredAdress?.locality
    );

    const matchedPincode = getSameAsNewPincodeByTehsil?.pincodeList?.find(
      (pin: any) => pin?.pincodeMasterId === filtredAdress?.zipcodeId
    );

    if (officeChecked && editRecord?.addressType === "1000000003") {
      if (matchedState) {
        setAddressValue("state", {
          label: matchedState?.label,
          value: matchedState?.value,
        });
      }
      if (matchedCity) {
        setAddressValue("city", {
          label: matchedCity?.label,
          value: matchedCity?.value,
        });
      }

      // if (matchedTehsil) {
      //   setAddressValue("locality", {
      //     label: matchedTehsil?.label,
      //     value: matchedTehsil?.value,
      //   });
      // }

      // if (matchedPincode) {
      //   setAddressValue("zipcode", {
      //     label: matchedPincode?.label,
      //     value: matchedPincode?.value,
      //     id: matchedPincode?.id,
      //   });
      // }
      // refetchSameAsTehsil();
      // refetchSameAsPincode();
      if (matchedTehsil) {
        setAddressValue("locality", {
          label: matchedTehsil?.tehsilMasterName,
          value: matchedTehsil?.tehsilMasterId,
        });
      }

      if (matchedPincode) {
        setAddressValue("zipcode", {
          label: `${matchedPincode?.pincode} - ${matchedPincode?.divisionName}`,
          value: matchedPincode?.pincode,
          id: matchedPincode?.pincodeMasterId,
        });
      }

      setAddressValue("landmark", filtredAdress?.landmark);
      setAddressValue("company_name", watchAddress("company_name"));
      setAddressValue("address", filtredAdress?.address);
      setAddressValue("flatNo", filtredAdress?.flatNo);
      setAddressValue("floorNo", filtredAdress?.floorNo);
      setAddressValue("mobile_no1", filtredAdress?.mobile_no1);
      //setAddressValue("locality", filtredAdress?.locality);

      if (matchedOccupancy) {
        setAddressValue("occupancyStatus", {
          label: matchedOccupancy?.label,
          value: matchedOccupancy?.value,
        });
      }
      setTimeout(() => {
        setRenderAfterUpdateSameAsAddress(prev => prev + 1);
      }, 0);
    }
  }, [
    officeChecked,
    watchAddress("sameAsDropdown"),
    editRecord?.addressType === "1000000003",
    stateOptionChangeCounter,
    allAddress,
    isSameAsSelected,
    getSameAsNewTehsilByCity,
    getSameAsNewPincodeByTehsil,
    isOpen,
  ]);

  // Nalin

  useEffect(() => {
    if (renderAfterUpdateSameAsAddress > 0) {
      const sameAsDropDown = watchAddress("sameAsDropdown");
      const filtredAdress = allAddress?.find((el: any) => {
        return el.addressType === getAdressType(sameAsDropDown?.label);
      });
      const matchedTehsil = getSameAsNewTehsilByCity?.tehsilList?.find(
        (tehsil: any) => tehsil?.tehsilMasterId === filtredAdress?.locality
      );

      const matchedPincode = getSameAsNewPincodeByTehsil?.pincodeList?.find(
        (pin: any) => pin?.pincodeMasterId === filtredAdress?.zipcodeId
      );
      if (matchedTehsil) {
        setAddressValue("locality", {
          label: matchedTehsil?.tehsilMasterName,
          value: matchedTehsil?.tehsilMasterId,
        });
      }

      if (matchedPincode) {
        setAddressValue("zipcode", {
          label: `${matchedPincode?.pincode} - ${matchedPincode?.divisionName}`,
          value: matchedPincode?.pincode,
          id: matchedPincode?.pincodeMasterId,
        });
      }
    }
  }, [renderAfterUpdateSameAsAddress]);

  useEffect(() => {
    if (
      (mailigAddress2 === "Y" ||
        mailigAddress4 === "Y" ||
        mailigAddress3 === "Y") &&
      (headerChecked || officeChecked)
    )
      setIsCheckedMailing(true);
    else {
      setIsCheckedMailing(false);
    }
  }, [mailigAddress2, mailigAddress4, mailigAddress3, setIsCheckedMailing]);

  useEffect(() => {
    if (
      (destinationAddress2 === "Y" ||
        destinationAddress3 === "Y" ||
        destinationAddress4 === "Y") &&
      (headerChecked || officeChecked)
    )
      setIsCheckedDestination(true);
    else {
      setIsCheckedDestination(false);
    }
  }, [
    destinationAddress2,
    destinationAddress3,
    setIsCheckedDestination,
    destinationAddress4,
  ]);

  const handleCheckboxChange = (addressType: string) => {
    if (addressType === "1000000002") {
      setHeaderChecked(prev => !prev);
      // setOfficeChecked(false);
    } else if (addressType === "1000000003") {
      setOfficeChecked(prev => !prev);
      // setHeaderChecked(false);
    }
  };

  const isCheckboxChecked = useWatch({
    control,
    name: "sameAsCheckBox",
  });

  useEffect(() => {
    if (!isCheckboxChecked) {
      resetAddress();
    }
  }, [isCheckboxChecked]);
  useEffect(() => {
    if (!watchAddress("state") || watchAddress("state") == null) {
      setAddressValue("city", null);
      setAddressValue("zipcode", null);
    }
    if (!watchAddress("city") || watchAddress("city") == null) {
      setAddressValue("locality", null);
      setAddressValue("zipcode", null);
    }
    if (!watchAddress("locality") || watchAddress("locality") == null) {
      setAddressValue("zipcode", null);
    }
  }, [watchAddress("state"), watchAddress("city"), watchAddress("locality")]);
  const getAddressTitle = (type: string) => {
    switch (type) {
      case "1000000001":
        return t("common.residenceAddress");
      case "1000000002":
        return t("common.permanentAddress");
      case "1000000003":
        return t("common.officeAddress");
      default:
        return t("common.address");
    }
  };

  useEffect(() => {
    setRadioCheckedDestination(null);
    setRadioCheckedMailing(null);
  }, [location]);

  useEffect(() => {
    if (entity?.value === "1000000002") {
      setAllAddress((prevAddresses: any) =>
        prevAddresses.map(addr =>
          addr.addressType === "1000000003"
            ? { ...addr, mailingAddress: "Y", destinationAddress: "Y" }
            : addr
        )
      );
    } else {
      setAllAddress((prevAddresses: any) =>
        prevAddresses.map(addr =>
          addr.addressType === "1000000001"
            ? { ...addr, mailingAddress: "Y", destinationAddress: "Y" }
            : addr
        )
      );
    }
  }, [entity]);

  return (
    <Box marginTop="40px">
      <Heading
        marginBottom={6}
        color="#3E4954"
        fontSize={{ base: "18px", md: "18px" }}
      >
        {t("newLead.heading.addressDetails")}
      </Heading>
      <Box display={{ base: "none", md: "block" }}>
        <Table dataSource={allAddress} columns={columns} pagination={false} />
      </Box>
      <Box display={{ base: "block", md: "none" }}>
        <Stack spacing={2}>
          {allAddress?.map((address, index) => (
            <Card
              key={index}
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <CardBody>
                <Flex justify="space-between" align="flex-end" pb={2}>
                  <Text fontWeight="bold" fontSize="14px" color="gray.700">
                    Address Type :
                  </Text>
                  <Text fontSize={"14px"}>
                    {(address.addressType === "1000000002"
                      ? "Permanent Address"
                      : address.addressType === "1000000001"
                      ? "Residence Address"
                      : "Office Address"
                    ).toUpperCase()}
                  </Text>
                </Flex>
                <Flex align="center" wrap="wrap" gap={2}>
                  <Text
                    fontWeight="bold"
                    fontSize="14px"
                    color="gray.700"
                    whiteSpace="nowrap"
                  >
                    Address Details :
                  </Text>
                  <Text fontSize="sm" color="#1A202C" wordBreak="break-word">
                    {(
                      convertingSelectValues(
                        address,
                        "address",
                        allMastersData,
                        allPincode,
                        allCities,
                        allTehsil,
                        resPinCodeOptions,
                        perPinCodeOptions,
                        offcPinCodeOptions,
                        resTehsilOptions,
                        perTehsilOptions,
                        offcTehsilOptions
                      ) || ""
                    ).toUpperCase()}
                  </Text>
                </Flex>

                <Text fontWeight="bold" fontSize="14px" color="gray.700" mt={2}>
                  {/* Type of address */}
                </Text>
                <Stack
                  direction="row"
                  mt={1}
                  alignItems="center"
                  justify="space-between"
                >
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Text fontSize="sm">Mailing :</Text>
                    <Radio
                      onChange={() =>
                        handleRadioChangeMailing(address.addressType)
                      }
                      name={`mailingAddress${index}`}
                      isChecked={
                        address.addressType === radioCheckedMailing ||
                        (!radioCheckedMailing &&
                          address.addressType === "1000000001")
                      }
                      size="lg"
                    />

                    <Text fontSize="sm">Destination :</Text>
                    <Radio
                      onChange={() =>
                        handleRadioChangeDestination(address.addressType)
                      }
                      name={`destinationAddress${index}`}
                      isChecked={
                        address.addressType === radioCheckedDestination ||
                        (!radioCheckedDestination &&
                          address.addressType === "1000000001")
                      }
                      size="lg"
                    />
                  </Stack>

                  {/* IconButton is now aligned with checkboxes */}
                  <IconButton
                    icon={<FiMenu />}
                    onClick={() => {
                      onOpen();
                      OpenAddressMenu(address);
                      setAddressType(address.addressType);
                    }}
                    aria-label="menu"
                    variant="outline"
                    colorScheme="grey.200"
                    isRound
                    size="xs"
                  />
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Stack>
      </Box>

      <DrawerComponent
        // title={t("common.address")}
        title={getAddressTitle(addressType)}
        resetForm={resetAddress}
        isModalOpen={isOpen}
        closeModal={onClose}
        submitHandler={handleSubmit(saveAddress)}
        renderFooter={
          editRecord.addressFlag !== "add" ? (
            <PrimaryButton title={"Update"} type="submit" />
          ) : (
            <PrimaryButton title={t("common.add")} type="submit" />
          )
        }
      >
        <Box>
          {allAddress &&
            allAddress.map((data: any, index: number) => {
              return (
                <Box key={index}>
                  {editRecord?.addressType == data?.addressType ? (
                    <>
                      <Grid
                        mt={3}
                        mx={-1}
                        // templateColumns="repeat(1, 5fr 7fr)"
                        templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}
                        gap={4}
                      >
                        {" "}
                        {/* LEFT COLUMN: Checkbox + Label */}
                        <GridItem display="flex" alignItems="center" gap={2}>
                          {/* Checkbox sabse pehle */}
                          <FormCheckbox
                            control={control}
                            name="sameAsCheckBox"
                            // checked={
                            //   editRecord?.addressType === "1000000002"
                            //     ? headerChecked
                            //     : officeChecked
                            // }
                            checked={
                              editRecord?.addressType === "1000000002"
                                ? headerChecked
                                : editRecord?.addressType === "1000000003"
                                ? officeChecked
                                : false
                            }
                            onChangeEvents={() =>
                              handleCheckboxChange(editRecord?.addressType)
                            }
                          />

                          {/* Label uske baad */}
                          <FormLabel mb={0}>
                            <Text fontSize="14px" color="#000000B3">
                              {t("newLead.leadDrawer.sameAs")}
                            </Text>
                          </FormLabel>
                        </GridItem>
                        {/* RIGHT COLUMN: Select */}
                        <GridItem>
                          <SelectComponent
                            name="sameAsDropdown"
                            placeholder="Select"
                            control={control}
                            options={mappedOptions}
                            isDisabled={!isCheckboxChecked}
                          />
                        </GridItem>
                        {editRecord.addressType === "1000000003" && (
                          <>
                            <GridItem display={"flex"} alignItems="center">
                              <FormLabel
                                fontSize={"14px"}
                                color={"#000000B3"}
                                mb={-3}
                              >
                                {t("newLead.leadDrawer.companyName")}
                                <RequiredMark />
                              </FormLabel>
                            </GridItem>
                            <GridItem>
                              <TextInput
                                placeholder="Enter"
                                name="company_name"
                                control={control}
                                type="text"
                                hideError={false}
                              />
                            </GridItem>
                          </>
                        )}
                        <GridItem display={"flex"} alignItems="center">
                          <FormLabel mb={-3}>
                            <Text fontSize={"14px"} color={"#000000B3"}>
                              {t("newLead.leadDrawer.address1")}
                              <RequiredMark />
                            </Text>
                          </FormLabel>
                        </GridItem>
                        <GridItem>
                          <TextInput
                            name="address"
                            control={control}
                            type="text"
                            placeholder={t("common.enter")}
                            hideError={false}
                          />
                        </GridItem>
                        <GridItem display={"flex"} alignItems="center">
                          <FormLabel mb={-3}>
                            <Text fontSize={"14px"} color={"#000000B3"}>
                              {t("newLead.leadDrawer.address2")}
                            </Text>
                          </FormLabel>
                        </GridItem>
                        <GridItem>
                          <TextInput
                            name="flatNo"
                            control={control}
                            type="text"
                            placeholder={t("common.enter")}
                          />
                        </GridItem>
                        <GridItem display={"flex"} alignItems="center">
                          <FormLabel mb={-3}>
                            <Text fontSize={"14px"} color={"#000000B3"}>
                              {t("newLead.leadDrawer.address3")}
                            </Text>
                          </FormLabel>
                        </GridItem>
                        <GridItem>
                          <TextInput
                            name="floorNo"
                            control={control}
                            type="text"
                            placeholder={t("common.enter")}
                          />
                        </GridItem>
                        <GridItem display={"flex"} alignItems="center">
                          <FormLabel mb={-3}>
                            <Text fontSize={"14px"} color={"#000000B3"}>
                              {t("newLead.leadDrawer.landmark")}
                            </Text>
                          </FormLabel>
                        </GridItem>
                        <GridItem>
                          <TextInput
                            name="landmark"
                            control={control}
                            type="text"
                            placeholder={t("common.enter")}
                          />
                        </GridItem>
                        {/* <GridItem display={"flex"} alignItems="center">
                          <FormLabel
                            fontSize={"14px"}
                            color={"#000000B3"}
                            mb={-3}
                          >
                            {t("newLead.leadDrawer.mobileNo")}
                            <RequiredMark />
                          </FormLabel>
                        </GridItem>
                        <GridItem>
                          <TextInput
                            regex="numeric"
                            type="text"
                            control={control}
                            placeholder={t("common.enter")}
                            name="mobile_no1"
                            maxLength={10}
                            hideError={false}
                          />
                        </GridItem> */}
                        {/* <GridItem display={"flex"} alignItems="center">
                          <FormLabel mb={-3}>
                            <Text fontSize={"14px"} color={"#000000B3"}>
                              {t("newLead.leadDrawer.district")}
                            </Text>
                          </FormLabel>
                        </GridItem>
                        <GridItem>
                          <TextInput
                            name="locality"
                            control={control}
                            type="text"
                            placeholder={t("common.enter")}
                          />
                        </GridItem> */}
                        <GridItem display={"flex"} alignItems="center">
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {t("newLead.leadDrawer.state")}
                          </Text>
                          <RequiredMark />
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            control={control}
                            name="state"
                            options={state}
                            placeholder={t("common.select")}
                            onCustomChange={handleState}
                            onFocus={() => setIsStateFocused(true)}
                            onBlur={() => setIsStateFocused(false)}
                            hideError={false}
                            // isDisabled={
                            //   watchAddress("sameAsCheckBox") ? true : false
                            // }
                            isDisabled={
                              editRecord?.addressType === "1000000002"
                                ? headerChecked
                                : editRecord?.addressType === "1000000003"
                                ? officeChecked
                                : false
                            }
                          />
                        </GridItem>
                        <GridItem display={"flex"} alignItems="center">
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {/* {t("newLead.leadDrawer.city")} */}
                            {t("newLead.leadDrawer.district")}
                          </Text>
                          <RequiredMark />
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            control={control}
                            name="city"
                            options={cityDropDownOptions}
                            onCustomChange={handleTehesilByCity}
                            placeholder={t("common.select")}
                            hideError={false}
                            // isDisabled={
                            //   watchAddress("sameAsCheckBox") ? true : false
                            // }
                            isDisabled={
                              editRecord?.addressType === "1000000002"
                                ? headerChecked
                                : editRecord?.addressType === "1000000003"
                                ? officeChecked
                                : false
                            }
                          />
                        </GridItem>
                        <GridItem display={"flex"} alignItems="center">
                          {/* <FormLabel mb={-3}> */}
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {/* {t("newLead.leadDrawer.district")} */}
                            {t("newLead.leadDrawer.tehsil")}
                          </Text>
                          {/* </FormLabel> */}
                          <RequiredMark />
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            control={control}
                            name="locality"
                            options={tehsilDropDownOptions}
                            onCustomChange={handleTehsil}
                            placeholder={t("common.select")}
                            //onCustomChange={handleState}
                            //onFocus={() => setIsStateFocused(true)}
                            //onBlur={() => setIsStateFocused(false)}
                            hideError={false}
                            // isDisabled={
                            //   watchAddress("sameAsCheckBox") ? true : false
                            // }
                            isDisabled={
                              editRecord?.addressType === "1000000002"
                                ? headerChecked
                                : editRecord?.addressType === "1000000003"
                                ? officeChecked
                                : false
                            }
                          />
                        </GridItem>
                        <GridItem display={"flex"} alignItems="center">
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {t("newLead.leadDrawer.pinCode")}
                          </Text>
                          <RequiredMark />
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            control={control}
                            name="zipcode"
                            options={pinCodeDropDownOptions}
                            placeholder={t("common.select")}
                            hideError={false}
                            // isDisabled={
                            //   watchAddress("sameAsCheckBox") ? true : false
                            // }
                            isDisabled={
                              editRecord?.addressType === "1000000002"
                                ? headerChecked
                                : editRecord?.addressType === "1000000003"
                                ? officeChecked
                                : false
                            }
                          />
                        </GridItem>
                        <GridItem>
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {t("newLead.leadDrawer.occupancyStatus")}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            control={control}
                            name="occupancyStatus"
                            options={occupancyMaster}
                            placeholder={t("common.select")}
                            // isDisabled={
                            //   watchAddress("sameAsCheckBox") ? true : false
                            // }
                            isDisabled={
                              editRecord?.addressType === "1000000002"
                                ? headerChecked
                                : editRecord?.addressType === "1000000003"
                                ? officeChecked
                                : false
                            }
                          />
                        </GridItem>
                        <Flex gap={2} alignItems={"flex-end"}></Flex>
                      </Grid>
                    </>
                  ) : null}
                </Box>
              );
            })}
        </Box>
      </DrawerComponent>
      <Divider sx={dividerStyling} />
    </Box>
  );
};

export default Address;
