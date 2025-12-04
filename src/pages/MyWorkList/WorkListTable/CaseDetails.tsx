import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
const CaseDetails = ({
  activeCase,
  leadTableData,
}: {
  activeCase: string;
  leadTableData: Array<any>;
}) => {
  const { t } = useTranslation();
  const formatINR = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      // minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  console.log("leadTableData", leadTableData);
  return (
    <Box>
      {leadTableData
        .filter(data => data.leadCode === activeCase)
        .map(data => {
          return (
            <SimpleGrid
              key={data}
              columns={{
                base: 1,
                md: 2,
              }}
              rowGap={5}
              px={4}
              py={2}
            >
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {t("workListDrawer.caseId")}
              </Text>
              <Text color="blue" fontSize={"14px"}>
                {data?.leadCode}
              </Text>
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {t("workListDrawer.queue")}
              </Text>
              <Text fontSize={"14px"}>{data?.queue}</Text>
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {t("workListDrawer.subQueue")}
              </Text>
              <Text fontSize={"14px"}>{data?.subQueue}</Text>
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {t("workListDrawer.customerName")}
              </Text>
              <Text fontSize={"14px"}>{data?.customerName}</Text>
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {" "}
                {t("workListDrawer.amount")}
              </Text>
              <Text fontSize={"14px"}>{formatINR(data?.amount)}</Text>
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {" "}
                {t("workListDrawer.actionName")}
              </Text>
              <Text fontSize={"14px"}>{data?.actionName}</Text>
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {" "}
                {t("workListDrawer.allocatedTo")}
              </Text>
              <Text fontSize={"14px"}>{data?.allocatedToName}</Text>
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {" "}
                {t("workListDrawer.followUpAction")}
              </Text>
              <Text fontSize={"14px"}>{data?.followUp_action}</Text>
              <Text color={"rgba(0,0,0,0.6)"} fontSize={"14px"}>
                {" "}
                {t("workListDrawer.followDate")}
              </Text>
              <Text fontSize={"14px"}>{data?.followUpDate}</Text>
            </SimpleGrid>
          );
        })}
    </Box>
  );
};

export default CaseDetails;
