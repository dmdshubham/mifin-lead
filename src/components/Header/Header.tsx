import {
  Box,
  Flex,
  Menu,
  HStack,
  Popover,
  IconButton,
  MenuButton,
  MenuItem,
  MenuList,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import * as React from "react";
import { LeftHeader } from "@mifin/components/Header/Header.Left";
import { RightHeader } from "@mifin/components/Header/Header.Right";
import { HeaderAnchor, IHeaderProps } from "@mifin/Interface/components";
import { headerTextStyling } from "@mifin/theme/style";
import { FC, useState } from "react";
import { FiChevronDown, FiLock, FiLogOut } from "react-icons/fi";
import { Badge, Divider, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import abcLogo from "@mifin/assets/svgs/abcLogo.png";

import { BiBell } from "react-icons/bi";
import { MifinColor } from "@mifin/theme/color";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { userInfo } from "@mifin/utils/getLoginUserInfo";
import { getMobileSidebarDetails } from "../LayoutWrapper";
import { OnlineStatusIndicator } from "@mifin/components/OnlineStatusIndicator";

const mobileMenuId = "primary-search-account-menu-mobile";
const LOUGOUT_REDIRECT_URL = "../mifin/userAuthAction.do?dispatchMethod=logout";

const Header: FC<IHeaderProps> = ({ isDrawerOpen }) => {
  const gg = getMobileSidebarDetails();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<HeaderAnchor>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  // const { togglesidebar, setToggleSidebar } = useAssetApiStore();
  // const { onToggle, isOpen, onClose, onOpen } = useDisclosure();
  const { t } = useTranslation();
  const {
    isOpen: isNotificationOpen,
    onOpen: onNotificationOpen,
    onClose: notificationClose,
  } = useDisclosure();
  const {
    isOpen: passwordOpen,
    onOpen: onPasswordOpen,
    onClose: onPasswordClose,
  } = useDisclosure();

  const navigate = useNavigate();

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleDrawerToggle = () => {
    setIsSidebarOpen(prev => !prev);
  };
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = LOUGOUT_REDIRECT_URL;
  };

  return (
    <Box height="80px">
      {isMobile ? (
        <Box
          sx={{
            // width: "100%",
            boxShadow: "0px 18px 35px rgba(0, 0, 0, 0.04)",
            position: "fixed", // Ensures the header stays at the top
            top: 0, // Sticks it to the top of the viewport
            left: 0,
            right: 0,
            paddingX: 3,
            zIndex: 1000, // Keeps it above other content
            backgroundColor: "white", // Ensures visibility
          }}
        >
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={"10px"}
          >
            <RxHamburgerMenu onClick={gg?.onOpen} fontSize="24px" />
            {/* <Box> */}
            {/* <LeftHeader isDrawerOpen={isDrawerOpen} /> */}
            {/* </Box> */}
            <Box display={"flex"} flexDirection="row" alignItems={"center"}>
              <Box
                width="20px"
                marginLeft={isMobile ? "20px" : "10px"}
                height="30px"
              >
                <Image src={abcLogo} alt="abclogo" />
              </Box>
            </Box>
            <RightHeader
              mobileMoreAnchorEl={mobileMoreAnchorEl}
              isMobileMenuOpen={isMobileMenuOpen}
              mobileMenuId={mobileMenuId}
              handleMobileMenuClose={handleMobileMenuClose}
            />
            <Box display={{ sm: "flex", md: "flex" }}>
              <Menu>
                <MenuButton
                  borderRadius={15}
                  textTransform="none"
                  cursor="pointer"
                >
                  <Stack direction={"row"} align="center" spacing={-4}>
                    <Stack spacing={0} alignItems="flex-start"></Stack>
                    <FiChevronDown size={25} />
                  </Stack>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleLogout()}>
                    <FiLogOut />
                    logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        </Box>
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            ml: isDrawerOpen ? 0 : 1.25,
            px: 3,
            py: 1,
            borderRadius: 2,
            background: "white",
            display: "flex",
            height: "80px",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            boxShadow: " 0px 18px 35px rgba(0, 0, 0, 0.04)",
          }}
        >
          <LeftHeader isDrawerOpen={isDrawerOpen} />
          <Stack
            direction={"row"}
            sx={{ flexGrow: 1 }}
            px={3}
            justifyContent="flex-end"
            alignItems="center"
            spacing={4}
          >
            <OnlineStatusIndicator />
            <Text sx={headerTextStyling}></Text>
            <Text fontSize="lg" fontWeight="normal" color="gray.500"></Text>
          </Stack>
          <RightHeader
            mobileMoreAnchorEl={mobileMoreAnchorEl}
            isMobileMenuOpen={isMobileMenuOpen}
            mobileMenuId={mobileMenuId}
            handleMobileMenuClose={handleMobileMenuClose}
          />
        </Box>
      )}
    </Box>
  );
};

export default Header;
