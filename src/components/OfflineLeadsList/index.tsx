import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Flex,
  Text,
  Spinner,
  useToast,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { ViewIcon, AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { useOffline } from '@mifin/hooks/OfflineContext';
import { getAllLeads, getUnsyncedLeads } from '@mifin/utils/indexedDB';
import { OfflineLeadForm } from '@mifin/components/OfflineLeadForm';

interface Lead {
  id: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

export const OfflineLeadsList: React.FC = () => {
  const { isOnline, triggerSync, syncInProgress } = useOffline();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const allLeads = await getAllLeads();
      const unsyncedLeads = await getUnsyncedLeads();
      setLeads(allLeads);
      setUnsyncedCount(unsyncedLeads.length);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        title: 'Error loading leads',
        description: 'Failed to load offline leads',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleSync = async () => {
    await triggerSync();
    await loadLeads();
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    onViewOpen();
  };

  const handleNewLeadSuccess = () => {
    onClose();
    loadLeads();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLeadName = (lead: Lead) => {
    const data = lead.data?.requestData?.leadGenerateFormVO;
    if (data) {
      return `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'N/A';
    }
    return 'N/A';
  };

  const getLeadMobile = (lead: Lead) => {
    return lead.data?.requestData?.leadGenerateFormVO?.mobile || 'N/A';
  };

  const getLeadAmount = (lead: Lead) => {
    return lead.data?.requestData?.leadGenerateFormVO?.loanAmount || 'N/A';
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Offline Leads
          </Text>
          {unsyncedCount > 0 && (
            <Badge colorScheme="orange" fontSize="sm" mt={1}>
              {unsyncedCount} pending sync
            </Badge>
          )}
        </Box>
        <Flex gap={2}>
          {unsyncedCount > 0 && isOnline && (
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="blue"
              size="sm"
              onClick={handleSync}
              isLoading={syncInProgress}
            >
              Sync Now
            </Button>
          )}
          <Button leftIcon={<AddIcon />} colorScheme="green" size="sm" onClick={onOpen}>
            New Lead
          </Button>
        </Flex>
      </Flex>

      {leads.length === 0 ? (
        <Box
          textAlign="center"
          py={10}
          bg="gray.50"
          borderRadius="md"
          border="1px"
          borderColor="gray.200"
        >
          <Text fontSize="lg" color="gray.500">
            No offline leads found
          </Text>
          <Text fontSize="sm" color="gray.400" mt={2}>
            Create a new lead to get started
          </Text>
        </Box>
      ) : (
        <Box overflowX="auto" border="1px" borderColor="gray.200" borderRadius="md">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Status</Th>
                <Th>Name</Th>
                <Th>Mobile</Th>
                <Th>Loan Amount</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {leads.map(lead => (
                <Tr key={lead.id} _hover={{ bg: 'gray.50' }}>
                  <Td>
                    <Badge colorScheme={lead.synced ? 'green' : 'orange'}>
                      {lead.synced ? 'Synced' : 'Pending'}
                    </Badge>
                  </Td>
                  <Td fontWeight="medium">{getLeadName(lead)}</Td>
                  <Td>{getLeadMobile(lead)}</Td>
                  <Td>{getLeadAmount(lead)}</Td>
                  <Td fontSize="sm" color="gray.600">
                    {formatDate(lead.timestamp)}
                  </Td>
                  <Td>
                    <Tooltip label="View details">
                      <IconButton
                        aria-label="View lead"
                        icon={<ViewIcon />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewLead(lead)}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* New Lead Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Lead</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <OfflineLeadForm onSuccess={handleNewLeadSuccess} onCancel={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* View Lead Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lead Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedLead && (
              <Box>
                <Badge
                  colorScheme={selectedLead.synced ? 'green' : 'orange'}
                  fontSize="md"
                  mb={4}
                >
                  {selectedLead.synced ? 'Synced' : 'Pending Sync'}
                </Badge>

                <Box mt={4}>
                  <Text fontWeight="bold" mb={2}>
                    Lead Information:
                  </Text>
                  <Box
                    bg="gray.50"
                    p={4}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                      {JSON.stringify(
                        selectedLead.data?.requestData?.leadGenerateFormVO,
                        null,
                        2
                      )}
                    </pre>
                  </Box>
                </Box>

                <Text fontSize="sm" color="gray.500" mt={4}>
                  Created: {formatDate(selectedLead.timestamp)}
                </Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

