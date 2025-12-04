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
import { Box } from "@chakra-ui/react";
import { FunnelController, TrapezoidElement } from "chartjs-chart-funnel";
import ChartDataLabels from "chartjs-plugin-datalabels";

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

const stageList = [
  { stageId: "1000000008", stageName: "REJECTED" },
  { stageId: "1000000001", stageName: "RAW LEAD" },
  { stageId: "1000000002", stageName: "NOT INTERESTED" },
  { stageId: "1000000003", stageName: "INELIGIBLE QUALIFIED" },
  { stageId: "1000000004", stageName: "QUALIFIED-DOCS ISSUE" },
  { stageId: "1000000005", stageName: "CONVERTED" },
  { stageId: "1000000006", stageName: "UNCONTACTABLE" },
];
const stageColorMap: Record<string, string> = {
  "REJECTED": "#00C896",
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

const defaultStages = [
  "REJECTED",
  "RAW LEAD",
  "NOT INTERESTED",
  "INELIGIBLE QUALIFIED",
  "QUALIFIED-DOCS ISSUE",
  "CONVERTED",
  "UNCONTACTABLE",
];

const defaultStageColorMap: Record<string, string> = {
  "REJECTED": "#00C896",
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

const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const FunnelChart = (props: any) => {
  const { dashboardData, watch } = props;
  const [stageLabels, setStageLabels] = useState(
    defaultStages?.map(stage => `${toTitleCase(stage)} (0)`)
  );

  const [stageColors, setStageColors] = useState(
    defaultStages?.map(stage => defaultStageColorMap?.[stage] || "#ccc")
  );
  const funnelChartData = {
    // labels: [
    //   "Rejected(1)",
    //   "Processing(2)",
    //   "Next Month(0)",
    //   "Next 2 Months(0)",
    //   "In This Week(0)",
    //   "Raw Lead(45)",
    //   "Ineligible Qualified(0)",
    //   "Not Interested(0)",
    //   "Uncontactable(0)",
    //   "Qualified Docs Issue(0)",
    //   "Converted(31)",
    // ],
    labels: stageLabels,
    datasets: [
      {
        label: "Leads Status",
        // data: [50, 45, 40, 35, 30, 25, 20, 15, 10, 10, 10],
        data: [35, 30, 25, 20, 15, 10, 10],
        // backgroundColor: [
        //   "#00C896", // Rejected
        //   "#FF4C4C", // Processing
        //   "#00C0F0", // Next Month
        //   "#F4A261", // Next 2 Months
        //   "#264653", // In This Week
        //   "#2A9D8F", // Raw Lead
        //   "#E63946", // Ineligible Qualified
        //   "#F1FAEE", // Not Interested
        //   "#A8DADC", // Uncontactable
        //   "#457B9D", // Qualified Docs Issue
        //   "#2ECC71", // Converted
        // ],
        backgroundColor: stageColors, // Use the colors from the state
      },
    ],
  };

  const funnelChartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 100, // add enough space for long labels
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        anchor: "end",
        align: "right",
        clip: false, // ❗️prevents label cutoff
        color: "#000",
        font: {
          size: 11,
          // weight: "bold",
        },
        formatter: (_value, context) =>
          funnelChartData?.labels?.[context?.dataIndex] || "",
      },
    },
  };

  // const funnelChartOptions = {
  //   indexAxis: "y" as const,
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { display: false },
  //     title: {
  //       display: false,
  //     },
  //     tooltip: {
  //       enabled: false,
  //     },
  //   },
  // };

  useEffect(() => {
    const allLeadDetails = dashboardData?.returnParameter?.allLeadDetails ?? [];
    if (!allLeadDetails || !stageList) return;
    const stageCountsMap: Record<string, number> = {};

    // Count how many leads per stage

    allLeadDetails?.forEach((lead: { stage: any }) => {
      const stage = lead?.stage?.toUpperCase();
      if (stage) {
        stageCountsMap[stage] = (stageCountsMap[stage] || 0) + 1;
      }
    });

    const toTitleCase = (str: string): string =>
      str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Combine stage info with counts and color
    const combinedStages = stageList.map(stage => {
      const nameUpper = stage?.stageName?.toUpperCase();
      const count = stageCountsMap[nameUpper] || 0;
      return {
        // label: `${stage?.stageName} (${count})`,
        label: `${toTitleCase(stage?.stageName)} (${count})`,
        count,
        color: stageColorMap[nameUpper] || "#ccc",
      };
    });

    // Sort by count DESC, then name ASC
    combinedStages.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.label.localeCompare(b.label);
    });

    // Separate labels and colors into different state arrays
    setStageLabels(combinedStages.map(item => item?.label));
    setStageColors(combinedStages.map(item => item?.color));
  }, [dashboardData]);

  return (
    <>
      <Chart
        type="funnel"
        data={funnelChartData}
        options={funnelChartOptions}
      />
    </>
  );
};
export { FunnelChart };
