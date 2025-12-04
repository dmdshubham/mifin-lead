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
  FormControl,
  Stack,
  Card,
  CardBody,
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
import { getTehsilByCity } from "@mifin/redux/service/getTehsilByCity/api";
import { getPincodeByTehsil } from "@mifin/redux/service/getPincodeByTehsil/api";
import {
  useGetNewTehsilByCity,
  useGetNewPincodeByTehsil,
} from "@mifin/service/getAllNewDependentMasters/getAllNewDependentMasters";
const formDefaultValues = {
  mobile_no1: "",
  company_name: "",
  state: null as null | { label: string; value: string },
  city: null as null | { label: string; value: string },
  locality: null as null | { label: string; value: string },
  zipcode: null as null | { label: string; value: string; id: string },
};

const CustomerAddress: FC<AddressProps> = props => {
  const { setAllAddress, allAddress, isConvertedToCustomer } = props;
  const destinationAddress0 = allAddress?.[0]?.destinationAddress ?? "";
  const destinationAddress1 = allAddress?.[1]?.destinationAddress ?? "";
  const destinationAddress2 = allAddress?.[2]?.destinationAddress ?? "";
  const mailigAddress0 = allAddress?.[0]?.mailingAddress ?? "";
  const mailigAddress1 = allAddress?.[1]?.mailingAddress ?? "";
  const mailigAddress2 = allAddress?.[2]?.mailingAddress ?? "";

  const [resPinCodeOptions, setResPinCodeOptions] = useState<Array<any>>([]);
  const [perPinCodeOptions, setPerPinCodeOptions] = useState<Array<any>>([]);
  const [offcPinCodeOptions, setOffcPinCodeOptions] = useState<Array<any>>([]);

  const [resTehsilOptions, setResTehsilOptions] = useState<Array<any>>([]);
  const [perTehsilOptions, setPerTehsilOptions] = useState<Array<any>>([]);
  const [offcTehsilOptions, setOffcTehsilOptions] = useState<Array<any>>([]);
  const { watch, setValue, reset } = useFormContext();
  const entity = watch("custEntityTypeId");
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
  const [allTehsilMasters, setAllTehsilMasters] = useState<Array<any>>([]);
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

  const allTehsil: any = useAppSelector(
    (state: any) => state.getTehsilByCity?.data?.tehsilList
  );

  const allPincode: any = useAppSelector(
    (state: any) => state.getPincodeByTehsil?.data?.pincodeList
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
  const [permanentChecked, setPermanentChecked] = useState<boolean>(false);
  const [residenceChecked, setResidenceChecked] = useState<boolean>(false);
  const [officeChecked, setOfficeChecked] = useState<boolean>(false);
  const [isStateFocused, setIsStateFocused] = useState<boolean>(false);
  const [cityDropDownOptions, setCityDropDownOptions] = useState<Array<any>>(
    []
  );

  const [tehsilDropDownOptions, setTehsilDropDownOptions] = useState<
    Array<any>
  >([]);

  const [pinCodeDropDownOptions, setPinCodeDropDownOptions] = useState<
    Array<any>
  >([]);
  const [isSameAsSelected, setIsSameAsSelected] = useState<boolean>(false);

  const [stateOptionChangeCounter, setStateOptionChangeCounter] =
    useState<number>(0);
  const [selState, setSelState] = useState("");

  const GET_CITIES_BY_STATE = (stateId: any) => ({
    ...MASTER_PAYLOAD,
    requestData: {
      id: stateId ?? "",
      action: "city",
    },
  });

  const handleState = (selectedState: any) => {
    if (selectedState) {
      setSelState(selectedState?.e?.value);
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
    const sameAsCheckBox = watchAddress("sameAsCheckBox");
    if (!sameAsCheckBox) {
      resetAddress();
    }
  }, [watchAddress("sameAsCheckBox")]);
  useEffect(() => {
    trigger();
  }, [
    watch("mobile_no1"),
    watchAddress("state"),
    watchAddress("city"),
    watchAddress("locality"),
    watchAddress("zipcode"),
    trigger,
  ]);

  // const GET_PINCODE_BY_CITY = (cityId: any) => ({
  //   ...MASTER_PAYLOAD,
  //   requestData: {
  //     id: cityId ?? "",
  //     action: "pincode",
  //   },
  // });

  // useEffect(() => {
  //   const cityId = city?.value;
  //   console.log(cityId,allPincode, "cityId");
  //   if (cityId) {
  //     console.log(cityId, isOpen, "cityId1");
  //     dispatch(getPincodeByCity(GET_PINCODE_BY_CITY(cityId)));
  //   }
  // }, [city?.value, isOpen]);

  // const handleCity = (selectedCity: any) => {
  //   if (selectedCity) {
  //     const cityId = selectedCity?.e?.value;
  //     dispatch(getPincodeByCity(GET_PINCODE_BY_CITY(cityId)));
  //   }
  // };

  const city = watchAddress("city");
  // const { data: getNewTehsilByCity, refetch } = useGetNewTehsilByCity(
  //   watchAddress("city")?.value ?? watchAddress("city")?.value
  // );

  // const allTehsil = useMemo(() => {
  //   return getNewTehsilByCity?.tehsilList;
  // }, [getNewTehsilByCity?.tehsilList]);

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
      //setAddressValue("zipcode", null);
    }
  }, [watchAddress("locality"), isOpen]);

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
    const cityId = city?.value;
    if (cityId) {
      // refetch();
      dispatch(getTehsilByCity(GET_TEHSIL_BY_CITY(cityId)));
      //setAddressValue("locality", null);
      //setAddressValue("zipcode", null);
    }
  }, [
    city?.value,
    isOpen,
    cityDropDownOptions,
    setCityDropDownOptions,
    allCities,
  ]);

  const handleTehesilByCity = (selectedCity: any) => {
    if (selectedCity) {
      const cityId = selectedCity?.e?.value;
      dispatch(getTehsilByCity(GET_TEHSIL_BY_CITY(cityId)));
      setAddressValue("locality", null);
      setAddressValue("zipcode", null);
    }
  };

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
  }, [allTehsil]);

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
  }, [allPincode]);

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
          state: filteredState
            ? {
                label: filteredState?.displayName ?? null,
                value: filteredState?.stateMasterId ?? null,
              }
            : null,
          city: {
            label: editRecord.cityName ?? null,
            value: editRecord?.city ?? null,
          },
          occupancyStatus: {
            label: filteredOccupancy?.occupancyStName ?? null,
            value: filteredOccupancy?.occupancyStId ?? null,
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
      const toPass = selState != "" ? selState : editRecord?.state;
      const filterState = state?.find((el: any) => {
        return el.value === toPass;
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
    pinCodeDropDownOptions,
    allMastersData,
    isSameAsSelected,
    isOpen,
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
        // editRecord.cityName = filteredCity?.label;
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

      const cityId = watchAddress("city")?.value;
      if (!cityId) {
        setAddressValue("locality", null);
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
        editRecord.zipcode ||
        editRecord.occupancyStatus)
    ) {
      const filteredPincode = pinCodeDropDownOptions?.find((el: any) => {
        return el.id === editRecord.zipcodeId;
      });
      if (filteredPincode && stateOptionChangeCounter < 1) {
        setAddressValue("zipcode", {
          label: filteredPincode?.label,
          value: filteredPincode?.value,
          id: filteredPincode?.id,
        });
      }
      const tehsilId = watchAddress("locality")?.value;
      if (!tehsilId) {
        setAddressValue("zipcode", null);
      }
    }
  }, [
    editRecord,
    pinCodeDropDownOptions,
    allMastersData,
    isSameAsSelected,
    isOpen,
    stateOptionChangeCounter,
  ]);

  // reset the city and pincode when state is empty
  useEffect(() => {
    if (particularState == null && isStateFocused) {
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
        }) => {
          return {
            ...data,
            state: (data.state as { value: string })?.value ?? "",
            city: (data.city as { value: string })?.value ?? "",
            zipcode: (data.zipcode as { value: string })?.value ?? "",
            occupancyStatus:
              (data.occupancyStatus as { value: string })?.value ?? "",
            locality: (data.locality as { value: string })?.value ?? "",
          };
        }
      );
      setValue("listAddress", finalAddress, {
        shouldDirty: true,
      });
      resetAddress();
    }
  }, [allAddress]);

  const cityId0 = useMemo(() => {
    return allAddress?.[0]?.city;
  }, [allAddress]);
  const cityId1 = useMemo(() => {
    return allAddress?.[1]?.city;
  }, [allAddress]);
  const cityId2 = useMemo(() => {
    return allAddress?.[2]?.city;
  }, [allAddress]);

  const { data: getNewTehsilByCity0, refetch: refetchTehsil0 } =
    useGetNewTehsilByCity(cityId0);
  const { data: getNewTehsilByCity1, refetch: refetchTehsil1 } =
    useGetNewTehsilByCity(cityId1);
  const { data: getNewTehsilByCity2, refetch: refetchTehsil2 } =
    useGetNewTehsilByCity(cityId2);

  useEffect(() => {
    const tehsilMapOptions = (data: any) =>
      data?.tehsilList?.map((el: AddressProps) => ({
        label: el?.tehsilMasterName,
        value: el?.tehsilMasterId,
      }));
    const dataTableTehsil0 = tehsilMapOptions(getNewTehsilByCity0);
    const dataTableTehsil1 = tehsilMapOptions(getNewTehsilByCity1);
    const dataTableTehsil2 = tehsilMapOptions(getNewTehsilByCity2);

    if (dataTableTehsil0) {
      setResTehsilOptions(dataTableTehsil0);
    }
    if (dataTableTehsil1) {
      setPerTehsilOptions(dataTableTehsil1);
    }
    if (dataTableTehsil2) {
      setOffcTehsilOptions(dataTableTehsil2);
    }
  }, [
    getNewTehsilByCity0,
    getNewTehsilByCity1,
    getNewTehsilByCity2,
    allAddress,
  ]);

  const localityId0 = useMemo(() => {
    return allAddress?.[0]?.locality;
  }, [allAddress]);
  const localityId1 = useMemo(() => {
    return allAddress?.[1]?.locality;
  }, [allAddress]);
  const localityId2 = useMemo(() => {
    return allAddress?.[2]?.locality;
  }, [allAddress]);

  const { data: getNewPincodeByTehsilBy0, refetch: refetchPincode0 } =
    useGetNewPincodeByTehsil(localityId0);

  const { data: getNewPincodeByTehsilBy1, refetch: refetchPincode1 } =
    useGetNewPincodeByTehsil(localityId1);

  const { data: getNewPincodeByTehsilBy2, refetch: refetchPincode2 } =
    useGetNewPincodeByTehsil(localityId2);

  useEffect(() => {
    const pincodeMapOptions = (data: any) =>
      data?.pincodeList?.map((el: AddressProps) => ({
        label: `${el?.pincode} - ${el?.divisionName}`,
        value: el?.pincode,
        id: el?.pincodeMasterId,
        divisionName: el?.divisionName,
      }));
    const dataTablePin0 = pincodeMapOptions(getNewPincodeByTehsilBy0);
    const dataTablePin1 = pincodeMapOptions(getNewPincodeByTehsilBy1);
    const dataTablePin2 = pincodeMapOptions(getNewPincodeByTehsilBy2);

    if (dataTablePin0) {
      setResPinCodeOptions(dataTablePin0);
    }
    if (dataTablePin1) {
      setPerPinCodeOptions(dataTablePin1);
    }
    if (dataTablePin2) {
      setOffcPinCodeOptions(dataTablePin2);
    }
  }, [
    getNewPincodeByTehsilBy0,
    getNewPincodeByTehsilBy1,
    getNewPincodeByTehsilBy2,
    allAddress,
  ]);

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
    // if (editRecord.addressType === "1000000001") {
    //   return option.id === 1;
    // }
    if (editRecord.addressType === "1000000002") {
      return option.id === 2 || option.id === 3;
    } else if (editRecord.addressType === "1000000003") {
      return option.id === 1 || option.id === 2;
    }
  });

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
              // isChecked={
              //   record.addressType === radioCheckedMailing ||
              //   (!radioCheckedMailing && record.addressType === "1000000001")
              // }
              isChecked={record.mailingAddress === "Y" ? true : false}
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
              // isChecked={
              //   record.addressType === radioCheckedDestination ||
              //   (!radioCheckedDestination &&
              //     record.addressType === "1000000001")
              // }
              isChecked={record.destinationAddress === "Y" ? true : false}
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
                colorScheme="grey.200"
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

  const saveAddress = (data: any) => {
    const payload = {
      ...data,
      addressFlag: "update",
      state: data.state?.value || "",
      city: data.city?.value || "",
      zipcode: data.zipcode?.value || "",
      occupancyStatus: data.occupancyStatus?.value || "",
      sameAsDropdown:
        data?.addressType !== "1000000001"
          ? data?.sameAsDropdown?.value ?? ""
          : "",
      //for instant labels
      cityName: data?.city?.label,
      zipName: data?.zipcode?.label,
      locality: data.locality?.value || "",
      zipcodeId: data.zipcode?.id || "",
    };
    trigger();

    setAllAddress((prevItems: any) =>
      prevItems.map((item: any) =>
        item.addressType === data.addressType ? payload : item
      )
    );

    setSelState("");
    onClose();
  };

  const sameAsAddressDropddown = watchAddress("sameAsDropdown");
  useEffect(() => {
    //const sameAsCheckBox = watchAddress("sameAsCheckBox");
    //const sameAsDropDown = watchAddress("sameAsDropdown");
    if (isOpen && sameAsAddressDropddown) {
      // Nalin
      setIsSameAsSelected(true);
    } else {
      setIsSameAsSelected(false);
    }
  }, [isOpen, sameAsAddressDropddown]);

  const sameAsStateId = useMemo(() => {
    const filteredAddress = allAddress?.find((el: any) => {
      return el.addressType === getAdressType(sameAsAddressDropddown?.label);
    });
    return filteredAddress?.state;
  }, [allAddress, sameAsAddressDropddown]);

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

    // const matchedTehsil = tehsilDropDownOptions?.find(
    //   (tehsil: any) => tehsil?.value === filtredAdress?.locality
    // );

    const matchedTehsil = getSameAsNewTehsilByCity?.tehsilList?.find(
      (tehsil: any) => tehsil?.tehsilMasterId === filtredAdress?.locality
    );

    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.value === filtredAdress?.zipcode
    // );

    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.id === filtredAdress?.zipcodeId
    // );

    const matchedPincode = getSameAsNewPincodeByTehsil?.pincodeList?.find(
      (pin: any) => pin?.pincodeMasterId === filtredAdress?.zipcodeId
    );

    if (permanentChecked && editRecord?.addressType === "1000000002") {
      if (matchedState) {
        setAddressValue("state", {
          label: matchedState?.label,
          value: matchedState?.value,
        });
      }

      // if (matchedTehsil) {
      //   setAddressValue("locality", {
      //     label: matchedTehsil?.label,
      //     value: matchedTehsil?.value,
      //   });
      // }

      if (matchedTehsil) {
        setAddressValue("locality", {
          label: matchedTehsil?.tehsilMasterName,
          value: matchedTehsil?.tehsilMasterId,
        });
      }

      // if (matchedPincode) {
      //   setAddressValue("zipcode", {
      //     label: matchedPincode?.label,
      //     value: matchedPincode?.value,
      //     id: matchedPincode?.id,
      //   });
      // }

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
    }
  }, [
    permanentChecked,
    watchAddress("sameAsDropdown"),
    editRecord?.addressType === "1000000002",
    isSameAsSelected,
    getSameAsNewTehsilByCity,
    getSameAsNewPincodeByTehsil,
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
    permanentChecked,
    watchAddress("sameAsDropdown"),
    editRecord?.addressType === "1000000002",
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

    // const matchedTehsil = tehsilDropDownOptions?.find(
    //   (tehsil: any) => tehsil?.value === filtredAdress?.locality
    // );
    const matchedTehsil = getSameAsNewTehsilByCity?.tehsilList?.find(
      (tehsil: any) => tehsil?.tehsilMasterId === filtredAdress?.locality
    );

    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.value === filtredAdress?.zipcode
    // );
    const matchedPincode = getSameAsNewPincodeByTehsil?.pincodeList?.find(
      (pin: any) => pin?.pincodeMasterId === filtredAdress?.zipcodeId
    );

    if (residenceChecked && editRecord?.addressType === "1000000001") {
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
      if (matchedTehsil) {
        setAddressValue("locality", {
          label: matchedTehsil?.tehsilMasterName,
          value: matchedTehsil?.tehsilMasterId,
        });
      }

      // if (matchedPincode) {
      //   setAddressValue("zipcode", {
      //     label: matchedPincode?.label,
      //     value: matchedPincode?.value,
      //     id: matchedPincode?.id,
      //   });
      // }
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
    }
  }, [
    residenceChecked,
    watchAddress("sameAsDropdown"),
    editRecord?.addressType === "1000000001",
    stateOptionChangeCounter,
    isSameAsSelected,
    getSameAsNewTehsilByCity,
    getSameAsNewPincodeByTehsil,
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

    // const matchedTehsil = tehsilDropDownOptions?.find(
    //   (tehsil: any) => tehsil?.value === filtredAdress?.locality
    // );

    const matchedTehsil = getSameAsNewTehsilByCity?.tehsilList?.find(
      (tehsil: any) => tehsil?.tehsilMasterId === filtredAdress?.locality
    );

    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.value === filtredAdress?.zipcode
    // );
    // const matchedPincode = pinCodeDropDownOptions?.find(
    //   (pin: any) => pin?.id === filtredAdress?.zipcodeId
    // );

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
      if (matchedTehsil) {
        setAddressValue("locality", {
          label: matchedTehsil?.tehsilMasterName,
          value: matchedTehsil?.tehsilMasterId,
        });
      }
      // if (matchedPincode) {
      //   setAddressValue("zipcode", {
      //     label: matchedPincode?.label,
      //     value: matchedPincode?.value,
      //     id: matchedPincode?.id,
      //   });
      // }
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
    }
  }, [
    officeChecked,
    watchAddress("sameAsDropdown"),
    editRecord?.addressType === "1000000003",
    stateOptionChangeCounter,
    allAddress,
    getSameAsNewTehsilByCity,
    getSameAsNewPincodeByTehsil,
    isSameAsSelected,
    isOpen,
  ]);

  useEffect(() => {
    if (
      (mailigAddress0 === "Y" ||
        mailigAddress2 === "Y" ||
        mailigAddress1 === "Y") &&
      (permanentChecked || officeChecked)
    )
      setIsCheckedMailing(true);
    else {
      setIsCheckedMailing(false);
    }
  }, [
    mailigAddress0,
    mailigAddress2,
    mailigAddress1,
    permanentChecked,
    officeChecked,
  ]);

  useEffect(() => {
    if (
      (destinationAddress0 === "Y" ||
        destinationAddress1 === "Y" ||
        destinationAddress2 === "Y") &&
      (permanentChecked || officeChecked)
    )
      setIsCheckedDestination(true);
    else {
      setIsCheckedDestination(false);
    }
  }, [
    destinationAddress0,
    destinationAddress1,
    destinationAddress2,
    permanentChecked,
    officeChecked,
  ]);

  const handleCheckboxChange = (addressType: string) => {
    switch (addressType) {
      case "1000000001": // Residence
        setResidenceChecked(prev => !prev);
        break;
      case "1000000002": // Permanent
        setPermanentChecked(prev => !prev);
        break;
      case "1000000003": // Office
        setOfficeChecked(prev => !prev);
        break;
    }
  };

  useEffect(() => {
    if (!watchAddress("state") || watchAddress("state") == null) {
      setAddressValue("city", null);
      setAddressValue("zipcode", null);
    }
    if (!watchAddress("city") || watchAddress("city") == null) {
      setAddressValue("zipcode", null);
    }
  }, [watchAddress("state"), watchAddress("city")]);

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

  return (
    <Box marginTop={{ base: "20px", md: "40px" }}>
      <Heading
        marginBottom={4}
        color="#3E4954"
        fontSize={{ base: "18px", md: "18px" }}
      >
        {t("newLead.heading.addressDetails")}
      </Heading>
      <Box display={{ base: "none", md: "block" }}>
        <Table dataSource={allAddress} columns={columns} pagination={false} />
      </Box>
      <Box display={{ base: "block", md: "none" }}>
        <Stack spacing={2} mx={-4}>
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
                  <Text fontSize="14px">
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
                    <Text fontSize="sm">Mailing:</Text>
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

                    <Text fontSize="sm">Destination:</Text>
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
            <PrimaryButton
              title={"Update"}
              type="submit"
              isDisabled={isConvertedToCustomer}
            />
          ) : (
            <PrimaryButton
              title={t("common.add")}
              type="submit"
              isDisabled={isConvertedToCustomer}
            />
          )
        }
        setSelState={setSelState}
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
                        gap={{ base: "3", md: "4" }}
                      >
                        {" "}
                        <GridItem display={"flex"} alignItems="center">
                          <FormCheckbox
                            // disabled={!watchAddress("sameAsDropdown")}
                            control={control}
                            name={"sameAsCheckBox"}
                            checked={
                              editRecord?.addressType === "1000000002"
                                ? permanentChecked
                                : editRecord?.addressType === "1000000001"
                                ? residenceChecked
                                : officeChecked
                            }
                            onChangeEvents={() =>
                              handleCheckboxChange(editRecord?.addressType)
                            }
                            disabled={
                              isConvertedToCustomer ||
                              addressType === "1000000001"
                            }
                          />

                          <FormLabel mb={-0.4}>
                            <Text mx={3} fontSize={"14px"} color={"#000000B3"}>
                              {t("newLead.leadDrawer.sameAs")}
                            </Text>
                          </FormLabel>
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            name="sameAsDropdown"
                            placeholder={"Select"}
                            control={control}
                            options={mappedOptions}
                            // isDisabled={
                            //   allAddress &&
                            //   allAddress[0].mobile_no1 &&
                            //   allAddress[0].mobile_no1.length > 0
                            //     ? false
                            //     : true
                            // }
                            isDisabled={
                              !watchAddress("sameAsCheckBox") ||
                              addressType === "1000000001"
                            }
                          />
                        </GridItem>
                        {editRecord.addressType === "1000000003" && (
                          <>
                            <GridItem display={"flex"} alignItems="center">
                              <FormLabel fontSize={"14px"} color={"#000000B3"}>
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
                                isDisabled={isConvertedToCustomer}
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
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
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
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
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
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
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
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
                          />
                        </GridItem>
                        {/* <GridItem display={"flex"} alignItems="center">
                          <FormLabel
                            mb={-3}
                            fontSize={"14px"}
                            color={"#000000B3"}
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
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
                          />
                        </GridItem> */}
                        {/* <GridItem display={"flex"} alignItems="center">
                          <FormLabel
                            mb={-3}
                            fontSize={"14px"}
                            color={"#000000B3"}
                          >
                            <Text>{t("newLead.leadDrawer.district")}</Text>
                          </FormLabel>
                        </GridItem>
                        <GridItem>
                          <TextInput
                            name="locality"
                            control={control}
                            type="text"
                            placeholder={t("common.enter")}
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
                          />
                        </GridItem> */}
                        <GridItem>
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {t("newLead.leadDrawer.state")}
                            <RequiredMark />
                          </Text>
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
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
                          />
                        </GridItem>
                        <GridItem>
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {/* {t("newLead.leadDrawer.city")} */}
                            {t("newLead.leadDrawer.district")}
                            <RequiredMark />
                          </Text>
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            control={control}
                            name="city"
                            options={cityDropDownOptions}
                            //onCustomChange={handleCity}
                            onCustomChange={handleTehesilByCity}
                            placeholder={t("common.select")}
                            hideError={false}
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
                          />
                        </GridItem>
                        <GridItem>
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {t("newLead.leadDrawer.tehsil")}
                            <RequiredMark />
                          </Text>
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            control={control}
                            name="locality"
                            options={tehsilDropDownOptions}
                            onCustomChange={handleTehsil}
                            placeholder={t("common.select")}
                            hideError={false}
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
                            }
                          />
                        </GridItem>
                        <GridItem>
                          <Text fontSize={"14px"} color={"#000000B3"}>
                            {t("newLead.leadDrawer.pinCode")}
                            <RequiredMark />
                          </Text>
                        </GridItem>
                        <GridItem>
                          <SelectComponent
                            control={control}
                            name="zipcode"
                            options={pinCodeDropDownOptions}
                            placeholder={t("common.select")}
                            hideError={false}
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
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
                            isDisabled={
                              watchAddress("sameAsCheckBox") ||
                              isConvertedToCustomer
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

export default CustomerAddress;
