import { MASTER_PAYLOAD } from '@mifin/ConstantData/apiPayload';
import { MifinHttpClient } from '@mifin/service/service-axios';
import { api } from '@mifin/service/service-api';
import { saveLeadDetails, getLeadDetails, updateLeadDetailTab } from './indexedDB';

// Cache freshness: data older than 24 hours will be refreshed
const CACHE_FRESHNESS_MS = 24 * 60 * 60 * 1000; // 24 hours

// Track in-progress pre-fetches to avoid duplicate calls
const prefetchInProgress = new Set<string>();
const worklistPrefetchInProgress = new Set<string>();

/**
 * Checks if cached data is fresh (not older than CACHE_FRESHNESS_MS)
 */
const isCacheFresh = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_FRESHNESS_MS;
};

/**
 * Checks which tabs need to be fetched for a lead
 * @param cachedData - Cached lead details from IndexedDB
 * @returns Object indicating which tabs need fetching
 */
const getTabsToFetch = (cachedData: any | undefined): {
  needContact: boolean;
  needCustomer: boolean;
  needProduct: boolean;
} => {
  if (!cachedData) {
    // No cache, fetch all
    return { needContact: true, needCustomer: true, needProduct: true };
  }

  const isFresh = isCacheFresh(cachedData.timestamp);
  
  return {
    needContact: !cachedData.contact || !isFresh,
    needCustomer: !cachedData.customer || !isFresh,
    needProduct: !cachedData.product || !isFresh,
  };
};

/**
 * Pre-fetches contact, customer, and product details for a lead and stores them in IndexedDB
 * Only fetches missing or stale data
 * @param leadId - The lead ID (caseId)
 * @param forceRefresh - If true, ignores cache and fetches all data
 * @returns Promise that resolves when all data is fetched and cached
 */
export const prefetchLeadDetails = async (
  leadId: string,
  forceRefresh = false
): Promise<void> => {
  // Skip if already in progress
  if (prefetchInProgress.has(leadId)) {
    return;
  }

  prefetchInProgress.add(leadId);

  try {
    // Check existing cache
    const cachedData = forceRefresh ? undefined : await getLeadDetails(leadId);
    const tabsToFetch = getTabsToFetch(cachedData);

    // If all tabs are fresh, skip fetching
    if (!tabsToFetch.needContact && !tabsToFetch.needCustomer && !tabsToFetch.needProduct) {
      console.log(`Skipping pre-fetch for ${leadId} - all data is fresh`);
      return;
    }

    // Prepare request body for all 3 APIs
    const requestBody = {
      ...MASTER_PAYLOAD,
      requestData: {
        leadDetail: {
          caseId: leadId,
        },
      },
    };

    // For customer and product, we might need to transform the caseId
    // Based on the code, customer uses a transformed caseId (SR -> 10)
    const showCustomerCaseId = leadId.replace(/^(SR|PR)/i, '10');
    const customerRequestBody = {
      ...MASTER_PAYLOAD,
      requestData: {
        leadDetail: {
          caseId: showCustomerCaseId,
        },
      },
    };

    // Build array of promises for only the tabs we need
    const fetchPromises: Promise<any>[] = [];
    const fetchLabels: string[] = [];

    if (tabsToFetch.needContact) {
      fetchPromises.push(MifinHttpClient.post(api.contactDetail, requestBody));
      fetchLabels.push('contact');
    }
    if (tabsToFetch.needCustomer) {
      fetchPromises.push(MifinHttpClient.post(api.customerDetails, customerRequestBody));
      fetchLabels.push('customer');
    }
    if (tabsToFetch.needProduct) {
      fetchPromises.push(MifinHttpClient.post(api.productDetail, requestBody));
      fetchLabels.push('product');
    }

    // Fetch only needed APIs in parallel
    const responses = await Promise.allSettled(fetchPromises);

    // Extract data from responses
    let contactData = cachedData?.contact || null;
    let customerData = cachedData?.customer || null;
    let productData = cachedData?.product || null;

    let responseIndex = 0;
    if (tabsToFetch.needContact) {
      const response = responses[responseIndex++];
      if (response.status === 'fulfilled') {
        contactData = response.value.data;
      }
    }
    if (tabsToFetch.needCustomer) {
      const response = responses[responseIndex++];
      if (response.status === 'fulfilled') {
        customerData = response.value.data;
      }
    }
    if (tabsToFetch.needProduct) {
      const response = responses[responseIndex++];
      if (response.status === 'fulfilled') {
        productData = response.value.data;
      }
    }

    // Save to IndexedDB (update only changed tabs or save all if new)
    if (contactData || customerData || productData) {
      if (cachedData) {
        // Update individual tabs that were fetched
        if (tabsToFetch.needContact && contactData) {
          await updateLeadDetailTab(leadId, 'contact', contactData);
        }
        if (tabsToFetch.needCustomer && customerData) {
          await updateLeadDetailTab(leadId, 'customer', customerData);
        }
        if (tabsToFetch.needProduct && productData) {
          await updateLeadDetailTab(leadId, 'product', productData);
        }
      } else {
        // New entry, save all
        await saveLeadDetails(leadId, contactData, customerData, productData);
      }
      
      const fetchedTabs = fetchLabels.filter((_, i) => responses[i]?.status === 'fulfilled');
      console.log(`Pre-fetched ${fetchedTabs.join(', ')} for ${leadId}`);
    }
  } catch (error) {
    console.error(`Error pre-fetching lead details for ${leadId}:`, error);
    // Don't throw - we want to continue even if one fails
  } finally {
    prefetchInProgress.delete(leadId);
  }
};

