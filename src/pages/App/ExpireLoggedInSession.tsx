import { FC, useEffect, useRef } from "react";
import {
  Box,
  ModalBody,
  Modal,
  ModalContent,
  Button,
  ModalOverlay,
  Flex,
} from "@chakra-ui/react";
import { toastFail } from "@mifin/components/Toast";
import { useSessionStore } from "@mifin/store/useSessionStore";

const ExpireLoggedInSession: FC = () => {
  const {
    counter,
    isModalOpen,
    incrementCounter,
    resetCounter,
    openModal,
    closeModal,
    handleSessionClose,
  } = useSessionStore();
  const intervalRef = useRef<number | null>(null);
  const modalTimeoutRef = useRef<number | null>(null);
  const FIVE_MINUTE = 5 * 60;
  const SIX_MINUTE = 6 * 60;
  const ONE_MINUTE = 60;
  const hostName = window.location.hostname;
  const isLocalHost =
    hostName === "localhost" || hostName === "127.0.0.1" || hostName === "";

  useEffect(() => {
    // eslint-disable-next-line no-constant-condition
    if (isLocalHost) {
      sessionStorage.setItem(
        "jwt",
        "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJqYXZhaW51c2UiLCJleHAiOjE3NjY5MDI0MjYsImlhdCI6MTc2NDMxMDQyNn0.A0FS5maj8U7chsv21iUGl26DG4q1Y5okgUopXvKJXmcvq-Fw5Meqdu5v_7bwtsrmOwHl_E9NYs37GbHLutOMYOA6GJ7UeVQeDtnYjYun3ROdZLWH2uA0FGCsxdKoAcmyokRTF2hcF_b3MAXO-FYhpE0abDie0rMPcpCZC46Poc7LTHYEOuyGKT9057sm1mD72vogpcARfK-1z2yF9F7-lswckJ2Ur01EkM4ahVh38oTtzSGUcZAxzvWpnu_G1HrLt_OwdnlGI0O0c2A9Vi7OljLzSia4LoF-BVmAeTGgyvGuHrBKsqSrgpdbxiuRiGxq2S1753ipJDEqVHFtXu63Lg"
      );
      sessionStorage.setItem(
        "jwt2",
        "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJqYXZhaW51c2UiLCJleHAiOjE3NjY5MDI0MjYsImlhdCI6MTc2NDMxMDQyNn0.A0FS5maj8U7chsv21iUGl26DG4q1Y5okgUopXvKJXmcvq-Fw5Meqdu5v_7bwtsrmOwHl_E9NYs37GbHLutOMYOA6GJ7UeVQeDtnYjYun3ROdZLWH2uA0FGCsxdKoAcmyokRTF2hcF_b3MAXO-FYhpE0abDie0rMPcpCZC46Poc7LTHYEOuyGKT9057sm1mD72vogpcARfK-1z2yF9F7-lswckJ2Ur01EkM4ahVh38oTtzSGUcZAxzvWpnu_G1HrLt_OwdnlGI0O0c2A9Vi7OljLzSia4LoF-BVmAeTGgyvGuHrBKsqSrgpdbxiuRiGxq2S1753ipJDEqVHFtXu63Lg"
      );
    }
    if (!isLocalHost) {
      intervalRef.current = window.setInterval(() => {
        incrementCounter();
      }, 1000);
      const resetCounterOnActivity = () => resetCounter();
      window.addEventListener("mousemove", resetCounterOnActivity);
      window.addEventListener("keydown", resetCounterOnActivity);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        window.removeEventListener("mousemove", resetCounterOnActivity);
        window.removeEventListener("keydown", resetCounterOnActivity);
      };
    }
  }, [isLocalHost, incrementCounter, resetCounter]);

  const handleResetSession = () => {
    resetCounter();
    closeModal();
    if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
  };

  useEffect(() => {
    if (counter > FIVE_MINUTE && counter < SIX_MINUTE) {
      openModal();

      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = window.setTimeout(() => {
        toastFail("Session expired due to inactivity");
        handleSessionClose();
      }, ONE_MINUTE * 1000);
    } else if (counter === SIX_MINUTE) {
      toastFail("Session expired");
      handleSessionClose();
    }
  }, [counter, openModal, handleSessionClose]);

  useEffect(() => {
    if (!isModalOpen && modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }
  }, [isModalOpen]);

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} isCentered size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody textAlign={"center"}>
          <Box mb={"10px"}>
            Session is about to expire. Do you wish to continue?
          </Box>
          <Flex gap={"10px"} justifyContent={"center"}>
            <Button size={"sm"} onClick={handleResetSession}>
              Okay
            </Button>
            <Button size={"sm"} onClick={handleSessionClose}>
              Cancel
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExpireLoggedInSession;
