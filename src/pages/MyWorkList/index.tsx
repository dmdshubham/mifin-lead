import { Box, Tabs } from "@chakra-ui/react";
import { FC } from "react";
import { useEffect, useState, useRef } from "react";
import LMSWorklistTabs from "./WorklistTabs";
import { useAppDispatch } from "@mifin/redux/hooks";
import SearchForm from "./SearchForm";
import ReAllocation from "./Reallocate/ReAllocation";
import WorkListTable from "./WorkListTable/WorkListTable";
import { fetchLeadDetails } from "@mifin/redux/service/worklistLeadDetails/api";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { IReallocationPopoverProps } from "@mifin/Interface/myWorklist";
import { useAppSelector } from "@mifin/redux/hooks";
import { getLeadDetails } from "@mifin/redux/service/worklistGetLeadDetails/api";
import { OfflineWorklistWrapper } from "./OfflineWorklistWrapper";
import { OnlineStatusIndicator } from "@mifin/components/OnlineStatusIndicator";
import {
  saveWorklist,
  getPendingActionsAsWorklistEntries,
  getWorklist,
} from "@mifin/utils/indexedDB";
import { useOffline } from "@mifin/hooks/OfflineContext";
import { prefetchWorklistLeadDetails } from "@mifin/utils/prefetchLeadDetails";

const GET_LEAD_DETAILS_BODY = {
  ...MASTER_PAYLOAD,
  requestData: {
    iDisplayStart: "0",
    iDisplayLength: "10",
    sEcho: "1",
    leadsSearchDetail: {
      requestType: "myLead",
      mobile: "",
      email: "",
      name: "",
      caseId: "",
      leadState: "",
      escalationRef: "MYLEAD",
      queue: "",
      subqueue: "",
      disposition: "",
      actionId: "",
      allocate: "",
      amountTo: "",
      amountFrom: "",
      source: "",
      sort1: "-1",
      sort2: "-1",
      sort3: "-1",
      currentPosition: 10,
      maxResult: 0,
      sortOrder: "-1",
      caseCode: "",
      company: "",
      id: "",
      campaign: "",
      team: "",
      syncDate: "",
      branch: "",
    },
  },
};

