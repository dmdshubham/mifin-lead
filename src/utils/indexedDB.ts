import { openDB, DBSchema, IDBPDatabase } from 'idb';

// @ts-expect-error - DBSchema type issue with idb library, but works at runtime
interface MifinDB extends DBSchema {
  leads: {
    key: string;
    value: {
      id: string;
      data: any;
      timestamp: number;
      synced: boolean;
    };
    indexes: { 'by-synced': boolean; 'by-timestamp': number };
  };
  worklist: {
    key: string;
    value: {
      id: string;
      data: any;
      timestamp: number;
    };
  };
  contactDetails: {
    key: string;
    value: {
      leadId: string;
      data: any;
      timestamp: number;
    };
  };
  pendingActions: {
    key: number;
    value: {
      id?: number;
      type: 'CREATE_LEAD' | 'UPDATE_LEAD' | 'DELETE_LEAD' | 'REALLOCATE' | 'SAVE_CONTACT' | 'SAVE_CUSTOMER' | 'SAVE_PRODUCT';
      payload: any;
      timestamp: number;
      retryCount: number;
      lastError?: string;
      syncStatus?: 'pending' | 'syncing' | 'error';
    };
    indexes: { 'by-timestamp': number };
  };
  appState: {
    key: string;
    value: {
      key: string;
      value: any;
      timestamp: number;
    };
  };
  masterData: {
    key: string;
    value: {
      key: string;
      data: any;
      timestamp: number;
    };
  };
  leadDetails: {
    key: string;
    value: {
      leadId: string;
      contact: any;
      customer: any;
      product: any;
      timestamp: number;
    };
  };
}

const DB_NAME = 'mifin-lead-db';
const DB_VERSION = 4; // Bumped to 4 to add leadDetails store

let dbPromise: Promise<IDBPDatabase<MifinDB>> | null = null;

export const initDB = async (): Promise<IDBPDatabase<MifinDB>> => {
  if (dbPromise) return dbPromise;

  dbPromise = openDB<MifinDB>(DB_NAME, DB_VERSION, {
    upgrade(db: any) {
      // Leads store
      if (!db.objectStoreNames.contains('leads')) {
        const leadsStore = db.createObjectStore('leads', { keyPath: 'id' });
        leadsStore.createIndex('by-synced', 'synced');
        leadsStore.createIndex('by-timestamp', 'timestamp');
      }

      // Worklist store
      if (!db.objectStoreNames.contains('worklist')) {
        db.createObjectStore('worklist', { keyPath: 'id' });
      }

      // Contact details store
      if (!db.objectStoreNames.contains('contactDetails')) {
        db.createObjectStore('contactDetails', { keyPath: 'leadId' });
      }

      // Master data store
      if (!db.objectStoreNames.contains('masterData')) {
        db.createObjectStore('masterData', { keyPath: 'key' });
      }

      // Pending actions store
      if (!db.objectStoreNames.contains('pendingActions')) {
        const actionsStore = db.createObjectStore('pendingActions', {
          keyPath: 'id',
          autoIncrement: true,
        });
        actionsStore.createIndex('by-timestamp', 'timestamp');
      }

      // App state store
      if (!db.objectStoreNames.contains('appState')) {
        db.createObjectStore('appState', { keyPath: 'key' });
      }

      // Lead details store (contact, customer, product)
      if (!db.objectStoreNames.contains('leadDetails')) {
        db.createObjectStore('leadDetails', { keyPath: 'leadId' });
      }
    },
  });

  return dbPromise;
};

// Lead operations
export const saveLead = async (leadId: string, data: any, synced = false) => {
  const db = await initDB();
  await db.put('leads', {
    id: leadId,
    data,
    timestamp: Date.now(),
    synced,
  });
};

export const getLead = async (leadId: string) => {
  const db = await initDB();
  return await db.get('leads', leadId);
};

export const getAllLeads = async () => {
  const db = await initDB();
  return await db.getAll('leads');
};

export const getUnsyncedLeads = async () => {
  const db = await initDB();
  const allLeads = await db.getAll('leads');
  return allLeads.filter(lead => !lead.synced);
};

export const deleteLead = async (leadId: string) => {
  const db = await initDB();
  await db.delete('leads', leadId);
};

export const markLeadAsSynced = async (leadId: string) => {
  const db = await initDB();
  const lead = await db.get('leads', leadId);
  if (lead) {
    lead.synced = true;
    await db.put('leads', lead);
  }
};

