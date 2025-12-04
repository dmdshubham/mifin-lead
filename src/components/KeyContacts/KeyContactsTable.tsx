import { FC, useState } from "react";
import { Table } from "antd";
import { FiMenu } from "react-icons/fi";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  Box,
  IconButton,
  Divider,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { MastersList } from "@mifin/Enum/index";
import KeyContactsDrawer from "./KeyContactsDrawer";
import { convertingSelectValues } from "@mifin/utils/convertingSelectValues";
import { useAppSelector } from "@mifin/redux/hooks";
import { useTranslation } from "react-i18next";
import { IKeyContactTableProps } from "@mifin/Interface/NewLead";
import { headingStyling, dividerStyling } from "@mifin/theme/style";
import { useFormContext } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";

export const important = {
  buildingName: null,
  caseId: null,
  city: null,
  createdBy: null,
  createdDate: null,
  createdSysDate: null,
  ext1: null,
  ext2: null,
  flatNo: null,
  floorNo: null,
  keyContactId: null,
  landmark: null,
  lname: null,
  locality: null,
  mname: null,
  personalDtlId: null,
  phone1: null,
  phone2: null,
  state: null,
  zipcode: null,
};

const KeyContactsTable: FC<IKeyContactTableProps> = props => {
  const { setValue } = useFormContext();
  const { contactType, setContactType, keyContactData } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editRecord, setEditRecord] = useState<any>();
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = { ...mastersData?.Masters };
  const [flag, setFlag] = useState(true);
  const { t } = useTranslation();

  const handleAddingRow = () => {
    setFlag(true);

    setEditRecord({
      key: contactType.length.toString(),
      contactTypeId: "",
      fname: "",
      firmName: "",
      mobile: "",
      email: "",
      address: "",
    });
    onOpen();
  };

  const Delete = (record: any) => {
    setContactType((pre: any) => {
      return pre.filter((person: any) => person.key != record.key);
    });
  };

  const OpenAddressMenu = (record: any) => {
    setFlag(false);
    setEditRecord(record);
    // onOpen();
  };

  const columns = [
    {
      title: t("newLead.keyContact.contactType"),
      dataIndex: "contactTypeId",
      key: "key",
      render: (type: any, record: any) =>
        convertingSelectValues(record, MastersList.CONTACT, allMastersData),
    },
    {
      title: t("newLead.keyContact.name"),
      dataIndex: "fname",
      key: "key",
    },
    {
      title: t("newLead.keyContact.firmName"),
      dataIndex: "firmName",
      key: "key",
    },
    {
      title: t("newLead.keyContact.mobileNo"),
      dataIndex: "mobile",
      key: "key",
    },
    {
      title: t("newLead.keyContact.emailId"),
      dataIndex: "email",
      key: "key",
    },
    {
      title: t("newLead.keyContact.address"),
      dataIndex: "address",
      key: "key",
    },
    {
      title: "",
      dataIndex: "",
      key: "key",
      render: (record: any) => {
        return (
          <>
            <Flex justify={"space-between"} align={"center"} gap={4}>
              <IconButton
                icon={<FiMenu></FiMenu>}
                onClick={() => {
                  onOpen();
                  OpenAddressMenu(record);
                }}
                aria-label="menu"
                variant={"outline"}
                colorScheme="purple"
                isRound
                size={"xs"}
              ></IconButton>

              <RiDeleteBin5Line
                onClick={() => Delete(record)}
                fontSize="20px"
              />
            </Flex>
          </>
        );
      },
    },
  ];

  return (
    <Box marginTop="40px">
      <Flex gap={2} justifyContent={"space-between"}>
        <Heading sx={headingStyling}>{t("newLead.heading.keyContact")}</Heading>
        <IconButton
          variant="solid"
          icon={<AiOutlinePlus />}
          onClick={handleAddingRow}
          aria-label="add key contact"
        />
      </Flex>

      <Table
        dataSource={
          keyContactData
            ? keyContactData
              ? keyContactData
              : []
            : contactType
            ? contactType
            : []
        }
        columns={columns}
        pagination={false}
      />
      <KeyContactsDrawer
        isOpen={isOpen}
        onClose={onClose}
        contactType={contactType}
        setContactType={setContactType}
        editRecord={editRecord}
        flag={flag}
        setFlag={setFlag}
        setValue={setValue}
      />
      <Divider sx={dividerStyling} />
    </Box>
  );
};

export default KeyContactsTable;
