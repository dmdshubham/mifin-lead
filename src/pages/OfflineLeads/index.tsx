import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { OfflineLeadsList } from '@mifin/components/OfflineLeadsList';

const OfflineLeadsPage: React.FC = () => {
  return (
    <Box pt={{ base: 2, md: 8 }} pb={8}>
      <Container maxW="container.xl">
        <Heading mb={6}>Offline Leads Management</Heading>
        <OfflineLeadsList />
      </Container>
    </Box>
  );
};

export default OfflineLeadsPage;

