import { SimpleGrid } from "@chakra-ui/react";
import { GridLayoutProps } from "@mifin/Interface/NewLead";
import { personalDetailsGridStyling } from "@mifin/theme/style";
import { FC } from "react";

const PersonalDetailGrid: FC<GridLayoutProps> = props => {
  const { children } = props;
  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 4 }}
      sx={personalDetailsGridStyling}
    >
      {children}
    </SimpleGrid>
  );
};

export default PersonalDetailGrid;
