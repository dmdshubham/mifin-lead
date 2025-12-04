import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@mifin/redux/hooks";
import { help } from "@mifin/redux/service/help/api";
import { referCase } from "@mifin/redux/service/referCase/api";
import { toastSuccess, toastFail } from "@mifin/components/Toast";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Text,
  Box,
  useDisclosure,
  ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PopOverSchema from "@mifin/schema/PopOverSchema";
import PrimaryButton from "@mifin/components/Button";
import SelectComponent from "@mifin/components/SelectComponent";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { errorTextStyle } from "@mifin/theme/style";
import { AllocatedUser } from "@mifin/Interface/Customer";
import { useApiStore } from "@mifin/store/apiStore";
import { sanitizedInput} from "@mifin/utils/sanitizedInput";

const ReferModal = (props: any) => {
  const { isConvertedToCustomer } = props;
  const navigate = useNavigate();
  const customerData: any = useAppSelector(state => state.leadHeaderDetails);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const yupValidationSchema: any = useMemo(() => PopOverSchema(t), [t]);
  const [allocateToMaster, setAllocateToMaster] = useState([]);
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userDetails } = useApiStore();
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      allocateTo: null as null | AllocatedUser,
      remarks: "",
    },
    mode: "onChange",
    resolver: yupResolver(yupValidationSchema),
  });
  const defaultValues = watch();
  const allocatedToId = customerData?.data?.allocatedToId || "";
  const leadId = customerData?.data?.leadId || "";

  useEffect(() => {
    if (isDirty || isSaveAttempted) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  const HELP_BODY = {
    // userDetail: {
    //   userId: allocatedToId,
    //   companyId: "1000000001",
    //   actionId: "1000000002",
    // },
    ...MASTER_PAYLOAD,
    // deviceDetail: userDetails.deviceDetail,
    requestData: {
      helpType: "refer",
      leadDetail: {
        caseId: leadId,
      },
    },
  };

  const getHelpData = () => {
    dispatch(help(HELP_BODY))
      .then((res: any) => {
        if (res?.payload.statusInfo.statusCode === "200") {
          setAllocateToMaster(
            res?.payload?.responseData.peerAndreportee.map(
              (el: AllocatedUser) => {
                return {
                  label: el?.userName,
                  value: el?.userId,
                };
              }
            )
          );
        }
      })
      .catch((err: AllocatedUser) => {
        toastFail("Something went wrong");
        throw new Error(`An Error occured ${err}`);
      });
  };

  const handleModalSubmit = () => {
    const REFER_CASE_BODY = {
      // userDetail: {
      //   userId: allocatedToId,
      //   companyId: "1000000001",
      //   actionId: "1000000002",
      // },
      // deviceDetail: userDetails.deviceDetail,
      ...MASTER_PAYLOAD,
      requestData: {
        leadDetail: {
          caseId: leadId,
        },
        contactDetail: {
          helpType: "refer",
          initiatedTo: defaultValues?.allocateTo?.value ?? "",
          remarks: defaultValues.remarks ?? "",
        },
      },
    };

    dispatch(referCase(REFER_CASE_BODY))
      .then(res => {
        if (res?.payload.statusInfo.statusCode === "200") {
          toastSuccess("Successfully refereed");
          navigate(`/worklist`);
          onClose();
        }
      })
      .catch(err => {
        toastFail("Failed to refer");
        throw new Error(`An Error occured ${err}`);
      });
  };

  return (
    <>
      <Button
        variant="outline"
        sx={{ color: "#2F4CDD", borderColor: "#2F4CDD" }}
        onClick={() => {
          getHelpData();
          onOpen();
        }}
        // isDisabled={isConvertedToCustomer}
        isDisabled={sessionStorage.getItem("isConverted") === "true"}
      >
        {t("contact.heading.refer")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(handleModalSubmit)}>
            <ModalHeader>{t("contact.heading.referTo")}</ModalHeader>
            <ModalBody>
              <FormControl display="flex" gap="2" isRequired>
                <FormLabel w="30%" fontSize={"14px"} color={"#000000BE"}>
                  {t("contact.heading.referTo")}
                </FormLabel>
                <Box w="70%" mb={4}>
                  <SelectComponent
                    control={control}
                    name="allocateTo"
                    options={allocateToMaster}
                    placeholder={t("common.select")}
                    onCustomChange={e => {
                      e.stopPropagation();
                    }}
                  />
                </Box>
              </FormControl>
              <FormControl display="flex" gap="2">
                <FormLabel w="40%" fontSize={"14px"} color={"#000000BE"}>
                  {t("common.remarks")}
                </FormLabel>
                <Box w="100%">
                  <Textarea
                    resize="none"
                    placeholder={t("common.enter")}
                    {...register("remarks", {
                          onChange: (e) => {
                            e.target.value = sanitizedInput(e.target.value);
                          },
                        })}
                    _placeholder={{ fontSize: "12px" }}
                    fontSize={"14px"}
                    fontWeight={"600"}
                    textTransform="uppercase"
                  />
                  {errors?.remarks && (
                    <Text sx={errorTextStyle}>{errors?.remarks?.message}</Text>
                  )}
                </Box>
              </FormControl>
            </ModalBody>
            <ModalFooter display="flex" justifyContent="flex-end">
              <ButtonGroup size="sm">
                <PrimaryButton
                  title={t("common.cancel")}
                  onClick={() => {
                    onClose();
                    reset();
                  }}
                  secondary
                />
                <PrimaryButton
                  title={t("common.submit")}
                  type="submit"
                  onClick={() => setIsSaveAttempted(true)}
                />
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReferModal;
