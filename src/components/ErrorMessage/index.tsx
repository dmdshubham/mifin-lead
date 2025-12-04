import {
  Text,
  Box,
  Flex,
  List,
  ListItem,
  Collapse,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { IShowError } from "@mifin/Interface/components";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const ShowError: FC<IShowError> = props => {
  // const [openMandatoryValidation, setOpenMandatoryValidation] = useState(false);
  const { ErrorMessage, error, onInputNavigate } = props;
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return isMobile ? (
    <Box
      ref={ref}
      w="100%"
      maxW="400px"
      position="fixed"
      bottom="10px"
      left="80%"
      width="90%"
      transform="translateX(-50%)"
      zIndex="999"
      bg="transparent"
    >
      <Flex
        className="testingItems"
        bg="#272937"
        borderRadius="16px"
        flexDirection="column"
        width="70%"
        p={1}
        boxSizing="border-box"
      >
        <Flex
          py={2}
          px={2}
          justifyContent="space-between"
          onClick={onToggle}
          _hover={{ cursor: "pointer" }}
          width="100%"
          position="sticky"
          top="0"
          zIndex="1"
          bg="#272937"
        >
          <Flex
            bg="#eed202"
            color="black"
            fontWeight={400}
            fontSize="12px"
            borderRadius="20px"
            px={2}
            py={0.5}
            w="auto"
          >
            {error}
            <Text ml="4px" fontSize="12px">
              {t("common.mandatory")}
            </Text>
          </Flex>
          <Flex flexShrink={0} align="center" ml={1}>
            {isOpen ? (
              <IoIosArrowDown onClick={onToggle} size={16} color="white" />
            ) : (
              <IoIosArrowUp onClick={onToggle} size={16} color="white" />
            )}
          </Flex>
        </Flex>

        <Collapse in={isOpen}>
          <List
            spacing={3}
            px={3}
            pb={5}
            maxH="500px"
            overflowY="auto"
            css={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            {Object.entries(ErrorMessage).map(([field, item], idx) =>
              field === "nickName" ? null : (
                <ListItem
                  key={idx}
                  color="whiteAlpha.800"
                  fontWeight={400}
                  fontSize="10px"
                  textTransform="capitalize"
                  onClick={() => {
                    onInputNavigate?.(field);
                    onToggle();
                  }}
                  h={5}
                  _hover={{
                    color: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  <Box maxW="300px" overflow="hidden">
                    {item.message}
                  </Box>
                </ListItem>
              )
            )}
          </List>
        </Collapse>
      </Flex>
    </Box>
  ) : (
    <Box
      ref={ref}
      w={"365px"}
      maxHeight={{
        base: "300px",
        lg: "500px",
        xl: "600px",
        "2xl": "600px",
      }}
      transition="width 0.3s"
      overflowY={
        Object.values(ErrorMessage)?.length >= 16 ? "scroll" : "hidden"
      }
      overflowX={"hidden"}
      right={{ base: "25%", md: "21%", lg: "17%", xl: "13%", "2xl": "11%" }}
      transform={"translateX(50%)"}
      bottom="20px"
      px="16px"
      py="16px"
      position="fixed"
      zIndex="999"
      color="white"
      css={{
        overflowY: "hidden",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Flex
        className="testingItems"
        bg="#272937"
        borderRadius="20px"
        flexDirection="column"
        width={"100%"}
        p={2}
        px={7}
      >
        <Flex
          py={4}
          justifyContent="space-between"
          onClick={onToggle}
          _hover={{
            cursor: "pointer",
          }}
          width={"100%"}
          position="sticky"
          top="0"
          zIndex="1"
          background="#272937"
        >
          <Flex
            bg="#eed202"
            color={"black"}
            fontWeight={400}
            fontSize="15px"
            borderRadius={"20px"}
            px={4}
            py={1}
            w={"100%"}
            flex={0.95}
          >
            {error}
            <Text marginLeft={"5px"}>{t("common.mandatory")}</Text>
          </Flex>
          <Flex flex={0.05} align={"center"} ml={2}>
            <IoIosArrowUp
              onClick={() => {
                onToggle();
              }}
              color={"white"}
            />
          </Flex>
        </Flex>

        <Collapse in={isOpen}>
          <List
            spacing={3}
            pb={5}
            maxHeight={"500px"}
            overflowY={"auto"}
            css={{
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                display: "none",
                color: "red",
              },
            }}
          >
            {Object.entries(ErrorMessage)?.map(
              ([fieldname, item]: any, index: number) => {
                if (fieldname === "nickName") {
                  return null;
                }

                return (
                  <ListItem
                    key={index}
                    color={"whiteAlpha.800"}
                    fontWeight={400}
                    fontSize={"13px"}
                    textTransform={"capitalize"}
                    onClick={() => {
                      onInputNavigate(fieldname);
                      onToggle();
                    }}
                    h={5}
                    sx={{
                      "&:hover": {
                        color: "white",
                        fontSize: "14px",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <Box maxW={"300px"} overflow="hidden">
                      {item?.message}
                    </Box>
                  </ListItem>
                );
              }
            )}
          </List>
        </Collapse>
      </Flex>
    </Box>
  );
};

export default ShowError;
