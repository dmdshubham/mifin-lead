import { FC } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  IEscalationHistoryTableColumn,
  IEscalationHistoryTableProps,
} from "@mifin/Interface/Customer";
import { useTranslation } from "react-i18next";

const EscalationHistoryTable: FC<IEscalationHistoryTableProps> = props => {
  const { ContactDetail } = props;
  const { t } = useTranslation();

  const columns: ColumnsType<IEscalationHistoryTableColumn> = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: t("contact.escalationReferralHistoryTable.actionName"),
      dataIndex: "actionName",
    },
    {
      title: t("contact.escalationReferralHistoryTable.initiatedBy"),
      dataIndex: "initiatedBy",
    },
    {
      title: t("contact.escalationReferralHistoryTable.initiatedTo"),
      dataIndex: "initiatedTo",
    },
    {
      title: t("contact.escalationReferralHistoryTable.initiatedDateTime"),
      dataIndex: "initiatedDateTime",
    },
    {
      title: t("contact.escalationReferralHistoryTable.initialRemarks"),
      dataIndex: "initialRemarks",
    },
    {
      title: t("contact.escalationReferralHistoryTable.resolveBy"),
      dataIndex: "resolvedBy",
    },
    {
      title: t("contact.escalationReferralHistoryTable.resolveDateTime"),
      dataIndex: "resolveDtTime",
    },
    {
      title: t("contact.escalationReferralHistoryTable.resolveRemarks"),
      dataIndex: "resolvedRemarks",
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

export default EscalationHistoryTable;
