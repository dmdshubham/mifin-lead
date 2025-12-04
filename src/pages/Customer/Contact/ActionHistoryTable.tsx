import { FC } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  IActionHistoryTableColumn,
  IActionHistoryTableProps,
} from "@mifin/Interface/Customer";
import { useTranslation } from "react-i18next";

const ActionHistoryTable: FC<IActionHistoryTableProps> = props => {
  const { ContactDetail } = props;
  const { t } = useTranslation();

  const columns: ColumnsType<IActionHistoryTableColumn> = [
    {
      title: "Sr. No.",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: t("contact.actionHistoryTable.action"),
      dataIndex: "action",
    },
    {
      title: t("contact.actionHistoryTable.actionDateTime"),
      dataIndex: "actionDate",
    },
    {
      title: t("contact.actionHistoryTable.followUpAction"),
      dataIndex: "followupAction",
    },
    {
      title: t("contact.actionHistoryTable.followUpDateTime"),
      dataIndex: "followupActionDate",
    },
   {
      title: t("contact.actionHistoryTable.leadStage"),
      render: (_text, record) => {
        if (record.action === "CONVERTED") {
          return record.action;         
        }
        return record.leadStage;
      },
    },
    {
      title: t("contact.actionHistoryTable.potential"),
      dataIndex: "potential",
    },
    {
      title: t("contact.actionHistoryTable.remarks"),
      dataIndex: "remarks",
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

export default ActionHistoryTable;
