import { SimpleGrid } from "@chakra-ui/react";
import { GridLayoutProps } from "@mifin/Interface/NewLead";
import { simpleGridStyling } from "@mifin/theme/style";
import { FC } from "react";

const PersonalDetailCustomerDetailGrid: FC<GridLayoutProps> = props => {
  const { children } = props;
  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }}  sx={simpleGridStyling}>
      {children}
    </SimpleGrid>
  );
};

export default PersonalDetailCustomerDetailGrid;
