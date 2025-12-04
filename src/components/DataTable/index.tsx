import {
  Box,
  Flex,
  FormControl,
  HStack,
  Select,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useEffect, useMemo } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import Pagination from "@mifin/components/DataTable/Pagination";
import { IDataTableProps } from "@mifin/Interface/myWorklist";


export const DataTable: FC<IDataTableProps> = props => {
  const { data, columns, pagination, isLoading, setTable } = props;

  const paginationParams = useMemo(
    () =>
      pagination?.manual
        ? {
            manualPagination: true,
            pageCount: pagination.pageCount ?? -1,
            state: {
              pagination: {
                pageIndex: pagination.pageIndex ?? 0,
                pageSize: pagination.pageIndex ?? 10,
              },
            },
            onPaginationChange: pagination?.onChangePagination,
          }
        : {
            getPaginationRowModel: getPaginationRowModel(),
          },
    [pagination]
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...paginationParams,
  });

  useEffect(() => setTable?.(table), [table]);

  return (
    <Box>
      <Skeleton
        isLoaded={!isLoading}
        startColor="black"
        endColor="black"
      >
        <Table bg="white">
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <Th key={header.id} textTransform="capitalize">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <Td key={cell.id} pl={4}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Skeleton>

      {pagination && (
        <>
          <HStack
            justifyContent={"flex-end"}
            float={"left"}
            flexWrap="wrap"
            mt={3}
          >
            <FormControl variant={"floating"}>
              <Flex alignItems={"center"}>
                <Text mr={3}>Show</Text>
                <Select
                  icon={<IoMdArrowDropdown />}
                  w="70px"
                  h="30px"
                  colorScheme={"white"}
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[10].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </Select>
                <Text ml={3}>Entries</Text>
              </Flex>
            </FormControl>
          </HStack>

          <HStack
            justifyContent={"flex-end"}
            float={"right"}
            flexWrap="wrap"
            mt={2}
          >
            <Pagination
              isBackendPaginated={pagination?.manual}
              table={table}
              pageIndex={pagination?.pageIndex}
              pageCount={pagination?.pageCount ?? data?.length}
            />
          </HStack>
          <HStack justifyContent={"center"} mt={5}>
            <Text>
              Showing {pagination?.pageIndex + 1} of {pagination?.pageCount}{" "}
              Entries
            </Text>
          </HStack>
        </>
      )}
    </Box>
  );
};
