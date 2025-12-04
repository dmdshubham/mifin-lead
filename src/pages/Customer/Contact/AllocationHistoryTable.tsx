import { FC } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  IAllocationHistoryTableColumn,
  IActionHistoryTableProps,
} from "@mifin/Interface/Customer";
import { useTranslation } from "react-i18next";

const AllocationHistoryTable: FC<IActionHistoryTableProps> = props => {
  const { ContactDetail } = props;
  const { t } = useTranslation();

  const columns: ColumnsType<IAllocationHistoryTableColumn> = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: t("contact.allocationHistoryTable.action"),
      dataIndex: "action",
    },
    {
      title: t("contact.allocationHistoryTable.allocatedBy"),
      dataIndex: "allocatedBy",
    },
    {
      title: t("contact.allocationHistoryTable.allocatedTo"),
      dataIndex: "allocatedTo",
    },
    {
      title: t("contact.allocationHistoryTable.allocatedDate"),
      dataIndex: "allocatedDate",
    },
    {
      title: t("contact.allocationHistoryTable.remarks"),
      dataIndex: "remark",
    },
  ];

  return (
    <Table
      columns={columns}
      pagination={false}
      dataSource={ContactDetail ? ContactDetail : []}
      scroll={{ x: 900 }}
    />
  );
};

export default AllocationHistoryTable;
