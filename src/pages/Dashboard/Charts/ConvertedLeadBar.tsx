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
// import { FunnelController, TrapezoidElement } from "chartjs-chart-funnel";
import ChartDataLabels from "chartjs-plugin-datalabels";

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

const ConvertedLeadBar = (props: any) => {
  const { dashboardData, watch } = props;
  const [leadConvertedMonthCounts, setLeadConvertedMonthCounts] = useState(
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
    const product = watch("convertedLeadProduct")?.value;
    const leads = dashboardData?.returnParameter?.convertedLeadDetails ?? [];
    leads?.forEach(lead => {
      const dateStr = lead?.leadConvertedDate;
      if (!dateStr) return;
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate) || parsedDate?.getFullYear() !== currentYear)
        return;
      if (!product || lead?.productId === product) {
        const month = parsedDate?.getMonth();
        counts[month]++;
      }
    });

    setLeadConvertedMonthCounts(counts);
  }, [dashboardData, watch("convertedLeadProduct")]);

  const convertedLeadData = {
    labels,
    datasets: [
      {
        // label: "Dataset 1",
        label: "Converted Leads ",
        //data: [1, 2, 4, 8, 20, 13, 4, 56, 23, 44, 69, 30],
        data: leadConvertedMonthCounts, // Use the computed month counts
        backgroundColor: "#2F4CDD",
        barThickness: 15,
      },
    ],
  };
  const convertedLeadBarOption = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false, // ✅ important!
      },
    },
    maintainAspectRatio: false,

    scales: {
      x: { grid: { display: false } },
      y: {
        title: {
          display: true,
          text: "Leads Converted",
        },
      },
    },
  };

  return (
    <>
      <Bar
        width={100}
        options={convertedLeadBarOption}
        data={convertedLeadData}
      />
    </>
  );
};
export { ConvertedLeadBar };
