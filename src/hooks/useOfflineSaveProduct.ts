import { useMutation } from 'react-query';
import { useOffline } from './OfflineContext';
import { addPendingAction, updateLeadDetailTab } from '@mifin/utils/indexedDB';
import { useSaveProductRecord } from '@mifin/service/mifin-productDetails';
import { toastSuccess, toastFail } from '@mifin/components/Toast';

export const useOfflineSaveProduct = () => {
  const { isOnline } = useOffline();
  const onlineMutation = useSaveProductRecord();

  const offlineMutation = useMutation(
    async (payload: any) => {
      // Save to pending actions
      await addPendingAction('SAVE_PRODUCT', payload);
      
      // Update the cached product details with the changes
      const leadId = payload?.requestData?.productDetail?.caseId || payload?.requestData?.leadDetail?.caseId;
      if (leadId && payload?.requestData) {
        // Update cached data with the new values
        await updateLeadDetailTab(leadId, 'product', {
          responseData: payload.requestData,
        });
        console.log('Product action queued for sync:', leadId);
      }
      
      return { success: true, message: 'Product action saved offline' };
    },
    {
      onSuccess: () => {
        toastSuccess('Product action saved offline. Will sync when online.');
      },
      onError: () => {
        toastFail('Failed to save product action offline');
      },
    }
  );

  if (isOnline) {
    return {
      ...onlineMutation,
      isOnline: true,
    };
  }

  return {
    ...offlineMutation,
    mutateAsync: async (payload: any) => {
      return offlineMutation.mutateAsync(payload);
    },
    isOnline: false,
  };
};

