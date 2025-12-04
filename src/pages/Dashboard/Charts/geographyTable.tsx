import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
} from "@chakra-ui/react";
const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
const GeographyTable = (props: any) => {
  const { dashboardData, watch, setMapAvailableState } = props;
  const product = watch("productWiseState")?.value;
  const [tableData, setTableData] = useState<Array<[]>>([]);

  useEffect(() => {
    const selectedProductId = watch("productWiseState")?.value;
    const stateMap: Record<
      string,
      { state: string; generatedAmount: number; convertedAmount: number }
    > = {};

    dashboardData?.returnParameter?.allLeadDetails?.forEach((lead: any) => {
      const { state, loanAmount, stage, productId } = lead;
      const amount = loanAmount ? parseInt(loanAmount) : 0;

      if (!state) return;
      if (selectedProductId && selectedProductId !== productId) return;
      if (!stateMap[state]) {
        stateMap[state] = {
          state,
          generatedAmount: 0,
          convertedAmount: 0,
        };
      }

      // Add amount (0 if missing)
      stateMap[state].generatedAmount += amount;

      // Add to converted if stage is "CONVERTED"
      if (stage === "CONVERTED") {
        stateMap[state].convertedAmount += amount;
      }
    });

    const result = Object?.values(stateMap)?.map(item => ({
      ...item,
      state: `${toTitleCase(item?.state)}`,
      generatedAmount: `Rs. ${item?.generatedAmount?.toLocaleString()}`,
      convertedAmount: `Rs. ${item?.convertedAmount?.toLocaleString()}`,
    }));

    setTableData(result);
    setMapAvailableState(result);
  }, [dashboardData, watch("productWiseState")]);

  const columns = [
    {
      header: "State",
      accessor: "state",
    },
    {
      header: (
        <Flex direction="column">
          <Text>Total Amount</Text>
          <Text fontSize="12px" color="gray.500">
            Generated
          </Text>
        </Flex>
      ),
      accessor: "generatedAmount",
    },
    {
      header: (
        <Flex direction="column">
          <Text>Total Amount</Text>
          <Text fontSize="12px" color="gray.500">
            Converted
          </Text>
        </Flex>
      ),
      accessor: "convertedAmount",
    },
  ];

  const data = [
    {
      state: "Delhi",
      totalDue: "Rs.1234567",
      collected: "Rs.7654321",
      pending: "Rs.214365",
    },
    {
      state: "Maharashtra",
      totalDue: "Rs.1425369",
      collected: "Rs.9362514",
      pending: "Rs.321654",
    },
    {
      state: "Karnataka",
      totalDue: "Rs.1357921",
      collected: "Rs.9157321",
      pending: "Rs.247135",
    },
    {
      state: "West Bengal",
      totalDue: "Rs.1452369",
      collected: "Rs.9265134",
      pending: "Rs.325147",
    },
    {
      state: "Tamil Nadu",
      totalDue: "Rs.1357249",
      collected: "Rs.9173526",
      pending: "Rs.254137",
    },
    {
      state: "Telangana",
      totalDue: "Rs.1462379",
      collected: "Rs.9286413",
      pending: "Rs.374159",
    },
    {
      state: "Maharashtra",
      totalDue: "Rs.1253479",
      collected: "Rs.7852314",
      pending: "Rs.273156",
    },
    {
      state: "Gujarat",
      totalDue: "Rs.1472369",
      collected: "Rs.9374521",
      pending: "Rs.382514",
    },
    {
      state: "Rajasthan",
      totalDue: "Rs.1352869",
      collected: "Rs.9165423",
      pending: "Rs.243178",
    },
    {
      state: "Uttar Pradesh",
      totalDue: "Rs.1475369",
      collected: "Rs.9384721",
      pending: "Rs.385714",
    },
    {
      state: "Goa",
      totalDue: "Rs.1364829",
      collected: "Rs.9178534",
      pending: "Rs.274365",
    },
    {
      state: "Madhya Pradesh",
      totalDue: "Rs.1485293",
      collected: "Rs.9278451",
      pending: "Rs.385716",
    },
  ];

  return (
    <Box
      marginTop="40px"
      overflowX="auto"
      overflowY="hidden"
      fontSize={"14px"}
      fontWeight={800}
    >
      <Table>
        <Thead>
          <Tr>
            {columns.map(column => (
              <Th
                key={column.accessor}
                sx={{
                  textTransform: "capitalize",
                  color: "gray.500",
                  fontSize: "12px",
                }}
              >
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData?.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns?.map(column => (
                <Td key={column?.accessor}>{row[column?.accessor]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default GeographyTable;
