import { Box, Flex, Text, Badge, IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { RepeatIcon, WarningIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { useOffline } from '@mifin/hooks/OfflineContext';
import { FC } from 'react';

export const OnlineStatusIndicator: FC = () => {
  const { isOnline, pendingSyncCount, syncInProgress, lastSyncTime, triggerSync } = useOffline();
  const toast = useToast();

  const handleSyncClick = async () => {
    if (!isOnline) {
      toast({
        title: 'No internet connection',
        description: 'Please check your internet connection and try again.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await triggerSync();
  };

  if (isOnline && pendingSyncCount === 0) {
    return (
      <Tooltip label="Online and synced" placement="bottom">
        <Badge
          colorScheme="green"
          display="flex"
          alignItems="center"
          gap={1}
          px={3}
          py={1}
          borderRadius="md"
        >
          <CheckCircleIcon />
          <Text fontSize="sm">Online</Text>
        </Badge>
      </Tooltip>
    );
  }

  if (!isOnline) {
    return (
      <Tooltip label="Working offline. Changes will sync when online." placement="bottom">
        <Badge
          colorScheme="red"
          display="flex"
          alignItems="center"
          gap={1}
          px={3}
          py={1}
          borderRadius="md"
        >
          <WarningIcon />
          <Text fontSize="sm">Offline</Text>
          {pendingSyncCount > 0 && (
            <Badge colorScheme="orange" ml={1}>
              {pendingSyncCount}
            </Badge>
          )}
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Flex alignItems="center" gap={2}>
      <Badge
        colorScheme="yellow"
        display="flex"
        alignItems="center"
        gap={1}
        px={3}
        py={1}
        borderRadius="md"
      >
        <WarningIcon />
        <Text fontSize="sm">Pending Sync</Text>
        <Badge colorScheme="orange" ml={1}>
          {pendingSyncCount}
        </Badge>
      </Badge>
      <Tooltip label="Click to sync now" placement="bottom">
        <IconButton
          aria-label="Sync now"
          icon={<RepeatIcon />}
          size="sm"
          colorScheme="blue"
          isLoading={syncInProgress}
          onClick={handleSyncClick}
          variant="outline"
        />
      </Tooltip>
      {lastSyncTime && (
        <Text fontSize="xs" color="gray.500">
          Last sync: {lastSyncTime.toLocaleTimeString()}
        </Text>
      )}
    </Flex>
  );
};

