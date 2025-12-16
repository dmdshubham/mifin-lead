import { FC, useEffect } from 'react';
import { Box, Spinner, Text, Progress, Alert, AlertIcon } from '@chakra-ui/react';
import { usePincodeData } from '@mifin/hooks/usePincodeData';

interface PincodeDataLoaderProps {
  children: React.ReactNode;
  showLoadingOverlay?: boolean;
}

/**
 * Component to handle pincode data initialization
 * Wrap your app or specific routes with this component
 */
const PincodeDataLoader: FC<PincodeDataLoaderProps> = ({ 
  children, 
  showLoadingOverlay = true 
}) => {
  const { isLoading, isInitialized, error } = usePincodeData();

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load location data: {error}
      </Alert>
    );
  }

  // Show loading overlay only on first load
  if (isLoading && !isInitialized && showLoadingOverlay) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="rgba(255, 255, 255, 0.95)"
        zIndex="9999"
      >
        <Box textAlign="center" maxW="400px" px={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
            mb={4}
          />
          <Text fontSize="lg" fontWeight="medium" mb={2}>
            Loading location database...
          </Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            This is a one-time setup. Please wait a moment.
          </Text>
          <Progress size="xs" isIndeterminate colorScheme="blue" />
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
};

export default PincodeDataLoader;

