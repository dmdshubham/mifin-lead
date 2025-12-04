import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  SimpleGrid,
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  Accordion,
} from "@chakra-ui/react";
import React, { ReactNode, useState } from "react";

interface SingleCardProps {
  data: Record<string, string | number>;
  children?: ReactNode;
}

const SingleCard: React.FC<SingleCardProps> = ({ data, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dataEntries = Object.entries(data);
  const formatKey = (key: string) => {
    if (key === "actionDate") return "Action Date Time";
    if (key.toLowerCase() === "subqueue") return "Potential";
    if (key.toLowerCase() === "queue") return "Product";
    if (key.toLowerCase() === "followupaction") return "Follow Up Action";
    if (key.toLowerCase() === "followupactiondate")
      return "Follow Up Action Date";
    if (key.toLowerCase() === "followupactiondate")
      return "Follow Up Action Date";
    return key
      .replace(/([A-Z])/g, " $1")
      .toLowerCase() // Convert entire string to lowercase
      .split(" ") // Split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
      .join(" "); // Join words back into a string
  };
  return (
    <Card
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.200"
      bg="white"
      mb="10px"
      boxShadow="0px 0px 10px 0px #00000012"
      display="flex"
      flexDirection="column"
    >
      <Divider />
      <CardBody p={4} pb={"0px"} w="100%">
        <SimpleGrid columns={2} spacing={2} fontSize="14px" color="gray.700">
          {dataEntries
            .slice(0, isExpanded ? dataEntries.length : 6)
            .map(([key, value], index) => (
              <Flex flexDirection="column" key={index} p={1} borderRadius="md">
                <Box fontWeight="semibold" color="gray.600">
                  {/* {key.replace(/([A-Z])/g, " $1").toUpperCase()} */}
                  {formatKey(key)}
                </Box>
                {/* <Box>{value == "" ? "N/A" : value}</Box> */}
                <Box>
                  {typeof value === "object" && value !== null
                    ? value.label || "" // Render `label` if it's an object
                    : value == ""
                    ? ""
                    : value}
                </Box>
              </Flex>
            ))}
        </SimpleGrid>
      </CardBody>

      {/* Accordion Button & Children Wrapper */}
      <Flex
        flexDirection="column"
        alignItems="center"
        flexDir={"row-reverse"}
        gap={2}
        p={2}
      >
        {dataEntries.length > 7 && (
          <Accordion allowToggle pb={"5px"}>
            <AccordionItem border="none">
              <AccordionButton
                p="0px"
                borderRadius="full"
                h="28px"
                w="28px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ bg: "#1E3A8A" }}
                bg="#2F4CDD"
                color="white"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <AccordionIcon fontSize="20px" />
              </AccordionButton>
            </AccordionItem>
          </Accordion>
        )}
        {children && (
          <Flex w="100%" justifyContent="flex-end">
            {children}
          </Flex>
        )}
      </Flex>
    </Card>
  );
};

export default SingleCard;
