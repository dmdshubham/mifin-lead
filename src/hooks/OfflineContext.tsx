import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { syncPendingActions } from '@mifin/utils/offlineSync';
import toast from 'react-hot-toast';

interface OfflineContextType {
  isOnline: boolean;
  pendingSyncCount: number;
  syncInProgress: boolean;
  lastSyncTime: Date | null;
  triggerSync: () => Promise<void>;
  refreshPendingCount: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const triggerSync = async () => {
    if (!isOnline || syncInProgress) return;

    setSyncInProgress(true);
    try {
      const result = await syncPendingActions();
      if (result.success) {
        setPendingSyncCount(0);
        setLastSyncTime(new Date());
        if (result.syncedCount > 0) {
          toast.success(`Successfully synced ${result.syncedCount} pending action(s)`);
        }
      } else {
        toast.error('Some actions failed to sync. Will retry later.');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed. Will retry later.');
    } finally {
      setSyncInProgress(false);
    }
  };

  // Check for pending actions helper function
  const checkPendingActions = async () => {
    const { getPendingActions } = await import('@mifin/utils/indexedDB');
    const actions = await getPendingActions();
    setPendingSyncCount(actions.length);
  };

  // Check for pending actions on mount
  useEffect(() => {
    checkPendingActions();
  }, []);

  // Refresh pending count when coming back online
  useEffect(() => {
    if (isOnline) {
      checkPendingActions();
    }
  }, [isOnline]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      toast.success('Back online! Syncing pending changes...');
      triggerSync();
    }
  }, [isOnline, wasOffline]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        pendingSyncCount,
        syncInProgress,
        lastSyncTime,
        triggerSync,
        refreshPendingCount: checkPendingActions,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

