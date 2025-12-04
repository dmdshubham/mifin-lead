import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnOrderState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
//import { IUseDataTableProps } from "@customTypes/components/dataTableType";

const useDataTable = ({
  pagination,
  columns,
  data,
  categoryId,
  categoryTitle,
  setTable,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [stickyColumn, setStickyColumn] = useState<null | number>(null);
  const table = useReactTable({
    columns,
    data,
    categoryId,
    categoryTitle,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
    getPaginationRowModel: pagination && getPaginationRowModel(),

    state: {
      sorting,
      columnOrder,
    },
  });

  useEffect(() => setTable?.(table), [table]);
  useEffect(() => {
    table.getHeaderGroups().map(headerGroup =>
      headerGroup.headers.map(({ index }) => {
        columns[index]?.enablePinning && setStickyColumn(index + 1);
      })
    );
  }, [columns, data, table, categoryId, categoryTitle]);

  return { stickyColumn, table, categoryId, categoryTitle };
};

export default useDataTable;