// Worklist operations
export const saveWorklist = async (worklistData: any[]) => {
  const db = await initDB();
  const tx = db.transaction('worklist', 'readwrite');
  
  // Clear existing worklist
  await tx.store.clear();
  
  // Save new worklist items
  for (const item of worklistData) {
    await tx.store.put({
      id: (item as any).id || (item as any).caseId || `worklist-${Date.now()}-${Math.random()}`,
      data: item,
      timestamp: Date.now(),
    });
  }
  
  await tx.done;
};

export const getWorklist = async () => {
  const db = await initDB();
  const items = await db.getAll('worklist');
  return items.map(item => item.data);
};

export const clearWorklist = async () => {
  const db = await initDB();
  await db.clear('worklist');
};

// Contact details operations
export const saveContactDetails = async (leadId: string, data: any) => {
  const db = await initDB();
  await db.put('contactDetails', {
    leadId,
    data,
    timestamp: Date.now(),
  });
};

export const getContactDetails = async (leadId: string) => {
  const db = await initDB();
  return await db.get('contactDetails', leadId);
};

export const getAllContactDetails = async () => {
  const db = await initDB();
  return await db.getAll('contactDetails');
};

export const deleteContactDetails = async (leadId: string) => {
  const db = await initDB();
  await db.delete('contactDetails', leadId);
};

// Pending actions operations
export const addPendingAction = async (
  type: 'CREATE_LEAD' | 'UPDATE_LEAD' | 'DELETE_LEAD' | 'REALLOCATE' | 'SAVE_CONTACT' | 'SAVE_CUSTOMER' | 'SAVE_PRODUCT',
  payload: any
) => {
  const db = await initDB();
  const actionId = await db.add('pendingActions', {
    type,
    payload,
    timestamp: Date.now(),
    retryCount: 0,
    syncStatus: 'pending',
  });
  return actionId;
};

export const getPendingActions = async () => {
  const db = await initDB();
  return await db.getAll('pendingActions');
};

export const deletePendingAction = async (actionId: number) => {
  const db = await initDB();
  await db.delete('pendingActions', actionId);
};

export const incrementActionRetryCount = async (actionId: number) => {
  const db = await initDB();
  const action = await db.get('pendingActions', actionId);
  if (action) {
    action.retryCount += 1;
    await db.put('pendingActions', action);
  }
};

export const updateActionError = async (actionId: number, error: string) => {
  const db = await initDB();
  const action = await db.get('pendingActions', actionId);
  if (action) {
    action.lastError = error;
    action.syncStatus = 'error';
    await db.put('pendingActions', action);
  }
};

export const updateActionStatus = async (
  actionId: number,
  status: 'pending' | 'syncing' | 'error'
) => {
  const db = await initDB();
  const action = await db.get('pendingActions', actionId);
  if (action) {
    action.syncStatus = status;
    await db.put('pendingActions', action);
  }
};

// App state operations
export const saveAppState = async (key: string, value: any) => {
  const db = await initDB();
  await db.put('appState', {
    key,
    value,
    timestamp: Date.now(),
  });
};

export const getAppState = async (key: string) => {
  const db = await initDB();
  const state = await db.get('appState', key);
  return state?.value;
};

export const clearAppState = async (key: string) => {
  const db = await initDB();
  await db.delete('appState', key);
};

// Master data operations
export const saveMasterData = async (key: string, data: any) => {
  const db = await initDB();
  await db.put('masterData', {
    key,
    data,
    timestamp: Date.now(),
  });
};

export const getMasterData = async (key: string) => {
  const db = await initDB();
  const result = await db.get('masterData', key);
  return result?.data;
};

export const getAllMasterData = async () => {
  const db = await initDB();
  return await db.getAll('masterData');
};

// Lead details operations (contact, customer, product)
export const saveLeadDetails = async (leadId: string, contact: any, customer: any, product: any) => {
  const db = await initDB();
  await db.put('leadDetails', {
    leadId,
    contact,
    customer,
    product,
    timestamp: Date.now(),
  });
};

export const getLeadDetails = async (leadId: string) => {
  const db = await initDB();
  return await db.get('leadDetails', leadId);
};

export const getAllLeadDetails = async () => {
  const db = await initDB();
  return await db.getAll('leadDetails');
};

export const deleteLeadDetails = async (leadId: string) => {
  const db = await initDB();
  await db.delete('leadDetails', leadId);
};

