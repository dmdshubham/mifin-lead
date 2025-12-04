import {
  Button,
  HStack,
  StackItem,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { validationComponentPeops } from "@mifin/Interface/Customer";
import ShowError from "@mifin/components/ErrorMessage";
import ChangesWrapper from "@mifin/components/apiToast";
import { useLoanStatusForAllScreen } from "@mifin/store/useLoanStatusForAllScreen";
import { MifinColor } from "@mifin/theme/color";
import { FC, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

// const saveAndExitStyle = {
//   "&:hover": {
//     bg: MifinColor.gray_300,
//     color: "#fff",
//   },
//   "&:active": {
//     bg: MifinColor.gray_300,
//     color: "#fff",
//   },
// };

const ValidationComponent: FC<validationComponentPeops> = props => {
  const {
    tabKey = true,
    onClick,
    isSubmitting,
    onInputNavigate,
    showActionButtons,
    pathName,
    setClickedButtonName,
    buttonClickStatus,
    setButtonClickStatus,
    isSaveButtonVisible = true,
    isSaveAndExitButtonVisible = true,
    initialValues,
    onReset
  } = props;
  const { t } = useTranslation();
  const {
    formState: { errors, isDirty },
    trigger,
    reset,
  } = useFormContext();

  const handleReset = () => {
    reset(initialValues);
    setButtonClickStatus({
      save: true,
      saveAndExit: false,
    });
    if (onReset) {
      onReset();
    }
  };

  const isDisabled = pathName == "newlead" && buttonClickStatus?.save;
  //const isLoading = pathName === "newlead" && isSubmitting;

  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  // const handleSaveAndExit = (
  //   e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  // ) => {
  //   const { name } = e.target;
  //   e.preventDefault();
  //   setButtonClickStatus({
  //     saveAndExit: true,
  //     save: false,
  //   });

  //   onClick().then(() => {
  //     setClickedButtonName && setClickedButtonName(name);
  //   });
  // };

  const handleSaveAndReset = (e: any) => {
  e.preventDefault();
  if (pathName === "") {
    setButtonClickStatus(() => ({
      save: true,
      cancel: false,
    }));
    
    onClick().then((data) => {
      setClickedButtonName && setClickedButtonName(e?.target?.name);
      if (data?.payload?.responseData?.error?.toLowerCase() === "s") {
        if (onReset) {
          onReset();
        }
        reset(initialValues);
      }
    });
  } else {
    onClick().then((data) => {
      setClickedButtonName && setClickedButtonName(e?.target?.name);
      if (data?.payload?.responseData?.error?.toLowerCase() === "s") {
        if (onReset) {
          onReset();
        }
        reset(initialValues);
      }
    });
  }
};


  useEffect(() => {
    trigger();
  }, [isDirty, trigger]);

  if (Object.values(errors).length === 1 && errors?.nickName) {
    return null;
  }
  const loanStatusStore = useLoanStatusForAllScreen();

  return (
    <>
      {loanStatusStore.hideValidationComponent
        ? null
        : Object.values(errors).length > 0 && (
            <ShowError
              error={
                errors.nickName
                  ? Object.values(errors).length - 1
                  : Object.values(errors).length
              }
              ErrorMessage={errors}
              onInputNavigate={onInputNavigate}
            />
          )}

      {loanStatusStore.hideValidationComponent
        ? null
        : (tabKey || showActionButtons) &&
          Object.values(errors).length == 0 && (
            <ChangesWrapper>
              <HStack gap={5}>
                {!isMobile && (
                  <StackItem>
                    <Text fontWeight={400} fontSize="15px">
                      {t("common.youHaveChangesToBeSaved")}
                    </Text>
                  </StackItem>
                )}
                {isSaveAndExitButtonVisible && (
                  <StackItem>
                    <Button
                      type="button"
                      fontWeight={500}
                      fontSize={"14px"}
                      backgroundColor={MifinColor.gray_300}
                      border="1px solid #FFF"
                      sx={{
                        "&:hover": {
                          bg: MifinColor.gray_300,
                          color: "#fff",
                        },
                        "&:active": {
                          bg: MifinColor.gray_300,
                          color: "#fff",
                        },
                      }}
                      onClick={handleReset}
                    >
                      {t("common.cancel")}
                    </Button>
                  </StackItem>
                )}
                {/* {isSaveAndExitButtonVisible && (
              <StackItem>
                <Button
                  fontWeight={500}
                  name="saveAndExit"
                  isLoading={isLoading && buttonClickStatus?.saveAndExit}
                  fontSize={"14px"}
                  backgroundColor={MifinColor.gray_300}
                  border="1px solid #FFF"
                 sx={saveAndExitStyle}
                  onClick={(
                    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
                  ) => handleSaveAndExit(e)}
                >
                  {t("common.saveAndExit")}
                </Button>
              </StackItem>
            )} */}

                {isSaveButtonVisible && (
                  <StackItem w={"80px"}>
                    <Button
                      title="Save"
                      isLoading={isSubmitting}
                      isDisabled={isDisabled || isSubmitting}
                      backgroundColor={MifinColor.blue_300}
                      name="save"
                      // onClick={(e: any) => {
                      //   if (pathName === "") {
                      //     setButtonClickStatus(() => ({
                      //       save: true,
                      //       cancel: false,
                      //     }));
                      //     e.preventDefault();
                      //     onClick().then(() => {
                      //       setClickedButtonName(e?.target?.name);
                      //     });
                      //   } else {
                      //     e.preventDefault();
                      //     onClick().then(() => {
                      //       setClickedButtonName(e?.target?.name);
                      //     });
                      //   }
                      // }}
                      onClick={handleSaveAndReset}
                    >
                      {t("common.save")}
                    </Button>
                  </StackItem>
                )}
              </HStack>
            </ChangesWrapper>
          )}
    </>
  );
};

export default ValidationComponent;
