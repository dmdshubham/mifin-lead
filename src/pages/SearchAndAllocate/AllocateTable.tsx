import React, { FC } from "react";
import type { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  IAllocateTableColumn,
  IAllocateTableProps,
} from "@mifin/Interface/SearchAndAllocate";
import { useTranslation } from "react-i18next";
import { toastSuccess } from "@mifin/components/Toast";
import SingleCard from "@mifin/components/common";
import CardPagination from "@mifin/components/common/CardPagination";

const AllocateTable: FC<IAllocateTableProps> = props => {
  const { allocatedList, setAllocatedList, remainingCase } = props;
  const tableData = structuredClone(allocatedList);
  const { t } = useTranslation();

  const handleDeleteRow = (record: any, indexId: number) => {
    setAllocatedList((data: any) =>
      data.filter((item: any, index: number) => {
        return index !== indexId;
      })
    );

    const tt = remainingCase.filter((el: any) => {
      if (el?.rowNo == record?.rowNo) {
        el.remaningCases = Number(el.remaningCases) + Number(record.noOfCase);
        return el;
      } else return el;
    });
    toastSuccess("Row Removed SuccessFully");
  };

  // const columns: ColumnsType<IAllocateTableColumn> = [
  //   {
  //     title: t("searchAndAllocate.convertCustomer.queue"),
  //     dataIndex: "queueId",
  //     key: "queueId",
  //     render: text => <Text as="p">{text?.label}</Text>,
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.subQueue"),
  //     dataIndex: "subQueue",
  //     key: "subQueue",
  //     render: text => <Text as="p">{text?.label}</Text>,
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.dnd"),
  //     dataIndex: "dnd",
  //     key: "dnd",
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.source"),
  //     dataIndex: "source",
  //     key: "source",
  //     render: text => <Text as="p">{text?.label}</Text>,
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.campaign"),
  //     dataIndex: "campaign",
  //     key: "campaign",
  //     render: text => <Text as="p">{text?.label}</Text>,
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.noOfCase"),
  //     dataIndex: "noOfCase",
  //     key: "noOfCase",
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.allocate"),
  //     dataIndex: "allocate",
  //     key: "allocate",
  //     render: text => <Text as="p">{text?.label}</Text>,
  //   },
  //   // {
  //   //   title: "",
  //   //   dataIndex: "addMore",
  //   //   key: "addMore",
  //   //   render: (text, record) => (
  //   //     <Button variant="unstyled" onClick={() => handleEditRow(record)}>
  //   //       <img src={addMore} alt="add more" />
  //   //     </Button>
  //   //   ),
  //   // },
  //   {
  //     title: "",
  //     dataIndex: "deleteRow",
  //     key: "deleteRow",
  //     render: (text, record, index) => {
  //       return (
  //         <Button
  //           variant="unstyled"
  //           onClick={() => handleDeleteRow(record, index)}
  //         >
  //           <RiDeleteBin5Line />
  //         </Button>
  //       );
  //     },
  //   },
  // ];
  const customTextStyles = {
    fontSize: "12px",
    color: "#4A5568",
    fontWeight: 600,
  };

  const headerTextStyles = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "12px",
    color: "#1A202C",
    fontWeight: 600,
    backgroundColor: "#FAFAFA",
    padding: "16px",
    textAlign: "left",
    display: "block",
  };

  const columns: ColumnsType<IAllocateTableColumn> = [
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.product")}
        </span>
      ),
      dataIndex: "queueId",
      key: "queueId",

      render: text => (
        <Text as="p" sx={{ ...customTextStyles, paddingLeft: "16px" }}>
          {text?.label}
        </Text>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.potential")}
        </span>
      ),
      dataIndex: "subQueue",
      key: "subQueue",

      render: text => (
        <Text as="p" sx={{ ...customTextStyles, paddingLeft: "16px" }}>
          {text?.label}
        </Text>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.dnd")}
        </span>
      ),
      dataIndex: "dnd",
      key: "dnd",

      render: text => (
        <Text as="p" sx={{ ...customTextStyles, paddingLeft: "16px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.source")}
        </span>
      ),
      dataIndex: "source",
      key: "source",

      render: text => (
        <Text as="p" sx={{ ...customTextStyles, paddingLeft: "16px" }}>
          {text?.label}
        </Text>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.campaign")}
        </span>
      ),
      dataIndex: "campaign",
      key: "campaign",

      render: text => (
        <Text as="p" sx={{ ...customTextStyles, paddingLeft: "16px" }}>
          {text?.label}
        </Text>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.noOfCase")}
        </span>
      ),
      dataIndex: "noOfCase",
      key: "noOfCase",

      render: text => (
        <Text as="p" sx={{ ...customTextStyles, paddingLeft: "16px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.allocate")}
        </span>
      ),
      dataIndex: "allocate",
      key: "allocate",

      render: text => (
        <Text as="p" sx={{ ...customTextStyles, paddingLeft: "16px" }}>
          {text?.label}
        </Text>
      ),
    },
    {
      title: "",
      dataIndex: "deleteRow",
      key: "deleteRow",
      render: (_, record, index) => (
        <Button
          variant="unstyled"
          onClick={() => handleDeleteRow(record, index)}
        >
          <RiDeleteBin5Line />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Box display={{ base: "none", md: "block" }} mr={-4}>
        <Table
          columns={columns}
          pagination={false}
          dataSource={tableData}
          scroll={{ x: 900 }}
          rowKey={record => record?.allocate?.value}
        />
      </Box>
      <Box display={{ base: "block", md: "none" }} width={"105%"}>
        {tableData?.length > 0 ? (
          <CardPagination
            data={tableData}
            itemsPerPage={3}
            renderComponent={(single, index) => {
              return (
                <SingleCard key={index} data={single} mr={-4}>
                  <Flex
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    gap={"1rem"}
                  >
                    <Button
                      variant="unstyled"
                      onClick={() => handleDeleteRow(single, index)}
                    >
                      <RiDeleteBin5Line />
                    </Button>
                  </Flex>
                </SingleCard>
              );
            }}
          />
        ) : (
          <Text textAlign={"center"}>No data found</Text>
        )}
      </Box>
    </>
  );
};

export default AllocateTable;
