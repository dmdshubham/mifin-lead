import React, { FC, useEffect } from "react";
import PrimaryButton from "@mifin/components/Button";
import type { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  ISearchAndAllocateColumn,
  ISearchAndAllocateTableProps,
} from "@mifin/Interface/SearchAndAllocate";
import { useTranslation } from "react-i18next";
import SingleCard from "@mifin/components/common";
import CardPagination from "@mifin/components/common/CardPagination";

const SearchAndAllocateTable: FC<ISearchAndAllocateTableProps> = props => {
  const { t } = useTranslation();
  const {
    setDrawerFormData,
    data,
    setShowAllocateTable,
    setRemainingCase,
    remainingCase,
    onOpen,
  } = props;
  useEffect(() => {
    if (data) {
      const totalCasesData = data.map(item => {
        return { rowNo: item.rowNo, remaningCases: "" };
      });
      setRemainingCase(totalCasesData);
    }
  }, [data]);

  const handleAllocateCase = (record: any) => {
    if (remainingCase?.length) {
      const matchData = remainingCase?.find((el: any) => {
        if (el?.rowNo == record?.rowNo) {
          return el;
        }
      });

      // const records = {
      //   ...record,
      //   noOfCase:
      //     matchData?.remaningCases === ""
      //       ? Number(record?.noOfCase)
      //       : Number(matchData?.remaningCases),
      // };
      setDrawerFormData(record);
    } else {
      setDrawerFormData(record);
    }
    setShowAllocateTable(true);
    onOpen();
  };
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

  // const columns: ColumnsType<ISearchAndAllocateColumn> = [
  //   {
  //     title: (
  //       <span style={customTableStyles}>
  //         {t("searchAndAllocate.convertCustomer.queue")}
  //       </span>
  //     ),
  //     dataIndex: "queue",
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.subQueue"),
  //     dataIndex: "subQueue",
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.dnd"),
  //     dataIndex: "dnd",
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.source"),
  //     dataIndex: "source",
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.campaign"),
  //     dataIndex: "campaign",
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.noOfCase"),
  //     dataIndex: "noOfCase",
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.allocate"),
  //     dataIndex: "allocate",
  //     render: (text, record) => (
  //       <PrimaryButton
  //         title={t("common.allocate")}
  //         onClick={() => handleAllocateCase(record)}
  //         //isDisabled = {showAllocateTable}
  //       />
  //     ),
  //   },
  //   {
  //     title: t("searchAndAllocate.convertCustomer.leftToAllocate"),
  //     dataIndex: "leftToAllocate",
  //     render: (_, record) => {
  //       const currentRowRemaningCase = remainingCase?.find(
  //         (item: any) => item.rowNo === record.rowNo
  //       )?.remaningCases;

  //       return (
  //         <Text as="p">
  //           {currentRowRemaningCase === null ? "" : currentRowRemaningCase}
  //         </Text>
  //       );
  //     },
  //   },
  // ];
  const columns: ColumnsType<ISearchAndAllocateColumn> = [
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.product")}
        </span>
      ),
      dataIndex: "queue",
      render: text => (
        <span style={{ ...customTextStyles, paddingLeft: "16px" }}>{text}</span>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.potential")}
        </span>
      ),
      dataIndex: "subQueue",
      render: text => (
        <span style={{ ...customTextStyles, paddingLeft: "16px" }}>{text}</span>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.dnd")}
        </span>
      ),
      dataIndex: "dnd",
      render: text => (
        <span style={{ ...customTextStyles, paddingLeft: "16px" }}>{text}</span>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.source")}
        </span>
      ),
      dataIndex: "source",
      render: text => (
        <span style={{ ...customTextStyles, paddingLeft: "16px" }}>{text}</span>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.campaign")}
        </span>
      ),
      dataIndex: "campaign",
      render: text => (
        <span style={{ ...customTextStyles, paddingLeft: "16px" }}>{text}</span>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.noOfCase")}
        </span>
      ),
      dataIndex: "noOfCase",
      render: text => (
        <span style={{ ...customTextStyles, paddingLeft: "16px" }}>{text}</span>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.allocate")}
        </span>
      ),
      dataIndex: "allocate",
      render: (text, record) => (
        <div style={{ paddingLeft: "16px" }}>
          <PrimaryButton
            title={t("common.allocate")}
            onClick={() => handleAllocateCase(record)}
          />
        </div>
      ),
    },
    {
      title: (
        <span style={headerTextStyles}>
          {t("searchAndAllocate.convertCustomer.leftToAllocate")}
        </span>
      ),
      dataIndex: "leftToAllocate",
      render: (_, record) => {
        const currentRowRemainingCase = remainingCase?.find(
          (item: any) => item.rowNo === record.rowNo
        )?.remaningCases;
        return (
          <Text as="p" style={customTextStyles}>
            {currentRowRemainingCase === null ? "" : currentRowRemainingCase}
          </Text>
        );
      },
    },
  ];
  return (
    <>
      <Box display={{ base: "none", md: "block" }} mr={-4}>
        <Table
          columns={columns}
          pagination={{
            pageSizeOptions: ["5", "10", "20"],
            showSizeChanger: true,
            defaultPageSize: 5,
            locale: { items_per_page: "/ page" },
          }}
          dataSource={data ? data : []}
          scroll={{ x: "max-content" }}
        />
      </Box>
      <Box display={{ base: "block", md: "none" }}>
        {data?.length > 0 ? (
          <CardPagination
            data={data}
            itemsPerPage={3}
            renderComponent={(
              {
                rowNo,
                sourceId,
                queueId,
                campaignId,
                subQueueId,
                temp,
                ...single
              },
              index
            ) => {
              const currentRowRemaningCase = remainingCase?.find(
                (item: any) => item.rowNo === single.rowNo
              )?.remaningCases;
              return (
                <Box w="328px" mt={-5} mb={7}>
                  <SingleCard key={index} data={single} w="450px">
                    <Flex
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={"1rem"}
                    >
                      <Text as="p">
                        {currentRowRemaningCase === null
                          ? ""
                          : currentRowRemaningCase}
                      </Text>
                      <PrimaryButton
                        title={t("common.allocate")}
                        onClick={() => handleAllocateCase({...single,campaignId:campaignId,sourceId:sourceId,subQueueId:subQueueId,queueId:queueId})}
                        //isDisabled = {showAllocateTable}
                      />
                    </Flex>
                  </SingleCard>
                </Box>
              );
            }}
          />
        ) : (
          <Text textAlign={"center"}>No Data found</Text>
        )}
      </Box>
    </>
  );
};

export default SearchAndAllocateTable;
