import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  Portal,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { MifinColor } from "@mifin/theme/color";
import { getSidebarDetails } from "../LayoutWrapper";
import TodoList from "../../assets/icons/TodoList.png";
import DollarTime from "../../assets/icons/DollarTime.png";
import Notes from "../../assets/icons/notes.png";
import DropDown from "../../assets/icons/Downarrow.png";
import DrawerComponent from "../Drawer";
import PrimaryButton from "../Button";
import {
  useDunningSaveMutation,
  useDunningTemplateMutation,
  useDunningTemplateTextMutation,
  useTemplateList,
} from "@mifin/service/mifin-contact";
import { FC, useEffect, useState } from "react";
import { useUserStore } from "@mifin/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectComponent from "../SelectComponent";
import { useQueryClient } from "react-query";
import parse from "html-react-parser";
import { AddressProps } from "@mifin/Interface/Customer";
import { toastFail } from "../Toast";
import ToolbarGrid from "@mifin/components/ToolbarGrid";

const defaultDunningForm = {
  mode: {
    name: "",
    value: "",
  },
  remark: "",
  event: "",
};

const Toolbar: FC = () => {
  const { open } = getSidebarDetails();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [noteDropdown, setNoteDropdown] = useState({
    notepadTypeMasterEntity: [],
    notepadCodeMasterEntity: [],
  });
  const [templateText, setTemplateText] = useState("");
  const {
    isOpen: isDunningOpen,
    onOpen: onDunningOpen,
    onClose: onDunningClose,
  } = useDisclosure();
  const { userInfo } = useUserStore();
  const { ...rest } = userInfo;

  const qclient = useQueryClient();
  const { mutateAsync: saveDunning } = useDunningSaveMutation();

  const { mutateAsync: tempText } = useDunningTemplateTextMutation();
  const { register, reset, handleSubmit, control } = useForm({
    defaultValues: defaultNoteForm,
    mode: "onBlur",
    resolver: yupResolver(noteFormSchema),
  });

  const {
    register: dunningRegister,
    reset: dunningReset,
    handleSubmit: dunningSubmit,
    watch,
    control: dunningControl,
    setValue: dunningSetValue,
    getValues,
  } = useForm({
    defaultValues: defaultDunningForm,
    mode: "onBlur",
    // resolver: yupResolver(noteFormSchema),
  });

  const { data: TemplateList = {} } = useTemplateList();
  const { mutateAsync: NotepadSave, isLoading: NoteSaving } =
    useSaveNotepadMutation();
  const { mutateAsync: DunningTemplate, isLoading: DunningSaving } =
    useDunningTemplateMutation();

  const Templatelist = (
    TemplateList as { templateList: AddressProps[] }
  ).templateList?.map(el => {
    return {
      label: el?.TEMPLATENAME,
      value: el?.TEMPLATEID,
      typeId: el?.MODEID,
    };
  });

  const NotepadType = noteDropdown?.notepadTypeMasterEntity?.map(
    (el: AddressProps) => {
      return {
        label: el?.noteTypeName,
        value: el?.noteTypeId,
      };
    }
  );

  const NotepadCode = noteDropdown?.notepadCodeMasterEntity?.map(
    (el: AddressProps) => {
      return {
        label: el?.notecodeName,
        value: el?.noteCodeId,
      };
    }
  );

  const getTemplateDropdown = async () => {
    try {
      await DunningTemplate(userInfo);
    } catch (err) {
      console.error(err);
      toastFail("Something went wrong");
      throw new Error(`An Error occured ${err}`);
    }
  };

  const saveDunningFunc = (data: any) => {
    const {
      mode: { name, value },
      ...rest2
    } = data;
    const payload = {
      ...rest2,
      emailId: null,
      letterId: null,
      smsId: null,
      [name]: value,
      event: (data.event as { value: string }).value,
    };

    try {
      saveDunning({
        ...rest,
        requestData: {
          leadDetail: {
            prospectId: userInfo?.requestData?.leadDetail?.prospectId,
          },
          dunningDto: payload,
        },
      }).then(() => {
        onDunningClose();
        dunningReset();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const saveNote = (data: any) => {
    const payload = {
      ...data,
      notepadType: (data.notepadType as { value: string }).value,
      notepadCode: (data.notepadCode as { value: string }).value,
    };

    try {
      NotepadSave({
        ...rest,
        requestData: {
          leadDetail: userInfo.requestData.leadDetail,
          notepadDto: payload,
        },
      }).then(() => {
        onClose();
        reset();
      });
    } catch {
      (error: boolean) => {
        toastFail("Something went wrong");
        throw new Error(`An Error occured ${error}`);
      };
    }
  };

  const hitTempText = async () => {
    const templateID = getValues();
    dunningSetValue("mode", {
      name: "emailId",
      value: "email",
    });
    let textType = "EMAIL";
    if (
      (templateID.event as unknown as { typeId: number }).typeId === 1000000001
    ) {
      textType = "SMS";
      dunningSetValue("mode", {
        name: "smsId",
        value: "sms",
      });
    }
    if (
      (templateID.event as unknown as { typeId: number }).typeId === 1000000004
    ) {
      textType = "LETTER";
      dunningSetValue("mode", {
        name: "letterId",
        value: "letter",
      });
    }

    await tempText({
      ...rest,
      requestData: {
        type: textType,
        templateId: (
          templateID.event as unknown as { value: string }
        ).value.toString(),
        leadDetail: {
          prospectId: userInfo.requestData.leadDetail?.prospectId,
        },
      },
    })
      .then(result => {
        setTemplateText(result.responseData["Template Text"]);
      })
      .catch(() =>
        setTemplateText("Template name and Dunning mode not matched!")
      );
  };

  useEffect(() => {
    hitTempText();
  }, [watch("event")]);

  useEffect(() => {
    const data = qclient.getQueryData("get-master-list") as any;

    if (data) {
      setNoteDropdown(data);
      return;
    }

    try {
      MasterList(userInfo).then(result => {
        setNoteDropdown(result.responseData);
      });
    } catch {
      (err: boolean) => {
        console.error(err);
      };
    }
  }, [noteDropdown]);

  useEffect(() => {
    if (!isDunningOpen) {
      setTemplateText("");
    }
  }, [isDunningOpen]);

  return (
    <Portal>
      <Box
        backgroundColor={MifinColor.primary_100}
        border={`1px solid ${MifinColor.gray_150}`}
        borderRadius="15px"
        left={open ? "280px" : "120px"}
        bottom="25px"
        position="fixed"
        zIndex="999"
        width="max-content"
      >
        <HStack>
          <Box paddingLeft={5} paddingRight={4}>
            <Image src={DropDown} alt="Notes" _hover={{ cursor: "pointer" }} />
          </Box>
          <Divider
            orientation="vertical"
            height="60px"
            borderColor={MifinColor.black}
            opacity="30%"
          />

          <Box display={"flex"} columnGap={5} px={5} py={4} alignItems="center">
            <Text>Add</Text>
            <Image
              src={Notes}
              alt="Notes"
              _hover={{ cursor: "pointer" }}
              onClick={onOpen}
            />

            <Image
              src={TodoList}
              alt="todoList"
              _hover={{ cursor: "pointer" }}
              onClick={() => {
                getTemplateDropdown();
                onDunningOpen();
              }}
            />
          </Box>
          <Divider
            orientation="vertical"
            height="36px"
            borderColor={MifinColor.black}
            opacity="30%"
          />

          <Box display={"flex"} columnGap={5} px={5} alignItems="center">
            <Text>Go To</Text>
            <Image
              src={DollarTime}
              alt="DollarTime"
              _hover={{ cursor: "pointer" }}
            />
          </Box>
        </HStack>
      </Box>
      <DrawerComponent
        isModalOpen={isDunningOpen}
        resetForm={dunningReset}
        closeModal={onDunningClose}
        title="Case Details"
        submitHandler={dunningSubmit(saveDunningFunc)}
        renderFooter={
          <PrimaryButton
            title="Submit"
            type="submit"
            isLoading={DunningSaving}
          />
        }
      >
        <ToolbarGrid>
          <Text color={"rgba(0,0,0,0.6)"}>Template Name</Text>

          <SelectComponent
            name="event"
            placeholder="select"
            options={Templatelist}
            control={dunningControl}
          />
          <Text color={"rgba(0,0,0,0.6)"}>Dunning Mode</Text>
          <Flex gap={2}>
            <input
              name="SMS"
              type="checkbox"
              className="form-check-input"
              checked={
                (watch("event") as unknown as { typeId: number }).typeId ===
                1000000001
              }
            />{" "}
            SMS
            <input
              name="EMAIL"
              type="checkbox"
              className="form-check-input"
              checked={
                (watch("event") as unknown as { typeId: number }).typeId ===
                1000000003
              }
            />{" "}
            Email
            <input
              name="LETTER"
              type="checkbox"
              className="form-check-input"
              checked={
                (watch("event") as unknown as { typeId: number }).typeId ===
                1000000004
              }
            />
            Letter
          </Flex>

          <Text color={"rgba(0,0,0,0.6)"}>Remarks</Text>
          <Input {...dunningRegister("remark")} />
          <Text color={"rgba(0,0,0,0.6)"}>Preview</Text>
        </ToolbarGrid>
        <Box backgroundColor={MifinColor.bgColor}>
          <Box margin={10} backgroundColor={MifinColor.primary_100}>
            <Box paddingLeft={8} paddingTop={6}>
              <Box
                backgroundColor={MifinColor.bgColor}
                width="71px"
                height={4}
                marginBottom={3}
              ></Box>
            </Box>
            <Stack px={7}>
              <Divider borderColor={MifinColor.black} opacity={0.15} />
            </Stack>

            <Text px={8} py={4}>
              {parse(templateText)}
            </Text>

            <Stack px={7} py={6}>
              <Divider borderColor={MifinColor.black} opacity={0.15} />
            </Stack>
          </Box>
        </Box>
      </DrawerComponent>
      <DrawerComponent
        title={"Notepad"}
        resetForm={reset}
        isModalOpen={isOpen}
        closeModal={onClose}
        submitHandler={handleSubmit(saveNote)}
        renderFooter={
          <PrimaryButton
            title="Save"
            type="submit"
            isLoading={NoteSaving}
            height="48px"
          />
        }
      >
        <Box>
          <Grid mt={3} mx={4} templateColumns="repeat(1, 5fr 7fr)" gap={4}>
            <GridItem display={"flex"} alignItems="center">
              <Text color={MifinColor.primary_red}>Note Type </Text>
            </GridItem>
            <GridItem>
              <SelectComponent
                name="notepadType"
                placeholder="select"
                options={NotepadType}
                control={control}
              />
            </GridItem>
            <GridItem display={"flex"} alignItems="center">
              <Text color={MifinColor.primary_red}>Note Code</Text>
            </GridItem>
            <GridItem>
              <SelectComponent
                name="notepadCode"
                placeholder="select"
                options={NotepadCode}
                control={control}
              />
            </GridItem>
            <GridItem display={"flex"} alignItems="center">
              <Text>Description</Text>
            </GridItem>
            <GridItem>
              <Input
                id="description"
                height={20}
                as="textarea"
                placeholder="Enter"
                color="#3E4954"
                {...register("description")}
              ></Input>
            </GridItem>
            <GridItem display={"flex"} alignItems="center">
              <Text>Remarks</Text>
            </GridItem>
            <GridItem>
              <Input
                id="remarks"
                height="20"
                as="textarea"
                placeholder="Enter"
                color="#3E4954"
                {...register("remarks")}
              ></Input>
            </GridItem>
            <Flex gap={2} alignItems={"flex-end"}></Flex>
          </Grid>
        </Box>
      </DrawerComponent>
      ;
    </Portal>
  );
};

export default Toolbar;
