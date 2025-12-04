import { ComponentStyleConfig, theme as ChakraTheme } from "@chakra-ui/react";

export const ButtonConfig: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 500,
    borderRadius: 8,
    padding: 2,
    lineHeight: 0,
  },
  variants: {
    default: props => ({
      ...ChakraTheme.components.Button.variants?.solid(props),
      bg: "purple.500",
      letterSpacing: "0.4px",
      lineHeight: 0,
      color: "white",
      _hover: {
        bg: "purple.600",
        _disabled: {
          bg: "purple.400",
        },
      },
      _active: {
        bg: "purple.400",
      },
    }),
    error: {
      color: "red",
      backgroundColor: "red.100",
      _hover: {
        backgroundColor: "red.200",
      },
    },
  },

  defaultProps: {
    size: "md",
    variant: "default",
  },
};
