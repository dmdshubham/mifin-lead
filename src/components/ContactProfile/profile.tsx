import {
  Box,
  Image,
  Text,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useBreakpointValue,
  PopoverArrow,
  Heading,
  HStack,
  AccordionIcon,
  Accordion,
  AccordionItem,
  Grid,
  GridItem,
  VStack,
  AccordionButton,
  AccordionPanel,
  Divider,
  Button,
  PopoverHeader,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Menu,
  MenuButton,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import burger from "@mifin/assets/icons/profileBurger.png";
import phoneLogo from "@mifin/assets/icons/phone.png";
import locationLogo from "@mifin/assets/icons/location.png";
import mailLogo from "@mifin/assets/icons/mail.png";
import { MifinColor } from "@mifin/theme/color";
import { useAppSelector } from "@mifin/redux/hooks";
import { useTranslation } from "react-i18next";
import {
  profileLightTextStyling,
  profileTextStyling,
  profileBoxStyling,
  profileFlexStyling,
  profileBoxsStyling,
  profilePopoverArrowStyling,
} from "@mifin/theme/style";
import { FC, useState } from "react";
import { AddressProps, CustomerData } from "@mifin/Interface/Customer";
import PrimaryButton from "../Button";
import { useCustomerDetail } from "@mifin/service/mifin-customerDetails";
import { useApiStore } from "@mifin/store/apiStore";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";

const lightText = (text: string) => {
  return <Text sx={profileLightTextStyling}>{text}</Text>;
};

const darkText = (text: string) => {
  return <Text sx={profileTextStyling}>{text ?? ""}</Text>;
};

const Profile: FC = () => {
  const { t } = useTranslation();
  const isMobile: boolean | undefined = useBreakpointValue({
    base: true,
    md: false,
  });
  const [showAccBtn, setShowAccBtn] = useState(true);
  const customerInfo = useAppSelector(state => state.getLeadId);
  const { userDetails } = useApiStore();

  const { data: CustomerDetail, refetch } = useCustomerDetail({
    // deviceDetail: userDetails.deviceDetail,
    // userDetail: userDetails.userDetail,
    ...MASTER_PAYLOAD,
    requestData: {
      leadDetail: {
        caseId: customerInfo.leadId,
      },
    },
  });

  // const mobileNo =
  //   CustomerDetail?.responseData?.customerDetail?.listMobile?.[0]
  //     ?.LEAD_MOBILE_NO;
  const mobileNo =
    CustomerDetail?.responseData?.customerDetail?.listMobile?.[0]?.contactNo;

  const emailId =
    CustomerDetail?.responseData?.customerDetail?.listEmail?.[0]?.email;

  // // fetching global customer value from store
  // const { userDetails } = useApiStore();
  // const customerInfo = useAppSelector(state => state.getLeadId);
  // const { data: CustomerDetail } = useCustomerDetail({
  //   deviceDetail: userDetails.deviceDetail,
  //   userDetail: userDetails.userDetail,
  //   requestData: {
  //     leadDetail: {
  //       caseId: customerInfo.leadId,
  //     },
  //   },
  // });
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const allMastersData = mastersData?.Masters;

  const allAddresses =
    CustomerDetail?.responseData?.customerDetail?.listAddress &&
    CustomerDetail?.responseData?.customerDetail?.listAddress?.map(
      (e: any, ind: number) => {
        return (
          <Tr key={ind}>
            <Td>
              {e?.addressType
                ? (e?.addressType === "1000000002"
                    ? "Permanent Address"
                    : e?.addressType === "1000000001"
                    ? "Residence Address"
                    : "Office Address"
                  ).toUpperCase()
                : ""}
            </Td>
            <Td>
              {e?.buildingName ? `${e?.buildingName},` : ""}&nbsp;
              {e?.cityName ? `${e?.cityName},` : ""}&nbsp;
              {e?.state
                ? allMastersData?.stateList?.find(
                    (el: { stateMasterId: any }) =>
                      el.stateMasterId === e?.state
                  )?.displayName
                : ""}
              &nbsp;
              {e?.zipcode ? `${e?.zipcode}` : ""}&nbsp;
            </Td>
            <Td>{e?.mobile_no1 || ""}</Td>
          </Tr>
        );
      }
    );

  const customerData: CustomerData = useAppSelector(
    state => state.leadHeaderDetails.data
  );
  const CardDetails = [
    { label: t("profile.lead"), value: customerData?.leadId ?? "" },
    { label: t("profile.queue"), value: customerData?.queue ?? "" },
    {
      label: t("profile.action"),
      value: customerData?.disposition ?? "",
    },
    {
      label: t("profile.generationDate"),
      value: customerData?.generationDate ?? "",
    },
    {
      label: t("profile.allocatedTo"),
      value: customerData?.allocatedTo ?? "",
    },
    { label: t("profile.source"), value: customerData?.source ?? "" },
    {
      label: t("profile.leadStage"),
      value: customerData?.leadStage ?? "",
    },
    { label: t("profile.product"), value: customerData?.queue ?? "" },
    { label: t("profile.campaign"), value: customerData?.campaign ?? "" },
  ];
  const hiddenData = [
    // { label: t("profile.lead"), value: customerData?.leadId ?? "" },
    { label: t("profile.queue"), value: customerData?.queue ?? "" },
    {
      label: t("profile.action"),
      value: customerData?.disposition ?? "",
    },
    {
      label: t("profile.generationDate"),
      value: customerData?.generationDate ?? "",
    },
    {
      label: t("profile.allocatedTo"),
      value: customerData?.allocatedTo ?? "",
    },
    { label: t("profile.source"), value: customerData?.source ?? "" },
    {
      label: t("profile.leadStage"),
      value: customerData?.leadStage ?? "",
    },
    { label: t("profile.product"), value: customerData?.queue ?? "" },
    { label: t("profile.campaign"), value: customerData?.campaign ?? "" },
  ];

  const renderAccordBody = hiddenData?.map((e, i) => {
    return (
      <GridItem
        key={i}
        m={{ base: "5px", md: "10px" }}
        p={{ base: "1px", md: "5px" }}
        mr={{ sm: "5px", base: "10px", md: "100px" }}
      >
        <Text
          fontFamily={"Poppins"}
          fontWeight={600}
          fontSize={"14px"}
          // opacity={0.8}
          color={"#1A202C"}
        >
          {e.label}
        </Text>
        <Text
          fontFamily={"Poppins"}
          fontWeight={600}
          fontSize={"14px"}
          textColor={"#3E4954"}
        >
          {e.value}
        </Text>
      </GridItem>
    );
  });

  return (
    <>
      {isMobile ? (
        <Accordion allowToggle>
          <AccordionItem
            boxShadow={"0px 0px 12px rgba(0, 0, 0, 0.07)"}
            borderRadius={"20px"}
            mt={{
              sm: "20px",
              md: "0px",
            }}
          >
            <Box borderRadius={"10px"} border={"hidden"} overflow={"hidden"}>
              <Box padding={"10px"}>
                <Flex alignItems={"flex-start"}>
                  <Flex
                    flexDirection={"column"}
                    alignItems={"flex-start"}
                    justifyContent={"space-between"}
                  >
                    <Text
                      fontFamily={"Poppins"}
                      fontWeight={400}
                      fontSize={"12px"}
                      opacity={0.5}
                      textColor={"#000000"}
                    >
                      {t("profile.applicant")}
                    </Text>
                    <Flex
                      // gap={"5px"}
                      alignItems={"center"}
                      justifyContent={{
                        base: "flex-start",
                        xl: "space-between",
                      }}
                      // flexDirection={"row"}
                    >
                      <Box>
                        <Heading
                          lineHeight={"28px"}
                          whiteSpace={"nowrap"}
                          fontWeight={700}
                          fontSize={{ base: "16px", xl: "20px", xxl: "24px" }}
                          color={MifinColor.black}
                          width={"100%"}
                          marginTop={{ sm: "0px", md: "10px" }}
                          mr={{ base: "10px", xl: "0px", xxl: "10px" }}
                        >
                          {customerData?.customerName
                            ?.toLowerCase()
                            .replace(/\b\w/g, char => char.toUpperCase())}
                        </Heading>
                      </Box>

                      <Box>
                        <Flex>
                          {/* <SwapApplicant
                          ProspectData={ProspectData}
                          isLoading={isProspectLoading}
                        /> */}
                        </Flex>
                      </Box>
                    </Flex>
                    <HStack>
                      <Text fontWeight={400} fontSize="12px" opacity={"50%"}>
                        {t("profile.lead")}
                      </Text>
                      <Text color={MifinColor.blue_300} fontSize="14px">
                        {customerData?.leadCode}
                      </Text>
                    </HStack>
                  </Flex>
                </Flex>
                <Flex>
                  <Flex
                    flexWrap={"wrap"}
                    columnGap={"4px"}
                    justifyContent={{ base: "flex-start" }}
                    alignItems={{ xl: "center" }}
                    alignContent={"center"}
                  >
                    {/* <Flex alignItems="center"> */}
                    <Popover arrowSize={20} variant="responsive">
                      <PopoverTrigger>
                        <Box display={"flex"} mr={4} alignItems={"center"}>
                          {" "}
                          <Box height="16px">
                            <Image src={phoneLogo} height="100%" alt="logo" />
                          </Box>
                          <Tooltip
                            label={mobileNo ?? ""}
                            placement="top"
                            hasArrow
                          >
                            <Text paddingLeft={2} fontSize="14px">
                              {mobileNo ?? ""}
                            </Text>
                          </Tooltip>
                          <Image
                            src={burger}
                            alt="img"
                            width="11px"
                            height="10px"
                            mt={{ sm: "none", md: 1 }}
                            ml={{ sm: 2, md: "none" }}
                            position="relative"
                            sx={{
                              "&:hover": {
                                cursor: "pointer",
                              },
                            }}
                          />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <Flex
                          width={{ sm: "auto", md: "425px" }}
                          sx={profilePopoverArrowStyling}
                        >
                          <Text
                            fontWeight={600}
                            fontSize="20px"
                            color={MifinColor.black}
                          >
                            Phone Number
                          </Text>
                          <Text
                            fontWeight={400}
                            fontSize="15px"
                            color={MifinColor.blue_300}
                            _hover={{ cursor: "pointer" }}
                          >
                            + Add New
                          </Text>
                        </Flex>
                      </PopoverContent>
                    </Popover>

                    <Popover arrowSize={20} variant="responsive">
                      <PopoverTrigger>
                        <Box display={"flex"} mr={4} alignItems={"center"}>
                          {" "}
                          <Box height="20px">
                            <Image
                              src={locationLogo}
                              height="100%"
                              alt="logo"
                            />
                          </Box>
                          {/* <Text paddingLeft={2}>
                            {allAddresses ?? "location"}
                          </Text> */}
                          <Image
                            src={burger}
                            alt="img"
                            width="11px"
                            height="9px"
                            mt={{ sm: "none", md: 1 }}
                            ml={{ sm: 2, md: "none" }}
                            position="relative"
                            sx={{
                              "&:hover": {
                                cursor: "pointer",
                              },
                            }}
                          />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent
                        width={{ base: "300px", md: "fit-content" }}
                        padding={"10px"}
                      >
                        <PopoverArrow />
                        <PopoverHeader>
                          <Flex
                            width={{ sm: "auto", md: "535px" }}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Text
                              fontWeight={700}
                              fontSize={"16px"}
                              fontFamily={"Roboto"}
                            >
                              Addresses
                            </Text>
                            <Button variant={"ghost"} isDisabled={true}>
                              <Text color={"blue"} fontFamily={"Inter"}>
                                + Add new Address
                              </Text>
                            </Button>
                          </Flex>
                        </PopoverHeader>
                        <TableContainer width={"fit-content"}>
                          <Table size={"sm"}>
                            <Thead>
                              <Tr>
                                <Th color={"#4A5568"} fontSize={"12px"}>
                                  Type
                                </Th>
                                <Th color={"#4A5568"} fontSize={"12px"}>
                                  Address
                                </Th>
                                <Th color={"#4A5568"} fontSize={"12px"}>
                                  Added On
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>{allAddresses ?? "location"}</Tbody>
                          </Table>
                        </TableContainer>
                      </PopoverContent>
                      {/* <PopoverContent>
                        <PopoverArrow />
                        <Flex
                          width={{ sm: "auto", md: "535px" }}
                          flexDir={"column"}
                          sx={profilePopoverArrowStyling}
                        >
                          <Text
                            fontWeight={600}
                            fontSize="20px"
                            color={MifinColor.black}
                          >
                            Select Pickup Address
                          </Text>
                          <Text
                            fontWeight={400}
                            fontSize="15px"
                            color={MifinColor.blue_300}
                            _hover={{ cursor: "pointer" }}
                          >
                            + Add New Address
                          </Text>
                        </Flex>
                      </PopoverContent> */}
                    </Popover>

                    <Box display={"flex"} alignItems={"center"}>
                      <Box height="16px">
                        <Image src={mailLogo} height="100%" alt="logo" />
                      </Box>
                      <Tooltip label={emailId ?? ""} placement="top" hasArrow>
                        <Text paddingLeft={2} fontSize="14px">
                          {emailId ?? ""}
                        </Text>
                      </Tooltip>
                    </Box>

                    {/* </Flex> */}
                  </Flex>

                  <Flex alignItems={"flex-end"}>
                    <AccordionButton
                      p={"0px"}
                      justifyContent={"flex-end"}
                      borderRadius={"300px"}
                      padding={"0 10px"}
                      _hover={{}}
                      onClick={() => {
                        setShowAccBtn(!showAccBtn);
                      }}
                    >
                      {showAccBtn && (
                        <AccordionIcon
                          ml={4}
                          bg={"#2F4CDD"}
                          color={"#FFFFFF"}
                          borderRadius={"100px"}
                          fontSize={"24px"}
                        />
                      )}
                    </AccordionButton>
                  </Flex>
                </Flex>
              </Box>
            </Box>
            <AccordionPanel
              sx={{
                maxHeight: { base: "650px", md: "300px" },
                overflowY: { base: "hidden", md: "auto" },
                overflowX: "hidden",
                padding: { base: "10px", md: "20px" },
              }}
            >
              <Divider
                sx={{
                  borderColor: "lightgrey",
                }}
              />

              <Grid
                templateColumns={{
                  base: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                }}
                margin={{
                  sm: "2px",
                  md: "12px",
                }}
                p={{
                  sm: "0px",
                  md: "10px",
                }}
              >
                {renderAccordBody}
              </Grid>
              <Flex justifyContent={"flex-end"} width={"100%"}>
                <Box>
                  {/* Accord body btn */}
                  <AccordionButton
                    padding={"10px"}
                    // display={{ base: "none", md: "block" }}
                    _hover={{}}
                    onClick={() => {
                      setShowAccBtn(!showAccBtn);
                    }}
                    // pos={"absolute"}
                  >
                    <AccordionIcon
                      bg={"#2F4CDD"}
                      color={"#FFFFFF"}
                      borderRadius={"50%"}
                      fontSize={"24px"}
                    />
                  </AccordionButton>
                </Box>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      ) : (
        <Box sx={profileBoxStyling} m="20px">
          <Flex
            // mt="5"
            flexDirection={{ base: "column", xl: "row" }}
            flexWrap={{ xxl: "wrap" }}
          >
            <Flex
              justify={{ base: "flex-start", xl: "space-between" }}
              sx={profileFlexStyling}
            >
              <Box flexGrow={1} marginRight={{ base: "50px", xl: "18px" }}>
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={{ sm: "space-between" }}
                >
                  <Text fontWeight="400" fontSize={"12px"}>
                    {t("profile.applicant")}
                  </Text>
                </Box>
                <Box display={"flex"}>
                  <Text
                    fontWeight="600"
                    fontSize={{ lg: "24px", sm: "18px" }}
                    marginRight={"20px"}
                  >
                    {customerData?.customerName
                      ?.toLowerCase()
                      .replace(/\b\w/g, char => char.toUpperCase())}
                  </Text>

                  <Flex alignItems="center">
                    <Popover arrowSize={20} variant="responsive">
                      <PopoverTrigger>
                        <Box display={"flex"} mr={4}>
                          {" "}
                          <Box height="16px">
                            <Image src={phoneLogo} height="100%" alt="logo" />
                          </Box>
                          <Text paddingLeft={2}>{mobileNo ?? ""}</Text>
                          <Image
                            src={burger}
                            alt="img"
                            width="11px"
                            height="10px"
                            mt={{ sm: "none", md: 1 }}
                            ml={{ sm: 2, md: "none" }}
                            position="relative"
                            sx={{
                              "&:hover": {
                                cursor: "pointer",
                              },
                            }}
                          />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <Flex
                          width={{ sm: "auto", md: "425px" }}
                          sx={profilePopoverArrowStyling}
                        >
                          <Text
                            fontWeight={600}
                            fontSize="20px"
                            color={MifinColor.black}
                          >
                            Phone Number
                          </Text>
                          {/* <Text
                            fontWeight={400}
                            fontSize="15px"
                            color={MifinColor.blue_300}
                            _hover={{ cursor: "pointer" }}
                          >
                            + Add New
                          </Text> */}
                        </Flex>
                      </PopoverContent>
                    </Popover>

                    <Popover arrowSize={20} variant="responsive">
                      <PopoverTrigger>
                        <Box display={"flex"} mr={4}>
                          {" "}
                          <Box height="20px">
                            <Image
                              src={locationLogo}
                              height="100%"
                              alt="logo"
                            />
                          </Box>
                          {/* <Text paddingLeft={2}>
                            {allAddresses ?? "location"}
                          </Text> */}
                          <Image
                            src={burger}
                            alt="img"
                            width="11px"
                            height="9px"
                            mt={{ sm: "none", md: 1 }}
                            ml={{ sm: 2, md: "none" }}
                            position="relative"
                            sx={{
                              "&:hover": {
                                cursor: "pointer",
                              },
                            }}
                          />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent
                        width={{ base: "300px", md: "fit-content" }}
                        padding={"10px"}
                      >
                        <PopoverArrow />
                        <PopoverHeader>
                          <Flex
                            width={{ sm: "auto", md: "535px" }}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                          >
                            <Text
                              fontWeight={700}
                              fontSize={"16px"}
                              fontFamily={"Roboto"}
                            >
                              Addresses
                            </Text>
                            <Button variant={"ghost"} isDisabled={true}>
                              <Text color={"blue"} fontFamily={"Inter"}>
                                + Add new Address
                              </Text>
                            </Button>
                          </Flex>
                        </PopoverHeader>
                        <TableContainer width={"fit-content"}>
                          <Table size={"sm"}>
                            <Thead>
                              <Tr>
                                <Th color={"#4A5568"} fontSize={"12px"}>
                                  Type
                                </Th>
                                <Th color={"#4A5568"} fontSize={"12px"}>
                                  Address
                                </Th>
                                <Th color={"#4A5568"} fontSize={"12px"}>
                                  Added On
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>{allAddresses ?? "location"}</Tbody>
                          </Table>
                        </TableContainer>
                      </PopoverContent>
                      {/* <PopoverContent>
                        <PopoverArrow />
                        <Flex
                          width={{ sm: "auto", md: "535px" }}
                          sx={profilePopoverArrowStyling}
                        >
                          <Text
                            fontWeight={600}
                            fontSize="20px"
                            color={MifinColor.black}
                          >
                            Select Pickup Address
                          </Text>
                          <Text
                            fontWeight={400}
                            fontSize="15px"
                            color={MifinColor.blue_300}
                            _hover={{ cursor: "pointer" }}
                          >
                            + Add New Address
                          </Text>
                        </Flex>
                      </PopoverContent> */}
                    </Popover>

                    <Box display={"flex"} ml={4}>
                      {" "}
                      <Popover arrowSize={20} variant="responsive">
                        <PopoverTrigger>
                          <Box display={"flex"} mr={4}>
                            {" "}
                            <Box height="16px">
                              <Image src={mailLogo} height="100%" alt="logo" />
                            </Box>
                            <Text paddingLeft={2}>{emailId ?? ""}</Text>
                            <Image
                              src={burger}
                              alt="img"
                              width="11px"
                              height="9px"
                              mt={{ sm: "none", md: 1 }}
                              ml={{ sm: 2, md: "none" }}
                              position="relative"
                              sx={{
                                "&:hover": {
                                  cursor: "pointer",
                                },
                              }}
                            />
                          </Box>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <Flex
                            width={{ sm: "auto", md: "425px" }}
                            sx={profilePopoverArrowStyling}
                          >
                            <Text
                              fontWeight={600}
                              fontSize="20px"
                              color={MifinColor.black}
                            >
                              Email Address
                            </Text>
                            {/* <Text
                              fontWeight={400}
                              fontSize="15px"
                              color={MifinColor.blue_300}
                              _hover={{ cursor: "pointer" }}
                            >
                              + Add New
                            </Text> */}
                          </Flex>
                        </PopoverContent>
                      </Popover>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Flex>
          <Box display={"flex"} flexWrap={"wrap"} ml={4}>
            <Box sx={profileBoxsStyling}>
              {lightText(t("profile.lead"))}
              {darkText(customerData?.leadCode ?? "")}
            </Box>

            <Box sx={profileBoxsStyling}>
              {lightText(t("profile.product"))}
              {darkText(customerData?.queue ?? "")}
            </Box>

            <Box sx={profileBoxsStyling}>
              {lightText(t("profile.action"))}
              {darkText(customerData?.disposition ?? "")}
            </Box>

            <Box sx={profileBoxsStyling}>
              {lightText(t("profile.generationDate"))}
              {darkText(customerData?.generationDate ?? "")}
            </Box>

            <Box sx={profileBoxsStyling}>
              {lightText(t("profile.allocatedTo"))}
              {darkText(customerData?.allocatedTo ?? "")}
            </Box>

            <Box sx={profileBoxsStyling}>
              {lightText(t("profile.source"))}
              {darkText(customerData?.source ?? "")}
            </Box>

            <Box sx={profileBoxsStyling}>
              {lightText(t("profile.leadStage"))}
              {darkText(customerData?.leadStage ?? "")}
            </Box>

            {/* <Box sx={profileBoxsStyling}>
              {lightText(t("profile.product"))}
              {darkText(customerData?.queue ?? "")}
            </Box> */}

            <Box sx={profileBoxsStyling}>
              {lightText(t("profile.campaign"))}
              {darkText(customerData?.campaign ?? "")}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Profile;
