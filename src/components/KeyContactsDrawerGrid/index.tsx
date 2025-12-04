import { SimpleGrid } from "@chakra-ui/react";
import { GridLayoutProps } from "@mifin/Interface/NewLead";
import { FC } from "react";

const KeyContactsDrawerGrid: FC<GridLayoutProps> = props => {
  const { children } = props;
  return (
    <SimpleGrid
      columns={{
        base: 1,
        md: 2,
      }}
      rowGap={5}
      px={4}
      py={2}
    >
      {children}
    </SimpleGrid>
  );
};

export default KeyContactsDrawerGrid;
