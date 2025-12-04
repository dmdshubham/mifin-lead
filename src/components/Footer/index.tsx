import { Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { MifinColor } from "@mifin/theme/color";
import { footerTextStyling, footerBoxStyling } from "@mifin/theme/style";
import { FC } from "react";

const Footer: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const textAlign = useBreakpointValue({ base: "center", md: "left" });

  return (
    <Box
      backgroundColor={MifinColor.footer}
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      alignItems="center"
      justifyContent="space-between"
      py={2}
    >
      <Box />
      <Text
        color={MifinColor.gray_100}
        textAlign={textAlign}
        sx={{
          fontSize: { base: "12px", md: "14px" },
        }}
      >
        Copyright Qualtech Solutions Pvt. Ltd. All Right Reserved
      </Text>
      <Box
        color={MifinColor.gray_100}
        sx={footerBoxStyling}
        mt={isMobile ? 1 : 0}
      >
        <Text fontSize={{ base: "12px", md: "14px" }}>v 2.1.1.5</Text>
      </Box>
    </Box>
  );
};

export default Footer;
