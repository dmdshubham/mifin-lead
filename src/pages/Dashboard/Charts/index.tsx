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
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import MapChart from "./map";
import GeographyTable from "./geographyTable";
import { useTranslation } from "react-i18next";
import { dashboardGridStyling, dashboardBoxStyling } from "@mifin/theme/style";
import { CollectionChartData, LeadChartData } from "@mifin/Interface/Customer";
import { FunnelController, TrapezoidElement } from "chartjs-chart-funnel";
import SelectComponent from "@mifin/components/SelectComponent";
import { useForm } from "react-hook-form";
import { IChartsProps, ISearchFormProps } from "@mifin/Interface/dashboard";
import { getDasboardMasterdata } from "@mifin/service/dashboard/getDashboardMasters";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FunnelChart } from "@mifin/pages/Dashboard/Charts/FunnelChart";
import { GeneratedLeadBar } from "@mifin/pages/Dashboard/Charts/GeneratedLeadBar";
import { ConvertedLeadBar } from "@mifin/pages/Dashboard/Charts/ConvertedLeadBar";
import { StatusTillDateDoughnut } from "@mifin/pages/Dashboard/Charts/StatusTillDateDoughnut";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  FunnelController,
  TrapezoidElement,
  ChartDataLabels
);

// const leadStatusTillDateData: LeadChartData = {
//   datasets: [
//     {
//       label: "# of Votes",
//       data: [12, 19, 3, 50],
//       backgroundColor: ["#10CF8B", "#2E4AD5", "#FD8350", "#FF0808"],
//       borderColor: ["#10CF8B", "#2E4AD5", "#FD8350", "#FF0808"],
//       borderWidth: 1,
//     },
//   ],
// };
// const doughnutOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     datalabels: {
//       display: false,
//     },
//     legend: {
//       display: true,
//       position: "bottom",
//     },
//   },
// };

const labels = [
  "1/12",
  "2/12",
  "3//12",
  "4/12",
  "5/12",
  "6/12",
  "7/12",
  "8/12",
  "9/12",
  "10/12",
  "11/12",
  "12/12",
];

// export const convertedLeadData = {
//   labels,
//   datasets: [
//     {
//       // label: "Dataset 1",
//       label: "Converted Leads ",
//       data: [1, 2, 4, 8, 20, 13, 4, 56, 23, 44, 69, 30],
//       backgroundColor: "#1BB6E7",
//       barThickness: 15,
//     },
//   ],
// };

// export const generatedLeadData = {
//   labels,
//   datasets: [
//     {
//       // label: "Dataset 1",
//       label: "Generated Leads ",

//       data: [1, 2, 4, 8, 20, 13, 4, 56, 23, 44, 69, 30],
//       backgroundColor: "#2F4CDD",
//       barThickness: 15,
//     },
//   ],
// };