/**
 * Pre-fetches lead details for all leads in a worklist
 * Only fetches missing or stale data
 * @param worklistItems - Array of worklist items with leadId/caseId
 * @param batchSize - Number of leads to fetch in parallel (default: 5)
 * @param forceRefresh - If true, ignores cache and fetches all data
 */
export const prefetchWorklistLeadDetails = async (
  worklistItems: any[],
  batchSize = 5,
  forceRefresh = false
): Promise<void> => {
  // Extract unique lead IDs from worklist
  const leadIds = Array.from(
    new Set(
      worklistItems
        .map(item => item.leadId || item.caseId || item.caseCode)
        .filter(Boolean)
    )
  );

  if (leadIds.length === 0) {
    return;
  }

  // Create a unique key for this worklist prefetch operation
  const worklistKey = leadIds.sort().join(',');
  
  // Skip if already in progress for the same worklist
  if (worklistPrefetchInProgress.has(worklistKey)) {
    console.log('Worklist pre-fetch already in progress, skipping...');
    return;
  }

  worklistPrefetchInProgress.add(worklistKey);

  try {
    // Check cache status for all leads first
    const { getLeadDetails } = await import('./indexedDB');
    const cacheChecks = await Promise.all(
      leadIds.map(async (leadId) => {
        const cached = forceRefresh ? undefined : await getLeadDetails(leadId);
        const tabsToFetch = getTabsToFetch(cached);
        return {
          leadId,
          needsFetch: tabsToFetch.needContact || tabsToFetch.needCustomer || tabsToFetch.needProduct,
        };
      })
    );

    // Filter to only leads that need fetching
    const leadsToFetch = cacheChecks
      .filter(check => check.needsFetch)
      .map(check => check.leadId);

    if (leadsToFetch.length === 0) {
      console.log(`All ${leadIds.length} leads have fresh cached data, skipping pre-fetch`);
      return;
    }

    console.log(`Pre-fetching lead details for ${leadsToFetch.length} of ${leadIds.length} leads...`);

    // Process in batches to avoid overwhelming the network
    for (let i = 0; i < leadsToFetch.length; i += batchSize) {
      const batch = leadsToFetch.slice(i, i + batchSize);
      await Promise.allSettled(batch.map(leadId => prefetchLeadDetails(leadId, forceRefresh)));
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < leadsToFetch.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`Finished pre-fetching lead details for ${leadsToFetch.length} leads`);
  } finally {
    worklistPrefetchInProgress.delete(worklistKey);
  }
};

