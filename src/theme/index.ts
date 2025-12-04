import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

import { ButtonConfig } from "./components/Button";
import { InputConfig } from "./components/Input";
import { TableConfig } from "./components/Table";
export { globalStyles } from "./Global";

export const theme = extendTheme(
  {
    fonts: {
      heading: "Poppins",
      body: "Poppins",
    },
    shadows: { outline: "0 0 0 3px var(--chakra-colors-purple-100)" },
    components: {
      Button: ButtonConfig,
      Input: InputConfig,
      Table: TableConfig,
      Popover: {
        variants: {
          responsive: {
            content: { width: "auto", borderRadius: "20px" },
            popper: {
              maxWidth: "unset",
              width: "unset",
            },
          },
        },
      },
    },

    breakpoints: {
      sm: "320px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
      "2xl": "1536px",
    },

  //   styles:{
  //     global:{
  //       "input:-webkit-autofill": {
  //         bg:"white!important",
  //         webkitBoxShadow:"0 0 0 1000px white inset",
  //         color:"black ! important"
  //     },
  //   },
  // },

  },
  withDefaultColorScheme({
    colorScheme: "#2F4CDD",
    components: ["Tab"],
  })
);
