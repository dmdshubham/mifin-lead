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
      title={t("Dunning History")}
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

function DunningHistoryCards() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const [filterTable, setFilterTable] = useState<any>(null);

  const dataSource = [
    {
      dunningTemplate: "A template",
      dunningMode: "Mode",
      dunningDate: "12-06-2023",
      dunningBy: "Ss",
      remarks: "y",
    },
    {
      dunningTemplate: "B template",
      dunningMode: "Mode",
      dunningDate: "12-06-2023",
      dunningBy: "tt",
      remarks: "y",
    },
    {
      dunningTemplate: "c template",
      dunningMode: "Mode",
      dunningDate: "12-06-2023",
      dunningBy: "tt",
      remarks: "n",
    },
  ];

  const handleChange = (value: any) => {
    const filterTable = dataSource.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilterTable(filterTable);
  };

  return (
    <Box>
      {/* {dataSource.length > 0 && <SingleCard data={dataSource[0]} />} */}
      {dataSource.length > 0 && (
        <SingleCard
          data={Object.fromEntries(
            Object.entries(dataSource[0]).map(([key, value]) => [
              key,
              typeof value === "string" ? value.toUpperCase() : value,
            ])
          )}
        />
      )}

      {dataSource.length == 0 && (
        <Center fontSize={{ base: "14px", md: "18px" }}>No data found</Center>
      )}

      {dataSource.length > 1 && (
        <Center mt={2}>
          <PrimaryButton tertiary title={t("View All")} onClick={onOpen} />
        </Center>
      )}
      <Modal isOpen={isOpen} onClose={onClose} data={dataSource} />
    </Box>
  );
}

export default DunningHistoryCards;
