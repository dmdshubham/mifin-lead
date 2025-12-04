import { ComponentStyleConfig, theme as ChakraTheme } from "@chakra-ui/react";

export const SelectConfig: ComponentStyleConfig = {
  baseStyle: {
    field: {
      fontWeight: 500,
      borderRadius: 8,
    },
  },
  variants: {
    default: {
      field: {
        // Base: bottom border only
        border: "none",
        borderBottom: "1px solid gray",
        backgroundColor: "white",
        transition: "all 0.2s ease-in-out",
        textTransform: "uppercase",

        // Hover: full gray outline
        _hover: {
          border: "1px solid gray",
          boxShadow: "none",
        },

        // Focus/Click: 2px blue outline
        _focusVisible: {
          border: "2px solid blue",
          boxShadow: "0px 0px 4px 1px rgba(0, 122, 255, 0.5)",
        },
      },
    },
  },
  defaultProps: {
    variant: "default", // by default sabhi <Select> is variant ko use karenge
  },
};

