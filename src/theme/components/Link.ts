import { ComponentStyleConfig, theme as ChakraTheme } from "@chakra-ui/react";

export const InputConfig: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 500,
    borderRadius: 8,
  },
  variants: {
    default: props => ({
      ...ChakraTheme.components.Link.variants,
      field: {
        ...ChakraTheme.components.Input.variants?.outline(props).field,
        _focusVisible: {
          ...ChakraTheme.components.Input.variants?.outline(props).field
            ._focusVisible,
          borderColor: "purple.500",
        },
      },
      addon: {
        ...ChakraTheme.components.Input.variants?.outline(props).addon,
      },
    }),
  },

  defaultProps: {
    variant: "default",
  },
};
