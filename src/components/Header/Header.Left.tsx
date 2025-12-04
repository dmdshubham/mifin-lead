import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Heading,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { getMobileSidebarDetails } from "../LayoutWrapper";
import mobilelogo from "@mifin/assets/svgs/mobileLogo.png";
import { useTranslation } from "react-i18next";
import leftarrow from "@mifin/assets/icons/leftArrow.png";
import { useLocation, useSearchParams } from "react-router-dom";
import { headerHeadingStyling, headerImageStyling } from "@mifin/theme/style";
import { LeftHeaderProps } from "@mifin/Interface/components";
import { getCorrectImageUrl } from "@mifin/utils/getCorrectImgUrl";
import { useLoanStatusForAllScreen } from "@mifin/store/useLoanStatusForAllScreen";

export const LeftHeader: FC<LeftHeaderProps> = ({ isDrawerOpen }) => {
  const { t } = useTranslation();
  const gg = getMobileSidebarDetails();
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const [path, setpathName] = useState<string>("");
  const [Case] = useSearchParams();
  const location = useLocation();
  const pathName = location.pathname;
  const route = Case.get("case") ? Case.get("case") : pathName.replace("/", "");
  const { updateHideValidationComponent } = useLoanStatusForAllScreen();

  useEffect(() => {
    if (!pathName.includes("contact")) {
      sessionStorage.setItem("isConverted", "false");
      updateHideValidationComponent(false);
    }
    switch (route) {
      case "newlead":
        setpathName(t("common.newLead"));
        break;
      case "search-and-allocate":
        setpathName(t("common.searchAndAllocate"));
        break;
      case "dailyReport":
        setpathName(t("common.dailyReport"));
        break;
      case "Contact":
        setpathName(t("common.contact"));
        break;
      case "Customer":
        setpathName(t("common.customer"));
        break;
      case "Product":
        setpathName(t("common.product"));
        break;
      case "Notepad":
        setpathName(t("common.notepad"));
        break;
      case "Document":
        setpathName(t("common.document"));
        break;
      case "Dunning":
        setpathName(t("common.dunning"));
        break;
      case "myLeads":
        setpathName(t("common.myLeads"));
        break;
      case "Escalated":
        setpathName(t("common.escalated"));
        break;
      case "Reffered":
        setpathName(t("common.reffered"));
        break;
      case "":
        setpathName(t("common.worklist"));
        break;
      case "dashboard":
        setpathName(t("common.dashboard"));
        break;
      default:
        setpathName("");
    }
  }, [route, localStorage.getItem("language")]);

  return (
    <Flex align="center" columnGap={4}>
      {/* <Box height={12} display={isDrawerOpen ? "none" : "block"}>
        <Image
          src={getCorrectImageUrl(mobilelogo)}
          alt="logo"
          width={"100%"}
          height="100%"
        />
      </Box> */}
      <Heading sx={headerHeadingStyling}>{path}</Heading>
      <Box display={{ sm: "block", md: "none" }}>
        {isMobile ? (
          <Image
            src={getCorrectImageUrl(leftarrow)}
            alt="arrow"
            _hover={{ cursor: "pointer" }}
            onClick={gg?.onOpen}
            sx={headerImageStyling}
          />
        ) : (
          <RxHamburgerMenu onClick={gg?.onOpen} fontSize="24px" />
        )}
      </Box>
    </Flex>
  );
};
