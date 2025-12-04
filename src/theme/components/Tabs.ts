const Tabs = {
  variants: {
    ["soft-rounded"]: {
      tab: {
        border: "1.5px solid",
        borderColor: "purple.400",
        color: "purple.700",
        mr: 2,
        _selected: {
          color: "purple.50",
          bg: "purple.400",
          fontWeight: "500",
          fontsize: "16px",
        },
      },
    },
  },
};

export const TabsComponent = {
  components: {
    Tabs,
  },
};
