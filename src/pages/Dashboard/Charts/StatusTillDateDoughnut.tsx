import { FC, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar, Chart } from "react-chartjs-2";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
// import { FunnelController, TrapezoidElement } from "chartjs-chart-funnel";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { LeadChartData } from "@mifin/Interface/Customer";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  // FunnelController,
  // TrapezoidElement,
  ChartDataLabels
);

const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const StatusTillDateDoughnut = (props: any) => {
  const { dashboardData, watch } = props;
  const { t } = useTranslation();

  const stageList = [
    { stageId: "1000000008", stageName: "REJECTED" },
    { stageId: "1000000001", stageName: "RAW LEAD" },
    { stageId: "1000000002", stageName: "NOT INTERESTED" },
    { stageId: "1000000003", stageName: "INELIGIBLE QUALIFIED" },
    { stageId: "1000000004", stageName: "QUALIFIED-DOCS ISSUE" },
    { stageId: "1000000005", stageName: "CONVERTED" },
    { stageId: "1000000006", stageName: "UNCONTACTABLE" },
  ];

  const stageColorMap: any = {
    REJECTED: "#00C896",
    "RAW LEAD": "#2A9D8F",
    "NOT INTERESTED": "#F1FAEE",
    "INELIGIBLE QUALIFIED": "#E63946",
    "QUALIFIED-DOCS ISSUE": "#457B9D",
    "CONVERTED": "#2ECC71",
    "UNCONTACTABLE": "#A8DADC",
    "PROCESSING": "#FF4C4C",
    "NEXT MONTH": "#00C0F0",
    "NEXT 2 MONTHS": "#F4A261",
    "IN THIS WEEK": "#264653",
  };
  const defaultLegendItems = stageList.map(({ stageName }) => ({
    label: stageName,
    color: stageColorMap[stageName.toUpperCase()] || "#000000",
    amount: 0,
    percentage: 0,
  }));

  const [legendItems, setLegendItems] = useState(defaultLegendItems);
  const [totalAmount, setTotalAmount] = useState("0");
  const [amountList, setAmountList] = useState(
    new Array(stageList.length).fill(0)
  );
  const [colorList, setColorList] = useState(
    stageList.map(
      stage => stageColorMap[stage.stageName.toUpperCase()] || "#000000"
    )
  );


  useEffect(() => {
  const product = watch("leadStatusTillDateProduct")?.value;
  const allLeadDetails = dashboardData?.returnParameter?.allLeadDetails ?? [];
  if (!allLeadDetails || !stageList) return;

  // 1. Aggregate amounts by stage
  const stageAmountMap: Record<string, number> = {};
  let total = 0;

  allLeadDetails.forEach(lead => {
    const stage = lead?.stage?.toUpperCase();
    const amount = Number(lead?.loanAmount) || 0;

    if (stage && (!product || lead?.productId === product)) {
      stageAmountMap[stage] = (stageAmountMap[stage] || 0) + amount;
      total += amount;
    }
  });

  // 2. Create full legendItems list with fallback/default values
  const fullLegendItems = stageList?.map(({ stageName }) => {
    const upperStage = stageName?.toUpperCase();
    const amount = stageAmountMap[upperStage] || 0;
    const percentage = total > 0 ? Math?.round((amount / total) * 100) : 0;
    const color = stageColorMap[upperStage] || "#000000";

    return {
      label: stageName,
      color,
      amount,
      percentage,
    };
  });

  // 3. Sort by amount desc, then alphabetically
  const sortedLegendItems = [...fullLegendItems]?.sort((a, b) => {
    if (b?.amount !== a?.amount) return b?.amount - a?.amount; // Descending amount
    return a?.label?.localeCompare(b?.label); // Alphabetical if amounts are same
  });

  // 4. Prepare amountList and colorList in sorted order
  const sortedAmountList = sortedLegendItems?.map(item => item?.amount);
  const sortedColorList = sortedLegendItems?.map(item => item?.color);
const formattedTotalAmount = total?.toLocaleString('en-IN');
  // 5. Update states
  setLegendItems(sortedLegendItems);
  setAmountList(sortedAmountList);
  setColorList(sortedColorList);
  setTotalAmount(formattedTotalAmount);
}, [dashboardData, watch("leadStatusTillDateProduct")]);


  const leadStatusTillDateData: LeadChartData = {
    datasets: [
      {
        label: "Amount",
        //data: [12, 19, 3, 50],
        data: amountList,
        // backgroundColor: ["#10CF8B", "#2E4AD5", "#FD8350", "#FF0808"],
        backgroundColor: colorList,
        //borderColor: ["#10CF8B", "#2E4AD5", "#FD8350", "#FF0808"],
        borderColor: colorList,
        borderWidth: 1,
      },
    ],
  };
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <>
      <Flex flexDirection={{ base: "column", md: "row" }} alignItems="center">
        <Box width={"190px"} height={"190px"} marginLeft="-30px">
          <Doughnut data={leadStatusTillDateData} options={doughnutOptions} />
        </Box>
        <VStack flexGrow={1}>
          <Grid
            templateColumns={{
              sm: "repeat(1,1fr)",
              md: "repeat(2,1fr)",
            }}
            columnGap={2}
            width="100%"
            marginLeft="30px"
          >
            <GridItem display={"flex"} alignItems="center">
              <Text fontSize="12px">
                {t("Dashboard.DashboardChart.leadsTotalAmount")}
              </Text>
            </GridItem>
            <GridItem>
              <Text
                fontFamily="Poppins"
                fontWeight={700}
                fontSize="16px"
                // textAlign="right"
                color="#000000"
              >
                {/* Rs. 34,78,630 */}
                Rs. {totalAmount}
              </Text>
            </GridItem>
            {legendItems.map((item, index) => (
              <>
                <GridItem display={"flex"} alignItems="center">
                  <HStack spacing={2}>
                    <Box
                      width="8px"
                      height="8px"
                      borderRadius="full"
                      // bg="#10CD8A"
                      bg={item?.color}
                    ></Box>
                    <Text fontSize="12px">
                      {/* {t("Dashboard.DashboardChart.converted")} */}
                      {toTitleCase(item?.label)}
                    </Text>
                  </HStack>
                </GridItem>
                <GridItem>
                  <HStack spacing={2}>
                    <Text fontWeight={400} fontSize="12px" color="#3E4954">
                      {/* Rs. 34,78,630 */}
                      Rs. {item?.amount?.toLocaleString()}
                    </Text>
                    <Text fontSize="12px">
                      {/* (79%) */}({item?.percentage}%)
                    </Text>
                  </HStack>
                </GridItem>
              </>
            ))}
          </Grid>
        </VStack>
      </Flex>
    </>
  );
};
export { StatusTillDateDoughnut };
