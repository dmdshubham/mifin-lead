import { useMutation } from 'react-query';
import { useOffline } from './OfflineContext';
import { addPendingAction, updateLeadDetailTab } from '@mifin/utils/indexedDB';
import { useSaveCustomerRecord } from '@mifin/service/mifin-customerDetails';
import { toastSuccess, toastFail } from '@mifin/components/Toast';

export const useOfflineSaveCustomer = () => {
  const { isOnline } = useOffline();
  const onlineMutation = useSaveCustomerRecord();

  const offlineMutation = useMutation(
    async (payload: any) => {
      // Save to pending actions
      await addPendingAction('SAVE_CUSTOMER', payload);
      
      // Update the cached customer details with the changes
      const leadId = payload?.requestData?.customerDetail?.caseId;
      if (leadId && payload?.requestData?.customerDetail) {
        // Update cached data with the new values
        await updateLeadDetailTab(leadId, 'customer', {
          responseData: {
            customerDetail: payload.requestData.customerDetail,
          },
        });
        console.log('Customer action queued for sync:', leadId);
      }
      
      return { success: true, message: 'Customer action saved offline' };
    },
    {
      onSuccess: () => {
        toastSuccess('Customer action saved offline. Will sync when online.');
      },
      onError: () => {
        toastFail('Failed to save customer action offline');
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

