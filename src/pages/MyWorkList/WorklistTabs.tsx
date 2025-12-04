import { Box, Tab, TabList, Text } from "@chakra-ui/react";
import { MifinColor } from "@mifin/theme/color";
import { useTranslation } from "react-i18next";
import { FC } from "react";
import { useSearchParams } from "react-router-dom";
import { ILMSWorklistTabsProps } from "@mifin/Interface/myWorklist";
import {
  worklistTabBoxStyling,
  worklistTextStyling,
  worklistMyLeadStyling,
} from "@mifin/theme/style";

const LMSWorklistTabs: FC<ILMSWorklistTabsProps> = () => {
  const { t } = useTranslation();
  const [, setCase] = useSearchParams();

  // useEffect(() => {
  //   // Call the API on component mount
  //   const fetchData = async () => {
  //     const response = await LeadListData(searchData);

  //     if (response?.responseData) {
  //       console.log("response", response);
  //     }
  //   };
  //   fetchData();
  // }, [LeadListData]);

  return (
    <TabList>
      <Tab
        onClick={() => {
          setCase({ case: "myLeads" });
        }}
        fontSize={"14px"}
        fontFamily={"Poppins"}
        fontWeight={700}
        color={"#3e4954"}
      >
        {t("worklist.myLeads")}
        <Box display={{ sm: "none", md: "flex" }} sx={worklistMyLeadStyling}>
          <Text fontWeight={400} fontSize="11px" px={1}></Text>
        </Box>
      </Tab>
      <Tab
        onClick={() => {
          setCase({ case: "Escalated" });
        }}
        fontSize={"14px"}
        fontFamily={"Poppins"}
        fontWeight={700}
        color={"#3e4954"}
      >
        {t("worklist.escalated")}
        <Box
          display={{ sm: "none", md: "flex" }}
          backgroundColor={MifinColor.gray_100}
          sx={worklistTabBoxStyling}
        >
          <Text sx={worklistTextStyling}></Text>
        </Box>
      </Tab>
      <Tab
        onClick={() => {
          setCase({ case: "Reffered" });
        }}
        fontSize={"14px"}
        fontFamily={"Poppins"}
        fontWeight={700}
        color={"#3e4954"}
      >
        {t("worklist.reffered")}
        <Box
          display={{ sm: "none", md: "flex" }}
          backgroundColor={MifinColor.primary_red}
          sx={worklistTabBoxStyling}
        >
          <Text sx={worklistTextStyling}></Text>
        </Box>
      </Tab>
    </TabList>
  );
};

export default LMSWorklistTabs;
