import React, { FC } from "react";
import { Box, FormControl, Input, HStack } from "@chakra-ui/react";
import PrimaryButton from "@mifin/components/Button/index";
import { convertToCustomerBoxStyling } from "@mifin/theme/style";

const CustomerContactHeader: FC = () => {
  return (
    <Box
      ml={{ lg: "16%", xl: "33.33%" }}
      mt={{ sm: 8 }}
      sx={convertToCustomerBoxStyling}
    >
      <HStack>
        <FormControl display="flex" maxW="259px">
          <Input variant="flushed" placeholder="Lead Id" />
          <PrimaryButton type="submit" title="search" />
        </FormControl>
        <PrimaryButton type="button" title="Next Lead" tertiary />
        <PrimaryButton type="button" title="Previous Lead" tertiary />
        <PrimaryButton type="submit" title="Save & Exit" tertiary />
        <PrimaryButton type="submit" title="Save" tertiary />
      </HStack>
    </Box>
  );
};

export default CustomerContactHeader;