const MyWorkList: FC = () => {
  const refetchWorklist = useRef<() => Promise<any> | null>(null);
  const [searchData, setSearchData] = useState({});
  const dispatch = useAppDispatch();
  const [leadData, setLeadData] = useState([]);
  const [pendingLeads, setPendingLeads] = useState([]);
  const [allID, setAllID] = useState([]);
  const [allocatedId, setAllocatedId] = useState();
  const mastersData: any = useAppSelector(state => state.leadDetails.data);
  const { isOnline, pendingSyncCount } = useOffline();
  const worklistData: any = useAppSelector(state => state.getLeadDetails.data);
  const lastPrefetchedWorklistRef = useRef<string>("");
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allocateOption = mastersData?.allocateToList?.map(
    (el: IReallocationPopoverProps) => {
      return {
        label: el?.userName,
        value: el?.userId,
      };
    }
  );

  const allocateMaster = allocateOption?.filter(
    (item: any) => item.value !== allocatedId?.allocatedTo
  );

  useEffect(() => {
    const getWorkListLeadDetails = () => {
      // Fetch master data - works both online and offline (with cache)
      dispatch(fetchLeadDetails({ ...MASTER_PAYLOAD })).catch(err => {
        console.log("Master data fetch issue (may be using cache):", err);
      });
    };
    getWorkListLeadDetails();
  }, []);

  const getAllLeadList = () => {
    dispatch(getLeadDetails(GET_LEAD_DETAILS_BODY));
  };

  // Load cached worklist helper
  const loadCachedWorklist = async () => {
    try {
      const cached = await getWorklist();
      if (cached && cached.length > 0) {
        setLeadData(cached);
      } else {
        setLeadData([]);
      }
    } catch (err) {
      console.error("Error loading cached worklist:", err);
      setLeadData([]);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    getAllLeadList();
  }, []);

  // Update leadData based on online/offline status
  useEffect(() => {
    if (isOnline) {
      // When online, use API data from Redux
      if (worklistData?.leadData?.aaData) {
        const apiData = worklistData.leadData.aaData;
        setLeadData(apiData);

        // Cache in IndexedDB for offline access
        saveWorklist(apiData).catch(err => {
          console.error("Error caching worklist:", err);
        });

        // Create a unique key for this worklist to avoid duplicate pre-fetches
        const worklistKey = apiData
          .map((item: any) => item.leadId || item.caseId || item.caseCode)
          .filter(Boolean)
          .sort()
          .join(",");

        // Only pre-fetch if this is a different worklist or if we haven't prefetched yet
        if (worklistKey !== lastPrefetchedWorklistRef.current) {
          // Clear any pending timeout
          if (prefetchTimeoutRef.current) {
            clearTimeout(prefetchTimeoutRef.current);
          }

          // Debounce pre-fetch by 1 second to avoid multiple calls on rapid updates
          prefetchTimeoutRef.current = setTimeout(() => {
            lastPrefetchedWorklistRef.current = worklistKey;

            // Pre-fetch lead details (contact, customer, product) for all worklist items
            // This runs in the background to cache data for offline access
            // Only fetches missing or stale data
            prefetchWorklistLeadDetails(apiData).catch(err => {
              console.error("Error pre-fetching lead details:", err);
            });
          }, 1000);
        }
      }
    } else {
      // When offline, load from IndexedDB cache
      loadCachedWorklist();
    }

    // Cleanup timeout on unmount
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, [isOnline, worklistData]);

  // Fetch fresh data when coming back online
  useEffect(() => {
    if (isOnline) {
      getAllLeadList();
    }
  }, [isOnline]);

  // Fetch and update pending leads
  const fetchPendingLeads = async () => {
    try {
      const pendingActions = await getPendingActionsAsWorklistEntries();
      setPendingLeads(pendingActions);
    } catch (err) {
      console.error("Error fetching pending actions:", err);
      setPendingLeads([]);
    }
  };

  // Refresh all worklist data (both pending and regular)
  const refreshWorklistData = async () => {
    // Refetch pending leads
    await fetchPendingLeads();
    // Refetch regular worklist data
    getAllLeadList();
  };

  // Load pending leads on mount and when sync count changes
  // Also refetch worklist data when sync count decreases (meaning items were synced)
  const prevSyncCountRef = useRef(pendingSyncCount);
  useEffect(() => {
    fetchPendingLeads();

    // If sync count decreased, it means items were synced - refetch main data
    if (prevSyncCountRef.current > pendingSyncCount && isOnline) {
      getAllLeadList();
    }

    prevSyncCountRef.current = pendingSyncCount;
  }, [pendingSyncCount, isOnline]);

  // Merge pending leads with regular leads
  const mergedLeadData = [...pendingLeads, ...leadData];

  return (
    <>
      <Box pt={{ base: 2, md: 8 }}>
        <Box mb={4}>
          <OnlineStatusIndicator />
        </Box>
        <OfflineWorklistWrapper onRefresh={refreshWorklistData}>
          <Tabs>
            <LMSWorklistTabs searchData={searchData} />
            <SearchForm
              searchData={searchData}
              setSearchData={setSearchData}
              setAllID={setAllID}
            />
            <WorkListTable
              leadData={mergedLeadData ?? []}
              searchData={searchData}
              ref={refetchWorklist}
              setSearchData={setSearchData}
              allID={allID}
              setAllID={setAllID}
              setAllocatedId={setAllocatedId}
              onSyncPending={fetchPendingLeads}
              onRefreshData={refreshWorklistData}
            />
          </Tabs>
        </OfflineWorklistWrapper>
      </Box>
      <ReAllocation
        allID={allID}
        searchData={searchData}
        setAllID={setAllID}
        onReAllocation={() => refetchWorklist.current?.()}
        allocateMaster={allocateMaster}
      />
    </>
  );
};

export default MyWorkList;
