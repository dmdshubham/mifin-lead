import {
  Box,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import { ChangeEvent } from "react";
// import { IPaginationProps } from "@customTypes/components/dataTableType";
import {
  LiaAngleDoubleLeftSolid,
  LiaAngleLeftSolid,
  LiaAngleRightSolid,
  LiaAngleDoubleRightSolid,
} from "react-icons/lia";
import { Rem } from "@mifin/utils/convertToRelativeUnit";

/*
    options should be passed from dataTable props for custom options
  */
const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

const CustomPagination = props => {
  const { table } = props;
  const buttonStyle = useStyleConfig("PaginationButtonStyles");

  const handleGoToFirstPage = () => table.setPageIndex(0);
  const handleGoToPreviousPage = () => table.previousPage();
  const handleGoToNextPage = () => table.nextPage();
  const handleGoToLastPage = () => table.setPageIndex(table.getPageCount() - 1);

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    table.setPageSize(Number(e.target.value));
  };

  const handleGoToPage = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const page = value ? Number(value) - 1 : 0;
    table.setPageIndex(page);
  };

  return (
    <Flex justify="space-between" my="6" gap={2}>
      <Flex align="center">
        <FormControl display="flex" alignItems="center" gap="2">
          <FormLabel htmlFor="selectPageLimit">Show</FormLabel>
          <Select
            id="selectPageLimit"
            minW={Rem(70)}
            fontSize="1rem"
            value={table.getState().pagination.pageSize}
            onChange={e => handlePageSizeChange(e)}
            variant="outline"
          >
            {PAGE_SIZE_OPTIONS.map((pageSize, index) => (
              <option key={index} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </Select>
          <FormLabel htmlFor="selectPageLimit" mt={1}>
            Entries
          </FormLabel>
        </FormControl>
        <Box>
          <Text minWidth={Rem(250)}>
            | &nbsp; Show {table.getState().pagination.pageIndex + 1} -{" "}
            {table.getPageCount()}
            <Text as="span" display="inline-block" ml="1">
              Entries
            </Text>
          </Text>
        </Box>
      </Flex>

      <HStack>
        <ButtonGroup aria-label="prev button group">
          <IconButton
            aria-label="first page"
            variant="unstyled"
            onClick={() => handleGoToFirstPage()}
            isDisabled={!table.getCanPreviousPage()}
            sx={buttonStyle}
            icon={<LiaAngleDoubleLeftSolid />}
          />

          <IconButton
            aria-label="previous page"
            variant="unstyled"
            onClick={() => handleGoToPreviousPage()}
            isDisabled={!table.getCanPreviousPage()}
            sx={buttonStyle}
            icon={<LiaAngleLeftSolid />}
          />
        </ButtonGroup>

        <Flex minWidth={Rem(52)} gap="2" align="center" textAlign="center">
          <Input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => handleGoToPage(e)}
            variant="outline"
            maxW={Rem(60)}
          />
          of {table.getPageCount()}
        </Flex>

        <ButtonGroup aria-label="next button group">
          <IconButton
            aria-label="next page"
            variant="unstyled"
            onClick={() => handleGoToNextPage()}
            isDisabled={!table.getCanNextPage()}
            sx={buttonStyle}
            icon={<LiaAngleRightSolid />}
          />

          <IconButton
            aria-label="last page"
            variant="unstyled"
            onClick={() => handleGoToLastPage()}
            isDisabled={!table.getCanNextPage()}
            sx={buttonStyle}
            icon={<LiaAngleDoubleRightSolid />}
          />
        </ButtonGroup>
      </HStack>
    </Flex>
  );
};

export default CustomPagination;
