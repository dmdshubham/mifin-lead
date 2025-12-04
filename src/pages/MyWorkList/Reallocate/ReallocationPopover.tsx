import { DeepPartial, useForm } from "react-hook-form";
import { useAppSelector } from "@mifin/redux/hooks";
import {
  Popover,
  PopoverTrigger,
  Button,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Heading,
  FormControl,
  FormLabel,
  PopoverFooter,
  Box,
} from "@chakra-ui/react";
import SelectComponent from "@mifin/components/SelectComponent";
import { useSearchStore } from "@mifin/store/apiStore";
import { useReallocationMutation } from "@mifin/service/mifin-reallocation";
import { useFetchleadList } from "@mifin/service/mifin-getLeadDetails";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "@mifin/components/Input";
import PrimaryButton from "@mifin/components/Button";
import ReallocationSchema from "@mifin/schema/ReallocationSchema";
import {
  FormValues,
  IReallocationPopoverProps,
} from "@mifin/Interface/myWorklist";
import { FC, useMemo } from "react";
import { useEffect } from "react";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { reallocationPopoverStyling } from "@mifin/theme/style";

const defaultValues: DeepPartial<FormValues> = {
  queueId: null,
  allocatedId: null,
  remark: "",
};

const ReallocationPopover: FC<IReallocationPopoverProps> = props => {
  const { allID, setAllID, searchData, allocateMaster } = props;
  const { userDetails } = useSearchStore();
  const { t } = useTranslation();
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const { mutateAsync: getReallocation } = useReallocationMutation();

  const formData1 = {
    ...MASTER_PAYLOAD,
    requestData: {
      iDisplayStart: "0",
      iDisplayLength: "10",
      sEcho: "1",
      leadsSearchDetail: {
        ...searchData,
        requestType: "myLead",
      },
    },
  };

  const { data, isLoading, refetch } = useFetchleadList(formData1);

  const yupValidationSchema: any = useMemo(() => ReallocationSchema(t), [t]);

  const {
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    resolver: yupResolver(yupValidationSchema),
  });

  const queueMaster = mastersData?.Masters?.productMaster?.map(
    (el: IReallocationPopoverProps) => {
      return {
        label: el?.prodName,
        value: el?.prodId,
      };
    }
  );

  const formData = {
    ...MASTER_PAYLOAD,
    requestData: {
      inpList: ["1000000235~1100000421", "1000000237~1100000421"],
      remark: "ok",
      allocatedId: "1100000421",
      queueId: "2000000080",
    },
  };

  const reallocationHandle = async (data: any) => {
    const reqBody = {
      ...formData,
      requestData: {
        queueId: data?.queueId?.value ?? "",
        allocatedId: data?.allocatedId?.value ?? "",
        remark: data?.remark,
        inpList: allID,
      },
    };

    try {
      await getReallocation(reqBody);
      reset();
      setAllID([]);
      await refetch();
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  };

  useEffect(() => {
    if (isDirty) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  useEffect(() => {
    if (isDirty) trigger();
  }, [isDirty]);

  return (
    <Popover closeOnBlur={false} placement="top">
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button
              variant="solid"
              sx={{
                backgroundColor: "#2F4CDD",
                color: "white",
              }}
              _hover={{
                backgroundColor: "#2F4CDD",
                color: "white",
              }}
            >
              {t("common.reallocation")}
            </Button>
          </PopoverTrigger>
          <Portal>
            <form onSubmit={handleSubmit(reallocationHandle)}>
              <PopoverContent
                sx={{
                  width: "320px",
                  height: "auto",
                  maxWidth: "95%",
                  maxHeight: "400px",
                  overflow: "visible",
                  position: "relative",
                  ...reallocationPopoverStyling,
                }}
              >
                <PopoverArrow />
                <PopoverBody>
                  <Heading as="h3" fontSize="20x" mb="4">
                    {t("common.reallocation")}
                  </Heading>
                  <FormControl display="flex" gap="2" isRequired pb={2}>
                    <FormLabel w="40%" fontSize={"14px"}>
                      {t("worklist.reallocationPopover.allocateTo")}
                    </FormLabel>
                    <Box w="60%">
                      <SelectComponent
                        control={control}
                        name="allocatedId"
                        options={allocateMaster}
                        placeholder={t("common.select")}
                      />
                    </Box>
                  </FormControl>
                  <FormControl display="flex" gap="2" pb={2}>
                    <FormLabel w="40%" fontSize={"14px"}>
                      {t("worklist.reallocationPopover.queue")}
                    </FormLabel>
                    <Box w="60%">
                      <SelectComponent
                        name="queueId"
                        control={control}
                        options={queueMaster}
                        placeholder={t("common.select")}
                      />
                    </Box>
                  </FormControl>
                  <FormControl display="flex" gap="2" isRequired>
                    <FormLabel w="40%" fontSize={"14px"}>
                      {t("common.remarks")}
                    </FormLabel>
                    <Box w="60%">
                      <TextInput
                        name="remark"
                        control={control}
                        type="text"
                        placeholder={t("common.remarksPlaceholder")}
                      />
                    </Box>
                  </FormControl>
                </PopoverBody>
                <PopoverFooter display="flex" justifyContent="flex-end" gap="2">
                  <PrimaryButton
                    title={t("common.cancel")}
                    onClick={onClose}
                    secondary
                    size="sm"
                  />
                  <PrimaryButton
                    title={t("common.submit")}
                    type="submit"
                    height="12px"
                    size="sm"
                  />
                </PopoverFooter>
              </PopoverContent>
            </form>
          </Portal>
        </>
      )}
    </Popover>
  );
};

export default ReallocationPopover;
