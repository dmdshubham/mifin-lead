import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import { NAVIGATION_ROUTES } from "@mifin/routes/routes.constant";
import { MifinColor } from "@mifin/theme/color";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaRegEdit } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import Logo from "@mifin/assets/svgs/logo.png";
import mifin from "@mifin/assets/svgs/mifin-logo.png";
import { getMobileSidebarDetails } from "@mifin/components/LayoutWrapper";
import { NavItem, NavItem2 } from "@mifin/components/Sidebar/NavItem";
import { ISidebarProps } from "@mifin/Interface/components";
import { getCorrectImageUrl } from "@mifin/utils/getCorrectImageUrl";
import { useFetchleadList } from "@mifin/service/mifin-getLeadDetails";
import { useSearchStore } from "@mifin/store/apiStore";
import DashboardIcon from "@mifin/assets/svgs/icons-grey/dashboard.svg";
import WorklistIcon from "@mifin/assets/svgs/icons-grey/my-worklist.svg";
import ReportsIcon from "@mifin/assets/svgs/icons-grey/Reports.svg";
import DashboardIconActive from "@mifin/assets/svgs/icons-white/dashboard.svg";
import WorklistIconActive from "@mifin/assets/svgs/icons-white/my-worklist.svg";
import ReportsIconActive from "@mifin/assets/svgs/icons-white/Reports.svg";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";

const DASHBOARD_REDIRECT_URL =
  "../mifin/llmDashboard.do?actionPerformed=getDashboard";

