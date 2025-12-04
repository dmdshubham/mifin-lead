import { ComponentStyleConfig, theme as ChakraTheme } from "@chakra-ui/react";

export const InputConfig: ComponentStyleConfig = {
  baseStyle: {
    fontWeight: 500,
    borderRadius: 8,
  },
  variants: {
    default: props => ({
      ...ChakraTheme.components.Input.variants?.outline(props),
      field: {
        ...ChakraTheme.components.Input.variants?.outline(props).field,
        _focusVisible: {
          ...ChakraTheme.components.Input.variants?.outline(props).field
            ._focusVisible,
            borderColor: "purple.500 !important",
        },
      },
      addon: {
        ...ChakraTheme.components.Input.variants?.outline(props).addon,
      },
    }),
    flushed: props => ({
      ...ChakraTheme.components.Input.variants?.flushed(props),
      field: {
        ...ChakraTheme.components.Input.variants?.flushed(props).field,
        overflowY: "visible",
      },
    }),
  },

  defaultProps: {
    size: "md",
    variant: "default",
  },
};
