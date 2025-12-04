import { DatepickerStyleProps } from "@mifin/Interface/components";

const styleText = {
  background: "#3182ce",
  fontWeight: "normal",

  "&:hover": {
    background: "#2a69ac",
  },
};

const styleColor = { borderColor: "#e2e8f0" };


export const useDatepickerStyles = ({ noBorder }: DatepickerStyleProps) => ({
  "&": {
    ".react-datepicker": {
      position: "relative",
      overflow: "hidden",
      borderColor: noBorder ? "#CBD5E0" : "inherit",
      fontSize: "sm",
    },

    ".react-datepicker__day": {
      width: 7,
      height: 7,
      my: 1,
      mx: 1,
      color: "gray.950",
      fontWeight: "light",
      "&:hover": {
        background: "#edf2f7",
      },
    },

    ".react-datepicker__day--outside-month": { color: "gray.700" },

    ".react-datepicker__day-name": {
      textTransform: "uppercase",
      color: "gray.700",
      width: 8,
    },

    ".react-datepicker__week": { py: 0.5 },

    ".react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button)":
      {
        right: "90px",
      },

    ".react-datepicker__navigation--previous": {
      height: 1,
      borderRightColor: "#cbd5e0",

      "&:hover": {
        borderRightColor: "#a0aec0",
      },
    },
    ".react-datepicker__navigation--next": {
      height: 1,
      borderLeftColor: "#cbd5e0",

      "&:hover": {
        borderLeftColor: "#a0aec0",
      },
    },

    ".react-datepicker-wrapper": {
      display: "block",
    },
    ".react-datepicker__input-container": {
      display: "block",
    },

    ".react-datepicker__header": {
      borderRadius: 0,
      background: "transparent",
      border: "none",
      padding: 0,
      ...styleColor,
    },

    ".react-datepicker__time-container": styleColor,

    ".react-datepicker__current-month": {
      fontSize: "inherit",
      fontWeight: "small",
    },
    ".react-datepicker-time__header": {
      fontSize: "inherit",
      fontWeight: "small",
    },
    ".react-datepicker-year-header": {
      fontSize: "inherit",
      fontWeight: "small",
    },
    ".react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box":
      {
        width: "180px",
        textAlign: "left",
      },
    ".react-datepicker__time-container ": {
      width: "180px",
      textAlign: "left",
    },

    ".react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item":
      {
        margin: "0 1px 0 0",
        height: "auto",
        padding: "10px 15px",

        "&:hover": {
          background: "#edf2f7",
        },
      },

    ".react-datepicker__day--selected": { ...styleText, borderRadius: "full" },
    ".react-datepicker__day--keyboard-selected": { borderRadius: "full" },
    ".react-datepicker__day--in-selecting-range": styleText,
    ".react-datepicker__day--in-range": styleText,
    ".react-datepicker__month-text--selected": styleText,
    ".react-datepicker__month-text--in-selecting-range": styleText,
    ".react-datepicker__month-text--in-range": styleText,
    ".react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected":
      styleText,
  },
});