const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const Charts: FC<IChartsProps> = props => {
  const { dashboardData, dashboardMasterList, resetDropValue } = props;
  const { register, handleSubmit, control, watch, reset } = useForm({});
  // const [tabIndex, setTabIndex] = useState(1);
  // const [PTPIndex, setPTPIndex] = useState(1);
  const { t } = useTranslation();
  const [mapAvailableState, setMapAvailableState] = useState<Array<[]>>([]);

  const productMaster =
    dashboardMasterList?.productMaster?.returnParameter?.map(
      (el: ISearchFormProps) => {
        return {
          label: el?.productName,
          value: el?.productId,
        };
      }
    );
  useEffect(() => {
    if (resetDropValue) {
      reset({
        generatedLeadProduct: null,
        convertedLeadProduct: null,
        leadStatusTillDateProduct: null,
        productWiseState: null,
      });
    }
  }, [resetDropValue]);

  return (
    <>
      <Grid
        templateColumns={{
          sm: "repeat(1,1fr)",
          md: "repeat(1,1fr)",
          lg: "repeat(2,1fr)",
        }}
        grid-column-gap="3%"
        sx={dashboardGridStyling}
      >
        <Box
          border={"1px solid #E5EAF2"}
          borderRadius={15}
          padding="16px 20px 30px 20px"
        >
          <Flex
            justifyContent={"space-between"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Text fontWeight={700} fontSize="15px">
              {t("Dashboard.DashboardChart.leadStatus")}
            </Text>
            <Flex gap={4} flexWrap="wrap"></Flex>
          </Flex>

          <Box height={"80%"} width={"90%"} mt={"5%"} ml={"-5%"}>
            {/* <Box height="350px" width="100%" mt="5%" ml="0"> */}
            <FunnelChart dashboardData={dashboardData} watch={watch} />
          </Box>
        </Box>
        <Box
          border={"1px solid #E5EAF2"}
          borderRadius={15}
          padding="16px 20px 30px 20px"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            flexDirection={{ base: "column", md: "row" }}
            gap={4}
            flexWrap="wrap"
          >
            <Text fontWeight={700} fontSize="15px" whiteSpace="nowrap">
              {t("Dashboard.DashboardChart.leadGenerated")}
            </Text>

            <Box minW="250px" maxW="100%" flexShrink={0}>
              <SelectComponent
                control={control}
                name="generatedLeadProduct"
                options={productMaster}
                placeholder={t("dashboard.allProducts")}
                size="lg"
              />
            </Box>
          </Flex>

          <Box height={"260px"} maxW="99%">
            <GeneratedLeadBar dashboardData={dashboardData} watch={watch} />
          </Box>
        </Box>

        <Box sx={dashboardBoxStyling}>
          <Flex
            justifyContent={"space-between"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Text fontWeight={700} fontSize="15px">
              {t("Dashboard.DashboardChart.leadStatusTillDate")}
            </Text>
            <Flex gap={4}>
              <Box minW="250px" maxW="100%" flexShrink={0}>
                <SelectComponent
                  control={control}
                  name="leadStatusTillDateProduct"
                  options={productMaster}
                  placeholder={t("dashboard.allProducts")}
                  size="lg"
                />
              </Box>
            </Flex>
          </Flex>
          <Tabs variant={"unstyled"}>
            <TabPanels>
              <TabPanel>
                <StatusTillDateDoughnut
                  dashboardData={dashboardData}
                  watch={watch}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Box
          border={"1px solid #E5EAF2"}
          borderRadius={15}
          padding="16px 20px 30px 20px"
        >
          <Flex
            justifyContent={"space-between"}
            flexDirection={{ base: "column", md: "row" }}
          >
            <Text fontWeight={700} fontSize="15px">
              {t("Dashboard.DashboardChart.leadConverted")}
            </Text>
            <Flex gap={4} flexWrap="wrap">
              <Box minW="250px" maxW="100%" flexShrink={0}>
                <SelectComponent
                  control={control}
                  name="convertedLeadProduct"
                  options={productMaster}
                  placeholder={t("dashboard.allProducts")}
                  size="lg"
                />
              </Box>
              {/* <SelectComponent
                control={control}
                name="convertedLeadProduct"
                options={productMaster}
                placeholder={t("dashboard.allProducts")}
                // isMulti
              /> */}
              {/* <HStack
                backgroundColor={"#EAEDEF"}
                borderRadius={6}
                paddingX="2px"
              > */}
              {/* <Text
                  padding="8px 12px 7px 12px"
                  backgroundColor={tabIndex === 1 ? "#ffffff" : "#EAEDEF"}
                  borderRadius={6}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => setTabIndex(1)}
                >
                  {t("dashboard.daily")}
                </Text>

                <Text
                  padding="8px 12px 7px 12px"
                  backgroundColor={tabIndex === 2 ? "#ffffff" : "#EAEDEF"}
                  borderRadius={6}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => setTabIndex(2)}
                >
                  {t("dashboard.weekly")}
                </Text> */}
              {/* </HStack> */}
            </Flex>
          </Flex>

          {/* {tabIndex === 1 ? ( */}
          <Box height={"260px"} maxW="99%">
            <ConvertedLeadBar dashboardData={dashboardData} watch={watch} />
          </Box>
        </Box>
      </Grid>
      <Box
        border={"1px solid #E5EAF2"}
        borderRadius={15}
        padding="16px 20px 30px 20px"
      >
        <Flex justifyContent={"space-between"}>
          <Text fontWeight={700} fontSize="15px">
            {t("dashboard.geography")}
          </Text>
          <Flex gap={4}>
            <Box minW="250px" maxW="100%" flexShrink={0}>
              <SelectComponent
                control={control}
                name="productWiseState"
                options={productMaster}
                placeholder={t("dashboard.allProducts")}
                size="lg"
              />
            </Box>
          </Flex>
        </Flex>
        <HStack alignItems={"start"}>
          <VStack flex={0.5}>
            <MapChart
              dashboardData={dashboardData}
              mapAvailableState={mapAvailableState}
            />
          </VStack>
          <Flex
            flex={0.5}
            sx={{
              "&>*": {
                width: "100%",
              },
            }}
          >
            <GeographyTable
              dashboardData={dashboardData}
              watch={watch}
              setMapAvailableState={setMapAvailableState}
            />
          </Flex>
        </HStack>
      </Box>
    </>
  );
};

export default Charts;
