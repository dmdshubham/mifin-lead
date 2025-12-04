import {
  As,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  Grid,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FONT_WEIGHT } from "@mifin/assets/fonts/font";
import { svgs } from "@mifin/assets/svgs";
import TextInput from "@mifin/components/Input";
import SelectComponent from "@mifin/components/SelectComponent";
import { toastFail } from "@mifin/components/Toast";
// import { getCurrentUserInfo } from "@mifin/features/Los/utils/sessionData";
// import { Email, Mobile } from "@mifin/service/newLoan/api";
// import { useGetOtp, useSetOtp } from "@mifin/service/newLoan/mutation";
import { MifinColor } from "@mifin/theme/color";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { RxMinusCircled, RxPencil2 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import * as yup from "yup";
import { getCorrectImageUrl } from "@mifin/utils/getCorrectImgUrl";
import SingleCard from "@mifin/components/common";

const mobileScheme = yup.object().shape({
  phoneNoType: yup
    .mixed()
    // .required("Please select Type")
    // .object()
    // .shape({
    //   label: yup.string().required("Please select Type"),
    //   value: yup.string().nullable().required("Please select Type"),
    // })
    .nullable()
    .required("Mobile Type is required"),
  phoneNo: yup
    .string()
    .required("Please enter mobile no")
    .matches(/^[6-9]\d*$/, "Should begin with 6,7,8 or 9")
    .test("len", "must be exact 10 number", val => val?.length === 10),
});
const Scheme = yup.object().shape({
  emailType: yup
    .mixed()
    // .object()
    // .shape({
    //   label: yup.string(),
    //   value: yup.string().nullable().required("Please select Type"),
    // })
    .nullable()
    .required("Email Type is required"),
  email: yup
    .string()
    .email("Email Format not correct.")
    .required("Please enter email"),
});

const PhoneAndEmail = ({
  // allMasterKey,
  setMobileArray,
  setEmailArray,
  mobileArray,
  emailArray,
  setPhoneNoData,
  mobile,
  isExisting,
  email,
  mobileValue,
  checkNewLoanOrApplicant,
  setClearMobileValue,
  freezeDisabledApplicant,
  isNewSelected,
  id,
  activeLink,
  setResetMobileValidate,
  setDefaultMobileChangeFlag,
  navigateFocus,
  customerDetail,
}: {
  navigateFocus: any;
  allMasterKey: any;
  setMobileArray?: any;
  setEmailArray?: any;
  mobileArray?: any;
  emailArray?: any;
  setPhoneNoData?: any;
  mobile?: any;
  //  Mobile[] | undefined;
  email?: Email[] | undefined;
  mobileValue?: any;
  checkNewLoanOrApplicant: any;
  setClearMobileValue?: any;
  freezeDisabledApplicant?: any;
  isNewSelected?: any;
  id?: any;
  isExisting?: boolean;
  // activeLink?: any;
  setResetMobileValidate?: any;
  setDefaultMobileChangeFlag?: any;
  setDnsFlagData?: any;
  customerDetail?: any;
}) => {
  const { DefaultArrowTable } = svgs;
  const mobileBtnRef = useRef<HTMLButtonElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isEmailHighlighted, setIsEmailHighlighted] = useState(false);
  const emailBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (navigateFocus === "mobileArray") {
        mobileBtnRef.current?.focus();
        setIsHighlighted(true);
      } else if (navigateFocus === "emailArray") {
        emailBtnRef.current?.focus();
        setIsEmailHighlighted(true);
      }
    }, 0);
  }, [navigateFocus]);

  const handleBlur = () => {
    setIsHighlighted(false);
  };

  // const [value, setValue] = useState("1");
  const [emailValue, setEmailValue] = useState("1");

  // const [mobileRows, setMobileRows] = useState<Mobile[]>([]);
  // const [emailRows, setEmailRows] = useState<Email[]>();
  const [typeOptions, setTypeOptions] = useState<[any]>();

  // default email and mobile
  const [defaultEmail, setDefaultEmail] = useState(-1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState("");

  const [isEditModeEmail, setIsEditModeEmail] = useState(false);
  const [editDataEmail, setEditDataEmail] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editEmailIndex, setEditEmailIndex] = useState<number | null>(null);
  const [dnssFlag, setDnssFlag] = useState("N");
  const [removeEmailconfirmMsg, setRemoveEmailconfirmMsg] = useState("");
  const [removeMobileconfirmMsg, setRemoveMobileconfirmMsg] = useState("");

  const location = useLocation();
  useEffect(() => {
    if (location) {
      setDnssFlag("N");
    }
  }, [location]);
  const {
    control,
    handleSubmit: phoneHandelSubmit,
    reset,
    formState: { errors },
    getValues: getPhoneValues,
    trigger: phoneTrigger,
    setValue,
    watch,
    trigger,
    setFocus,
  } = useForm({
    defaultValues: {
      // phoneNoType: {
      //   label: "",
      //   value: "",
      // },

      phoneNoType: null as null | { label: string; value: string },
      phoneNo: "",
    },
    mode: "onKeyPress",
    resolver: yupResolver(mobileScheme),
  });
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    reset: emailReset,
    formState: { errors: emailError },
    trigger: emailTrigger,
    getValues: getEmailValues,
    setValue: setValueEmail,
  } = useForm({
    defaultValues: {
      emailType: null as null | { label: string; value: string },

      // {
      //   label: "",
      //   value: "",
      // },
      email: "",
    },
    mode: "onChange",
    resolver: yupResolver(Scheme),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [arrowHide, setArrowHide] = useState(true);

  const {
    isOpen: isEmailOpen,
    onOpen: onEmailOpen,
    onClose: onEmailClose,
  } = useDisclosure();
  const {
    isOpen: isMobileOpen,
    onOpen: onMobileOpen,
    onClose: onMobileClose,
  } = useDisclosure();

  const {
    isOpen: isOtpOpen,
    onOpen: onOtpOpen,
    onClose: onOtpClose,
  } = useDisclosure();
  // const mobileTypeOptions = useMemo(
  //   () =>
  //     allMasterKey?.contactTypeMobile?.map((x: any) => ({
  //       label: x?.contactTypeName,
  //       value: x?.contactTypeId,
  //     })),
  //   [allMasterKey?.contactTypeMobile]
  // );
  const mobileTypeOptions = [
    {
      label: "HOME",
      value: "1000000001",
    },
    {
      label: "OFFICE",
      value: "1000000002",
    },
  ];

  const emailTypeOptions = [
    {
      label: "HOME",
      value: "1000000001",
    },
    {
      label: "OFFICE",
      value: "1000000002",
    },
  ];

  // const emailTypeOptions = useMemo(
  //   () =>
  //     allMasterKey?.contactTypeEmail?.map((x: any) => ({
  //       label: x?.contactTypeName,
  //       value: x?.contactTypeId,
  //     })),
  //   [allMasterKey?.contactTypeEmail]
  // );

  // useEffect(() => {
  //   if (mobile && mobile?.length > 0) {
  //     const newMobile =
  //       mobile &&
  //       mobile?.reduce((acc: any, obj: any) => {
  //         const {
  //           POS,
  //           applicantId,
  //           applicantMobileNo,
  //           applicantMobileType,
  //           defaultFlag,
  //           // defaultFlatMobile,
  //           dnsFlag,
  //           id,
  //           verified,
  //         } = obj;
  //         acc.push({
  //           // POS: POS,
  //           // applicantId: applicantId,
  //           id: id,
  //           applicantMobileType: {
  //             label: allMasterKey?.contactTypeMobile?.filter(
  //               (el: any) => el?.masterId === applicantMobileType
  //             )?.[0]?.masterName,
  //             value: allMasterKey?.contactTypeMobile?.filter(
  //               (el: any) => el?.masterId === applicantMobileType
  //             )?.[0]?.masterId,
  //           },
  //           applicantMobileNo: applicantMobileNo,
  //           // defaultFlatMobile: defaultFlatMobile,
  //           defaultFlag: defaultFlag,
  //           dnsFlag: dnssFlag,
  //           verified: verified,
  //         });
  //         return acc;
  //       }, []);

  //     setMobileArray(newMobile);
  //   }
  // }, [mobile, allMasterKey]);
  // useEffect(() => {
  //   if (email && email?.length > 0) {
  //     const newEmail =
  //       email &&
  //       email?.reduce((acc: any, obj: any) => {
  //         const {
  //           POS,
  //           applicantEmailId,
  //           applicantEmailType,
  //           applicantId,
  //           defaultFlag,
  //           id,
  //           verified,
  //         } = obj;
  //         acc.push({
  //           // POS: POS,
  //           id: id,
  //           applicantEmailType: {
  //             label: allMasterKey?.contactTypeEmail?.filter(
  //               (el: any) => el?.masterId === applicantEmailType
  //             )?.[0]?.masterName,
  //             value: allMasterKey?.contactTypeEmail?.filter(
  //               (el: any) => el?.masterId === applicantEmailType
  //             )?.[0]?.masterId,
  //           },
  //           applicantEmailId: applicantEmailId,
  //           defaultFlag: defaultFlag,
  //           verified: verified,
  //           // applicantId: applicantId,
  //         });
  //         return acc;
  //       }, []);
  //     setEmailArray(newEmail);
  //   }
  // }, [email, emailTypeOptions]);

  const handleMobilePopUp = (data: any) => {
    const isExist = mobileArray.filter(
      (el: any) => el.applicantMobileNo === data?.phoneNo
    );

    if (isExist.length > 0) {
      toastFail("Mobile no already exists");
    } else {
      const _id = Math.floor(Math.random() * 9999);

      const obj = {
        id: _id,
        // applicantMobileType: {
        //   label: data?.phoneNoType?.label,
        //   value: data?.phoneNoType?.value,
        // },
        applicantMobileType: data?.phoneNoType,
        applicantMobileNo: data?.phoneNo,
        defaultFlag: mobileArray?.length === 0 ? "Y" : "N",
        dnsFlag: "N",
        verified: "N",
      };
      setMobileArray((prev: any) =>
        prev !== undefined ? [...prev, obj] : null
      );
      // reset({
      //   phoneNoType: {
      //     label: "",
      //     value: "",
      //   },
      //   phoneNo: "",
      // });
      // onClose();
      handleMobileClose();
    }
  };

  const handleMobileClose = () => {
    reset({
      phoneNoType: null,
      // {
      //   label: "",
      //   value: "",
      // },
      phoneNo: "",
    });
    onClose();
    setIsEditMode(false);
  };

  const handleEmailClose = () => {
    emailReset({
      emailType: null,
      email: "",
    });
    onEmailClose();
  };

  const handleEmailPopUp = (data: any) => {
    const _id = Math.floor(Math.random() * 9999);
    const obj = {
      id: _id,
      // applicantEmailType: {
      //   label: data?.emailType?.label,
      //   value: data?.emailType?.value,
      // },
      applicantEmailType: data?.emailType,
      applicantEmailId: data?.email,
      defaultFlag: emailArray.length === 0 ? "Y" : "N",
      Verified: "Y",
    };
    setEmailArray((prev: any) => (prev !== undefined ? [...prev, obj] : null));
    // emailReset();
    // onEmailClose();
    handleEmailClose();
  };

  // function that sets default 'Y' and others 'N'
  // when radio button change
  // phone
  // email
  const setDefaultYNPhone = (index: number) => {
    const newMobileArray = mobileArray.map((x: any, i: number) => {
      if (i === index) {
        return { ...x, defaultFlag: "Y", verified: "N" };
      } else {
        return { ...x, defaultFlag: "N" };
      }
    });

    if (setDefaultMobileChangeFlag !== undefined)
      setDefaultMobileChangeFlag(true);
    setMobileArray(newMobileArray);
  };

  const setDefaultYNEmail = (index: number) => {
    const newEmailArray = emailArray.map((x: any, i: number) => {
      if (i === index) {
        return { ...x, defaultFlag: "Y" };
      } else {
        return { ...x, defaultFlag: "N" };
      }
    });
    setEmailArray(newEmailArray);
  };
  useEffect(() => {
    navigateFocus && setFocus(navigateFocus);
  }, [navigateFocus]);
  // DNS flag transfor for
  // phone
  // const setDefaultFlag = (index: number) => {
  //   const newMobileArray = mobileArray.map((x: any, i: number) => {
  //     if (i === index) {
  //       return { ...x, dnsFlag: dnsStatus };
  //     }
  //     return x;
  //   });
  //   setMobileArray(newMobileArray);
  // };

  // useEffect(() => {
  //   if (checkNewLoanOrApplicant === "newLoan") {
  //     if (mobileValue && mobileValue?.length == 10) {
  //       const mobArray = [
  //         {
  //           id: "",
  //           applicantMobileType: { label: "OFFICE", value: "1000000002" },
  //           applicantMobileNo: mobileValue,
  //           defaultFlag: "Y",
  //           dnsFlag: "N",
  //           verified: "N",
  //           uid: uuidv4(),
  //         },
  //       ];
  //       setMobileArray((prev: any) => [...mobArray, ...prev]);
  //     } else {
  //       if (mobileArray?.length > 0) {
  //         setMobileArray(tempMobileArray);
  //       } else {
  //         setMobileArray([]);
  //       }
  //     }
  //   }
  // }, [mobileValue, setMobileArray]);

  const handlePhoneDelete = (singleRow: any, i: number) => {
    if (checkNewLoanOrApplicant === "newLoan") {
      if (singleRow?.id === "mobileValue") {
        setClearMobileValue(true);
      }

      const filteredArray = mobileArray?.filter(
        (item: any, index: number) => index !== i
      );

      setMobileArray(filteredArray);
    }

    if (checkNewLoanOrApplicant === "applicant") {
      const filteredArray = mobileArray?.filter(
        (item: any, index: number) => index !== i
      );

      setMobileArray(filteredArray);
    }
  };

  const handleEmailDelete = (singleRow: any, i: number) => {
    const filteredArray = emailArray?.filter(
      (item: any, index: number) => index !== i
    );
    setEmailArray(filteredArray);
  };

  // phone no validation
  const handlePhoneValidate = (event: any) => {
    if (
      event.nativeEvent.data === undefined &&
      event?.target?.value.length === 0
    ) {
      setValue("phoneNo", " ");
    } else if (event.nativeEvent.data !== "e") {
      const numericValue = event?.target?.value.replace(/\D/g, "");
      const limitedValue = numericValue.slice(0, 10);
      setValue("phoneNo", limitedValue);
    }
  };

  const handleMobileEdit = (singleRow: any, index: number) => {
    onOpen();
    setIsEditMode(true);
    setEditData(singleRow);
    setEditIndex(index);
    setValue("phoneNo", singleRow.applicantMobileNo);
    setValue("phoneNoType", singleRow.applicantMobileType);
  };

  const handleMobileEditPopUp = (data: any) => {
    if (editIndex !== null) {
      setMobileArray((prev: any) => {
        return prev.map((el: any, index: number) => {
          if (index === editIndex) {
            return {
              ...el,
              applicantMobileNo: data?.phoneNo,
              applicantMobileType: data?.phoneNoType,
              verified: "N",
            };
          }
          return el;
        });
      });
    }
    handleMobileClose();
    setEditIndex(null);
  };
  const handleEmailEdit = (singleRow: any, index: number) => {
    onEmailOpen();
    setIsEditModeEmail(true);
    setEditDataEmail(singleRow);
    setEditEmailIndex(index);

    setValueEmail("email", singleRow.applicantEmailId);
    setValueEmail("emailType", singleRow.applicantEmailType);
  };

  const handleEmailEditPopUp = (data: any) => {
    if (editEmailIndex !== null) {
      setEmailArray((prev: any) => {
        return prev.map((el: any, index: number) => {
          if (index === editEmailIndex) {
            return {
              ...el,
              applicantEmailId: data?.email,
              applicantEmailType: data?.emailType,
              verified: "N",
            };
          }
          return el;
        });
      });
    }
    handleEmailClose();
    setEditEmailIndex(null);
    setIsEditModeEmail(false);
  };
  const { t } = useTranslation();

  useEffect(() => {
    if (isNewSelected) {
      setMobileArray([]);
    }
  }, [isNewSelected]);

  useEffect(() => {
    if (isNewSelected) {
      setEmailArray([]);
    }
  }, [isNewSelected]);

  const { isOpen: isConfirmDeleteOpen, onOpen: onConfirmDeleteOpen } =
    useDisclosure();

  useEffect(() => {
    if (isConfirmDeleteOpen) onConfirmDeleteOpen();
  }, [isConfirmDeleteOpen]);

  const [otp, setOtp] = useState("");
  const [checkValidationStatus, setCheckValidationStatus] = useState(false);
  const handleChangeOnOtp = (e: any) => {
    setOtp(e.target.value.trim());
  };
  // const { mutate: muatateGetOtp } = useGetOtp();
  // const handleGetOtp = async (mobileData: string) => {
  //   const { userDetail, deviceDetail } = getCurrentUserInfo().userInfo;

  //   // const mobileNumber = 123;
  //   try {
  //     // setOtherDetails(true);
  //     await muatateGetOtp({
  //       userDetail: userDetail,
  //       deviceDetail: deviceDetail,
  //       requestData: {
  //         mobileNo: mobileData?.applicantMobileNo,
  //       },
  //     });
  //   } catch (error: any) {
  //     toastFail("Something went wrong");
  //   }
  // };
  const handleToggleDns = (index: number, status: string) => {
    setMobileArray(prevArray =>
      prevArray.map((row, i) =>
        i === index ? { ...row, dnsFlag: status } : row
      )
    );
  };
  // const { mutate: muatateSetOtp } = useSetOtp({
  //   setValue,
  //   trigger,
  //   setCheckValidationStatus,
  // });
  // const handleSetOtp = async (mobileData: string) => {
  //   const { userDetail, deviceDetail } = getCurrentUserInfo().userInfo;
  //   // const mobileNumber = 123;
  //   try {
  //     // setOtherDetails(true);
  //     await muatateSetOtp({
  //       userDetail: userDetail,
  //       deviceDetail: deviceDetail,
  //       requestData: {
  //         mobileNo: mobileData?.applicantMobileNo,
  //         otp: otp,
  //       },
  //     });
  //     const toValidate = mobileArray.map((item: any) => {
  //       if (item?.applicantMobileNo == mobileData?.applicantMobileNo) {
  //         item.verified = "Y";
  //         return item;
  //       } else {
  //         return item;
  //       }
  //     });
  //     setMobileArray(toValidate);
  //   } catch (error: any) {
  //     toastFail("Something went wrong");
  //   }
  //   onMobileClose();
  // };

  const preventWheel = (e: {
    target: { blur: () => void; focus: () => void };
    stopPropagation: () => void;
  }) => {
    e.target.blur();
    e.stopPropagation();
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const onOpenOtpModal = (row: any) => {
    setCurrentRow(row);
    setOtpModalOpen(true);
  };

  const onCloseOtpModal = () => {
    setOtpModalOpen(false);
    setCurrentRow(null);
  };

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [currentRow, setCurrentRow] = useState(null);

  const onOpenDeleteModal = (row: any) => {
    const mobileMatch =
      customerDetail?.responseData?.customerDetail?.listMobile?.find(
        item => item?.contactNo === row?.applicantMobileNo
      );
    if (mobileMatch) {
      setRemoveMobileconfirmMsg(
        "Saved mobile details will not be deleted permanently"
      );
    } else {
      setRemoveMobileconfirmMsg(
        "This action will delete mobile detail, click ok to continue"
      );
    }
    setCurrentRow(row);
    setDeleteModalOpen(true);
  };

  const onCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setCurrentRow(null);
  };
  const [isModalOpen, setModalOpen] = useState(false);

  const onOpenModal = () => {
    setModalOpen(true);
  };

  const onCloseModal = () => {
    setModalOpen(false);
  };
  const {
    isOpen: isDeleteOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  // const [disabledButton, setDisabledButton] = useState(false);
  // useEffect(() => {
  //   mobileArray.map(id => {
  //     if (id.verified === "Y") {
  //       setDisabledButton(false);
  //     } else if (id.verified === "N" && id.defaultFlag === "N") {
  //       setDisabledButton(true); // Disable if defaultFlag is N and not verified
  //     } else {
  //       setDisabledButton(false); // Otherwise, enable
  //     }
  //   });
  // }, [mobileArray]);

  const handleEmailModalClick = (singleRow: any, index: number) => {
    const emailMatch =
      customerDetail?.responseData?.customerDetail?.listEmail?.find(
        item => item?.email === singleRow?.applicantEmailId
      );
    if (emailMatch) {
      setRemoveEmailconfirmMsg(
        "Saved email details will not be deleted permanently"
      );
    } else {
      setRemoveEmailconfirmMsg(
        "This action will delete email detail, click ok to continue"
      );
    }
    openModal();
  };

  return (
    <Box my={{ base: "10px", md: "5" }} id="isMobileAvailable" fontSize="12">
      <Box id={id}>
        <Box
          // column={{ base: "1", lg: "2" }}
          // minChildWidth={"295px"}
          // spacingX={"26px"}
          // spacingY={"50px"}
          display={"flex"}
          flexDir={{ base: "column", md: "row" }}
          justifyContent={{ sm: "space-between" }}
          rowGap={{ base: 6, md: 0 }}
          columnGap={{ base: 3, md: 0 }}
        >
          <Box
            marginRight={{ md: 8 }}
            width={{ base: "100%", md: "50%" }}
            fontSize="12"
          >
            <Flex justifyContent={"space-between"}>
              <Heading
                fontSize={"18px"}
                color={
                  activeLink == id ? MifinColor.blue_300 : MifinColor.gray_100
                }
                fontWeight={"700"}
                lineHeight={"36px"}
                // mb={{ base: "18px", lg: "22px" }}
                mb={{ base: "15px", md: "22px" }}
              >
                {t("newloan.mobile1")}
              </Heading>

              <Button
                id="mobileArray" //changed
                ref={mobileBtnRef}
                onClick={() => {
                  onOpen();
                  setIsHighlighted(false);
                }}
                onBlur={handleBlur}
                isDisabled={
                  mobile &&
                  mobile?.length > 0 &&
                  checkNewLoanOrApplicant === "newLoan"
                    ? true
                    : false
                }
                background={"none"}
                sx={{
                  "&:hover ": {
                    background: "none !important",
                  },
                }}
                padding={0}
                _focus={{
                  borderColor: isHighlighted ? "#2F4CDD" : "transparent",
                  boxShadow: isHighlighted ? "0 0 0 1px #2F4CDD" : "none",
                  outline: "none",
                }}
              >
                <img src={getCorrectImageUrl(svgs.addButton)} alt="addMobBtn" />
              </Button>

              <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="350px">
                  <ModalHeader
                    fontSize={"16px"}
                    fontWeight={"semibold"}
                    border={"0"}
                    py={"14px"}
                    px={"22px"}
                  >
                    {t("newloan.mobile")}
                  </ModalHeader>
                  <ModalCloseButton onClick={handleMobileClose} />
                  <ModalBody px={"22px"} pt="0" pb="30px">
                    <form>
                      <Grid
                        gridTemplateColumns={"35% 65%"}
                        alignItems={"center"}
                      >
                        <FormLabel
                          fontSize={"14px"}
                          color={MifinColor?.black_opacity_black_70}
                          m={"0"}
                        >
                          {t("newloan.phoneNoType")}
                          <span style={{ color: MifinColor?.primary_red }}>
                            *
                          </span>
                        </FormLabel>
                        <SelectComponent
                          name="phoneNoType"
                          inputId="phoneNoType"
                          placeholder="Select"
                          control={control}
                          options={mobileTypeOptions ?? []}
                          disabled={freezeDisabledApplicant}
                        />
                        <Text></Text>
                        <Text>
                          {errors && (
                            <span style={{ color: MifinColor?.primary_red }}>
                              {errors?.phoneNoType?.message}
                            </span>
                          )}
                        </Text>

                        <FormLabel
                          fontSize={"14px"}
                          color={MifinColor?.black_opacity_black_70}
                          m={"0"}
                        >
                          {t("newloan.phone")}
                          <span style={{ color: MifinColor?.primary_red }}>
                            *
                          </span>
                        </FormLabel>
                        <TextInput
                          type="phoneNo"
                          placeholder="Enter"
                          name="phoneNo"
                          isMore0
                          control={control}
                          style={{
                            color: "#000000CC !important",
                            fontWeight: FONT_WEIGHT,
                          }}
                          maxLength={10}
                          isDisabled={freezeDisabledApplicant}
                          onChange={handlePhoneValidate}
                          onWheel={preventWheel}
                        />
                        <Text></Text>
                        <Text>
                          {errors && (
                            <span style={{ color: MifinColor?.primary_red }}>
                              {errors?.phoneNo?.message}
                            </span>
                          )}
                        </Text>
                      </Grid>
                    </form>
                  </ModalBody>
                  <ModalFooter py={"3"} px={"22px"}>
                    <Button
                      variant="outline"
                      borderColor="#000"
                      color="#000"
                      mr={3}
                      fontSize={"14px"}
                      py={1}
                      onClick={handleMobileClose}
                    >
                      {t("common.cancel")}
                    </Button>

                    {!isEditMode && (
                      <Button
                        background={"#2F4CDD"}
                        fontSize={"14px"}
                        onClick={async () => {
                          const isValid = await phoneTrigger();
                          if (!isValid) {
                            return;
                          }
                          handleMobilePopUp(getPhoneValues());
                        }}
                        py={1}
                        isDisabled={freezeDisabledApplicant}
                      >
                        {t("newloan.add")}
                      </Button>
                    )}

                    {isEditMode && (
                      <Button
                        background={"#2F4CDD"}
                        fontSize={"14px"}
                        onClick={async () => {
                          const isValid = await phoneTrigger();
                          if (!isValid) {
                            return;
                          }
                          handleMobileEditPopUp(getPhoneValues());
                        }}
                        py={1}
                        isDisabled={freezeDisabledApplicant}
                      >
                        Update
                      </Button>
                    )}
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
            <TableContainer
              display={{ base: "none", md: "table" }}
              overflow={"hidden"}
            >
              <Table variant="striped" marginLeft={"-1"}>
                <Thead>
                  <Tr color={"#3E4954"}>
                    <Th style={{ textTransform: "unset" }} py={"3"}>
                      <Flex>
                        <Text>{t("newloan.type1")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th style={{ textTransform: "unset" }} py={"3"}>
                      <Flex>
                        <Text>{t("newloan.mobile3")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th style={{ textTransform: "unset" }} py={"3"}>
                      <Flex>
                        <Text>{t("newloan.default")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th style={{ textTransform: "unset" }} py={"3"}>
                      <Flex>
                        <Text>{t("newloan.dns")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th style={{ textTransform: "unset" }} py={"3"} colSpan={2}>
                      <Flex>
                        <Text>{t("newloan.validate1")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th>
                      <Text></Text>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mobileArray?.length > 0 &&
                    mobileArray?.map((singleRow: any, i: any) => (
                      <>
                        <Tr key={i}>
                          <Td px={"2"} py={"3"}>
                            {singleRow?.applicantMobileType?.label}
                          </Td>
                          <Td px={"2"} py={"3"}>
                            {singleRow?.applicantMobileNo}
                          </Td>
                          <Td px={"2"} py={"3"}>
                            <Stack direction="row">
                              <Radio
                                value={String(i)}
                                isChecked={
                                  singleRow?.defaultFlag === "Y" ? true : false
                                }
                                onChange={() => {
                                  setDefaultYNPhone(i);
                                }}
                                sx={{
                                  ".chakra-radio__control": {
                                    bg: "#000",
                                    color: "#3182ce",
                                  },
                                }}
                                isDisabled={mobileArray?.length === 1}
                              ></Radio>
                            </Stack>
                          </Td>

                          <Td px={"2"} py={"3"}>
                            <ButtonGroup>
                              <Flex
                                borderRadius="6px"
                                maxW="fit-content"
                                border="1px solid #2F4CDD"
                                color="#2F4CDD"
                                fontSize="12px"
                              >
                                <Button
                                  onClick={() => handleToggleDns(i, "Y")}
                                  color={
                                    //   singleRow?.dnsFlag === "Y"
                                    //     ? "white"
                                    //     : "#2F4CDD"
                                    singleRow?.dnsFlag === "Y" ||
                                    dnssFlag === "Y"
                                      ? "white"
                                      : "#2F4CDD"
                                  }
                                  bg={
                                    // singleRow?.dnsFlag === "Y" ? "#2F4CDD" : ""
                                    singleRow?.dnsFlag === "Y" ||
                                    dnssFlag === "Y"
                                      ? "#2F4CDD"
                                      : ""
                                  }
                                  borderRadius="5px 0 0 5px"
                                  px="1"
                                  py="0.5"
                                  fontSize="12"
                                >
                                  {t("newloan.y")}
                                </Button>
                                <Button
                                  onClick={() => handleToggleDns(i, "N")}
                                  color={
                                    // singleRow?.dnsFlag === "N"
                                    //   ? "white"
                                    //   : "#2F4CDD"

                                    singleRow?.dnsFlag === "N" &&
                                    dnssFlag === "N"
                                      ? "white"
                                      : "#2F4CDD"
                                  }
                                  bg={
                                    //singleRow?.dnsFlag === "N" ? "#2F4CDD" : ""

                                    singleRow?.dnsFlag === "N" &&
                                    dnssFlag === "N"
                                      ? "#2F4CDD"
                                      : ""
                                  }
                                  borderRadius="0 5px 5px 0"
                                  px="1"
                                  py="0.5"
                                  fontSize="12"
                                >
                                  {t("newloan.n")}
                                </Button>
                              </Flex>
                            </ButtonGroup>
                          </Td>

                          <Td px={"4"} py={"3"}>
                            {(singleRow?.verified &&
                              singleRow?.verified === "Y") ||
                            (singleRow?.verified &&
                              singleRow?.verified !== "N") ? (
                              <Box py={"2"}>
                                <IoMdCheckmarkCircle
                                  color="#10CF8B"
                                  fontSize={"23px"}
                                />
                              </Box>
                            ) : (
                              <>
                                {(((singleRow?.id === "mobileValue" ||
                                  singleRow?.id !== "") &&
                                  !singleRow?.verified) ||
                                  (singleRow?.verified &&
                                    singleRow?.verified === "N")) && (
                                  <>
                                    <Button
                                      variant={"link"}
                                      color={"#2F4CDD"}
                                      fontSize={"14px"}
                                      px={0}
                                      onClick={() => {
                                        handleGetOtp(singleRow);
                                        onOpenOtpModal(singleRow);
                                      }}
                                    >
                                      {t("newloan.validate")}
                                    </Button>
                                    <Modal
                                      isOpen={isOtpModalOpen}
                                      onClose={onCloseOtpModal}
                                      isCentered
                                    >
                                      <ModalOverlay />
                                      <ModalContent width="300px">
                                        <ModalHeader
                                          fontSize={"18px"}
                                          fontWeight={"semibold"}
                                          border={"0"}
                                          pb={"0"}
                                          pt={"14px"}
                                          px={"22px"}
                                        >
                                          {t("newloan.enterotp")}
                                        </ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody
                                          fontSize={"14px"}
                                          pt={"0"}
                                          px={"22px"}
                                          color={"RGBA(0, 0, 0, 0.7)"}
                                        >
                                          {t("newloan.enteryourotp")}
                                          <Flex
                                            pt={"37px"}
                                            pb={"30px"}
                                            gap={"30px"}
                                            alignItems={"center"}
                                          >
                                            <FormLabel
                                              fontSize={"12px"}
                                              color={"RGBA(0, 0, 0, 0.6)"}
                                              m={"0"}
                                            >
                                              {t("newloan.otp")}
                                            </FormLabel>
                                            <Input
                                              type="text"
                                              placeholder="Enter"
                                              fontSize={"13px"}
                                              variant={"flushed"}
                                              value={otp}
                                              name="otp"
                                              onChange={handleChangeOnOtp}
                                              maxLength={6}
                                            />
                                          </Flex>
                                        </ModalBody>
                                        <ModalFooter
                                          textAlign={"center"}
                                          py={"3"}
                                        >
                                          <Button
                                            fontSize={"14px"}
                                            height={"32px"}
                                            background={"#2F4CDD"}
                                            onClick={() => {
                                              handleSetOtp(singleRow);
                                              onCloseOtpModal();
                                            }}
                                            isDisabled={!otp}
                                          >
                                            {t("newloan.validate")}
                                          </Button>
                                        </ModalFooter>
                                      </ModalContent>
                                    </Modal>
                                  </>
                                )}
                              </>
                            )}
                          </Td>
                          <Td px={"0"} py={"3"}>
                            {singleRow?.defaultFlag === "Y" &&
                            (singleRow?.verified === "Y" ||
                              !singleRow?.verified) ? null : (
                              <RxPencil2
                                color={"#2f4cdd"}
                                cursor={"pointer"}
                                fontSize={"20px"}
                                onClick={() => {
                                  handleMobileEdit(singleRow, i);
                                }}
                              />
                            )}
                          </Td>
                          <Td px={"0"} py={"3"}>
                            {/* {(singleRow?.id === "mobileValue" ||
                              singleRow?.id !== "") &&
                              singleRow?.verified &&
                               */}
                            {/* {singleRow?.defaultFlag === "Y" &&
                              (singleRow?.verified === "Y" ||
                                !singleRow?.verified) ? null : ( */}
                            {singleRow?.defaultFlag === "Y" ? null : (
                              <>
                                <Button
                                  px={0}
                                  style={{
                                    backgroundColor: "transparent",
                                    paddingLeft: "0px",
                                  }}
                                  onClick={() => onOpenDeleteModal(singleRow)}
                                >
                                  <RxMinusCircled
                                    color={"#FF0909"}
                                    cursor={"pointer"}
                                    fontSize={"20px"}
                                  />
                                </Button>

                                <Modal
                                  isOpen={isDeleteModalOpen}
                                  onClose={onCloseDeleteModal}
                                  isCentered
                                >
                                  <ModalOverlay />
                                  <ModalContent width="350px">
                                    <ModalHeader
                                      fontSize={"18px"}
                                      fontWeight={"semibold"}
                                      border={"0"}
                                      pb={"0"}
                                      pt={"14px"}
                                      px={"22px"}
                                    >
                                      Confirmation
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody
                                      fontSize={"14px"}
                                      pt={"0"}
                                      px={"22px"}
                                      color={"RGBA(0, 0, 0, 0.7)"}
                                    >
                                      {/* This action will delete mobile detail,
                                      click ok to continue */}
                                      {removeMobileconfirmMsg}
                                    </ModalBody>
                                    <ModalFooter textAlign={"right"} py={"3"}>
                                      <ButtonGroup size="sm">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={onCloseDeleteModal}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          background={"#2F4CDD"}
                                          onClick={() => {
                                            handlePhoneDelete(
                                              currentRow,
                                              index
                                            );
                                            onCloseDeleteModal();
                                          }}
                                        >
                                          Ok
                                        </Button>
                                      </ButtonGroup>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </>
                            )}
                          </Td>
                        </Tr>
                      </>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Box display={{ base: "block", md: "none" }}>
              {mobileArray.map(
                ({ defaultFlag, dnsFlag, id, verified, ...single }, index) => {
                  return (
                    <SingleCard data={single} key={index}>
                      <>
                        <Flex
                          justifyContent="space-between"
                          mt={4}
                          allowToggle
                          w="100vw"
                          maxW="100%"
                          mx="auto"
                        >
                          {/* Left column - Default section */}
                          <Flex
                            direction="column"
                            alignItems="center"
                            //   marginRight="40px"
                            ml={3}
                          >
                            <Text
                              fontSize={"14px"}
                              color={"RGBA(0, 0, 0, 0.7)"}
                              mb={2}
                            >
                              {t("newloan.default")}
                            </Text>
                            <Radio
                              value={String(index)}
                              isChecked={defaultFlag === "Y"}
                              onChange={() => {
                                setDefaultYNPhone(index);
                              }}
                              sx={{
                                ".chakra-radio__control": {
                                  bg: "#000",
                                  color: "#3182ce",
                                },
                              }}
                              isDisabled={mobileArray?.length === 1}
                            />
                          </Flex>

                          {/* Right column - DNS section */}
                          <Flex
                            direction="column"
                            alignItems="center"
                            allowToggle
                            maxW="100%"
                            marginLeft="10px"
                            marginRight="40px"
                          >
                            <Text
                              fontSize={"14px"}
                              color={"RGBA(0, 0, 0, 0.7)"}
                              mb={2}
                            >
                              {t("newloan.dns")}
                            </Text>
                            <ButtonGroup>
                              <Flex
                                borderRadius="6px"
                                maxW="fit-content"
                                border="1px solid #2F4CDD"
                                color="#2F4CDD"
                                fontSize="14px"
                              >
                                <Button
                                  onClick={() => handleToggleDns(index, "Y")}
                                  color={
                                    single?.dnsFlag === "Y" || dnssFlag === "Y"
                                      ? "white"
                                      : "#2F4CDD"
                                  }
                                  bg={
                                    single?.dnsFlag === "Y" || dnssFlag === "Y"
                                      ? "#2F4CDD"
                                      : ""
                                  }
                                  borderRadius="5px 0 0 5px"
                                  px="1"
                                  py="0.5"
                                >
                                  {t("newloan.y")}
                                </Button>
                                <Button
                                  onClick={() => handleToggleDns(index, "N")}
                                  color={
                                    single?.dnsFlag === "N" && dnssFlag === "N"
                                      ? "white"
                                      : "#2F4CDD"
                                  }
                                  bg={
                                    single?.dnsFlag === "N" && dnssFlag === "N"
                                      ? "#2F4CDD"
                                      : ""
                                  }
                                  borderRadius="0 5px 5px 0"
                                  px="1"
                                  py="0.5"
                                >
                                  {t("newloan.n")}
                                </Button>
                              </Flex>
                            </ButtonGroup>
                          </Flex>
                        </Flex>

                        {/* Validation and Delete buttons row */}
                        {/* Validation and Delete buttons row */}
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {/* Validation section */}
                          {(single?.verified && single?.verified === "Y") ||
                          (single?.verified && single?.verified !== "N") ? (
                            <Box>
                              <IoMdCheckmarkCircle
                                color="#10CF8B"
                                fontSize={"23px"}
                              />
                            </Box>
                          ) : (
                            <Box>
                              {(((single?.id === "mobileValue" ||
                                single?.id !== "") &&
                                !single?.verified) ||
                                (single?.verified &&
                                  single?.verified === "N")) && (
                                <Button
                                  variant={"link"}
                                  color={"#2F4CDD"}
                                  fontSize={"14px"}
                                  px={2}
                                  onClick={() => {
                                    handleGetOtp(single);
                                    onOpenOtpModal(single);
                                  }}
                                >
                                  {t("newloan.validate")}
                                </Button>
                              )}
                            </Box>
                          )}

                          {/* Delete button - maintain space for alignment */}
                          <Box
                            width="32px"
                            display="flex"
                            justifyContent="center"
                          >
                            {defaultFlag === "Y" ? (
                              // Empty space but maintains layout
                              <Box width="20px" height="20px" />
                            ) : (
                              <Button
                                px={0}
                                style={{
                                  backgroundColor: "transparent",
                                  paddingLeft: "0px",
                                }}
                                onClick={() => onOpenDeleteModal(single)}
                              >
                                <RxMinusCircled
                                  color={"#FF0909"}
                                  cursor={"pointer"}
                                  fontSize={"20px"}
                                />
                              </Button>
                            )}
                          </Box>
                        </Flex>
                      </>
                    </SingleCard>
                  );
                }
              )}

              {/* Keep modals outside the mapping function */}
              <Modal
                isOpen={isDeleteModalOpen}
                onClose={onCloseDeleteModal}
                isCentered
              >
                <ModalOverlay />
                <ModalContent width="350px">
                  <ModalHeader
                    fontSize={"18px"}
                    fontWeight={"semibold"}
                    border={"0"}
                    pb={"0"}
                    pt={"14px"}
                    px={"22px"}
                  >
                    Confirmation
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody
                    fontSize={"14px"}
                    pt={"0"}
                    px={"22px"}
                    color={"RGBA(0, 0, 0, 0.7)"}
                  >
                    {/* This action will delete mobile detail, click ok to continue */}
                    {removeMobileconfirmMsg}
                  </ModalBody>
                  <ModalFooter textAlign={"right"} py={"3"}>
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onCloseDeleteModal}
                      >
                        Cancel
                      </Button>
                      <Button
                        background={"#2F4CDD"}
                        onClick={() => {
                          const rowIndex = mobileArray.findIndex(
                            item =>
                              item.applicantMobileNo ===
                              currentRow?.applicantMobileNo
                          );
                          handlePhoneDelete(currentRow, rowIndex);
                          onCloseDeleteModal();
                        }}
                      >
                        Ok
                      </Button>
                    </ButtonGroup>
                  </ModalFooter>
                </ModalContent>
              </Modal>

              <Modal
                isOpen={isOtpModalOpen}
                onClose={onCloseOtpModal}
                isCentered
              >
                <ModalOverlay />
                <ModalContent width="300px">
                  <ModalHeader
                    fontSize={"18px"}
                    fontWeight={"semibold"}
                    border={"0"}
                    pb={"0"}
                    pt={"14px"}
                    px={"22px"}
                  >
                    {t("newloan.enterotp")}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody
                    fontSize={"14px"}
                    pt={"0"}
                    px={"22px"}
                    color={"RGBA(0, 0, 0, 0.7)"}
                  >
                    {t("newloan.enteryourotp")}
                    <Flex
                      pt={"37px"}
                      pb={"30px"}
                      gap={"30px"}
                      alignItems={"center"}
                    >
                      <FormLabel
                        fontSize={"12px"}
                        color={"RGBA(0, 0, 0, 0.6)"}
                        m={"0"}
                      >
                        {t("newloan.otp")}
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder="Enter"
                        fontSize={"13px"}
                        variant={"flushed"}
                        value={otp}
                        name="otp"
                        onChange={handleChangeOnOtp}
                        maxLength={6}
                      />
                    </Flex>
                  </ModalBody>
                  <ModalFooter textAlign={"center"} py={"3"}>
                    <Button
                      fontSize={"14px"}
                      height={"32px"}
                      background={"#2F4CDD"}
                      onClick={() => {
                        handleSetOtp(currentRow);
                        onCloseOtpModal();
                      }}
                      isDisabled={!otp}
                    >
                      {t("newloan.validate")}
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Box>
          </Box>
          <Box width={{ base: "100%", md: "50%" }}>
            <Flex justifyContent={"space-between"}>
              <Heading
                fontSize={"18px"}
                color={
                  activeLink == id ? MifinColor.blue_300 : MifinColor.gray_100
                }
                fontWeight={"700"}
                lineHeight={"36px"}
                mb={{ base: "18px", lg: "22px" }}
              >
                {t("newloan.email1")}
              </Heading>
              <Button
                id="emailArray" // changed
                ref={emailBtnRef}
                onClick={() => {
                  onEmailOpen();
                  setIsEmailHighlighted(false);
                }}
                onBlur={() => setIsEmailHighlighted(false)}
                isDisabled={
                  mobile &&
                  mobile?.length > 0 &&
                  checkNewLoanOrApplicant === "newLoan"
                    ? true
                    : false
                }
                background={"none"}
                sx={{
                  "&:hover ": {
                    background: "none !important",
                  },
                }}
                padding={0}
                _focus={{
                  borderColor: isEmailHighlighted ? "#2F4CDD" : "transparent",
                  boxShadow: isEmailHighlighted ? "0 0 0 1px #2F4CDD" : "none",
                  outline: "none",
                }}
              >
                <img
                  src={getCorrectImageUrl(svgs.addButton)}
                  alt="addEmailBtn"
                />
              </Button>

              <Modal isOpen={isEmailOpen} onClose={handleEmailClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="350px">
                  {" "}
                  {/* Set your desired width here */}
                  <ModalHeader
                    fontSize={"18px"}
                    fontWeight={"semibold"}
                    border={"0"}
                    py={"12px"}
                    px={"22px"}
                  >
                    {t("newloan.email2")}
                  </ModalHeader>
                  <ModalCloseButton onClick={handleEmailClose} />
                  <ModalBody px={"22px"} pt="0" pb="30px">
                    <form>
                      <Grid
                        gridTemplateColumns={"35% 65%"}
                        alignItems={"center"}
                      >
                        <FormLabel
                          fontSize={"14px"}
                          color={MifinColor?.black_opacity_black_70}
                          m={"0"}
                        >
                          {t("newloan.type2")}
                          <span style={{ color: MifinColor?.primary_red }}>
                            *
                          </span>
                        </FormLabel>
                        <SelectComponent
                          name="emailType"
                          inputId="emailType"
                          placeholder={"Select"}
                          control={emailControl}
                          options={emailTypeOptions ?? []}
                          disabled={freezeDisabledApplicant}
                        />
                        <Text></Text>
                        <Text>
                          {emailError && (
                            <span style={{ color: MifinColor?.primary_red }}>
                              {emailError?.emailType?.message}
                            </span>
                          )}
                        </Text>
                        <FormLabel
                          fontSize={"14px"}
                          color={MifinColor?.black_opacity_black_70}
                          m={"0"}
                        >
                          {t("newloan.email3")}
                          <span style={{ color: MifinColor?.primary_red }}>
                            *
                          </span>
                        </FormLabel>
                        <TextInput
                          placeholder="Enter"
                          name="email"
                          control={emailControl}
                          style={{
                            color: "#000000CC !important",
                            textTransform: "uppercase",
                            fontWeight: FONT_WEIGHT,
                          }}
                          maxLength={100}
                          isSpecialChar
                          type="email"
                          isDisabled={freezeDisabledApplicant}
                        />
                        <Text></Text>
                        <Text>
                          {emailError && (
                            <span style={{ color: MifinColor?.primary_red }}>
                              {emailError?.email?.message}
                            </span>
                          )}
                        </Text>
                      </Grid>
                    </form>
                  </ModalBody>
                  <ModalFooter py={"3"} px={"22px"}>
                    <Button
                      variant="outline"
                      borderColor="#000"
                      color="#000"
                      mr={3}
                      fontSize={"14px"}
                      py={1}
                      onClick={handleEmailClose}
                    >
                      {t("common.cancel")}
                    </Button>
                    {!isEditModeEmail && (
                      <Button
                        background={"#2F4CDD"}
                        fontSize={"14px"}
                        py={1}
                        onClick={async () => {
                          const isValid = await emailTrigger();
                          if (!isValid) {
                            return;
                          }
                          handleEmailPopUp(getEmailValues());
                        }}
                        isDisabled={freezeDisabledApplicant}
                      >
                        {t("common.add")}
                      </Button>
                    )}
                    {isEditModeEmail && (
                      <Button
                        background={"#2F4CDD"}
                        fontSize={"14px"}
                        py={1}
                        onClick={async () => {
                          const isValid = await emailTrigger();
                          if (!isValid) {
                            return;
                          }
                          handleEmailEditPopUp(getEmailValues());
                        }}
                        isDisabled={freezeDisabledApplicant}
                      >
                        Update
                      </Button>
                    )}
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
            <Box display={{ base: "block", md: "none" }}>
              {emailArray.map(
                ({ defaultFlag, dnsFlag, id, Verified, ...single }, index) => {
                  return (
                    <SingleCard data={single} key={index}>
                      <Flex gap={"10px"} alignItems={"center"}>
                        {single?.verified === "Y" ? (
                          <IoMdCheckmarkCircle
                            color="#10CF8B"
                            fontSize={"23px"}
                          />
                        ) : (
                          <>
                            <Button
                              variant={"link"}
                              color={"#2F4CDD"}
                              fontSize={"14px"}
                              px={0}
                              onClick={onOpenModal}
                            >
                              Validate
                            </Button>

                            <Portal>
                              <Modal
                                isOpen={isModalOpen}
                                onClose={onCloseModal}
                                isCentered
                              >
                                <ModalOverlay />
                                <ModalContent width="300px">
                                  <ModalHeader
                                    fontSize={"16px"}
                                    fontWeight={"semibold"}
                                    border={"0"}
                                    pb={"0"}
                                    pt={"14px"}
                                    px={"22px"}
                                  >
                                    Enter OTP
                                  </ModalHeader>
                                  <ModalCloseButton />
                                  <ModalBody
                                    fontSize={"14px"}
                                    pt={"0"}
                                    px={"22px"}
                                    color={"RGBA(0, 0, 0, 0.7)"}
                                  >
                                    Please enter OTP received on your email
                                    account
                                    <Flex
                                      pt={"37px"}
                                      pb={"30px"}
                                      gap={"30px"}
                                      alignItems={"center"}
                                    >
                                      <FormLabel
                                        fontSize={"12px"}
                                        color={"RGBA(0, 0, 0, 0.6)"}
                                        m={"0"}
                                      >
                                        OTP
                                      </FormLabel>
                                      <Input
                                        type="number"
                                        placeholder="Enter"
                                        fontSize={"13px"}
                                        variant={"flushed"}
                                      />
                                    </Flex>
                                  </ModalBody>
                                  <ModalFooter textAlign={"center"} py={"3"}>
                                    <Button
                                      fontSize={"14px"}
                                      height={"32px"}
                                      background={"#2F4CDD"}
                                    >
                                      Validate
                                    </Button>
                                  </ModalFooter>
                                </ModalContent>
                              </Modal>
                            </Portal>
                          </>
                        )}
                        <RxPencil2
                          color={"#2f4cdd"}
                          cursor={"pointer"}
                          fontSize={"20px"}
                          onClick={() => {
                            handleEmailEdit(single, index);
                          }}
                        />
                        <>
                          <Button
                            px={0}
                            style={{
                              backgroundColor: "transparent",
                              paddingLeft: "0px",
                            }}
                            // onClick={openModal}
                            onClick={() => handleEmailModalClick(single, index)}
                          >
                            <RxMinusCircled
                              color={"#FF0909"}
                              cursor={"pointer"}
                              fontSize={"20px"}
                            />
                          </Button>
                        </>
                      </Flex>
                    </SingleCard>
                  );
                }
              )}
            </Box>
            <TableContainer
              display={{ base: "none", md: "table" }}
              overflow={"hidden"}
            >
              <Table variant="striped" marginLeft={"-2"}>
                <Thead>
                  <Tr color={"#3E4954"}>
                    <Th style={{ textTransform: "unset" }} py={"3"}>
                      <Flex>
                        <Text>{t("newloan.type3")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th style={{ textTransform: "unset" }} py={"3"}>
                      <Flex>
                        <Text>{t("newloan.email4")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th style={{ textTransform: "unset" }} py={"3"}>
                      <Flex>
                        <Text>{t("newloan.default1")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th style={{ textTransform: "unset" }} py={"3"} colSpan={2}>
                      <Flex>
                        <Text>{t("newloan.validate2")}</Text>
                        {!arrowHide && <Icon as={svgs?.DefaultArrowTable} />}
                      </Flex>
                    </Th>
                    <Th py={3}>
                      <Text></Text>
                    </Th>
                    <Th py={3}>
                      <Text></Text>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {emailArray?.map((singleRow: any, i: any) => (
                    <>
                      <Tr key={i}>
                        <Td px={"4"} py={"3"}>
                          {singleRow?.applicantEmailType?.label}
                        </Td>
                        <Td
                          px={"4"}
                          py={"3"}
                          overflow={"hidden"}
                          maxWidth={"10px"}
                        >
                          <Tooltip
                            label={singleRow?.applicantEmailId?.toUpperCase()}
                            aria-label="A tooltip"
                          >
                            {singleRow?.applicantEmailId?.toUpperCase()}
                          </Tooltip>
                        </Td>
                        <Td px={"4"} py={"3"}>
                          <Stack direction="row" pl={"6"}>
                            <Radio
                              onChange={() => setDefaultYNEmail(i)}
                              isChecked={
                                singleRow?.defaultFlag === "Y" ? true : false
                              }
                              sx={{
                                ".chakra-radio__control": {
                                  bg: "#000",
                                  color: "#3182ce",
                                },
                              }}
                              isDisabled={freezeDisabledApplicant}
                            ></Radio>
                          </Stack>
                        </Td>
                        <Td px={"4"} py={"3"}>
                          {singleRow?.verified === "Y" ? (
                            <IoMdCheckmarkCircle
                              color="#10CF8B"
                              fontSize={"23px"}
                            />
                          ) : (
                            <>
                              <Button
                                variant={"link"}
                                color={"#2F4CDD"}
                                fontSize={"14px"}
                                px={0}
                                onClick={onOpenModal}
                              >
                                Validate
                              </Button>

                              <Portal>
                                <Modal
                                  isOpen={isModalOpen}
                                  onClose={onCloseModal}
                                  isCentered
                                >
                                  <ModalOverlay />
                                  <ModalContent width="300px">
                                    <ModalHeader
                                      fontSize={"16px"}
                                      fontWeight={"semibold"}
                                      border={"0"}
                                      pb={"0"}
                                      pt={"14px"}
                                      px={"22px"}
                                    >
                                      Enter OTP
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody
                                      fontSize={"14px"}
                                      pt={"0"}
                                      px={"22px"}
                                      color={"RGBA(0, 0, 0, 0.7)"}
                                    >
                                      Please enter OTP received on your email
                                      account
                                      <Flex
                                        pt={"37px"}
                                        pb={"30px"}
                                        gap={"30px"}
                                        alignItems={"center"}
                                      >
                                        <FormLabel
                                          fontSize={"12px"}
                                          color={"RGBA(0, 0, 0, 0.6)"}
                                          m={"0"}
                                        >
                                          OTP
                                        </FormLabel>
                                        <Input
                                          type="number"
                                          placeholder="Enter"
                                          fontSize={"13px"}
                                          variant={"flushed"}
                                        />
                                      </Flex>
                                    </ModalBody>
                                    <ModalFooter textAlign={"center"} py={"3"}>
                                      <Button
                                        fontSize={"14px"}
                                        height={"32px"}
                                        background={"#2F4CDD"}
                                      >
                                        Validate
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Portal>
                            </>
                          )}
                        </Td>
                        <Td px={"0"} py={"3"}>
                          <RxPencil2
                            color={"#2f4cdd"}
                            cursor={"pointer"}
                            fontSize={"20px"}
                            onClick={() => {
                              handleEmailEdit(singleRow, i);
                            }}
                          />
                        </Td>
                        <Td>
                          {/* {!singleRow?.id && ( */}
                          {/* <> */}

                          <>
                            <Button
                              px={0}
                              style={{
                                backgroundColor: "transparent",
                                paddingLeft: "0px",
                              }}
                              // onClick={openModal}
                              onClick={() =>
                                handleEmailModalClick(singleRow, i)
                              }
                            >
                              <RxMinusCircled
                                color={"#FF0909"}
                                cursor={"pointer"}
                                fontSize={"20px"}
                              />
                            </Button>

                            <Modal
                              isOpen={isDeleteOpen}
                              onClose={closeModal}
                              isCentered
                            >
                              <ModalOverlay />
                              <ModalContent width="350px">
                                <ModalHeader
                                  fontSize={"18px"}
                                  fontWeight={"semibold"}
                                  border={"0"}
                                  pb={"0"}
                                  pt={"14px"}
                                  px={"22px"}
                                >
                                  Confirmation
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody
                                  fontSize={"14px"}
                                  pt={"0"}
                                  px={"22px"}
                                  color={"RGBA(0, 0, 0, 0.7)"}
                                >
                                  {/* This action will delete email detail which newly added but not saved one, click ok
                                  to continue */}
                                  {removeEmailconfirmMsg}
                                </ModalBody>
                                <ModalFooter textAlign={"right"} py={"3"}>
                                  <ButtonGroup size="sm">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={closeModal}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      background={"#2F4CDD"}
                                      onClick={() => {
                                        handleEmailDelete(singleRow, i);
                                        closeModal();
                                      }}
                                    >
                                      Ok
                                    </Button>
                                  </ButtonGroup>
                                </ModalFooter>
                              </ModalContent>
                            </Modal>
                          </>
                          {/* </>
                        )} */}
                        </Td>
                      </Tr>
                    </>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PhoneAndEmail;
