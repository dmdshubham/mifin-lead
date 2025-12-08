import { useState, useEffect, useRef, useCallback } from 'react';
import { useOffline } from './OfflineContext';
import { getLeadDetails, updateLeadDetailTab } from '@mifin/utils/indexedDB';
import { useProductDetails } from '@mifin/service/mifin-productDetails';

export const useOfflineProductDetail = (requestBody: any) => {
  const { isOnline } = useOffline();
  const leadId = requestBody?.requestData?.leadDetail?.caseId;
  
  // Use the online hook
  const onlineQuery = useProductDetails(requestBody);
  
  // Offline state
  const [offlineData, setOfflineData] = useState<any>(null);
  const [isLoadingOffline, setIsLoadingOffline] = useState(false);
  const hasLoadedRef = useRef(false);

  // Save to cache when online data is fetched
  useEffect(() => {
    if (isOnline && onlineQuery.data && leadId) {
      updateLeadDetailTab(leadId, 'product', onlineQuery.data).catch(err => {
        console.error('Error caching product details:', err);
      });
    }
  }, [isOnline, onlineQuery.data, leadId]);

  // Load cached data function
  const loadCachedData = useCallback(async () => {
    if (!leadId || hasLoadedRef.current) return;
    
    hasLoadedRef.current = true;
    setIsLoadingOffline(true);
    
    try {
      const cached = await getLeadDetails(leadId);
      if (cached && cached.product) {
        console.log(`Loaded product details for ${leadId} from cache`);
        setOfflineData(cached.product);
      } else {
        console.log(`No cached product details for ${leadId}`);
        setOfflineData(null);
      }
    } catch (err) {
      console.error('Error loading cached product details:', err);
      setOfflineData(null);
    } finally {
      setIsLoadingOffline(false);
    }
  }, [leadId]);

  // Load from cache when offline
  useEffect(() => {
    if (!isOnline && leadId) {
      // Reset flag when leadId or online status changes
      if (hasLoadedRef.current) {
        hasLoadedRef.current = false;
      }
      loadCachedData();
    } else if (isOnline) {
      hasLoadedRef.current = false; // Reset when coming back online
      setOfflineData(null); // Clear offline data when online
    }
  }, [isOnline, leadId, loadCachedData]);

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

