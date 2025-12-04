import { SimpleGrid } from "@chakra-ui/react";
import { GridLayoutProps } from "@mifin/Interface/NewLead";
import { FC } from "react";

const SearchFormControlGrid: FC<GridLayoutProps> = props => {
  const { children } = props;
  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3 }}
      spacing={{ sm: "10px", md: "20px", lg: "40px", xl: "60px" }}
      color={"#000000B3"}
      fontFamily={"Poppins"}
    >
      {children}
    </SimpleGrid>
  );
};

export default SearchFormControlGrid;
