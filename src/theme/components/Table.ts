import { theme as ChakraTheme, ComponentStyleConfig } from "@chakra-ui/react";

export const TableConfig: ComponentStyleConfig = {
  sizes: {
    md: {
      th: {
        px: 4,
        py: 4,
      },
    },
  },
  variants: {
    striped: props => ({
      ...ChakraTheme.components.Table.variants?.striped(props),
      th: {
        ...ChakraTheme.components.Table.variants?.striped(props).th,
        color: "black",
        bg: "white",
        "&:first-of-type": {
          borderTopLeftRadius: 6,
        },
        "&:last-child": {
          borderTopRightRadius: 6,
        },
      },
      tbody: {
        tr: {
          color: "gray.600",
          "&:nth-of-type(odd)": {
            ...ChakraTheme.components.Table.variants?.striped(props).tbody.tr[
              "&:nth-of-type(odd)"
            ],

            td: {
              background: "white",
            },
          },
          "&:nth-of-type(even)": {
            td: {
              background: "white",
            },
          },
        },
      },
    }),
  },

  defaultProps: {
    size: "md",
    variant: "striped",
  },
};
