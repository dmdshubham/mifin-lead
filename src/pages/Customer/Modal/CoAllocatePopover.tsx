import { useState, useMemo, useEffect, FC } from "react";
import { useAppSelector, useAppDispatch } from "@mifin/redux/hooks";
import { help } from "@mifin/redux/service/help/api";
import { referCase } from "@mifin/redux/service/referCase/api";
import { toastSuccess, toastFail } from "@mifin/components/Toast";
import { useNavigate } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PopOverSchema from "@mifin/schema/PopOverSchema";
import SelectComponent from "@mifin/components/SelectComponent";
import PrimaryButton from "@mifin/components/Button";
import { setIsEscalatedScreen } from "@mifin/redux/features/isEscalatedScreen";
import { errorTextStyle } from "@mifin/theme/style";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { AllocatedUser } from "@mifin/Interface/Customer";

const CoAllocateModal: FC = (props: any) => {
  const { isConvertedToCustomer } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const yupValidationSchema: any = useMemo(() => PopOverSchema(t), [t]);
  const customerData: any = useAppSelector(state => state.getLeadId);
  const [allocateToMaster, setAllocateToMaster] = useState([]);
  const dispatch = useAppDispatch();
  const [isSavedAttempted, setIsSaveAttempted] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
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

  useEffect(() => {
    if (isDirty || isSavedAttempted) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  const defaultValues = watch();

  const HELP_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      helpType: "allocate",
      leadDetail: {
        caseId: customerData?.leadId,
      },
    },
  };

  const getHelpData = () => {
    dispatch(help(HELP_BODY)).then((res: any) => {
      if (res.payload.statusInfo.statusCode === "200") {
        setAllocateToMaster(
          res.payload?.responseData?.peerAndreportee.map(
            (el: AllocatedUser) => {
              return {
                label: el?.userName,
                value: el?.userId,
              };
            }
          )
        );
      }
    });
  };

  const handleModalSubmit = () => {
    const REFER_CASE_BODY = {
      ...MASTER_PAYLOAD,
      requestData: {
        leadDetail: {
          caseId: customerData?.leadId,
        },
        contactDetail: {
          helpType: "coallocate",
          initiatedTo: defaultValues?.allocateTo?.value ?? "",
          remarks: defaultValues?.remarks ?? "",
        },
      },
    };

    dispatch(referCase(REFER_CASE_BODY))
      .then(res => {
        if (res?.payload.statusInfo.statusCode === "200") {
          toastSuccess("Successfully allocated");
          navigate(`/worklist`);
          dispatch(setIsEscalatedScreen({ value: !true }));
          onClose();
        }
      })
      .catch(err => {
        toastFail("Failed to Allocated");
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
      >
        {t("contact.heading.coAllocate")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(handleModalSubmit)}>
            <ModalHeader>{t("contact.heading.coAllocate")}</ModalHeader>
            <ModalBody>
              <FormControl display="flex" gap="4">
                <FormLabel w="30%" fontSize="14px" color={"#000000BE"}>
                  {t("contact.heading.coAllocateTo")}
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
              <FormControl display="flex" gap="4">
                <FormLabel w="40%" fontSize="14px" color={"#000000BE"}>
                  {t("common.remarks")}
                </FormLabel>
                <Box w="100%">
                  <Textarea
                    resize="none"
                    placeholder={t("common.enter")}
                    {...register("remarks")}
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
                  height="12px"
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

export default CoAllocateModal;
