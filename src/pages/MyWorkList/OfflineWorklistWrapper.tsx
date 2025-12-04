import React, { useEffect, useState } from 'react';
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription, Button, Flex } from '@chakra-ui/react';
import { useOffline } from '@mifin/hooks/OfflineContext';
import { getWorklist } from '@mifin/utils/indexedDB';
import toast from 'react-hot-toast';

interface OfflineWorklistWrapperProps {
  children: React.ReactNode;
  onDataLoad?: (data: any[]) => void;
  onRefresh?: () => void;
}

export const OfflineWorklistWrapper: React.FC<OfflineWorklistWrapperProps> = ({
  children,
  onDataLoad,
  onRefresh,
}) => {
  const { isOnline, pendingSyncCount, triggerSync, syncInProgress } = useOffline();
  const [hasLoadedOfflineData, setHasLoadedOfflineData] = useState(false);

  // Load offline data when offline
  useEffect(() => {
    if (!isOnline && !hasLoadedOfflineData) {
      loadOfflineData();
    }
  }, [isOnline, hasLoadedOfflineData]);

  const loadOfflineData = async () => {
    try {
      const data = await getWorklist();
      if (data && data.length > 0) {
        setHasLoadedOfflineData(true);
        if (onDataLoad) {
          onDataLoad(data);
        }
        console.log(`Loaded ${data.length} items from offline cache`);
      } else {
        console.log('No offline data available');
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  const handleSyncClick = async () => {
    await triggerSync();
    // Refresh worklist data after sync
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Box>
      {!isOnline && (
        <Alert status="warning" mb={4} borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>You are offline</AlertTitle>
            <AlertDescription>
              Showing cached data. Changes will be synced when you&apos;re back online.
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {isOnline && pendingSyncCount > 0 && (
        <Alert status="info" mb={4} borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Pending changes</AlertTitle>
            <AlertDescription>
              You have {pendingSyncCount} pending action(s) to sync.
            </AlertDescription>
          </Box>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleSyncClick}
            isLoading={syncInProgress}
            ml={2}
          >
            Sync Now
          </Button>
        </Alert>
      )}

      {children}
    </Box>
  );
};

