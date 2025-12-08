import {
  getPendingActions,
  deletePendingAction,
  incrementActionRetryCount,
  markLeadAsSynced,
  getUnsyncedLeads,
  updateActionError,
  updateActionStatus,
} from './indexedDB';
import { store } from '@mifin/redux/store';
import { manageNewLead } from '@mifin/redux/service/manageNewLead/api';

const MAX_RETRY_COUNT = 3;

interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors: Array<{ actionId: number; error: string }>;
}

export const syncPendingActions = async (): Promise<SyncResult> => {
  const result: SyncResult = {
    success: true,
    syncedCount: 0,
    failedCount: 0,
    errors: [],
  };

  try {
    const pendingActions = await getPendingActions();
    
    if (pendingActions.length === 0) {
      return result;
    }

    for (const action of pendingActions) {
      try {
        // Skip if max retries exceeded
        if (action.retryCount >= MAX_RETRY_COUNT) {
          console.warn(`Action ${action.id} exceeded max retries, skipping`);
          if (action.id) {
            await updateActionError(action.id, 'Max retries exceeded');
            await deletePendingAction(action.id);
          }
          result.failedCount++;
          continue;
        }

        // Update status to syncing
        if (action.id) {
          await updateActionStatus(action.id, 'syncing');
        }

        let syncSuccess = false;
        let syncError = '';

        try {
          switch (action.type) {
            case 'CREATE_LEAD': {
              const result = await syncCreateLead(action.payload);
              syncSuccess = result.success;
              if (!result.success && result.error) {
                syncError = result.error;
              }
              break;
            }
            case 'UPDATE_LEAD':
              syncSuccess = await syncUpdateLead(action.payload);
              break;
            case 'DELETE_LEAD':
              syncSuccess = await syncDeleteLead(action.payload);
              break;
            case 'REALLOCATE':
              syncSuccess = await syncReallocation(action.payload);
              break;
            case 'SAVE_CONTACT':
              syncSuccess = await syncSaveContact(action.payload);
              break;
            case 'SAVE_CUSTOMER':
              syncSuccess = await syncSaveCustomer(action.payload);
              break;
            case 'SAVE_PRODUCT':
              syncSuccess = await syncSaveProduct(action.payload);
              break;
            default:
              console.warn(`Unknown action type: ${action.type}`);
              syncError = `Unknown action type: ${action.type}`;
          }
        } catch (syncErr) {
          syncError = syncErr instanceof Error ? syncErr.message : 'Sync failed';
        }

        if (syncSuccess) {
          if (action.id) {
            await deletePendingAction(action.id);
          }
          result.syncedCount++;
        } else {
          if (action.id) {
            await incrementActionRetryCount(action.id);
            await updateActionError(action.id, syncError || 'Sync failed');
          }
          result.failedCount++;
          result.errors.push({
            actionId: action.id || 0,
            error: syncError || 'Sync failed',
          });
        }
      } catch (error) {
        console.error(`Error syncing action ${action.id}:`, error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        if (action.id) {
          await incrementActionRetryCount(action.id);
          await updateActionError(action.id, errorMsg);
        }
        result.failedCount++;
        result.errors.push({
          actionId: action.id || 0,
          error: errorMsg,
        });
      }
    }

    // Sync unsynced leads
    await syncUnsyncedLeads();

    result.success = result.failedCount === 0;
  } catch (error) {
    console.error('Error in syncPendingActions:', error);
    result.success = false;
  }

  return result;
};

const syncCreateLead = async (payload: any): Promise<{ success: boolean; error?: string }> => {
  try {
    const response: any = await store.dispatch(manageNewLead(payload));
    
    if (response?.payload?.responseData?.error?.toLowerCase() === 's') {
      // Mark lead as synced if it was stored locally
      if (payload.localLeadId) {
        await markLeadAsSynced(payload.localLeadId);
      }
      return { success: true };
    }
    
    // Capture the actual error message from API
    const errorMessage = response?.payload?.responseData?.errorMessage || 
                        response?.payload?.responseData?.message ||
                        'Sync failed';
    return { success: false, error: errorMessage };
  } catch (error) {
    console.error('Error syncing create lead:', error);
    const errorMsg = error instanceof Error ? error.message : 'Sync failed';
    return { success: false, error: errorMsg };
  }
};

const syncUpdateLead = async (payload: any): Promise<boolean> => {
  try {
    // Implement update lead sync logic
    // This would call the appropriate API endpoint
    // For now, returning true as placeholder
    console.log('Syncing update lead:', payload);
    return true;
  } catch (error) {
    console.error('Error syncing update lead:', error);
    return false;
  }
};

const syncDeleteLead = async (payload: any): Promise<boolean> => {
  try {
    // Implement delete lead sync logic
    // This would call the appropriate API endpoint
    console.log('Syncing delete lead:', payload);
    return true;
  } catch (error) {
    console.error('Error syncing delete lead:', error);
    return false;
  }
};

const syncReallocation = async (payload: any): Promise<boolean> => {
  try {
    // Implement reallocation sync logic
    // This would call the appropriate API endpoint
    console.log('Syncing reallocation:', payload);
    return true;
  } catch (error) {
    console.error('Error syncing reallocation:', error);
    return false;
  }
};

const syncSaveContact = async (payload: any): Promise<boolean> => {
  try {
    // Import the save contact function
    const { MifinHttpClient } = await import('@mifin/service/service-axios');
    const { api } = await import('@mifin/service/service-api');
    
    const response = await MifinHttpClient.post(api.contactRecord, payload);
    
    if (response.data && response.status === 200) {
      console.log('Contact action synced successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error syncing contact action:', error);
    return false;
  }
};

const syncSaveCustomer = async (payload: any): Promise<boolean> => {
  try {
    const { MifinHttpClient } = await import('@mifin/service/service-axios');
    const { api } = await import('@mifin/service/service-api');
    
    const response = await MifinHttpClient.post(api.customerRecord, payload);
    
    if (response.data && response.status === 200) {
      console.log('Customer action synced successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error syncing customer action:', error);
    return false;
  }
};

const syncSaveProduct = async (payload: any): Promise<boolean> => {
  try {
    const { MifinHttpClient } = await import('@mifin/service/service-axios');
    const { api } = await import('@mifin/service/service-api');
    
    const response = await MifinHttpClient.post(api.saveProduct, payload);
    
    if (response.data && response.status === 200) {
      console.log('Product action synced successfully');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error syncing product action:', error);
    return false;
  }
};

const syncUnsyncedLeads = async (): Promise<void> => {
  try {
    const unsyncedLeads = await getUnsyncedLeads();
    
    for (const lead of unsyncedLeads) {
      try {
        const response: any = await store.dispatch(manageNewLead(lead.data));
        
        if (response?.payload?.responseData?.error?.toLowerCase() === 's') {
          await markLeadAsSynced(lead.id);
        }
      } catch (error) {
        console.error(`Error syncing lead ${lead.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error syncing unsynced leads:', error);
  }
};

// Export function to check if there are pending actions
export const hasPendingActions = async (): Promise<boolean> => {
  const actions = await getPendingActions();
  return actions.length > 0;
};

// Export function to get pending actions count
export const getPendingActionsCount = async (): Promise<number> => {
  const actions = await getPendingActions();
  return actions.length;
};

