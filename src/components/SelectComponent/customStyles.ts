import chakraUiTheme from "@chakra-ui/theme";
import { PropsValue, StylesConfig } from "react-select";

const fontSizes = {
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
};

const paddings = {
  sm: "6px 9px",
  md: "8px 12px",
  lg: "10px 15px",
};

const px = {
  sm: "0.75rem",
  md: "1rem",
  lg: "1rem",
};

/* When disabled, react-select sets the pointer-state to none
   which prevents the `not-allowed` cursor style from chakra
    from getting applied to the Control  */

export const customStyles: StylesConfig = {
  container: (
    provided,
    { selectProps: { hideContainerBorder, isSingleTimeDropdown } }
  ) => ({
    ...provided,
    pointerEvents: "auto",
    //flex: 1,
    width: isSingleTimeDropdown ? "60px" : "100%",
    borderColor: hideContainerBorder ? "red" : "",
    height: "100%",
    borderWidth: "1px",
    borderRadius:"4px",
    borderBottom: "none", 
  }),
  input: (provided, { selectProps: { size } }) => ({
    ...provided,
    color: "inherit",
    lineHeight: "inherit",
    margin: "0px",
    fontSize: fontSizes[size ?? "sm"],
    height: "35px",
    background: "none",
  }),
  menu: (provided, { selectProps: { isSingleTimeDropdown } }) => ({
    ...provided,
    zIndex: 3,
    boxShadow: `0 0 0 1px ${chakraUiTheme.colors.gray["200"]}, 0 1px 1px ${chakraUiTheme.colors.gray["200"]}`,
    width: isSingleTimeDropdown ? "80px" : "100%",
    borderRadius: "6px",
  }),
  option: (provided, { selectProps: { size } }) => ({
    ...provided,
    fontSize: fontSizes[size ?? "sm"],
  }),
  control: (
    provided,
    { selectProps: { isSingleTimeDropdown, inheritControlBG }, isDisabled }
  ) => ({
    ...provided,
    border: "1px solid transparent",
    borderBottom: " 1px solid rgba(0, 0, 0, 0.15)",
    // borderRadius: "0",
    background: "transparent",
    ...(isDisabled && inheritControlBG ? { backgroundColor: "inherit" } : {}),
     cursor: isDisabled ? "not-allowed" : "pointer", 
    // "&:hover": {
    //   border: "1px solid",
    //   borderColor: "#80808052",
    //   borderRadius: "6px",
    //   backgroundColor: isSingleTimeDropdown
    //     ? `${chakraUiTheme.colors.gray["100"]}`
    //     : "inherit",
    //   ...(isDisabled
    //     ? {
    //         cursor: "not-allowed",
    //         backgroundColor: "gray.100",
    //       }
    //     : {}),
    //   "&:focus": {
    //     borderColor: "red",
    //     boxShadow: "0 0 0 1px gray",
    //     backgroundColor: isSingleTimeDropdown
    //       ? `${chakraUiTheme.colors.gray["100"]}`
    //       : "inherit",
    //     ...(isDisabled
    //       ? {
    //           cursor: "not-allowed",
    //           backgroundColor: "gray.100",
    //         }
    //       : {}),
    //   },
    // },
    //borderRadius: hasInputAddon ? "0px 6px 6px 0px" : "6px",
    flex: 1,
  }),
  dropdownIndicator: (provided, { selectProps: { hideDropdownArrow } }) => {
    if (hideDropdownArrow) {
      return {
        display: "none",
      };
    } else {
      return { ...provided };
    }
  },
  valueContainer: (
    provided,
    {
      selectProps: {
        size,
        formatOptionLabel,
        disableLeftPaddingInValueContainer,
        value,
        isMulti,
      },
    }
  ) => {
    let padding = `0.125rem ${px[size ?? "sm"]}`;
    if (
      formatOptionLabel && isMulti ? (value as PropsValue<any>)?.length : value
    ) {
      padding = `0.125rem ${px[size ?? "sm"]}`;
    }
    if (disableLeftPaddingInValueContainer) {
      padding = `0.41rem 0 0.41rem 0.25rem`;
    }
    return {
      ...provided,
      padding,
      overflow: "visible",
      fontSize: `${fontSizes[size ?? "sm"]}`,
    };
  },
  placeholder: (provided, state) => ({
    ...provided,
    color: "grey",
    display:
      state.isFocused || state.hasValue || state.selectProps.inputValue
        ? "none"
        : "block",
    fontSize: "12px",
  }),
 
  multiValueRemove: (
    provided,
    { selectProps: { disableMultiValueRemove }, isDisabled }
  ) => ({
    ...provided,
    ...(isDisabled && disableMultiValueRemove
      ? {
          visibility: "hidden",
          width: "4px",
        }
      : {}),
  }),
  multiValue: (
    provided,
    { selectProps: { hasInputAddon, hideSelectedValues, inheritMultiValueBG } }
  ) =>
    hasInputAddon
      ? {
          ...provided,
          borderRadius: "6px",
          backgroundColor: inheritMultiValueBG ? "inherit" : "#F1F3F6",
          padding: "4px 8px",
        }
      : hideSelectedValues
      ? { ...provided, display: "none" }
      : { ...provided },
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: provided => ({
    ...provided,
    color: chakraUiTheme.colors.gray["200"],
    "&:hover": {
      color: chakraUiTheme.colors.gray["200"],
    },
  }),
  loadingMessage: (provided, { selectProps: { size } }) => {
    return {
      ...provided,
      fontSize: fontSizes[size ?? "sm"],
      padding: paddings[size ?? "sm"],
    };
  },
};
