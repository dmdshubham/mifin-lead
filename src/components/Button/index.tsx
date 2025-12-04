import { Box, Button, Spinner } from "@chakra-ui/react";
import { FC } from "react";
import { IButton } from "@mifin/Interface/components";

/* Button types 
    1) primary:- blue bg white text
    2) secondary:- white bg black border black text
    3) tertiary:- white bg blue border blue text
*/

const PrimaryButton: FC<IButton> = props => {
  const {
    title,
    onClick,
    type = "button",
    height = "auto",
    isLoading = false,
    secondary = false,
    tertiary = false,
    isDisabled = false,
    form,
    name,
  } = props;

  return (
    <Button
      type={type}
      sx={{
        "&:hover": {
          bg: secondary ? "#ffffff" : tertiary ? "#ffffff" : "#2F4CDD",
          color: secondary ? "#000000" : tertiary ? "#2F4CDD" : "#ffffff",
        },
        "&:active": {
          bg: secondary ? "#ffffff" : tertiary ? "#ffffff" : "#2F4CDD",
          color: secondary ? "#000000" : tertiary ? "#2F4CDD" : "#ffffff",
        },
      }}
      onClick={onClick}
      height={height ? height : "auto"}
      disabled={isLoading}
      border={secondary ? "1px solid #000000" : "1px solid #2F4CDD"}
      bg={secondary ? "#ffffff" : tertiary ? "#ffffff" : "#2F4CDD"}
      color={secondary ? "#000000" : tertiary ? "#2F4CDD" : "#ffffff"}
      padding={"18px 15px"}
      fontWeight={secondary ? "500" : "400"}
      fontSize={"14px"}
      isDisabled={isDisabled}
      form={form}
      name={name}
    >
      {title}

      {isLoading && (
        <Box justifyContent={"center"}>
          <Spinner size={"sm"} />
        </Box>
      )}
    </Button>
  );
};

export default PrimaryButton;
