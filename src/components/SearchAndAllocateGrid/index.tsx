import { SimpleGrid } from "@chakra-ui/react";
import { GridLayoutProps } from "@mifin/Interface/NewLead";
import { FC } from "react";

const SearchAndAllocateGrid: FC<GridLayoutProps> = props => {
  const { children } = props;
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3, xl: 4 }} mb="10">
      {children}
    </SimpleGrid>
  );
};

export default SearchAndAllocateGrid;