// Update individual tab data
export const updateLeadDetailTab = async (leadId: string, tab: 'contact' | 'customer' | 'product', data: any) => {
  const db = await initDB();
  const existing = await db.get('leadDetails', leadId);
  if (existing) {
    existing[tab] = data;
    existing.timestamp = Date.now();
    await db.put('leadDetails', existing);
  } else {
    // Create new entry if doesn't exist
    await db.put('leadDetails', {
      leadId,
      contact: tab === 'contact' ? data : null,
      customer: tab === 'customer' ? data : null,
      product: tab === 'product' ? data : null,
      timestamp: Date.now(),
    });
  }
};

// Clear all data
export const clearAllData = async () => {
  const db = await initDB();
  await db.clear('leads');
  await db.clear('worklist');
  await db.clear('contactDetails');
  await db.clear('pendingActions');
  await db.clear('appState');
  await db.clear('masterData');
  await db.clear('leadDetails');
};

// Get pending actions as worklist entries
export const getPendingActionsAsWorklistEntries = async () => {
  const db = await initDB();
  const pendingActions = await db.getAll('pendingActions');
  
  // Try to get master data for lookups (key is 'getMasters' from api.ts)
  const masterData = await getMasterData('getMasters');
  
  // Extract lists from master data structure
  const productList = masterData?.responseData?.Masters?.productMaster || [];
  const queueList = masterData?.responseData?.Masters?.queueMaster || [];
  const subQueueList = masterData?.responseData?.Masters?.subQueueMaster || [];
  
  return pendingActions.map(action => {
    const payload = action.payload;
    
    // For CREATE_LEAD actions, extract data from newLeadDetail
    let leadData: any = {};
    
    if (payload.requestData?.newLeadDetail) {
      // Data is in requestData.newLeadDetail
      leadData = payload.requestData.newLeadDetail;
    } else if (payload.requestData?.leadsInsertDetail) {
      // Alternative location
      leadData = payload.requestData.leadsInsertDetail;
    } else if (payload.requestData) {
      // Try requestData directly
      leadData = payload.requestData;
    } else {
      // Fallback to payload itself
      leadData = payload;
    }
    
    // Extract user info for allocated to
    const userName = payload.userDetail?.userName || payload.userDetail?.userFirstName || 'Self';
    
    // Build customer name from firstName and lastName
    const firstName = leadData.firstName || '';
    const lastName = leadData.lastName || '';
    const customerName = `${firstName} ${lastName}`.trim() || 'NEW LEAD';
    
    // Get primary mobile number
    const primaryMobile = leadData.listMobile?.find((m: any) => m.primaryContact === 'Y')?.contactNo || '';
    
    // Get primary email
    const primaryEmail = leadData.listEmail?.find((e: any) => e.primaryEmail === 'Y')?.email || '';
    
    // In QuickLead.tsx: productId = product/queue, queueId = subQueue
    // Lookup product name from productId
    const product = productList.find((p: any) => 
      p.productId === leadData.productId || 
      p.prodId === leadData.productId
    );
    const productName = product?.prodName || product?.productName || 'N/A';
    
    // Lookup subQueue name from queueId (the field name is 'subQueue' in the object)
    const subQueueObj = subQueueList.find((sq: any) => 
      sq.subQueueId === leadData.queueId
    );
    const subQueueName = subQueueObj?.subQueue || subQueueObj?.subQueueName || 'N/A';
    
    // Create a worklist-compatible entry from the pending action
    return {
      leadId: `offline-${action.id}`,
      leadCode: `OFFLINE-${action.id}`,
      customerName: customerName,
      queue: productName,         // Product column shows product/queue name
      subQueue: subQueueName,     // Potential column shows subQueue name
      amount: leadData.loanAmount || leadData.netMonthlyIncome || '0',
      actionName: 'NEW LEAD',
      allocatedToName: userName,
      allocatedTo: leadData.allocateTo || '',
      followUp_action: 'N/A',
      status: 'New',
      refer: 'N',
      escalated: 'N',
      coAllocate: 'N',
      
      // Additional fields that might be useful
      productId: leadData.productId,  // This is actually the product/queue ID
      queueId: leadData.queueId,      // This is actually the subQueue ID
      mobile: primaryMobile,
      email: primaryEmail,
      
      // Add offline-specific metadata
      _isOffline: true,
      _pendingActionId: action.id,
      _syncStatus: action.syncStatus || 'pending',
      _lastError: action.lastError,
      _retryCount: action.retryCount,
      _timestamp: action.timestamp,
      _actionType: action.type,
    };
  });
};

