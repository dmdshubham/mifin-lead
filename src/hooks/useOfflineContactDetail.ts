import { useState, useEffect } from 'react';
import { useOffline } from './OfflineContext';
import { saveContactDetails, getContactDetails } from '@mifin/utils/indexedDB';
import { useContactDetail as useOnlineContactDetail } from '@mifin/service/service-contactDetail';

export const useOfflineContactDetail = (requestBody: any) => {
  const { isOnline } = useOffline();
  const leadId = requestBody?.requestData?.leadDetail?.caseId;
  
  // Use the online hook
  const onlineQuery = useOnlineContactDetail(requestBody);
  
  // Offline state
  const [offlineData, setOfflineData] = useState<any>(null);
  const [isLoadingOffline, setIsLoadingOffline] = useState(false);

  // Save to cache when online data is fetched
  useEffect(() => {
    if (isOnline && onlineQuery.data && leadId) {
      saveContactDetails(leadId, onlineQuery.data).catch(err => {
        console.error('Error caching contact details:', err);
      });
    }
  }, [isOnline, onlineQuery.data, leadId]);

  // Load from cache when offline
  useEffect(() => {
    if (!isOnline && leadId) {
      setIsLoadingOffline(true);
      getContactDetails(leadId)
        .then(cached => {
          if (cached) {
            console.log(`Loaded contact details for ${leadId} from cache`);
            setOfflineData(cached.data);
          } else {
            console.log(`No cached contact details for ${leadId}`);
          }
        })
        .catch(err => {
          console.error('Error loading cached contact details:', err);
        })
        .finally(() => {
          setIsLoadingOffline(false);
        });
    }
  }, [isOnline, leadId]);

  // Return online data when online, offline data when offline
  if (isOnline) {
    return {
      data: onlineQuery.data,
      isLoading: onlineQuery.isLoading,
      refetch: onlineQuery.refetch,
      error: onlineQuery.error,
      isOnline: true,
    };
  }

  return {
    data: offlineData,
    isLoading: isLoadingOffline,
    refetch: async () => {
      // No refetch possible offline
      return Promise.resolve(offlineData);
    },
    error: null,
    isOnline: false,
  };
};

