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
      
        bg:"white",
        
        _focusVisible: {
          ...ChakraTheme.components.Input.variants?.outline(props).field
            ._focusVisible,
            bg: "white !important",
          borderColor: "purple.500",
          boxShadow: "0 0 0 1px #805AD5",
          BoxShadow: "0 0 0px 1000px white inset",
          color: "black !important",
        },
        _hover:{
          bg:"white",
        },
        _active:{
          bg:"white",
        },
        _selected:{
          bg:"white",
        },
        _autofill: {
          bg: "white !important", 
          BoxShadow: "0 0 0px 1000px white inset !important",
          color: "black !important",
          transition: "background-color 5000s ease-in-out 0s !important",
        },
      },
      addon: {
        ...ChakraTheme.components.Input.variants?.outline(props).addon,
      },
    }),
  },

  defaultProps: {
    size: "md",
    variant: "default",
  },
};
