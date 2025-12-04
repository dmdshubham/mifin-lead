import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState, ReactNode } from "react";

interface PaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  renderComponent: (item: T) => JSX.Element;
  children?: (currentItems: T[]) => ReactNode; // Support children rendering
}

const CardPagination = <T,>({
  data,
  itemsPerPage,
  renderComponent,
  children,
}: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  // Paginate Data
  const currentItems = data?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <Box>
      {/* Render children if provided, otherwise fallback to renderComponent */}
      {children
        ? children(currentItems)
        : currentItems?.map(item => renderComponent(item))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Flex align={"center"} justify="space-between" mt={4} gap={2}>
          <Box
            onClick={goToPrevPage}
            isDisabled={currentPage === 1}
            bg="transparent"
          >
            <ChevronLeftIcon fontSize={"24px"} />
          </Box>

          <Text fontSize="12px" fontWeight="bold">
            Page {currentPage} of {totalPages}
          </Text>

          <Box
            onClick={goToNextPage}
            isDisabled={currentPage === totalPages}
            bg="transparent"
          >
            <ChevronRightIcon fontSize={"24px"} />
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default CardPagination;
