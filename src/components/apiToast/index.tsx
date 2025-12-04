import { Box, Portal, useBreakpointValue } from "@chakra-ui/react";
import { changesWrapperProps } from "@mifin/Interface/app";
import { MifinColor } from "@mifin/theme/color";
import { apiToastStyling } from "@mifin/theme/style";
import { FC } from "react";



const ChangesWrapper: FC<changesWrapperProps> = props => {
  const { children } = props;
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <Portal>
      <Box
        backgroundColor={MifinColor.gray_300}
        right={!isMobile ? "25px" : "50%"}
        transform={!isMobile ? "none" : "translateX(50%)"}
        sx={apiToastStyling}
      >
        {children}
      </Box>
    </Portal>
  );
};

export default ChangesWrapper;
