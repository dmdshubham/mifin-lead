import { SimpleGrid } from "@chakra-ui/react";
import { GridLayoutProps } from "@mifin/Interface/NewLead";
import { FC } from "react";

const LMSReallocationGrid: FC<GridLayoutProps> = props => {
  const { children } = props;
  return (
    <SimpleGrid columns={{ sm: 1, lg: 3 }} spacing={"100px"} width={"85%"}>
      {children}
    </SimpleGrid>
  );
};

export default LMSReallocationGrid;
