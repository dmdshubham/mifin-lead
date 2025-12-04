import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  FormHelperText,
  InputRightElement,
  VStack,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Logo from "@mifin/assets/svgs/mobileLogo.png";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@mifin/service/mifin-auth";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_ROUTES } from "@mifin/routes/routes.constant";
import { toastFail, toastSuccess } from "@mifin/components/Toast";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import {
  loginFlexStyling,
  loginStackStyling,
  loginInnerStackStyling,
} from "@mifin/theme/style";
import { LoginDetail } from "@mifin/Interface/NewLead";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const App = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);
  const navigate = useNavigate();
  const { mutateAsync: initLogin, isLoading } = useLoginMutation();
  const { register, reset, handleSubmit } = useForm({
    mode: "onBlur",
  });

  const onSubmitHandler = async (loginDetail: LoginDetail) => {
    try {
      const requestBody = {
        deviceDetail: MASTER_PAYLOAD.deviceDetail,
        requestData: {
          userDetail: {
            password: loginDetail?.password,
            userName: loginDetail?.username,
          },
        },
      };
      await initLogin(requestBody).then((data: any) => {
        if (
          JSON.parse(data?.request?.responseText)?.statusInfo?.statusCode ===
          "200"
        ) {
          const userLoginId = data?.data?.responseData?.UserDetails?.userId;
          sessionStorage.setItem("userLoginId", userLoginId);
          reset();
          navigate(NAVIGATION_ROUTES.WORKLIST);
          toastSuccess("Login Successfully");
        } else {
          toastFail("Invalid Username or Password");
        }
      });
    } catch (error) {
      toastFail("Something went wrong")
      throw new Error(`An Error occured ${error}`);
    }
  };

  return (
    <Flex sx={loginFlexStyling}>
      <Stack sx={loginStackStyling}>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Stack sx={loginInnerStackStyling}>
              <VStack pb="3rem">
                <Box>
                  <Box height={42}>
                    <Image
                      alt={"logo"}
                      src={Logo}
                      objectFit="contain"
                      w="100%"
                      h="100%"
                    />
                  </Box>
                </Box>
                <Heading color="#1576A4">Welcome</Heading>
              </VStack>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CFaUserAlt color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    id="username"
                    placeholder="User Name"
                    {...register("username")}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300">
                    <CFaLock color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      variant="ghost"
                      aria-label="password"
                      icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      onClick={handleShowClick}
                      sx={{
                        bgColor: "transparent",
                        "&:focus": { outline: "none" },
                        color: "gray.300",
                        "&:hover": {
                          bgColor: "transparent",
                          color: "gray.300",
                        },
                      }}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={10}
                type="submit"
                variant="solid"
                colorScheme="telegram"
                width="full"
                isLoading={isLoading}
              >
                Login
              </Button>
              <VStack>
                <Box>
                  New to us? <Link color="#1576A4">Sign Up</Link>
                </Box>
              </VStack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default App;
