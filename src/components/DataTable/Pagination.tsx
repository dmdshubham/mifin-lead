import {
  Box,
  Center,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { IPagination } from "@mifin/Interface/myWorklist";
import { FC, useMemo } from "react";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination: FC<IPagination> = props => {
  const { isBackendPaginated, pageIndex, table } = props;

  const totalPage = useMemo(() => {
    return table.getPageCount();
  }, [table.getPageCount()]);

  const currentPage = useMemo(() => {
    return isBackendPaginated
      ? (pageIndex ?? 0) + 1
      : table.getState().pagination.pageIndex + 1;
  }, [isBackendPaginated, pageIndex, table.getState().pagination.pageIndex]);

  const PageNumberWrapper = (item: number, isActive?: boolean) => {
    return isActive ? (
      <Center
        h={9}
        w={9}
        bg="whiteAlpha.500"
        borderRadius={"10px"}
        border="1px solid black"
        color="black"
        cursor={"default"}
        fontSize={"md"}
        userSelect="none"
      >
        <Text mt={0.5}>{item}</Text>
      </Center>
    ) : (
      <Center
        h={9}
        w={9}
        _hover={{ bg: "whiteAlpha.500", color: "black" }}
        borderRadius={20}
        cursor="pointer"
        userSelect="none"
        onClick={() => {
          table.setPageIndex(item - 1);
        }}
      >
        {item}
      </Center>
    );
  };

  return (
    <Box
      display={"flex"}
      justifyContent="flex-end"
      alignItems={"center"}
      height={"50px"}
    >
      <Box marginX={"16px"}>
        <Stack direction={"row"} alignItems="center" columnGap={0}>
          <IconButton
            variant={"outline"}
            aria-label="First Page"
            borderRadius="10px"
            onClick={() => table.setPageIndex(0)}
            size="xs"
            fontSize={"lg"}
            border={"none"}
            disabled={!table.getCanPreviousPage()}
            icon={<HiOutlineChevronDoubleLeft />}
          />
          <IconButton
            variant={"outline"}
            aria-label="Previous Page"
            borderRadius="10px"
            onClick={() => table.previousPage()}
            size="xs"
            fontSize={"lg"}
            border={"none"}
            disabled={!table.getCanPreviousPage()}
            icon={<IoIosArrowBack />}
          />
          {currentPage != 1 && PageNumberWrapper(currentPage - 1)}
          {PageNumberWrapper(currentPage, true)}
          {currentPage < totalPage && PageNumberWrapper(currentPage + 1)}
          {totalPage < currentPage - 1 && PageNumberWrapper(totalPage - 1)}

          <IconButton
            aria-label="Next Page"
            variant={"outline"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            size="xs"
            fontSize={"lg"}
            border="none"
            icon={<IoIosArrowForward />}
          />
          <Tooltip label={`Last Page: ${totalPage}`} placement="top">
            <IconButton
              aria-label="Last Page"
              variant={"outline"}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              size="xs"
              fontSize={"lg"}
              border="none"
              icon={<HiOutlineChevronDoubleRight />}
            />
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
};
export default Pagination;
