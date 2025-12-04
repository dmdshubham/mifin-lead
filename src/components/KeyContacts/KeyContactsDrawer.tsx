import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  Text,
  Flex,
  CloseButton,
  Divider,
  HStack,
  DrawerOverlay,
  GridItem,
  FormLabel,
} from "@chakra-ui/react";
import PrimaryButton from "@mifin/components/Button";
import { useAppSelector } from "@mifin/redux/hooks";
import { IKeyContactsDrawerProps } from "@mifin/Interface/NewLead";
import { useTranslation } from "react-i18next";
import { FC, useEffect, useMemo } from "react";
import KeyContactsDrawerGrid from "../KeyContactsDrawerGrid";
import { FormProvider, useForm } from "react-hook-form";
import TextInput from "../Input";
import { important } from "./KeyContactsTable";
import { yupResolver } from "@hookform/resolvers/yup";
import KeyContactSchema from "@mifin/schema/KeyContactSchema";
import SelectComponent from "../SelectComponent";
import RequiredMark from "@mifin/components/RequiredMark";

const formDefaultValues = {
  mobile: "",
  email: "",
};

const FIELD_TO_SET = ["fname", "firmName", "mobile", "email", "address"];

const KeyContactsDrawer: FC<IKeyContactsDrawerProps> = props => {
  const {
    setValue,
    editRecord,
    flag: isAdd,
    isOpen,
    onClose,
    contactType,
    setContactType,
  } = props;
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;
  const { t } = useTranslation();
  const yupValidationSchema: any = useMemo(() => KeyContactSchema(t), [t]);

  const methods = useForm({
    defaultValues: formDefaultValues,
    mode: "onSubmit",
    resolver: yupResolver(yupValidationSchema),
  });

  const { control, watch, reset, trigger, setValue: drawerSetValue } = methods;
  const fieldValues = watch();

  useEffect(() => {
    trigger();
  }, [watch("email"), watch("mobile"), trigger]);

  const handleReset = () => {
    reset({
      contactTypeId: "",
      fname: "",
      firmName: "",
      mobile: "",
      email: "",
      address: "",
    });
  };

  const handleCancel = () => {
    onClose();
    // handleReset();
  };

  // const handleSubmit = async () => {
  //   const isValid = await trigger();

  //   if (isValid) {
  //     setValue("listKeyContact", contactType, { shouldDirty: true });
  //     setContactType((prevState: any) => {
  //       if (isAdd) {
  //         return [
  //           ...prevState,
  //           {
  //             ...important,
  //             key: contactType.length.toString(),
  //             ...fieldValues,
  //             contactTypeId: fieldValues?.contactTypeId?.value,
  //           },
  //         ];
  //       } else {
  //         const editedData = prevState.map((item: any) => {
  //           return editRecord.key === item.key
  //             ? {
  //                 ...important,
  //                 key: contactType.length.toString(),
  //                 ...fieldValues,
  //                 contactTypeId: fieldValues?.contactTypeId?.value,
  //               }
  //             : item;
  //         });

  //         return editedData;
  //       }
  //     });
  //     onClose();
  //     handleReset();
  //   }
  // };
  const handleSubmit = async () => {
    const isValid = await trigger();

    if (isValid) {
      setValue("listKeyContact", contactType, { shouldDirty: true });

      setContactType((prevState: any) => {
        const existingIndex = prevState.findIndex(
          (item: any) => item.key === editRecord.key
        );

        if (existingIndex !== -1) {
          // Update existing record
          prevState[existingIndex] = {
            ...important,
            key: editRecord.key,
            ...fieldValues,
            contactTypeId: fieldValues?.contactTypeId?.value,
          };
          return [...prevState];
        } else {
          // Add new record
          return [
            ...prevState,
            {
              ...important,
              key: contactType.length.toString(),
              ...fieldValues,
              contactTypeId: fieldValues?.contactTypeId?.value,
            },
          ];
        }
      });
      //reset(formDefaultValues);

      onClose();
      handleReset();
    }
  };

  const CONTACT_TYPE_OPTIONS = allMastersData?.contact?.map(
    (item: { contactTypeId: string; contactType: string }) => {
      return {
        value: item.contactTypeId,
        label: item.contactType,
      };
    }
  );

  const handleAutoPopulate = () => {
    FIELD_TO_SET.forEach((fieldName: string) => {
      drawerSetValue(fieldName, editRecord?.[fieldName]);
    });
    drawerSetValue("contactTypeId", {
      value: editRecord?.contactTypeId,
      label: CONTACT_TYPE_OPTIONS?.find(
        (item: { value: string }) => item.value == editRecord?.contactTypeId
      )?.label,
    });
  };

  useEffect(() => {
    if (!isAdd) {
      handleAutoPopulate();
      return;
    }

    handleReset();
  }, [editRecord, isAdd, FIELD_TO_SET, allMastersData]);

  return (
    <FormProvider {...methods}>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent
          rounded={"xl"}
          m={0}
          shadow="lg"
          maxW={{
            base: "90vw",
            sm: "100vw",
            md: "calc(100vw - 300px)",
            lg: "30vw",
          }}
        >
          <DrawerHeader>
            <Flex alignItems={"center"} justify="space-between">
              <Text>{t("newLead.heading.keyContact")}</Text>
              <CloseButton onClick={onClose} />
            </Flex>
          </DrawerHeader>

          <Divider borderColor={"black"} opacity={0.15}></Divider>

          <DrawerBody padding={3} overflowY="scroll">
            <KeyContactsDrawerGrid>
              <GridItem>
                <FormLabel>
                  <Text mb={2}>{t("newLead.keyContact.contactType")}</Text>
                </FormLabel>
              </GridItem>
              <GridItem>
                <SelectComponent
                  name="contactTypeId"
                  control={control}
                  options={CONTACT_TYPE_OPTIONS}
                />
              </GridItem>
              <GridItem>
                <FormLabel>
                  <Text mb={2}>{t("newLead.keyContact.name")}</Text>
                </FormLabel>
              </GridItem>
              <GridItem>
                <TextInput
                  name="fname"
                  regex="alphabet"
                  control={control}
                  placeholder={t("common.enter")}
                />
              </GridItem>
              <FormLabel>
                <Text mb={2}>{t("newLead.keyContact.firmName")}</Text>
              </FormLabel>
              <GridItem>
                <TextInput
                  regex="alphabet"
                  name="firmName"
                  control={control}
                  placeholder={t("common.enter")}
                />
              </GridItem>
              <GridItem>
                <FormLabel>
                  {t("newLead.keyContact.mobileNo")}
                  <RequiredMark />
                </FormLabel>
              </GridItem>

              <GridItem>
                <TextInput
                  regex="numeric"
                  type="text"
                  control={control}
                  name="mobile"
                  maxLength={10}
                  hideError={false}
                  placeholder={t("common.enter")}
                />
              </GridItem>
              <GridItem>
                <FormLabel>
                  {t("newLead.keyContact.emailId")}
                  <RequiredMark />
                </FormLabel>
              </GridItem>
              <GridItem>
                <TextInput
                  type="text"
                  name="email"
                  control={control}
                  hideError={false}
                  regex="alphanumeric"
                  placeholder={t("common.enter")}
                />
              </GridItem>
              <GridItem>
                <FormLabel>
                  <Text mb={2}>{t("newLead.keyContact.address")}</Text>
                </FormLabel>
              </GridItem>
              <GridItem>
                <TextInput
                  type="text"
                  name="address"
                  control={control}
                  placeholder={t("common.enter")}
                />
              </GridItem>
            </KeyContactsDrawerGrid>
          </DrawerBody>
          <DrawerFooter>
            <HStack gap={2}>
              <PrimaryButton
                title={t("common.cancel")}
                secondary
                onClick={() => {
                  handleCancel();
                }}
              />
              <PrimaryButton
                onClick={handleSubmit}
                title={isAdd ? t("common.add") : "Update"}
              />
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
};
export default KeyContactsDrawer;
