import React, { useState } from "react";
import {
  Box,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  useDisclosure,
} from "@chakra-ui/react";
import PrimaryButton from "@mifin/components/Button";
import { t } from "i18next";
import ModalForm from "@mifin/components/Modal";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@chakra-ui/icons";
import CardPagination from "@mifin/components/common/CardPagination";
import SingleCard from "@mifin/components/common";

const Modal = ({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ModalForm
      title={t("Escalation/Referral History")}
      isModalOpen={isOpen}
      closeModal={onClose}
    >
      <Box overflowX={"auto"}>
        <CardPagination
          data={data || []}
          itemsPerPage={5}
          renderComponent={single => (
            <SingleCard key={single.id} data={single} />
          )}
        />
      </Box>
    </ModalForm>
  );
};

function EscalationReferralHistoryCards({ data }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ptpData = data ?? [];
  const hasMoreThanOne = ptpData.length > 1;

  return (
    <Box>
      {/* {ptpData.length > 0 && <SingleCard data={ptpData[0]} />} */}
      {ptpData.length > 0 && (
        <SingleCard
          data={Object.fromEntries(
            Object.entries(ptpData[0]).map(([key, value]) => [
              key,
              typeof value === "string" ? value.toUpperCase() : value,
            ])
          )}
        />
      )}
      {ptpData.length == 0 && (
        <Center fontSize={{ base: "16px", md: "18px" }}>No data found</Center>
      )}

      {hasMoreThanOne && (
        <Center mt={2}>
          <PrimaryButton tertiary title={t("View All")} onClick={onOpen} />
        </Center>
      )}
      <Modal isOpen={isOpen} onClose={onClose} data={data} />
    </Box>
  );
}

export default EscalationReferralHistoryCards;
