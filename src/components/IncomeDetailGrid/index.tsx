import { SimpleGrid } from "@chakra-ui/react";
import { GridLayoutProps } from "@mifin/Interface/NewLead";
import { FC } from "react";

const IncomeDetailGrid: FC<GridLayoutProps> = props => {
  const { children } = props;
  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 4 }}
      gap={{ base: "12px", md: "30px" }}
      mt="14px"
    >
      {children}
    </SimpleGrid>
  );
};

export default IncomeDetailGrid;
