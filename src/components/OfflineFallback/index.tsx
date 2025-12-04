import React from 'react';
import { Box, VStack, Heading, Text, Button, Icon, useColorModeValue } from '@chakra-ui/react';
import { FiWifiOff, FiRefreshCw } from 'react-icons/fi';

interface OfflineFallbackProps {
  onRetry?: () => void;
  message?: string;
}

export const OfflineFallback: React.FC<OfflineFallbackProps> = ({ 
  onRetry,
  message = "You're currently offline" 
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
      p={4}
    >
      <VStack spacing={6} textAlign="center" maxW="md">
        <Icon as={FiWifiOff} boxSize={16} color="gray.400" />
        
        <VStack spacing={2}>
          <Heading size="lg" color="gray.700">
            {message}
          </Heading>
          <Text color={textColor} fontSize="md">
            Please check your internet connection and try again.
          </Text>
          <Text color={textColor} fontSize="sm" mt={2}>
            {`Don't worry, your data is safe. Any changes made offline will be synced when you're back online.`}
          </Text>
        </VStack>

        <Button
          leftIcon={<Icon as={FiRefreshCw} />}
          colorScheme="blue"
          size="lg"
          onClick={handleRetry}
        >
          Retry Connection
        </Button>

        <Box mt={4} p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
          <Text fontSize="sm" color="blue.700">
            💡 <strong>Tip:</strong> You can still view cached data and create new leads offline. 
            {`They will be automatically synced when you're back online.`}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default OfflineFallback;

