import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { MifinColor } from "@mifin/theme/color";
import { FC, useEffect, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { getMobileSidebarDetails } from "../LayoutWrapper";
import { INavItemProps, INavItemProps2 } from "@mifin/Interface/components";

const NavItem: FC<INavItemProps> = ({
  icon,
  title,
  iconActive,
  active,
  navSize,
  to,
  visible,
  click,
}: INavItemProps) => {
  const gg = getMobileSidebarDetails();
  const getCorrectImageUrl = (url: string) => {
    const hostName = window.location.hostname;
    const isLocalHost =
      hostName === "localhost" || hostName === "127.0.0.1" || hostName === "";

    return isLocalHost ? url : `/mifinLead/${url}`;
  };

  if (visible) {
    return (
      <Flex
        flexDir="column"
        w="100%"
        px={3}
        pt={1}
        alignItems={navSize == "small" ? "center" : "flex-start"}
        onClick={gg?.onClose}
      >
        <Menu placement="right">
          <Link
            as={RouterLink}
            to={to}
            bg={`${active && MifinColor.blue_100}`}
            _hover={{
              textDecor: "none",
              backgroundColor: active
                ? MifinColor.blue_100
                : MifinColor.blue_200,
            }}
            w={`${navSize == "large" && "100%"}`}
            borderRadius={navSize == "small" ? 8 : 8}
            pos="relative"
          >
            <MenuButton
              w="100%"
              p={3}
              pl={navSize == "small" ? 3 : 6}
              color={active ? MifinColor.white : "rgba(255, 255, 255, 0.6)"}
              stroke={MifinColor.white}
              _hover={{ color: "white", stroke: "white" }}
              onClick={e => {
                if (click) {
                  click(e);
                }
              }}
            >
              <Flex>
                <Tooltip title={title}>
                  {typeof icon === "string" ? (
                    <Image
                      src={
                        active
                          ? getCorrectImageUrl(iconActive)
                          : getCorrectImageUrl(icon)
                      }
                      alt={title}
                      boxSize="20px"
                    />
                  ) : (
                    <Icon
                      as={
                        active
                          ? getCorrectImageUrl(iconActive)
                          : getCorrectImageUrl(icon)
                      }
                      fontSize={{ base: "14px", md: "xl" }}
                    />
                  )}
                </Tooltip>
                <Text
                  ml={5}
                  display={navSize == "small" ? "none" : "flex"}
                  textAlign="left"
                >
                  {title}
                </Text>
              </Flex>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
    );
  } else {
    return <></>;
  }
};

const NavItem2 = ({
  icon,
  title,
  active,
  navSize,
  iconActive,
  child,
  visible,
  click,
}: INavItemProps2) => {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const item = child.find(item => item.to === location.pathname);
  const gg = getMobileSidebarDetails();
  const getCorrectImageUrl = (url: string) => {
    const hostName = window.location.hostname;
    const isLocalHost =
      hostName === "localhost" || hostName === "127.0.0.1" || hostName === "";

    return isLocalHost ? url : `/mifinLead/${url}`;
  };

  useEffect(() => {
    if (item) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [item]);

  if (visible) {
    return (
      <>
        <Flex
          flexDir="column"
          w="100%"
          alignItems={navSize == "small" ? "center" : "flex-start"}
          bgColor={MifinColor.blue_200}
        >
          <Menu placement="right">
            <Box
              onClick={() => {
                setShow(!show);
              }}
              bg={`${MifinColor.blue_200}`}
              _hover={{
                textDecor: "none",
                backgroundColor: MifinColor.blue_200,
              }}
              paddingLeft={navSize == "small" ? "20px" : "12px"}
              w={`${navSize == "large" && "100%"}`}
              borderRadius={navSize == "small" ? 8 : 0}
              pos="relative"
            >
              <MenuButton
                w="100%"
                p={3}
                pl={navSize == "small" ? 3 : 6}
                color={active ? MifinColor.white : "rgba(255, 255, 255, 0.6)"}
                stroke={MifinColor.white}
                _hover={{
                  color: MifinColor.white,
                  stroke: MifinColor.white,
                }}
                onClick={click ?? "s"}
              >
                <Flex justifyContent="space-between">
                  <Flex>
                    <Tooltip title={title}>
                      {typeof icon === "string" ? (
                        <Image
                          src={
                            active
                              ? getCorrectImageUrl(iconActive)
                              : getCorrectImageUrl(icon)
                          }
                          alt={title}
                          boxSize="20px"
                        />
                      ) : (
                        <Icon
                          as={
                            active
                              ? getCorrectImageUrl(iconActive)
                              : getCorrectImageUrl(icon)
                          }
                          fontSize={{ base: "14px", md: "xl" }}
                        />
                      )}
                    </Tooltip>
                    <Text
                      ml={5}
                      display={navSize == "small" ? "none" : "flex"}
                      textAlign="left"
                    >
                      {title}
                    </Text>
                  </Flex>
                  <Icon as={show ? HiChevronUp : HiChevronDown} fontSize="xl" />
                </Flex>
              </MenuButton>
            </Box>
          </Menu>
        </Flex>
        {show && (
          <Box bgColor={MifinColor.blue_200} w="full">
            {child?.map((data, index) => {
              if (data.visible) {
                return (
                  <Flex
                    key={index}
                    px={3}
                    flexDir="column"
                    w="100%"
                    alignItems={navSize == "small" ? "center" : "flex-start"}
                  >
                    <Menu placement="right">
                      <Box
                        as={RouterLink}
                        to={data.to}
                        bg={`${data.isActive && MifinColor.blue_100}`}
                        _hover={{
                          textDecor: "none",
                          backgroundColor: data.isActive
                            ? MifinColor.blue_100
                            : MifinColor.blue_200,
                        }}
                        w={`${navSize == "large" && "100%"}`}
                        borderRadius={navSize == "small" ? 8 : 8}
                        pos="relative"
                        onClick={() => gg?.onClose()}
                      >
                        {active && (
                          <Box
                            pos="absolute"
                            h="100%"
                            w={1}
                            right={0}
                            bg={MifinColor.blue_200}
                            borderTopLeftRadius={10}
                            borderBottomLeftRadius={10}
                          />
                        )}
                        <MenuButton
                          w="100%"
                          p={3}
                          pl={navSize == "small" ? 3 : 6}
                          color={
                            active
                              ? MifinColor.white
                              : "rgba(255, 255, 255, 0.6)"
                          }
                          stroke={MifinColor.white}
                          _hover={{ color: "white", stroke: "white" }}
                        >
                          <Flex justifyContent="space-between">
                            <Flex>
                              <Icon as={data.iconChild} fontSize="xl" />
                              <Text
                                ml={10}
                                display={navSize == "small" ? "none" : "flex"}
                                textAlign="inherit"
                              >
                                {data.name}
                              </Text>
                            </Flex>
                          </Flex>
                          <Flex></Flex>
                        </MenuButton>
                      </Box>
                    </Menu>
                  </Flex>
                );
              } else {
                <></>;
              }
            })}
          </Box>
        )}
      </>
    );
  } else {
    return <></>;
  }
};

export { NavItem, NavItem2 };
