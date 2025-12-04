import {
  CloseButton,
  Divider,
  Drawer as CDrawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Flex,
  Text,
} from "@chakra-ui/react";
import React, { FC, useRef } from "react";
import { IDrawerProps } from "@mifin/Interface/components";

type ButtonRef = HTMLButtonElement | null;
const Drawer: FC<IDrawerProps> = props => {
  const {
    isOpen,
    onClose,
    title,
    children,
    header,
    position = "right",
    sidebarWidth,
  } = props;
  const btnRef = useRef<ButtonRef>(null);

  return (
    <>
      <CDrawer
        isOpen={isOpen}
        placement={position}
        onClose={onClose}
        finalFocusRef={btnRef}
        size="md"
      >
        <DrawerContent
          rounded={"xl"}
          m={0}
          shadow="drawer"
          sx={{ maxWidth: sidebarWidth ? sidebarWidth : "100%", padding: 0 }}
          inset={0}
        >
          {header && (
            <DrawerHeader>
              <Flex alignItems={"center"} justify="space-between">
                <Text>{title}</Text>
                <CloseButton onClick={onClose} />
              </Flex>
            </DrawerHeader>
          )}

          <Divider borderColor={"black"} opacity={0.15}></Divider>

          <DrawerBody padding={0} overflow="hidden">
            {children}
          </DrawerBody>
        </DrawerContent>
      </CDrawer>
    </>
  );
};

export default Drawer;
