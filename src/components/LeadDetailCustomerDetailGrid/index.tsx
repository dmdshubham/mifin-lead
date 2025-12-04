import { SimpleGrid } from "@chakra-ui/react";
import { GridLayoutProps } from "@mifin/Interface/NewLead";
import { FC } from "react";

const LeadDetailCustomerDetailGrid: FC<GridLayoutProps> = props => {
  const { children } = props;
  return (
    <SimpleGrid
      mt="8"
      columns={{ md: 2, lg: 3, xl: 4 }}
      spacing={{ sm: 4, lg: 8 }}
    >
      {children}
    </SimpleGrid>
  );
};

export default LeadDetailCustomerDetailGrid;
