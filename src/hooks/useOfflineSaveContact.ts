import { useMutation } from 'react-query';
import { useOffline } from './OfflineContext';
import { addPendingAction, saveContactDetails } from '@mifin/utils/indexedDB';
import { useSaveContactRecord } from '@mifin/service/service-contactDetail';
import { toastSuccess, toastFail } from '@mifin/components/Toast';

export const useOfflineSaveContact = () => {
  const { isOnline } = useOffline();
  const onlineMutation = useSaveContactRecord();

  const offlineMutation = useMutation(
    async (payload: any) => {
      // Save to pending actions
      await addPendingAction('SAVE_CONTACT', payload);
      
      // Optionally update the cached contact details with the changes
      const leadId = payload?.requestData?.contactRecordDetail?.caseId;
      if (leadId) {
        // You might want to merge the changes with existing cached data
        console.log('Contact action queued for sync:', leadId);
      }
      
      return { success: true, message: 'Contact action saved offline' };
    },
    {
      onSuccess: () => {
        toastSuccess('Contact action saved offline. Will sync when online.');
      },
      onError: () => {
        toastFail('Failed to save contact action offline');
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

