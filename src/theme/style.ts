import { MifinColor } from "@mifin/theme/color";
import { rem, em } from "@mifin/utils/convertToRem";

export const dividerStyling = {
  orientation: "horizontal",
  // margintop: "40px",
  borderColor: MifinColor.gray_50,
};

export const formLabelStyling = {
  fontWeight: "400",
  fontSize: rem(14),
  lineHeight: "1.5",
  paddingBottom: "1",
  color: "#000000B3",
};

export const gapLayoutStyling = {
  gap: "30px",
};

export const headingStyling = {
  fontWeight: "700",
  fontSize: { base: "18px", md: "18px" },
  color: "#3E4954",
  lineHeight: "2.25",
  marginBottom: "-7px",
  marginLeft: "-4px",
};

export const personalDetailsGridStyling = {
  gap: { base: "12px", md: "30px" },
  marginTop: "22px",
  marginBottom: "56px",
};

export const leadGridStyling = {
  gap:         { base: "12px", md: "30px" },
  marginTop:    "22px",
  marginBottom: "56px",
};

export const apiToastStyling = {
  borderRadius: "15px",
  bottom: rem(25),
  padding: em(20),
  position: "fixed",
  zIndex: "999",
  color: "white",
  width: "max-content",
};

export const collapeStyling = {
  borderRadius: 15,
  paddingLeft: 5,
  border: "1px solid #E5EAF2",
  marginTop: 1,
};

export const profileLightTextStyling = {
  fontSize: rem(12),
  fontWeight: "400",
  color: "#3E4954",
  marginRight: rem(9),
};

export const profileTextStyling = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#000",
  paddingRight: "20px",
  borderRight: "1px solid lightgray",
};

export const profileBoxStyling = {
  border: "1px solid #E5EAF2",
  borderRadius: "20px",
  marginTop: 4,
  width: "100%",
  color: "#000000",
  alignItems: "flex-start",
  margin: "0px",
};

export const profileImageStyling = {
  height: "100%",
  width: "100%",
  borderRadius: "20px",
  border: "1px solid #E5EAF2",
};

export const profileFlexStyling = {
  alignItems: "center",
  marginBottom: 4,
  flexGrow: 1,
  maxHeight: rem(50),
  margin: "20px",
};

export const profilePopoverContentStyling = {
  marginTop: 2,
  maxWidth: rem(155),
  borderRadius: 2,
  border: "#E5EAF2",
};

export const profileOverAllProgressStyling = {
  flexGrow: 1,
  paddingLeft: 5,
  maxHeight: rem(50),
  borderLeft: "1px solid lightgray",
};

export const profileOverAllProgressTextStyling = {
  fontSize: rem(15),
  fontWeight: "700",
  paddingRight: "12px",
  color: "#3E4954",
  marginTop: "8px",
};

export const profileProgressStyling = {
  colorScheme: "green",
  height: 5,
  value: 40,
  borderRadius: 16,
};

export const profileLoanStatusTextStyling = {
  flexGrow: 1,
  paddingLeft: 5,
  maxHeight: rem(50),
  borderLeft: "1px solid lightgray",
};

export const profilePendingBtnStyling = {
  margin: "7px 22px 42px 0px",
  borderRadius: "4px",
  width: rem(84),
  height: rem(23),
  backgroundColor: "#F17E14",
};

export const profileBoxsStyling = {
  display: "flex",
  padding: "0px 20px 12px 0px",
  weight: 400,
  fontSize: rem(12),
  color: "#3E4954",
  fontWeight: "bold",
};

export const profilePopoverArrowStyling = {
  justifyContent: "space-between",
  paddingLeft: 6,
  paddingRight: 6,
  paddingTop: 4,
  paddingBottom: 3,
};

export const errorBoxStyling = {
  right: "10%",
  transform: "translateX(50%)",
  bottom: "25px",
  px: "20px",
  py: "20px",
  position: "fixed",
  zIndex: "999",
  color: "white",
  width: "max-content",
};

export const errorFlexStyling = {
  backgroundColor: "#eed202",
  color: "black",
  fontWeight: 400,
  fontSize: "15px",
  borderRadius: "20px",
  px: 4,
  py: 1,
};

export const errorListItemStyling = {
  color: "whiteAlpha.800",
  fontWeight: 400,
  fontSize: rem(13),
  textTransform: "capitalize",
};

export const errorValidationStyling = {
  borderRadius: rem(15),
  right: rem(50),
  bottom: rem(25),
  position: "fixed",
  zIndex: "999",
  padding: rem(3),
  transition: "all 0.5s ease-in-out",
};

export const errorValidationBoxStyling = {
  borderRadius: rem(10),
  color: "white",
  backgroundColor: "red",
  fontSize: rem(12),
  padding: "3px 5px",
};

export const footerTextStyling = {
  opacity: "70%",
  fontWeight: 400,
  fontSize: rem(14),
};

export const footerBoxStyling = {
  paddingRight: 3,
  opacity: "70%",
  fontWeight: 400,
  fontSize: rem(14),
};

export const headerHeadingStyling = {
  fontWeight: "bold",
  fontSize: rem(26),
  filter: "drop-shadow(-1px 0px 0px #3E4954)",
};

export const headerImageStyling = {
  height: rem(12),
  width: rem(6),
  margin: "0px 12px 0px 6px",
};

export const headerRightBoxsStyling = {
  marginTop: "3",
  width: rem(120),
  height: rem(47),
};

