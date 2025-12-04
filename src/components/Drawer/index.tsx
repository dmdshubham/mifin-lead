import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Stack,
} from "@chakra-ui/react";
import { FC } from "react";
import { IDrawerComponentsProps } from "@mifin/Interface/components";
import { useTranslation } from "react-i18next";

const DrawerComponent: FC<IDrawerComponentsProps> = props => {
  const {
    children,
    renderFooter,
    title,
    width,
    isModalOpen,
    closeModal,
    resetForm,
    submitHandler,
    setSelState,
  } = props;
  const { t } = useTranslation();

  return (
    <Drawer
      isOpen={isModalOpen}
      placement="right"
      onClose={() => {
        closeModal();
        setSelState && setSelState("");
      }}
    >
      <DrawerOverlay />
      <form onSubmit={submitHandler}>
        <DrawerContent
          marginX={{ sm: 0, md: 4 }}
          marginY={4}
          borderRadius={"10px"}
          maxWidth={width ? width : "484px"}
        >
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">{title}</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">{children}</Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                closeModal();
                resetForm && resetForm();
                setSelState && setSelState("");
              }}
              height="38px"
            >
              {t("common.cancel")}
              {/* Cancel */}
            </Button>
            {renderFooter && renderFooter}
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default DrawerComponent;
