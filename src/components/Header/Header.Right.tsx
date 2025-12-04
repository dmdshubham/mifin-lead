import React, { useEffect, useState } from "react";

import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Stack,
  Text,
  Badge,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MifinColor } from "@mifin/theme/color";
import { FC, Fragment } from "react";
import { BiBell } from "react-icons/bi";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import abcLogo from "@mifin/assets/svgs/abcLogo.png";
import i18n from "@mifin/translations";
import QuickLead from "@mifin/components/Header/QuickLead";
import { getNotificationDetails } from "@mifin/redux/service/getNotificationDetails/api";
import { updateLeadId } from "@mifin/redux/features/updateLeadIdSlice";
import { useAppDispatch, useAppSelector } from "@mifin/redux/hooks";
import { useTranslation } from "react-i18next";
import { IRightHeaderProps } from "@mifin/Interface/components";
import { userInfo } from "@mifin/utils/getLoginUserInfo";
import { headerRightBoxsStyling } from "@mifin/theme/style";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import {
  getCurrentUserInfo,
  getLastLoginDetails,
  getUserId,
} from "@mifin/utils/sessionData";
import PWAInstallButton from "@mifin/components/PWAInstallButton";
// import { getCorrectImageUrl } from "@mifin/utils/getCorrectImgUrl";

interface Notification {
  notificationId: string;
  caseCode: string;
  caseid: string;
  notification: string;
  customerName: string;
}
// const LOUGOUT_REDIRECT_URL = "../mifin/userAuthAction.do?dispatchMethod=logout";
const LOUGOUT_REDIRECT_URL = "/mifin/userAuthAction.do?dispatchMethod=logout";

