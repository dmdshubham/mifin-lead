import {
  Box,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { MifinColor } from "@mifin/theme/color";
import image from "@mifin/assets/svgs/image.png";
import { IoAlertSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FC } from "react";
import allocationHoldIcon from "@mifin/assets/icons/allocationHold.png";
import escalationIcon from "@mifin/assets/icons/escalation.png";
import missedIcon from "@mifin/assets/icons/missed.png";
import { cardTableProps } from "@mifin/Interface/myWorklist";

const list = ["L", "S", "SF"];

export const CardTable: FC<cardTableProps> = props => {
  const { data } = props;
  const navigate = useNavigate();

  return (
    <>
      {data &&
        data?.map((detail: cardTableProps) => {
          return (
            <Box
              key={detail.leadCode}
              display={{ sm: "flex", md: "none" }}
              flexDirection="column"
              borderRadius="15px"
              mb={3}
              border={`1px solid ${MifinColor.gray_400}`}
              p={4}
            >
              <HStack onClick={() => navigate(`/contact/${detail.leadCode}`)}>
                <Box height={"63px"} width="63px" borderRadius="10px">
                  <Image
                    src={image}
                    width="100%"
                    height="100%"
                    alt="image of person"
                  />
                </Box>
                <Box
                  display={"flex"}
                  flexDirection="column"
                  flexGrow={1}
                  alignItems="flex-start"
                >
                  <Text fontWeight={700} fontSize="15px">
                    {detail.customerName}
                  </Text>
                  <HStack mt={0}>
                    <Text fontWeight={400} fontSize="12px" opacity={"50%"}>
                      LAN
                    </Text>
                    <Text
                      color={MifinColor.blue_300}
                      onClick={() => navigate(`/contact/${detail.leadCode}`)}
                    >
                      {detail.leadCode}
                    </Text>
                  </HStack>
                  <HStack mt={0}>
                    <Text fontWeight={400} fontSize="12px" opacity={"50%"}>
                      Customer Code
                    </Text>
                    <Text
                      color={MifinColor.black}
                      fontWeight={600}
                      fontSize="12px"
                    >
                      {detail.applicantCode}
                    </Text>
                  </HStack>
                </Box>
              </HStack>
              <Grid templateColumns="repeat(2,1fr)" rowGap={4} mt={4}>
                <GridItem>
                  <Text opacity={"50%"}>OD Amount</Text>
                  <Text>Rs.{detail.odAmt}</Text>
                </GridItem>
                <GridItem>
                  <Text opacity={"50%"}>Product</Text>
                  <Text>{detail.product}</Text>
                </GridItem>
                <GridItem>
                  <Text>{detail.allocatedTo}</Text>
                </GridItem>
                <GridItem>
                  <Text opacity={"50%"}>PTP AMount</Text>
                  <Text>{detail.ptpAmt}</Text>
                </GridItem>
              </Grid>
              <HStack
                maxW={"170px"}
                sx={{
                  "& button": {
                    padding: 0,
                  },
                }}
                pt={6}
              >
                <IconButton
                  variant={"solid"}
                  colorScheme={"red"}
                  isRound
                  size={"xs"}
                  icon={<IoAlertSharp></IoAlertSharp>}
                  aria-label={"alert"}
                ></IconButton>
                {list.map(each => (
                  <IconButton
                    key={each}
                    variant={"error"}
                    size={"xs"}
                    icon={<span>{each}</span>}
                    aria-label={each}
                  ></IconButton>
                ))}
                {detail.allocated === "Y" ? (
                  <Image src={allocationHoldIcon} alt="allocationHold" />
                ) : null}

                {detail.escalated === "Y" ? (
                  <Image src={escalationIcon} alt="escalationIcon" />
                ) : null}
                {detail.followUp_Flag === "Y" ? (
                  <Image src={missedIcon} alt="escalationIcon" />
                ) : null}

                <Spacer></Spacer>
              </HStack>
            </Box>
          );
        })}
    </>
  );
};

export default CardTable;
