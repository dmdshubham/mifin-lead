import { FC, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  IDunningHistoryTableColumn,
  IDunningHistoryTableProps,
} from "@mifin/Interface/Customer";
import { Input } from "antd";
import { useTranslation } from "react-i18next";

const DunningHistoryTable: FC<IDunningHistoryTableProps> = () => {
  const { t } = useTranslation();
  const [filterTable, setFilterTable] = useState<any>(null);

  const columns: ColumnsType<IDunningHistoryTableColumn> = [
    {
      title: t("contact.dunningHistoryTable.dunningTemplate"),
      dataIndex: "dunningTemplate",
    },
    {
      title: t("contact.dunningHistoryTable.dunningMode"),
      dataIndex: "dunningMode",
    },
    {
      title: t("contact.dunningHistoryTable.dunningDate"),
      dataIndex: "dunningDate",
    },
    {
      title: t("contact.dunningHistoryTable.dunningBy"),
      dataIndex: "dunningBy",
    },
    {
      title: t("contact.dunningHistoryTable.remarks"),
      dataIndex: "remarks",
    },
  ];

  const dataSource = [
    {
      dunningTemplate: "A template",
      dunningMode: "Mode",
      dunningDate: "12-06-2023",
      dunningBy: "Ss",
      remarks: "y",
    },
    {
      dunningTemplate: "B template",
      dunningMode: "Mode",
      dunningDate: "12-06-2023",
      dunningBy: "tt",
      remarks: "y",
    },
    {
      dunningTemplate: "c template",
      dunningMode: "Mode",
      dunningDate: "12-06-2023",
      dunningBy: "tt",
      remarks: "n",
    },
  ];

  const handleChange = (value: any) => {
    const filterTable = dataSource.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilterTable(filterTable);
  };
  return (
    <>
      <Box my="6">
        <Input.Search
          type="text"
          placeholder={t("common.searchHere")}
          style={{ width: 350 }}
          onSearch={handleChange}
        />
      </Box>

      <Table
        columns={columns}
        pagination={false}
        dataSource={filterTable == null ? dataSource : filterTable}
        scroll={{ x: 200 }}
      />
    </>
  );
};

export default DunningHistoryTable;
