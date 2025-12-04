import {
  Box,
  Collapse,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ICollapse } from "@mifin/Interface/components";
import { collapeStyling } from "@mifin/theme/style";

const CardCollapse: FC<ICollapse> = props => {
  const { title, progressbar, cases, children } = props;
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box onClick={onToggle} sx={collapeStyling}>
      <HStack justifyContent={"space-between"}>
        <Text fontWeight={700} fontSize={"15px"}>
          {title}
        </Text>
        <HStack>
          {cases && !isOpen && (
            <Text fontWeight={700} fontSize={"20px"}>
              {cases}
            </Text>
          )}
          <IconButton
            variant={"ghost"}
            icon={
              isOpen ? (
                <FiChevronUp fontSize={"18px"}></FiChevronUp>
              ) : (
                <FiChevronDown fontSize={"18px"}></FiChevronDown>
              )
            }
            aria-label={"expand"}
            onClick={onToggle}
          />
        </HStack>
      </HStack>
      {progressbar && !isOpen && progressbar}
      <Collapse in={isOpen} animateOpacity>
        {children}
      </Collapse>
    </Box>
  );
};

export default CardCollapse;