const Sidebar: FC<ISidebarProps> = props => {
  const { navSize, handleDrawerToggle } = props;
  const location = useLocation();
  const { t } = useTranslation();
  const gg = getMobileSidebarDetails();
  const { userDetails } = useSearchStore();
  const formData = {
    ...MASTER_PAYLOAD,
    requestData: {
      iDisplayStart: "0",
      iDisplayLength: "10",
      sEcho: "1",
      leadsSearchDetail: {
        requestType: "myLead",
      },
    },
  };
  const { data } = useFetchleadList(formData);
  const checkLocation = (expectedLocation: string) => {
    if (expectedLocation === location.pathname) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    checkLocation(location.pathname);
  }, [location.pathname]);

  const redirect = (event, url) => {
    if (event.type == "click") {
      // window.location.href = url;
      window.open(url, "_blank");
    }
  };

  const uid = `?id=${Math.floor(Math.random() * 10) + 1}`;

  const navItems = [
    {
      name: t("common.dashboard"),
      icon: DashboardIcon,
      iconActive: DashboardIconActive,
      isActive: checkLocation(NAVIGATION_ROUTES.DASHBOARD),
      to: NAVIGATION_ROUTES.DASHBOARD + uid,
      visible: true,
    },
    {
      name: t("common.newLead"),
      icon: DashboardIcon,
      iconActive: DashboardIconActive,
      isActive: checkLocation(NAVIGATION_ROUTES.LEAD),
      to: NAVIGATION_ROUTES.LEAD + uid,
      visible: true,
    },
    {
      name: t("common.worklist"),
      icon: WorklistIcon,
      iconActive: WorklistIconActive,
      isActive: checkLocation(NAVIGATION_ROUTES.WORKLIST),
      to: NAVIGATION_ROUTES.WORKLIST + uid,
      visible: true,
    },
    {
      name: t("common.searchAndAllocate"),
      icon: DashboardIcon,
      iconActive: DashboardIconActive,
      isActive: checkLocation(NAVIGATION_ROUTES.SEARCH_AND_ALLOCATE),
      to: NAVIGATION_ROUTES.SEARCH_AND_ALLOCATE + uid,
      visible: true,
    },
    {
      name: t("common.dailyReport"),
      icon: ReportsIcon,
      iconActive: ReportsIconActive,
      isActive: checkLocation(NAVIGATION_ROUTES.DAILYREPORT),
      to: NAVIGATION_ROUTES.DAILYREPORT + uid,
      visible: true,
    },
    {
      name: t("common.salesMis"),
      icon: ReportsIcon,
      iconActive: ReportsIconActive,
      click: event => redirect(event, data?.SALES_MIS),
      visible: true,
      newTab: true,
    },
    {
      name: t("common.convertedLeads"),
      icon: ReportsIcon,
      iconActive: ReportsIconActive,
      click: event => redirect(event, data?.convertedLead),
      visible: true,
      newTab: true,
    },
    {
      name: t("common.freshLeads"),
      icon: ReportsIcon,
      iconActive: ReportsIconActive,
      click: event => redirect(event, data?.freshLead),
      visible: true,
      newTab: true,
    },
    {
      name: t("common.travelSummary"),
      icon: ReportsIcon,
      iconActive: ReportsIconActive,
      click: event => redirect(event, data?.TRAVEL_SUMMARY),
      visible: true,
      newTab: true,
    },
    {
      name: t("common.missedAction"),
      icon: ReportsIcon,
      iconActive: ReportsIconActive,
      click: event => redirect(event, data?.MISSED_FOLLOWUPS),
      visible: true,
      newTab: true,
    },
    // {
    //   name: t("common.backToCollection"),
    //   icon: DashboardIcon,
    //   isActive: false,
    //   to: NAVIGATION_ROUTES.RETURN_TO_COLLECTION,
    //   visible: true,
    //   click: (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    //     e.preventDefault();
    //     window.location.replace("collection");
    //   },
    // },
  ];

  return (
    <Flex
      pos="sticky"
      top={0}
      bottom={0}
      h={"100vh"}
      zIndex={99}
      w={
        navSize == "small"
          ? "100px"
          : { sm: "auto", lg: "220px", xl: "240px", "2xl": "260px" }
      }
      flexDir="column"
      justifyContent="space-between"
      bg={MifinColor.blue_200}
      transition="all .25s ease-in-out"
      flexShrink={0}
      overflowY="auto"
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Flex
        flexDir="column"
        w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        as="nav"
        transition="all 0.25s ease-in-out"
      >
        <Box
          // backgroundColor={MifinColor.black}
          width="100%"
          w="full"
          h={{ base: "60px", md: "80px" }}
          display="flex"
          alignItems="center"
          justifyContent="start"
        >
          <IconButton
            size="xl"
            variant="link"
            aria-label="Minify sidebar"
            color="inherit"
            onClick={() => {
              handleDrawerToggle();
              gg.onClose();
            }}
            display={{ base: "none", md: "block" }}
            paddingX={navSize === "small" ? "34px" : "24px"}
          >
            <RxHamburgerMenu
              style={{
                height: "24px",
                width: "24px",
                color: "white",
              }}
            />
          </IconButton>
          {/* <Link as={RouterLink} to={NAVIGATION_ROUTES.DASHBOARD}> */}
          <Tooltip
            style={{ width: "100px" }}
            hasArrow
            label="Go back on old mifin application"
          >
            <>
              <HStack
                onClick={() => (window.location.href = DASHBOARD_REDIRECT_URL)}
                display={navSize == "small" ? "none" : "flex"}
              >
                <Box height={42}>
                  <Image
                    alt={"logo"}
                    src={Logo}
                    objectFit="contain"
                    w="100%"
                    h="100%"
                    ml={{ base: "25px", md: "0px" }}
                  />
                </Box>
                <Box height={42} marginLeft={2}>
                  <Image
                    alt={"mifin"}
                    src={getCorrectImageUrl(mifin)}
                    objectFit="contain"
                    w="100%"
                    h="100%"
                    pt={"2px"}
                    ml={{ base: "13px", md: "0px" }}
                  />
                </Box>
              </HStack>
            </>
          </Tooltip>
          {/* </Link> */}
        </Box>
        {navItems.map(
          ({ name, icon, iconActive, to, isActive, child, visible, click }) => {
            if (child) {
              return (
                <Box width={"100%"} key={name} alignItems={"center"}>
                  <NavItem2
                    child={child}
                    navSize={navSize}
                    icon={icon}
                    title={name}
                    iconActive={iconActive}
                    active={isActive}
                    visible={visible}
                    iconChild={icon}
                    click={click}
                  />
                </Box>
              );
            }
            return (
              <Box
                width={"100%"}
                key={name}
                alignItems={"center"}
                fontSize={"14px"}
              >
                <NavItem
                  key={name}
                  to={to}
                  navSize={navSize}
                  icon={icon}
                  iconActive={iconActive}
                  title={name}
                  active={isActive}
                  visible={visible}
                  click={click}
                />
              </Box>
            );
          }
        )}
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize == "small" ? "center" : "flex-start"}
        mb={20}
      />
    </Flex>
  );
};

export default Sidebar;