export const headerNotificationStyling = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: -2,
  variant: "solid",
  boxSize: rem(20),
  right: -2,
  borderRadius: "50%",
  backgroundColor: "red",
};

export const headerMenuButtonStyling = {
  borderRadius: 15,
  textTransform: "none",
  cursor: "pointer",
};

export const headerRightBoxStyling = {
  flexDirection: "column",
  alignItems: "flex-end",
  marginLeft: 8,
};

export const headerTextStyling = {
  fontSize: "lg",
  fontWeight: "normal",
  color: "gray.500",
  borderColor: "gray.400",
  px: 2.5,
};

export const keyContactTextStyling = {
  color: "rgba(0,0,0,0.6)",
  marginTop: "1.25rem",
};

export const layoutBoxStyling = {
  display: "flex",
  flexDirection: "column",
  width: "80vw",
  maxWidth: rem(2000),
  margin: "0 auto",
  boxShadow: "0 0 10px 0 rgba(0,0,0,0.5)",
  flexGrow: 1,
};

export const layoutChildBoxStyling = {
  paddingTop: 0,
  paddingBottom: 6,
  height: "full",
  display: "flex",
  position: "relative",
  flexDirection: "column",
};

export const leadStatuseFlexStyling = {
  marginTop: "8",
  marginBottom: "8",
  justify: "space-between",
};

export const leadDetailsHeadingStyling = {
  fontSize: { base: "18px", md: "18px" },
  fontWeight: "700",
};

export const personalDetailsHeadingStyling = {
  marginTop: { base: "1", md: "19" },
  fontSize: { base: "18px", md: "18px" },
  fontWeight: "700",
};

export const simpleGridStyling = {
  gap: { base: "15px", md: rem(31) },
  marginTop: { base: "10px", md: rem(56) },
  marginBottom: { base: "10px", md: rem(56) },
};

export const errorTextStyle = {
  color: "#e53e3e",
  fontSize: "sm",
};

export const addButtonStyle = {
  hoverState: {
    cursor: "pointer",
    backgroundColor: "transparent",
  },
};

export const popoverStyling = {
  minWidth: { base: "100px", md: rem(450) },
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
  padding: 2,
  borderRadius: rem(14),
};

export const convertToCustomerBoxStyling = {
  display: "flex",
  justifyContent: "end",
};

export const nextPreviousButtonStyle = {
  backgroundColor: "#F2F1F1",
};

export const tabBoxStyling = {
  display: { base: "none", md: "flex" },
  justifyContent: "space-between",
  alignItems: "flex-start",
};

export const tabStyling = {
  backgroundColor: "#EEF0F6",
  borderRadius: "12px",
  fontWeight: "500",
};

export const tabListStyling = {
  display: "flex",
  gap: "3",
  justifyContent: "space-between",
  border: "none",
  marginBottom: "8",
};

export const dashboardGridStyling = {
  columnGap: 8,
  rowGap: 6,
  marginBottom: 4,
};

export const dashboardBoxStyling = {
  border: "1px solid #E5EAF2",
  borderRadius: 15,
  padding: "16px 20px 30px 20px",
};

export const loginFlexStyling = {
  flexDirection: "column",
  width: "100wh",
  height: "100vh",
  backgroundColo: "gray.200",
  justifyContent: "center",
  alignItems: "center",
};

export const loginStackStyling = {
  flexDirection: "column",
  marginBottom: "2",
  justifyContent: "center",
  alignItems: "center",
};

export const loginInnerStackStyling = {
  spacing: 4,
  padding: "3rem",
  backgroundColor: "whiteAlpha.900",
  boxShadow: "md",
  borderRadius: "20",
};

export const portalStyle = {
  backgroundColor: "#272937",
  padding: "1.25rem",
  borderRadius: "1rem",
  color: "white",
  maxWidth: "max-content",
};

export const refStyling = {
  position: "fixed",
  bottom: rem(4),
  right: rem(1),
};

export const reallocationPopoverStyling = {
  minWidth: "16rem",
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
  padding: 2,
  borderRadius: rem(14),
};

export const worklistTabBoxStyling = {
  marginLeft: 2,
  borderRadius: rem(6),
  color: MifinColor.white,
};

export const worklistTextStyling = {
  fontWeight: 400,
  fontSize: rem(11),
  px: 1,
};

export const worklistMyLeadStyling = {
  marginLeft: 2,
  borderRadius: "6px",
  backgroundColor: MifinColor.blue_300,
  color: MifinColor.white,
};

export const searchAndAllocateTabStyling = {
  color: "#2F4CDD",
  fontWeight: "700",
  fontSize: rem(16),
  borderBottom: "2px solid #2F4CDD",
  lineHeight: em(22),
};

export const searchAndAllocateHeadingStyling = {
  color: "#3E4954",
  fontSize: { base: "20px", md: "24px" },
  fontWeight: "bold",
  marginTop: "4",
};

export const searchAndAllocateAllocatToHeadingStyling = {
  marginTop: "10",
  marginBottom: "8",
  color: "#3E4954",
  fontSize: { base: "18px", md: "18px" },
};

export const formControlStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "6",
};

export const tabStyle = {
  base: {
    backgroundColor: "#EEF0F6",
    borderRadius: "12px",
    fontWeight: "500",
  },
  selected: {
    color: "white",
    backgroundColor: "#3E4954",
  },
};

export const escalatedLeadStatusBoxStyling = {
  marginTop: "8",
  marginBottom: "8",
  justify: "space-between",
};

export const searchFormBoxStyling = {
  backgroundColor: "#F7F8F9",
  borderRadius: "12",
};