export const RightHeader: FC<IRightHeaderProps> = () => {
  const { onClose, onToggle, isOpen } = useDisclosure();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userDetails = sessionStorage.getItem("userInfo");
  const parsedUserDetails = JSON.parse(userDetails);
  const { t } = useTranslation();
  const [setUniqueData] = useState<Notification[]>([]);
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const notificationData = useAppSelector(
    state => state.getNotificationDetails
  );
  useEffect(() => {
    if (!notificationData || !Array.isArray(notificationData)) return;

    const filteredData = notificationData.filter(
      (item: Notification, index: number, self: Notification[]) =>
        index ===
        self.findIndex(
          t =>
            t.caseCode === item.caseCode && t.customerName === item.customerName
        )
    );

    setUniqueData(filteredData);
  }, [notificationData]);

  const NOTIFICATION_REQUEST_BODY = {
    ...MASTER_PAYLOAD,
    requestData: {
      notificationId: "show",
    },
  };

  const getNotification = () => {
    dispatch(getNotificationDetails(NOTIFICATION_REQUEST_BODY));
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = LOUGOUT_REDIRECT_URL;
  };

  const getCurrentDate = () => {
    const businessDate = sessionStorage.getItem("BusinessDate");

    if (businessDate && businessDate !== "") {
      return businessDate.split('"').join("");
    }

    return "";
  };

  useEffect(() => {
    getNotification();
  }, []);

  const notificationlength: number =
    notificationData?.data?.notification?.length ?? 0;

  return (
    <Fragment>
      <Box
        display={isMobile ? "none" : "flex"}
        flexDirection="row"
        alignItems={"center"}
      >
        <Box width="29px" height="47px">
          <Image src={abcLogo} alt="abclogo" height={"100%"} width={"100%"} />
        </Box>
        {/* <Text fontWeight={600} fontSize="20px" paddingLeft={"8px"}>
          ABC Inc
        </Text> */}
        <Box marginLeft="0px">
          <Divider orientation="vertical" marginX={30} height="50px" />
        </Box>
      </Box>
      <Box display="flex" alignItems={"center"} ml={"10px"}>
        <Popover
          isOpen={isOpen}
          onClose={onClose}
          closeOnBlur={true}
          returnFocusOnClose={false}
        >
          <PopoverTrigger>
            <Box
              position="relative"
              _hover={{ cursor: "pointer" }}
              ml={isMobile ? "5px" : "25px"}
            >
              <Badge
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="absolute"
                top={-2}
                variant="solid"
                boxSize="20px"
                right={-2}
                borderRadius="50%"
                bg="red"
              >
                {notificationlength ?? "0"}
              </Badge>

              <BiBell
                size={25}
                onClick={() => {
                  {
                    !state?.allowNotification ? onToggle() : " ";
                  }
                }}
              />
            </Box>
          </PopoverTrigger>
          <PopoverContent
            borderRadius={"20px"}
            width={{ sm: "auto", md: "418px" }}
          >
            <PopoverHeader
              fontWeight={600}
              fontSize="20px"
              px={7}
              textAlign="center"
            >
              {t("common.notifications")}
            </PopoverHeader>
            <PopoverBody
              overflowY={notificationlength ? "scroll" : "none"}
              p={0}
              m={0}
              height={Number(notificationlength) <= 10 ? "max-content" : "70vh"}
            >
              <Flex flexDirection="column" pt={2}>
                {notificationData?.data &&
                  notificationData?.data?.notification?.map(
                    (item: IRightHeaderProps) => {
                      return (
                        <Box
                          py={2}
                          pr={5}
                          pl={isMobile ? 2 : 10}
                          key={item?.caseCode}
                        >
                          <Text fontSize="14px" fontWeight={500}>
                            <Text
                              as="span"
                              color={MifinColor.blue_300}
                              _hover={{ cursor: "pointer" }}
                              onClick={() => {
                                dispatch(
                                  updateLeadId({
                                    leadId: item?.caseid,
                                  })
                                );

                                navigate(`/contact/${item?.caseid}`, {
                                  state: { allowNotification: true },
                                });
                                onClose();
                              }}
                            >
                              {item?.caseCode}
                            </Text>{" "}
                            <Text as="span" color={MifinColor.black}>
                              {item?.notification} {item?.customerName}
                            </Text>
                          </Text>

                          <Text
                            fontSize="12px"
                            fontWeight={400}
                            color={MifinColor.black}
                            mt={1}
                          >
                            {item?.caseCode} at {item?.NotificationTime}
                          </Text>
                          <Divider marginTop={4} />
                        </Box>
                      );
                    }
                  )}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
      <Box display="flex" alignItems="center" ml={4}>
        <QuickLead />
      </Box>
      <Box display="flex" alignItems="center" ml={3}>
        <PWAInstallButton variant="button" />
      </Box>
      <Box sx={headerRightBoxsStyling} ml={"39px"}>
        {!isMobile && (
          <Select
            borderColor="transparent"
            cursor="pointer"
            variant="ghost"
            defaultValue={
              !localStorage.getItem("language")
                ? "en"
                : i18n.language === "en"
                ? "en"
                : "hi"
            }
            onChange={event => {
              localStorage.setItem("language", event.target.value);
              i18n.changeLanguage(event.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </Select>
        )}
        {isMobile && (
          <Box ml={3}>
            <Text fontWeight={600} fontSize="10px" color={"#1a202c"}>
              {/* {userInfo()} */}
              {parsedUserDetails?.userLoginId ?? "-"}
            </Text>
            <Text fontSize={"10px"} fontWeight={600} color={"#1a202c"}>
              {getCurrentDate()}
            </Text>
          </Box>
        )}
      </Box>

      {/* <Box
        display={isMobile ? "none" : "flex"}
        flexDirection={"column"}
        alignItems={"flex-end"}
        marginLeft={8}
      >
        <Text fontWeight={400} fontSize="16px">
          {userInfo()}
        </Text> */}
      {/* <HStack> */}
      {/* <HStack>
            <Text fontWeight={400} fontSize="12px">
              {t("common.lastLogin")}
            </Text>
            <Text fontWeight={400} fontSize="12px">
              8 Jan 2023,5:30pm
            </Text>
          </HStack> */}
      {/* <Box
              backgroundColor={MifinColor.gray_100}
              paddingX={3}
              paddingY={1}
              borderRadius="4px"
            >
              <Text color={MifinColor.white}>8 Jan 2023</Text>
            </Box> */}
      {/* </HStack> */}
      {/* </Box>  */}
      <HStack>
        <Box
          display={isMobile ? "none" : "flex"}
          flexDirection={"column"}
          alignItems={"flex-end"}
          marginLeft={12}
        >
          <Text fontWeight={500} fontSize="16px">
            {/* {userInfo()} */}
            {parsedUserDetails?.userLoginId ?? "-"}
          </Text>
          <HStack>
            <HStack>
              <Text fontWeight={400} fontSize="12px">
                {t("common.lastLogin")} {getLastLoginDetails()}
              </Text>
            </HStack>
            <Box
              backgroundColor={MifinColor.gray_100}
              paddingX={3}
              paddingY={1}
              borderRadius="4px"
            >
              <Text fontSize={"12px"} fontWeight={600} color={MifinColor.white}>
                {getCurrentDate()}
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box display={{ sm: "none", md: "flex" }}>
          <Menu>
            <MenuButton borderRadius={15} textTransform="none" cursor="pointer">
              <Stack direction={"row"} align="center">
                <Stack alignItems="flex-start"></Stack>
                <FiChevronDown size={25} />
              </Stack>
            </MenuButton>
            <MenuList>
              <MenuItem minH="40px" onClick={() => handleLogout()}>
                <FiLogOut />
                <span>logout</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    </Fragment>
  );
};
