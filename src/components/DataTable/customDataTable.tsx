import {
  Box,
  HStack,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";
// import { upArrowTable, DefaultArrowTable } from "@assets/icons/svg";
import { FC } from "react";
import useDataTable from "./hooks/useDataTable";

const DataTable: FC = props => {
  const {
    variant,
    data,
    columns,
    CustomPagination,
    isLoading,
    showtotal,
    setTable,
    count,
    size,
    sx,
    isSortingRequired,
    categoryId = "",
    categoryTitle = "",
  } = props;

  const { stickyColumn, table } = useDataTable({
    CustomPagination,
    columns,
    data,
    categoryId,
    categoryTitle,
    setTable,
  });

  return (
    <Box>
      <Skeleton isLoaded={true}>
        <Table bg="white" layout="fixed" variant={variant} size={size} sx={sx}>
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr
                key={headerGroup.id}
                css={{
                  [`th:nth-of-type(${stickyColumn})`]: {
                    position: "sticky",
                    left: "-1px",
                    right: "-1px",
                    zIndex: 40,
                  },
                }}
              >
                {headerGroup.headers.map((header, index) => {
                  const isHidden = columns[index]?.hidden ?? false;

                  if (isHidden) return null;
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      textTransform="capitalize"
                      whiteSpace="break-spaces" // Modified
                      width={`${columns[index]?.size}%` ?? header.getSize()}
                    >
                      <HStack>
                        <Text>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </Text>
                        {isSortingRequired &&
                          header.getContext().header.id !== "button" && (
                            <Box
                              cursor={
                                header.column.getCanSort() ? "pointer" : "auto"
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {/* {(header.column.getCanSort() &&
                                  {
                                    asc: <Icon as={upArrowTable} />,
                                    //desc: <Icon as={DefaultArrowTable} />,
                                  }[header.column.getIsSorted() as string]) ?? (
                                  <Icon as={DefaultArrowTable} />
                                )} */}
                            </Box>
                          )}
                      </HStack>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          {/* original code start */}
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td
                  colSpan={table.getAllColumns().length}
                  fontSize={{ xl: "12px", lg: "12px" }}
                  textAlign={"center"}
                  pl={2}
                >
                  <Spinner size={"md"} />
                </Td>
              </Tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => {
                const visibleColumns = row
                  .getAllCells()
                  .filter(cell => !cell.column.columnDef.hidden);
                return (
                  <Tr key={row.id}>
                    {visibleColumns.map(cell => {
                      return (
                        <Td
                          fontSize={{ xl: "12px", lg: "12px" }}
                          key={cell.id}
                          pl={2}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })
            ) : (
              <Tr>
                <Td
                  colSpan={table.getAllColumns().length}
                  fontSize={{ xl: "12px", lg: "12px" }}
                  textAlign={"center"}
                  pl={2}
                >
                  No Data found
                </Td>
              </Tr>
            )}
            {showtotal && count && (
              <Tr>
                <Td></Td>
                <Td fontWeight={600}>{showtotal}</Td>
                <Td fontWeight={600}>{count}</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Skeleton>
      {!!CustomPagination && <CustomPagination table={table} />}
    </Box>
  );
};

export default DataTable;
