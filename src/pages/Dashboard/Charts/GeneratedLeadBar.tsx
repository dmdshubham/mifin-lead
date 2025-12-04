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

const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const GeneratedLeadBar = (props: any) => {
  const { dashboardData, watch } = props;
  const [leadGeneratedMonthCounts, setLeadGeneratedMonthCounts] = useState(
    Array(12).fill(0)
  );
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

  useEffect(() => {
    const counts = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    const product = watch("generatedLeadProduct")?.value;
    const leads = dashboardData?.returnParameter?.allLeadDetails ?? [];
    leads?.forEach(lead => {
      const dateStr = lead?.leadGenerationDate;
      if (!dateStr) return;
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate) || parsedDate?.getFullYear() !== currentYear)
        return;
      if (!product || lead?.productId === product) {
        const month = parsedDate?.getMonth();
        counts[month]++;
      }
    });

    setLeadGeneratedMonthCounts(counts);
  }, [dashboardData, watch("generatedLeadProduct")]);

  const generatedLeadData = {
    labels,
    datasets: [
      {
        // label: "Dataset 1",
        label: "Generated Leads ",

        // data: [1, 2, 4, 8, 20, 13, 4, 56, 23, 44, 69, 30],
        data: leadGeneratedMonthCounts, // Use the computed month counts
        backgroundColor: "#1BB6E7",
        barThickness: 15,
      },
    ],
  };
  const generatedLeadBarOption = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        display: false, // ✅ important!
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        title: {
          display: true,
          text: "No Of Leads",
        },
      },
    },
  };

  return (
    <>
      <Bar
        width={100}
        options={generatedLeadBarOption}
        data={generatedLeadData}
      />
    </>
  );
};
export { GeneratedLeadBar };
