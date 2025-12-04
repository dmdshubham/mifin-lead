import React, { FC, useEffect } from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Stack,
  Box,
  Input,
  FormControl,
  FormLabel,
  DrawerFooter,
  Text,
  Flex,
} from "@chakra-ui/react";
import addIcons from "@mifin/assets/icons/add-icon.svg";
import { ISideDrawerProps } from "@mifin/Interface/SearchAndAllocate";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectComponent from "@mifin/components/SelectComponent";
import PrimaryButton from "@mifin/components/Button";
import { BiReset } from "react-icons/bi";
import { toastSuccess } from "@mifin/components/Toast";
import { useMemo } from "react";
import SearchAndAllocateYupSchema from "@mifin/schema/SearchAndAllocateYupSchema";
import {
  formControlStyle,
  errorTextStyle,
  addButtonStyle,
} from "@mifin/theme/style";
import { AddressProps } from "@mifin/Interface/Customer";
import { useAppSelector } from "@mifin/redux/hooks";
import isEqual from "@mifin/utils/isEqual";

const SideDrawer: FC<ISideDrawerProps> = props => {
  const {
    drawerFormData,
    allocatedList,
    setAllocatedList,
    setShowAllocateTable,
    remainingCase,
    setRemainingCase,
    allocateList,
    selectedUser,
    setIsEditClicked,
    isEditClicked,
    handleReset,
    isOpen,
    onOpen,
    onClose,
  } = props;

  const drawerData = JSON.parse(JSON.stringify(drawerFormData));

  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const { t } = useTranslation();
  const yupValidationSchema: any = useMemo(
    () => SearchAndAllocateYupSchema(t, remainingCase, drawerData),
    [t, remainingCase, drawerData]
  );

  const {
    register,
    reset,
    watch,
    handleSubmit,
    trigger,
    control,
    setValue,
    getValues,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      campaign: drawerData?.campaign ?? "",
      campaignId: drawerData?.campaignId ?? "",
      queue: drawerData?.queue ?? "",
      queueId: drawerData?.queueId ?? "",
      subQueueId: drawerData?.subQueueId ?? "",
      dnd: drawerData?.dnd ?? "",
      sourceId: drawerData?.sourceId ?? "",
      source: drawerData?.source ?? "",
      noOfCase: drawerData?.noOfCase,
      allocate: null as null | ISideDrawerProps,
      rowNo: drawerData?.rowNo,
    },
    mode: "onSubmit",
    resolver: yupResolver(yupValidationSchema),
  });
  useEffect(() => {
    trigger();
  }, [watch("allocate"), trigger, watch("noOfCase")]);

  const productMaster = mastersData?.Masters?.productMaster.map(
    (el: AddressProps) => {
      return {
        label: el?.prodName,
        value: el?.prodId,
      };
    }
  );
  const subQueueMaster = mastersData?.Masters?.subQueueMaster.map(
    (el: AddressProps) => {
      return {
        label: el?.subQueue,
        value: el?.subQueueId,
      };
    }
  );

  const sourceMaster = mastersData?.Masters?.sourceMaster.map(
    (el: AddressProps) => {
      return {
        label: el?.sourceName,
        value: el?.caseSourceId,
      };
    }
  );
  const campaignMaster = mastersData?.Masters?.campaignMaster.map(
    (el: AddressProps) => {
      return {
        label: el?.campaignName,
        value: el?.campaignId,
      };
    }
  );

  useEffect(() => {
    if (isDirty) {
      setTimeout(trigger, 0);
    }
  }, [t]);

  const defaultValues = watch();

  const allocateMasterData = allocateList
    ?.filter((el: ISideDrawerProps) => {
      return el.userId !== selectedUser;
    })
    .map((el: ISideDrawerProps) => {
      return {
        label: el.userName,
        value: el.userId,
      };
    });
  const handleDrawerCancel = () => {
    onClose();
    reset();
  };

  const calculateRemainingCases = () => {
    let allocatedCase = 0;
    for (let i = 0; i < allocatedList.length; i++) {
      allocatedCase += +allocatedList[i].noOfCase;
    }
    // setTotalCase(drawerData?.noOfCase);
  };

  // re calculate based on the table data changes
  // useEffect(() => {
  //   calculateRemainingCases();
  //   // checkAllocatedCases();
  // }, [allocatedList]);

  // const memoizedDrawerData = useMemo(() => drawerData, [drawerData,drawerFormData,remainingCase]);

  useEffect(() => {
    if (drawerFormData) {
      const currentFormData = {
        queueId: getValues("queueId"),
        subQueue: getValues("subQueue"),
        source: getValues("source"),
        campaign: getValues("campaign"),
        noOfCase: getValues("noOfCase"),
        rowNo: getValues("rowNo"),
      };

      const newFormData = {
        queueId: {
          label: drawerFormData?.queue,
          value: drawerFormData?.queueId,
        },
        subQueue: {
          label: drawerFormData?.subQueue,
          value: drawerFormData?.subQueueId,
        },
        source: {
          label: drawerFormData?.source,
          value: drawerFormData?.sourceId,
        },
        campaign: {
          label: drawerFormData?.campaign,
          value: drawerFormData?.campaignId,
        },
        noOfCase: drawerFormData?.noOfCase,
        rowNo: drawerFormData?.rowNo,
      };

      if (!isEqual(currentFormData, newFormData)) {
        setValue("queueId", newFormData?.queueId);
        setValue("subQueue", newFormData?.subQueue);
        setValue("source", newFormData?.source);
        setValue("campaign", newFormData?.campaign);
        setValue("noOfCase", newFormData?.noOfCase);
        setValue("rowNo", newFormData?.rowNo);
      }
    }
  }, [drawerFormData, setValue, getValues, isDirty]);

  const handleAddCase = () => {
    const currentAllocatedCase = parseInt(watch("noOfCase"));
    if (currentAllocatedCase) {
      setRemainingCase((prev: any) => {
        const updatedRemaningCase = prev.map((item: any) => {
          if (item?.rowNo == drawerFormData?.rowNo) {
            return {
              rowNo: drawerFormData?.rowNo,
              remaningCases: drawerFormData?.noOfCase - currentAllocatedCase,
            };
          }
          // if (item.rowNo === drawerFormData?.rowNo && item.remaningCases) {
          //   return {
          //     rowNo: item.rowNo,
          //     remaningCases: item.remaningCases - currentAllocatedCase,
          //   };
          // } else if (item.rowNo === drawerFormData?.rowNo && !item.remaningCases) {
          //   return {
          //     rowNo: item.rowNo,
          //     remaningCases: drawerFormData?.noOfCase - currentAllocatedCase,
          //   };
          // }
          return item;
        });

        return updatedRemaningCase;
      });
    }
    setAllocatedList([...allocatedList, defaultValues]);
    reset();
    onClose();
  };

  return (
    <>
      <Box>
        <Button
          onClick={() => {
            setIsEditClicked(false);
            onOpen();
          }}
          sx={{ backgroundColor: "transparent" }}
          _hover={addButtonStyle.hoverState}
        >
          <img src={addIcons} alt="add icon" />
        </Button>
        <Button
          onClick={() => {
            handleReset();
            toastSuccess("Reset Successfully");
          }}
        >
          <BiReset />
        </Button>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <Box onClick={() => setShowAllocateTable(false)}>
            <DrawerCloseButton />
          </Box>

          <DrawerHeader borderBottomWidth="1px">
            {t("searchAndAllocate.allocateToDrawer.allocateTo")}
          </DrawerHeader>

          <DrawerBody mt="4">
            <form id="drawerForm" onSubmit={handleSubmit(handleAddCase)}>
              <Stack spacing={{ base: "2px", md: "24px" }}>
                <FormControl sx={formControlStyle} width="100%">
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "start", md: "center" }}
                    justify="space-between"
                    width="100%"
                  >
                    <FormLabel
                      htmlFor="queue"
                      color="#000000B3"
                      fontSize="14px"
                      width={{ base: "100%", md: "30%" }}
                    >
                      {t("searchAndAllocate.allocateToDrawer.product")}
                    </FormLabel>
                    <Box
                      width={{ base: "100%", md: "65%" }}
                      mb={{ base: 4, md: 0 }}
                    >
                      <SelectComponent
                        control={control}
                        name="queueId"
                        options={productMaster}
                        placeholder={t("common.select")}
                        isDisabled
                      />
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "start", md: "center" }}
                    justify="space-between"
                    width="100%"
                  >
                    <FormLabel
                      htmlFor="subQueue"
                      color="#000000B3"
                      fontSize="14px"
                      width={{ base: "100%", md: "30%" }}
                    >
                      {t("searchAndAllocate.allocateToDrawer.potential")}
                    </FormLabel>
                    <Box
                      width={{ base: "100%", md: "65%" }}
                      mb={{ base: 4, md: 0 }}
                    >
                      <SelectComponent
                        control={control}
                        name="subQueue"
                        options={subQueueMaster}
                        placeholder={t("common.select")}
                        isDisabled
                      />
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl sx={formControlStyle} isReadOnly width="100%">
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "start", md: "center" }}
                    justify="space-between"
                    width="100%"
                  >
                    <FormLabel
                      htmlFor="dnd"
                      color="#000000B3"
                      fontSize="14px"
                      width={{ base: "100%", md: "30%" }}
                    >
                      {t("searchAndAllocate.allocateToDrawer.dnd")}
                    </FormLabel>
                    <Box
                      width={{ base: "100%", md: "65%" }}
                      mb={{ base: 4, md: 0 }}
                    >
                      <Input
                        id="dnd"
                        // {...register("dnd")}
                         //defaultValue={drawerData?.dnd}
                        defaultValue={"N"}
                        type="text"
                        variant="flushed"
                        placeholder="Enter"
                        disabled
                        pl={4}
                      />
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl sx={formControlStyle} isReadOnly width="100%">
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "start", md: "center" }}
                    justify="space-between"
                    width="100%"
                  >
                    <FormLabel
                      htmlFor="source"
                      color="#000000B3"
                      fontSize="14px"
                      width={{ base: "100%", md: "30%" }}
                    >
                      {t("searchAndAllocate.allocateToDrawer.source")}
                    </FormLabel>
                    <Box
                      width={{ base: "100%", md: "65%" }}
                      mb={{ base: 4, md: 0 }}
                    >
                      <SelectComponent
                        control={control}
                        name="source"
                        options={sourceMaster}
                        placeholder={t("common.select")}
                        isDisabled
                      />
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl sx={formControlStyle} isReadOnly width="100%">
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "start", md: "center" }}
                    justify="space-between"
                    width="100%"
                  >
                    <FormLabel
                      htmlFor="campaign"
                      color="#000000B3"
                      fontSize="14px"
                      width={{ base: "100%", md: "30%" }}
                    >
                      {t("searchAndAllocate.allocateToDrawer.campaign")}
                    </FormLabel>
                    <Box
                      width={{ base: "100%", md: "65%" }}
                      mb={{ base: 4, md: 0 }}
                    >
                      <SelectComponent
                        control={control}
                        name="campaign"
                        options={campaignMaster}
                        placeholder={t("common.select")}
                        isDisabled
                      />
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl sx={formControlStyle} width="100%">
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "start", md: "center" }}
                    justify="space-between"
                    width="100%"
                  >
                    <FormLabel
                      htmlFor="noOfCase"
                      color="#000000B3"
                      fontSize="14px"
                      width={{ base: "100%", md: "30%" }}
                    >
                      {t("searchAndAllocate.allocateToDrawer.noOfCases")}
                    </FormLabel>
                    <Box
                      width={{ base: "100%", md: "65%" }}
                      mb={{ base: 4, md: 0 }}
                    >
                      <Input
                        id="noOfCase"
                        type="number"
                        variant="flushed"
                        placeholder="Enter"
                        {...register("noOfCase")}
                        sx={{
                          px: 3,
                          fontSize: "12px",
                          fontWeight: 600,
                          pl: "18px",
                        }}
                      />
                      {errors?.noOfCase && (
                        <Text sx={errorTextStyle}>
                          {errors?.noOfCase?.message}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </FormControl>
                <FormControl sx={formControlStyle} width="100%">
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "start", md: "center" }}
                    justify="space-between"
                    width="100%"
                  >
                    <FormLabel
                      htmlFor="allocate"
                      color="#000000B3"
                      fontSize="14px"
                      width={{ base: "100%", md: "30%" }}
                    >
                      {t("searchAndAllocate.allocateToDrawer.allocateTo")}
                    </FormLabel>
                    <Box
                      width={{ base: "100%", md: "65%" }}
                      mb={{ base: 4, md: 0 }}
                    >
                      <SelectComponent
                        control={control}
                        name="allocate"
                        options={allocateMasterData}
                        placeholder={t("common.select")}
                      />
                    </Box>
                  </Flex>
                </FormControl>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px" d="flex" gap={4}>
            <PrimaryButton
              title={t("common.cancel")}
              onClick={() => handleDrawerCancel()}
              secondary
            />
            <PrimaryButton
              type="submit"
              form="drawerForm"
              title={isEditClicked ? "Update" : t("common.add")}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
