import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FC } from "react";
import {IModal} from "@mifin/Interface/components"

const ModalForm: FC<IModal> = ({
  children,
  renderFooter,
  title,
  isModalOpen,
  closeModal,
  submitHandler,
  maxwidth,
}) => {
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} size={"xs"}>
        <ModalOverlay />
        <form onSubmit={submitHandler}>
          <ModalContent
            maxWidth={
              maxwidth ? "20vw" : { sm: "100vw", md: "calc(100vw - 130px)" }
            }
            minHeight={{ sm: "100vh", md: "auto" }}
            // display="flex"
            // flexDirection={"column"}
            borderRadius={{ sm: "none", md: 8 }}
            marginTop={{ sm: "none", md: 20 }}
          >
            <ModalHeader>{title}</ModalHeader>

            <ModalCloseButton />
            <ModalBody display={"flex"} flexDirection="column" pt={0}>
              <Divider orientation="horizontal" />
              {children}
              <Divider orientation="horizontal" />
            </ModalBody>

            <ModalFooter>{renderFooter && renderFooter()}</ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default ModalForm;
