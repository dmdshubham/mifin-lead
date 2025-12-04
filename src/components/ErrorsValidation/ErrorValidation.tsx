import { Portal, Box, Flex, IconButton } from "@chakra-ui/react";
import { MifinColor } from "@mifin/theme/color";
import { FC, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useDisclosure } from "@chakra-ui/react";
import { IErrorValidationProps } from "@mifin/Interface/components";
import {
  errorValidationStyling,
  errorValidationBoxStyling,
} from "@mifin/theme/style";

const ErrorValidation: FC<IErrorValidationProps> = props => {
  const { errors } = props;
  const { isOpen, onToggle } = useDisclosure();
  const [visibleItems, setVisibleItems] = useState(4);
  const errorsList = Object.values(errors);
  const cases = Object.keys(errors).length;

  //const itemsToShow = errorsList.slice(0, visibleItems);
  // let array=[]
  // if(errorsList.length>4){
  //    array=errorsList.slice(4)
  // }

  return (
    <Portal>
      <Box
        backgroundColor={MifinColor.gray_900}
        border={`1px solid ${MifinColor.gray_150}`}
        w={isOpen ? "300px" : "200px"}
        h={isOpen ? "200px" : "50px"}
        sx={errorValidationStyling}
      >
        <Flex justify={"space-between"} align={"center"} pl={"2px"}>
          <Box sx={errorValidationBoxStyling}>{cases} Errors</Box>
          <Box>
            <IconButton
              variant={"ghost"}
              color={"white"}
              icon={
                isOpen ? (
                  <>
                    <FiChevronDown fontSize={"18px"}></FiChevronDown>
                  </>
                ) : (
                  <>
                    <FiChevronUp fontSize={"18px"}></FiChevronUp>
                  </>
                )
              }
              aria-label={"expand"}
              onClick={onToggle}
            ></IconButton>
          </Box>
        </Flex>
        <Box
          fontSize="12px"
          color={"white"}
          display={isOpen ? "block" : "none"}
        >
          {errorsList.slice(0, visibleItems).map((item: any, idx: any) => {
            return <p key={idx}>{item}</p>;
          })}
          {visibleItems < errorsList.length && (
            <button onClick={() => setVisibleItems(visibleItems + 10)}>
              +{errorsList.length - 4} more
            </button>
          )}
        </Box>
      </Box>
    </Portal>
  );
};

export default ErrorValidation;
