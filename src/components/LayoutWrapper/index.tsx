import { Box, Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import ErrorBoundary from "@mifin/components/ErrorBoundry";
import AppBar from "@mifin/components/Header/AppBar";
import Header from "@mifin/components/Header/Header";
import Sidebar from "@mifin/components/Sidebar";
import useWindowSize from "@mifin/hooks/useWindowResize";
import { FC, useContext, useEffect, useState } from "react";
import Drawer from "@mifin/components/Drawer/Drawer";
import Footer from "@mifin/components/Footer";
import {
  SidebarState,
  mobileSidebar,
} from "@mifin/components/UseContext/UseContext";
import { ILayoutWrapper } from "@mifin/Interface/components";
import { layoutBoxStyling, layoutChildBoxStyling } from "@mifin/theme/style";

const sidebarAnimate = "all .25s ease";

const LayoutWrapper: FC<ILayoutWrapper> = props => {
  const { children } = props;
  const [open, setOpen] = useState(true);
  const { width } = useWindowSize();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (width < 640) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [width]);

  return (
    <ErrorBoundary>
      <mobileSidebar.Provider value={{ isOpen, onOpen, onClose }}>
        <Flex minH="100vh">
          {isMobile ? (
            <Drawer
              isOpen={isOpen}
              onClose={onClose}
              header={false}
              position="left"
              sidebarWidth="calc(100vw - 20%)"
            >
              <Sidebar
                navSize={"large"}
                handleDrawerToggle={handleDrawerToggle}
              />
            </Drawer>
          ) : (
            <Sidebar
              navSize={open ? "large" : "small"}
              handleDrawerToggle={handleDrawerToggle}
            />
          )}

          <Box transition={sidebarAnimate} sx={layoutBoxStyling}>
            <AppBar
            // zIndex={{ base: 100, md: 10 }}
            >
              <Header
                handleDrawerToggle={handleDrawerToggle}
                isDrawerOpen={open}
              />
            </AppBar>
            <SidebarState.Provider value={{ open, setOpen }}>
              <Box px={{ sm: 4, md: 8 }} sx={layoutChildBoxStyling}>
                {children}
              </Box>
            </SidebarState.Provider>
            <Footer />
          </Box>
        </Flex>
      </mobileSidebar.Provider>
    </ErrorBoundary>
  );
};

export default LayoutWrapper;

export function getSidebarDetails() {
  const sidebarOpen = useContext(SidebarState);
  return sidebarOpen as {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export function getMobileSidebarDetails() {
  const sidebarOpen = useContext(mobileSidebar);
  return sidebarOpen as {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
}
