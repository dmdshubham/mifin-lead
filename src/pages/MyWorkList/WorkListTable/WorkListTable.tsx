import { forwardRef, useEffect } from "react";
import {
  Text,
  Image,
  HStack,
  IconButton,
  useDisclosure,
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  SimpleGrid,
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  Accordion,
} from "@chakra-ui/react";
import { Table, Checkbox } from "antd";
import React, { ReactNode, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { useAppDispatch } from "@mifin/redux/hooks";
import { useNavigate } from "react-router-dom";
import { toastFail } from "@mifin/components/Toast";
import { useSearchParams } from "react-router-dom";
import { useFetchleadList } from "@mifin/service/mifin-getLeadDetails";
import "./WorkList.css";
import { useSearchStore } from "@mifin/store/apiStore";
import escalated from "@mifin/assets/svgs/escalated.svg";
import refer from "@mifin/assets/svgs/refer.svg";
import coAllocate from "@mifin/assets/svgs/coAllocate.svg";
import { useTranslation } from "react-i18next";
import {
  IWorklistTableProps,
  IWorklistTableColumnType,
} from "@mifin/Interface/myWorklist";
import { updateLeadId } from "@mifin/redux/features/updateLeadIdSlice";
import { MASTER_PAYLOAD } from "@mifin/ConstantData/apiPayload";
import { showContact } from "@mifin/redux/service/showContact/api";
import { userInfo } from "@mifin/utils/getLoginUserInfo";
import { setIsEscalatedScreen } from "@mifin/redux/features/isEscalatedScreen";
import { updateContactData } from "@mifin/redux/features/contactDataSlice";
import { updateLeadHeaderDetails } from "@mifin/redux/features/leadHeaderDetailSlice";
import { FiMenu, FiTrash2 } from "react-icons/fi";
import DrawerComponent from "@mifin/components/Drawer";
import CaseDetails from "./CaseDetails";
import { getCorrectImageUrl2 } from "@mifin/utils/getCorrectImgUrl";
import { useLocation } from "react-router-dom";
import SingleCard from "@mifin/components/common";
import CardPagination from "@mifin/components/common/CardPagination";
import { getUserId, getUserDetails } from "@mifin/utils/sessionData";
import { useOffline } from "@mifin/hooks/OfflineContext";
import { getWorklist, getPendingActions, deletePendingAction, updateActionStatus } from "@mifin/utils/indexedDB";
import { syncPendingActions } from "@mifin/utils/offlineSync";
import toast from "react-hot-toast";
import { Badge, Spinner, Tooltip, VStack, Alert, AlertIcon, AlertDescription, Button } from "@chakra-ui/react";
//eslint-disable-next-line react/display-name
const WorkListTable = forwardRef<
  () => Promise<any> | null,
  IWorklistTableProps
>(({ allID, setAllID, searchData, setSearchData, setAllocatedId, onSyncPending, onRefreshData, leadData: propLeadData }) => {
  const [Case] = useSearchParams();
  //  const [isChecked, setIsChecked] = useState(false);
  const { t } = useTranslation();
  // const data =[]
  // const dataUpdatedAt=false
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const [WorkData, setWorkData] = useState();
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { userDetails } = useSearchStore();
  // const { mutateAsync: sendlead } = useGetLeadListMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeCase, setActiveCase] = useState("");
  const location = useLocation();
  const { isOnline, triggerSync, refreshPendingCount } = useOffline();
  const [cachedData, setCachedData] = useState<any>(null);
  const [syncingItems, setSyncingItems] = useState<Set<number>>(new Set());
  // const formatKey = (key: string) => {
  //   return key
  //     .replace(/([A-Z])/g, " $1")
  //     .toLowerCase()
  //     .split(" ")
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");
  // };

  // Handler to sync a single pending action
  const handleSyncSingleAction = async (actionId: number) => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setSyncingItems(prev => new Set(prev).add(actionId));
    
    try {
      await updateActionStatus(actionId, 'syncing');
      await triggerSync();
      
      // Refresh both pending leads and worklist data
      if (onRefreshData) {
        await onRefreshData();
      } else if (onSyncPending) {
        onSyncPending();
      }
      
      toast.success('Synced successfully');
    } catch (error) {
      console.error('Error syncing action:', error);
      toast.error('Sync failed. Will retry later.');
    } finally {
      setSyncingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  };

  // Handler to delete a pending action
  const handleDeletePendingAction = async (actionId: number) => {
    if (window.confirm('Are you sure you want to delete this offline lead? This action cannot be undone.')) {
      try {
        await deletePendingAction(actionId);
        
        // Refresh pending count immediately
        await refreshPendingCount();
        
        // Refresh pending leads list
        if (onRefreshData) {
          await onRefreshData();
        } else if (onSyncPending) {
          onSyncPending();
        }
        
        toast.success('Offline lead deleted successfully');
      } catch (error) {
        console.error('Error deleting pending action:', error);
        toast.error('Failed to delete offline lead');
      }
    }
  };

  const formatKey = (key: string) => {
    switch (key.toLowerCase()) {
      case "queue":
        return "Product";
      case "subqueue":
        return "Potential";
      case "allocatedtoname":
        return "Allocated To";
      default:
        return key
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };
  useEffect(() => {
    setSearchData({
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
    });
  }, [location]);

  const formData = {
    ...MASTER_PAYLOAD,
    requestData: {
      iDisplayStart: "0",
      iDisplayLength: "10",
      sEcho: "1",
      leadsSearchDetail: {
        // ...searchData,
        requestType: "myLead",
        ...searchData,
      },
    },
  };
  const { data, dataUpdatedAt, refetch } = useFetchleadList(formData);

  // Load cached data when offline
  useEffect(() => {
    if (!isOnline) {
      const loadCachedData = async () => {
        try {
          const cached = await getWorklist();
          if (cached && cached.length > 0) {
            setCachedData({ leadData: { aaData: cached } });
            console.log(`Loaded ${cached.length} cached leads`);
          } else {
            console.log('No cached data available');
          }
        } catch (error) {
          console.error('Error loading cached data:', error);
        }
      };
      loadCachedData();
    }
  }, [isOnline]);

  const handleSelect = (record: IWorklistTableProps) => {
    setAllocatedId(record);
    const recordIdentifier = `${record.leadId}~${record.allocatedTo}`;

    const isRecordSelected = allID?.find((item: string) =>
      item.startsWith(`${record.leadId}~`)
    );
    if (isRecordSelected) {
      setAllID((prev: any) =>
        prev.filter((item: string) => !item.startsWith(`${record.leadId}~`))
      );
    } else {
      const multiId =
        Array.isArray(WorkData) &&
        WorkData.filter(item => item?.leadId === record?.leadId).map(
          item => `${item.leadId}~${item.allocatedTo}`
        );
      const idsToAdd =
        multiId && multiId.length > 0 ? multiId : [recordIdentifier];

      setAllID((prev: any) => [...prev, ...idsToAdd]);
    }
  };
  // const handleSelect = (record: IWorklistTableProps) => {
  //   const leadIdStr = String(record.leadId);
  //   const allocatedToStr = record.allocatedTo || "undefined"; // Handle undefined

  //   const isSelected = allID.some(id => id.startsWith(`${leadIdStr}~`));

  //   if (isSelected) {
  //     setAllID(prev => prev.filter(id => !id.startsWith(`${leadIdStr}~`)));
  //   } else {
  //     const newId = `${leadIdStr}~${allocatedToStr}`;
  //     setAllID(prev => [...prev, newId]);
  //   }
  // };
  // const handleSelect = (record: IWorklistTableProps) => {
  //   setAllocatedId(record);
  //   const recordId = String(record.leadId);
  //   if (allID.includes(recordId)) {
  //     setAllID(prev => prev.filter((id: string) => id !== recordId));
  //   } else {
  //     const multiId =
  //       Array.isArray(WorkData) &&
  //       WorkData.filter(item => item?.leadId === record?.leadId).map(
  //         item => `${item.leadId}~${item.allocatedTo}`
  //       );
  //     const idsToAdd =
  //       multiId && multiId.length > 0 ? multiId : [recordIdentifier];
  //     setAllID(prev => [...prev, recordId]);
  //   }
  // };
  // const handleSelect = (record: IWorklistTableProps) => {
  //   setAllocatedId(record);
  //   const recordId = String(record.leadId);

  //   // Toggle selection based on leadId only
  //   setAllID(
  //     prev =>
  //       prev.includes(recordId)
  //         ? prev.filter(id => id !== recordId) // Remove if exists
  //         : [...prev, recordId] // Add if not exists
  //   );
  // };

  // useEffect(() => {
  //   setSearchData({
  //     mobile: "",
  //     email: "",
  //     name: "",
  //     caseId: "",
  //     leadState: "",
  //     escalationRef: "MYLEAD",
  //     queue: "",
  //     subqueue: "",
  //     disposition: "",
  //     actionId: "",
  //     allocate: "",
  //     amountTo: "",
  //     amountFrom: "",
  //     source: "",
  //     sort1: "-1",
  //     sort2: "-1",
  //     sort3: "-1",
  //     currentPosition: 10,
  //     maxResult: 0,
  //     sortOrder: "-1",
  //     caseCode: "",
  //     company: "",
  //     id: "",
  //     campaign: "",
  //     team: "",
  //     syncDate: "",
  //     branch: "",
  //   });
  // }, []);
  useEffect(() => {
    //userlogin is not provided so manually coluser1 is filtered down
    // Use prop data (which includes pending leads) if available, otherwise use cached data when offline, otherwise use API data
    let sourceDataArray = propLeadData && propLeadData.length > 0 
      ? propLeadData 
      : (isOnline ? data?.leadData?.aaData : cachedData?.leadData?.aaData);
    
    if (!sourceDataArray) sourceDataArray = [];
    
    if (Case.get("case") === "Escalated") {
      const filterData = sourceDataArray?.filter((data: any) =>
        data.escalated?.toLowerCase().includes("y")
      );
      setWorkData(filterData);
    } else if (Case.get("case") === "Reffered") {
      setWorkData(
        sourceDataArray?.filter((data: any) =>
          data.refer?.toLowerCase().includes("y")
        )
      );
    } else {
      setWorkData(sourceDataArray);
    }
  }, [Case.get("case"), dataUpdatedAt, data, isOnline, cachedData, propLeadData]);

  // useImperativeHandle(refetchAction, () => {
  //   return () => sendlead(formData);
  // });

  // const toggleSelectAll = () => {
  //   setAllID((keys: any) =>
  //     keys.length === WorkData?.length
  //       ? []
  //       : WorkData?.map((row: IWorklistTableProps) => row.leadId)
  //   );
  // };
  // const toggleSelectAll = () => {
  //   if (!WorkData) return;

  //   const allLeadIds = WorkData.map((row: IWorklistTableProps) =>
  //     String(row.leadId)
  //   );

  //   setAllID(
  //     prev =>
  //       prev.length === allLeadIds.length
  //         ? [] // Unselect all
  //         : allLeadIds // Select all
  //   );
  // };
  const toggleSelectAll = () => {
    if (!WorkData) return;
    const selectableRecords = WorkData.filter(
      (row: any) =>
        !(
          row.actionName === "CONVERTED" ||
          row?.escalated?.toString().toLowerCase().includes("y") ||
          row?.refer?.toString().toLowerCase().includes("y")
        )
    );
    const selectableLeadIds = selectableRecords.map(
      (row: IWorklistTableProps) => String(row.leadId)
    );
    setAllID(prev =>
      prev.length === selectableLeadIds.length
        ? [] // Unselect all
        : selectableLeadIds
    );
  };
  const headerCheckbox = allID && WorkData && (
    <Checkbox
      checked={allID.length === WorkData?.length}
      indeterminate={allID.length > 0 && allID.length < WorkData?.length}
      onChange={toggleSelectAll}
    />
  );
  const rowSelection = {
    selectedRowKeys: allID?.map(item => item.split("~")[0]),
    type: "checkbox",
    onSelect: handleSelect,
    columnTitle: headerCheckbox,
    getCheckboxProps: (record: any) => ({
      disabled:
        record.actionName === "CONVERTED" ||
        record.escalated?.toString().toLowerCase().includes("y") ||
        record.refer?.toString().toLowerCase().includes("y"),
      name: record.leadId,
    }),
  };
  // const rowSelection = {
  //   selectedRowKeys: allID, // directly use allID
  //   type: "checkbox",
  //   onSelect: handleSelect,
  //   columnTitle: headerCheckbox,
  // };

  // const checkNavigateEscalatedLead = (caseId: string) => {
  //   // converting lead code in to caseId
  //   console.log(caseId, "caseid");
  //   const showCustomerCaseId = caseId?.toLowerCase()?.includes("sr")
  //     ? caseId.replace("SR", "10")
  //     : caseId?.toLowerCase().includes("pr")
  //     ? caseId.replace("PR", "10")
  //     : caseId;

  //   const SHOW_CUSTOMER_BODY = {
  //     ...MASTER_PAYLOAD,
  //     requestData: {
  //       leadDetail: {
  //         caseId: showCustomerCaseId,
  //       },
  //     },
  //   };

  //   dispatch(showContact(SHOW_CUSTOMER_BODY))
  //     .then((res: any) => {
  //       const InitialedTo =
  //         res?.payload?.responseData?.contactDetail?.caseEscalationHistory[0]
  //           .initiatedTo;
  //       if (
  //         res.payload.statusInfo.statusCode === "200" &&
  //         InitialedTo.toLowerCase() === userInfo().toString().toLowerCase()
  //       ) {
  //         //dispatch(setIsEscalatedScreen({ value: true }));
  //         dispatch(
  //           updateLeadId({
  //             leadId: res?.payload?.responseData?.leadHeaderDetail?.leadId,
  //           })
  //         );
  //         dispatch(updateContactData(res.payload.responseData));
  //         dispatch(
  //           updateLeadHeaderDetails(
  //             res?.payload?.responseData?.leadHeaderDetail
  //           )
  //         );
  //         navigate(`/contact/${caseId}?case=Contact`);
  //       } else if (
  //         res.payload.statusInfo.statusCode === "400" ||
  //         InitialedTo.toLowerCase() !== userInfo().toString().toLowerCase()
  //       ) {
  //         //toastFail("Lead is already escalated");
  //       } else {
  //         toastFail(res.payload.statusInfo.message);
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //       toastFail("SomeThing Went wrong");
  //     });
  //   // navigate(`/contact/${caseId}?case=Contact`);
  // };
  const checkNavigateEscalatedLead = async (caseId: string) => {
    try {
      const showCustomerCaseId = caseId.replace(/^(SR|PR)/i, "10");
      const SHOW_CUSTOMER_BODY = {
        ...MASTER_PAYLOAD,
        requestData: { leadDetail: { caseId: showCustomerCaseId } },
      };

      const res = await dispatch(showContact(SHOW_CUSTOMER_BODY)).unwrap();

      // Debug logs
      // console.log("API Response:", res);
      // const InitialedTo =
      //   res.responseData.contactDetail.caseEscalationHistory[0].initiatedTo
      //     .replace(/[^0-9]/g, "")
      //     .toLowerCase();
      // const currentUser = userInfo()
      //   ?.toString()
      //   .replace(/[^0-9]/g, "")
      //   .toLowerCase();
      const InitiatedToId =
        res?.responseData?.contactDetail?.caseEscalationHistory?.[0]
          ?.initiatedToId;
      const currentUserId = getUserDetails()?.userId;

      if (InitiatedToId === currentUserId) {
        dispatch(
          updateLeadId({ leadId: res?.responseData?.leadHeaderDetail?.leadId })
        );
        dispatch(updateContactData(res.responseData));
        dispatch(updateLeadHeaderDetails(res?.responseData?.leadHeaderDetail));
        navigate(`/contact/${caseId}?case=Contact`);
      } else {
        toastFail("You are not the intended recipient of this escalated lead");
      }
    } catch (err) {
      console.error("Error:", err);
      toastFail(err.message || "Failed to process lead");
    }
  };
  const handleNavigateToContact = (record: IWorklistTableProps) => {
    // check if current case is Escalated case
    if (
      record?.escalated?.toString().toLowerCase().includes("y") &&
      record?.allocatedTo === getUserId()
    ) {
      checkNavigateEscalatedLead(record?.leadCode);
      dispatch(setIsEscalatedScreen({ value: true }));
      return;
    } else {
      dispatch(setIsEscalatedScreen({ value: false }));
    }
    if (
      record?.refer?.toString().toLowerCase().includes("y") &&
      record?.allocatedTo === getUserId()
    ) {
      checkNavigateEscalatedLead(record?.leadCode);
      dispatch(setIsEscalatedScreen({ value: true }));
      return;
    } else {
      dispatch(setIsEscalatedScreen({ value: false }));
    }
    if (
      record?.refer?.toString().toLowerCase().includes("y") &&
      record?.allocatedTo !== getUserId()
    ) {
      toastFail("Lead is already refered");
    }
    // else if (record?.coAllocate?.toString().toLowerCase().includes("y")) {
    //   toastFail("Lead is already co-allocated");
    // }
    else if (
      record?.escalated?.toString().toLowerCase().includes("y") &&
      record?.allocatedTo !== getUserId()
    ) {
      toastFail("Lead is already escalated");
    } else {
      localStorage.setItem("leadId", JSON.stringify(record.leadId));
      dispatch(
        updateLeadId({
          leadId: record.leadId,
        })
      );
      navigate(`/contact/${record.leadCode}?case=Contact`);
    }
  };

  useEffect(() => {
    refetch();
  }, [searchData]);

  const formatINR = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      // minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns: ColumnsType<IWorklistTableColumnType> = [
    {
      title: t("worklist.workListTable.caseId"),
      dataIndex: "leadCode",
      key: "leadCode",
      render: leadCode => {
        return (
          <Text
            sx={{ color: "#0000FF" }}
            _hover={{ cursor: "pointer" }}
            fontWeight={600}
            fontSize={"12px"}
          >
            {leadCode}
          </Text>
        );
      },
      onCell: record => {
        return {
          onClick: () => handleNavigateToContact(record),
        };
      },
    },
    {
      title: t("worklist.workListTable.product"),
      dataIndex: "queue",
      key: "queue",
    },
    {
      title: t("worklist.workListTable.potential"),
      dataIndex: "subQueue",
      key: "subQueue",
    },
    // {
    //   title: t("worklist.workListTable.refer"),
    //   dataIndex: "refer",
    //   key: "refer",
    // },
    {
      title: t("worklist.workListTable.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      render: (text: string) => text?.toUpperCase(),
    },
    // {
    //   title: t("worklist.workListTable.amount"),
    //   dataIndex: "amount",
    //   key: "amount",
    // },
    {
      title: t("worklist.workListTable.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (value: string | number) =>
        value ? formatINR(Number(String(value).replace(/[^0-9.-]/g, ""))) : "",
    },
    {
      title: t("worklist.workListTable.actionName"),
      dataIndex: "actionName",
      key: "actionName",
    },
    {
      title: t("worklist.workListTable.allocatedTo"),
      dataIndex: "allocatedToName",
      key: "allocatedToName",
    },
    {
      title: t("worklist.workListTable.followUpAction"),
      dataIndex: "followUp_action",
      key: "followUp_action",
    },
    {
      title: t("worklist.workListTable.status"),
      render: record => {
        const isOffline = record?._isOffline;
        const syncStatus = record?._syncStatus;
        const actionId = record?._pendingActionId;
        const lastError = record?._lastError;
        const isSyncing = syncingItems.has(actionId);
        
        return (
          <>
            <VStack align="start" spacing={2} maxW="200px">
              <HStack
                sx={{
                  "& button": {
                    padding: 0,
                  },
                }}
              >
                {isOffline && (
                  <>
                    {syncStatus === 'pending' && (
                      <Badge colorScheme="orange" fontSize="10px">
                        Offline
                      </Badge>
                    )}
                    {syncStatus === 'syncing' && (
                      <Badge colorScheme="blue" fontSize="10px">
                        <HStack spacing={1}>
                          <Spinner size="xs" />
                          <Text fontSize="10px">Syncing</Text>
                        </HStack>
                      </Badge>
                    )}
                    {syncStatus === 'error' && (
                      <Badge colorScheme="red" fontSize="10px">
                        Error
                      </Badge>
                    )}
                    {/* {isOnline && actionId && !isSyncing && syncStatus !== 'error' && (
                      <Button
                        size="xs"
                        colorScheme="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSyncSingleAction(actionId);
                        }}
                        isLoading={isSyncing}
                        ml={1}
                      >
                        Sync
                      </Button>
                    )} */}
                    {syncStatus === 'error' && actionId && (
                      <HStack spacing={1} ml={1}>
                        {/* {isOnline && (
                          <Button
                            size="xs"
                            colorScheme="blue"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSyncSingleAction(actionId);
                            }}
                            isLoading={isSyncing}
                          >
                            Retry
                          </Button>
                        )} */}
                        <IconButton
                          size="xs"
                          colorScheme="red"
                          icon={<FiTrash2 />}
                          aria-label="Delete offline lead"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePendingAction(actionId);
                          }}
                        />
                      </HStack>
                    )}
                  </>
                )}
                {!isOffline && (
                  <>
                    {record?.refer?.toString().toLowerCase().includes("y") ? (
                      <Image src={getCorrectImageUrl2(refer)} alt="refer" />
                    ) : null}
                    {record?.escalated?.toString().toLowerCase().includes("y") ? (
                      <Image src={getCorrectImageUrl2(escalated)} alt="escalation" />
                    ) : null}
                    {record?.coAllocate?.toString().toLowerCase().includes("y") ? (
                      <Image src={getCorrectImageUrl2(coAllocate)} alt="coAllocate" />
                    ) : null}
                  </>
                )}
              </HStack>
              {isOffline && lastError && syncStatus === 'error' && (
                <Alert status="error" fontSize="11px" p={1} borderRadius="md">
                  <AlertIcon boxSize="12px" />
                  <AlertDescription fontSize="11px">
                    {lastError}
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          </>
        );
      },
    },
    {
      title: t("worklist.workListTable.action"),
      render: record => {
        return (
          <>
            <HStack
              maxW={"170px"}
              sx={{
                "& button": {
                  padding: 0,
                },
              }}
            >
              <IconButton
                icon={<FiMenu></FiMenu>}
                onClick={() => {
                  onOpen();
                  setActiveCase(record?.leadCode);
                }}
                aria-label="menu"
                variant={"outline"}
                colorScheme={"MifinColor?.black_opacity_black_70"}
                isRound
                size={"xs"}
              ></IconButton>
            </HStack>
            <DrawerComponent
              isModalOpen={isOpen}
              closeModal={onClose}
              title="Case Details"
            >
              <CaseDetails
                activeCase={activeCase}
                leadTableData={WorkData || []}
              />
            </DrawerComponent>
          </>
        );
      },
    },
  ];

  // const handleCardClick = single => {
  //   //setIsChecked(!isChecked);
  //   if (handleSelect) {
  //     handleSelect(single);
  //   }
  // };

  const toggleExpand = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index], // Toggle only the clicked card
    }));
  };
  return (
    <>
      <Box className="worklistTable" display={{ base: "none", md: "block" }}>
        <Table
          rowSelection={rowSelection}
          rowKey={(record: any) => record.leadId}
          columns={columns}
          pagination={{
            pageSizeOptions: ["5", "10", "20"],
            showSizeChanger: true,
            defaultPageSize: 5,
            locale: { items_per_page: "" },
          }}
          dataSource={WorkData || []}
          scroll={{ x: 900 }}
          rowClassName={(record: any) => record._isOffline ? 'offline-row' : ''}
        />
      </Box>
      <Box display={{ base: "block", md: "none" }} mb={"22px"}>
        {WorkData?.length > 0 ? (
          <CardPagination
            data={WorkData}
            itemsPerPage={3}
            renderComponent={(
              {
                leadCode,
                generationDate,
                imageTag,
                sizeOfList,
                temp,
                followUp_actionId,
                followUp_Flag,
                allocatedTo,
                queueId,
                bankName,
                // allocatedToName,
                prospectId,
                coAllocate,
                ...single
              }: any,
              index
            ) => {
              // Add this debug output in your mobile view render
              // WorkData?.length > 0 ? WorkData?.map(({ leadCode, generationDate, imageTag, sizeOfList, temp, followUp_actionId, followUp_Flag, allocatedTo, queueId, bankName, allocatedToName, prospectId, coAllocate, ...single }: any, index: number) => {
              const dataEntries = Object.entries(single);
              return (
                <Card
                  key={index}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={single._isOffline ? "orange.400" : "gray.100"}
                  borderLeft={single._isOffline ? "4px solid" : "1px solid"}
                  borderLeftColor={single._isOffline ? "#FF9800" : "gray.100"}
                  bg={single._isOffline ? "#FFF3E0" : "white"}
                  mb="12px"
                  overflow="hidden"
                >
                  <Divider />
                  <CardBody p={2} mt={"8px"}>
                    {/* Offline Status Banner */}
                    {single._isOffline && (
                      <Box mb={3}>
                        <HStack spacing={2} mb={2}>
                          {single._syncStatus === 'pending' && (
                            <Badge colorScheme="orange" fontSize="11px">
                              ⚠️ Offline - Not Synced
                            </Badge>
                          )}
                          {single._syncStatus === 'syncing' && (
                            <Badge colorScheme="blue" fontSize="11px">
                              <HStack spacing={1}>
                                <Spinner size="xs" />
                                <Text fontSize="11px">Syncing...</Text>
                              </HStack>
                            </Badge>
                          )}
                          {single._syncStatus === 'error' && (
                            <Badge colorScheme="red" fontSize="11px">
                              ❌ Sync Error
                            </Badge>
                          )}
                          {isOnline && single._pendingActionId && !syncingItems.has(single._pendingActionId) && single._syncStatus !== 'error' && (
                            <Button
                              size="xs"
                              colorScheme="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSyncSingleAction(single._pendingActionId);
                              }}
                              isLoading={syncingItems.has(single._pendingActionId)}
                            >
                              Sync Now
                            </Button>
                          )}
                          {single._syncStatus === 'error' && single._pendingActionId && (
                            <HStack spacing={1}>
                              {isOnline && (
                                <Button
                                  size="xs"
                                  colorScheme="blue"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSyncSingleAction(single._pendingActionId);
                                  }}
                                  isLoading={syncingItems.has(single._pendingActionId)}
                                >
                                  Retry
                                </Button>
                              )}
                              <IconButton
                                size="xs"
                                colorScheme="red"
                                icon={<FiTrash2 />}
                                aria-label="Delete offline lead"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePendingAction(single._pendingActionId);
                                }}
                              />
                            </HStack>
                          )}
                        </HStack>
                        {single._lastError && single._syncStatus === 'error' && (
                          <Alert status="error" fontSize="12px" p={2} borderRadius="md">
                            <AlertIcon boxSize="14px" />
                            <AlertDescription fontSize="12px">
                              {single._lastError}
                            </AlertDescription>
                          </Alert>
                        )}
                      </Box>
                    )}
                    <Flex alignItems="flex-start" gap={2}>
                      {/* Checkbox */}
                      {
                        /* <Box position="absolute" top="0" right="0" p={2}>
                        <Checkbox
                          size="lg"
                          colorScheme="blue"
                          onChange={handleSelect}
                          onClick={e => e.stopPropagation()}
                          borderRadius="md"
                          _hover={{ transform: "scale(1.1)" }}
                        />
                      </Box> */
                        <Box position="absolute" top="0" right="0" p={2}>
                          {
                            /* <Checkbox
    size="lg"
    colorScheme="blue"
    // Use includes() to check if the current leadId is selected
    isChecked={allID.includes(String(single.leadId))}
    onChange={() => handleSelect(single)}
    onClick={e => e.stopPropagation()}
    borderRadius="md"
    _hover={{ transform: "scale(1.1)" }}
  /> */
                            <Checkbox
                              size="lg"
                              colorScheme="blue"
                              isChecked={allID.includes(String(single.leadId))}
                              onChange={() => handleSelect(single)}
                              onClick={e => e.stopPropagation()}
                            />
                            // <Checkbox
                            //   checked={allID.includes(String(single.leadId))}
                            //   onChange={() => handleSelect(single)}
                            //   onClick={e => e.stopPropagation()}
                            // />
                          }
                        </Box>
                      }

                      {/* Grid Section */}
                      <SimpleGrid
                        ml={"12px"}
                        columns={2}
                        spacingX={5}
                        spacingY={4}
                        fontSize="15px"
                        color="gray.800"
                        flex="1"
                      >
                        {dataEntries
                          .filter(([key]) => {
                            const keyLower = key.toLowerCase();
                            return !(
                              keyLower.includes("refer") ||
                              keyLower.includes("escalated") ||
                              keyLower.includes("coallocate")
                            );
                          }) // This will remove refer, escalated, and coallocate
                          .slice(
                            0,
                            expandedCards[index] ? dataEntries.length : 6
                          )
                          .map(([key, value], index) => {
                            return (
                              <Flex
                                key={index}
                                flexDirection="column"
                                borderRadius="md"
                              >
                                {/* Label */}
                                <Box
                                  fontWeight="600"
                                  color="#1A202C"
                                  fontSize={"14px"}
                                >
                                  {formatKey(key)}
                                </Box>

                                {/* Value */}
                                <Box
                                  color="#4A5568"
                                  fontWeight="100"
                                  fontSize={"14px"}
                                >
                                  {key.toLowerCase() === "leadid" ? (
                                    <Text
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleNavigateToContact(single);
                                      }}
                                      color="#0000ff"
                                      fontWeight="semibold"
                                      cursor="pointer"
                                      fontSize={"14px"}
                                      _hover={{
                                        textDecoration: "underline",
                                        color: "blue.700",
                                      }}
                                    >
                                      {/* {value} */}
                                      {leadCode}
                                    </Text>
                                  ) : (
                                    <Text>{String(value).toUpperCase()}</Text>
                                  )}
                                </Box>
                              </Flex>
                            );
                          })}
                      </SimpleGrid>
                    </Flex>
                  </CardBody>

                  {/* Expand Button */}
                  {/* {dataEntries.length > 6 && (
                    <Flex justifyContent="flex-end" p={3} pt={0}>
                      <Accordion allowToggle>
                        <AccordionItem border="none">
                          <AccordionButton
                            borderRadius="full"
                            h="32px"
                            w="32px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            _hover={{ bg: "rgb(47, 76, 221)" }}
                            bg="rgb(47, 76, 221)"
                            color="white"
                            transition="all 0.2s"
                            onClick={e => {
                              e.stopPropagation(); // Prevent checkbox selection when expanding
                              // setIsExpanded(!isExpanded);
                              toggleExpand(index);
                            }}
                          >
                            <AccordionIcon fontSize="20px" />
                          </AccordionButton>
                        </AccordionItem>
                      </Accordion>
                    </Flex>
                  )} */}
                  {dataEntries.length > 6 && (
                    <Flex
                      justifyContent={
                        dataEntries.some(
                          ([key, value]) =>
                            (key.toLowerCase().includes("refer") ||
                              key.toLowerCase().includes("escalated") ||
                              key.toLowerCase().includes("coallocate")) &&
                            value?.toString().toLowerCase() === "y"
                        )
                          ? "space-between"
                          : "flex-end"
                      }
                      p={3}
                      pt={0}
                      align="center"
                    >
                      {/* Icons should align to the left when showIconOnly is true */}
                      {dataEntries.some(
                        ([key, value]) =>
                          (key.toLowerCase().includes("refer") ||
                            key.toLowerCase().includes("escalated") ||
                            key.toLowerCase().includes("coallocate")) &&
                          value?.toString().toLowerCase() === "y"
                      ) && (
                        <Flex align="center" gap={2}>
                          {dataEntries.map(([key, value]) => {
                            const keyLower = key.toLowerCase();
                            if (
                              (keyLower.includes("refer") ||
                                keyLower.includes("escalated") ||
                                keyLower.includes("coallocate")) &&
                              value?.toString().toLowerCase() === "y"
                            ) {
                              return (
                                <Flex align="center" gap={2} key={key}>
                                  {keyLower.includes("refer") ? (
                                    <Image
                                      src={getCorrectImageUrl2(refer)}
                                      alt="refer"
                                    />
                                  ) : null}

                                  {keyLower.includes("escalated") ? (
                                    <Image
                                      src={getCorrectImageUrl2(escalated)}
                                      alt="escalation"
                                    />
                                  ) : null}

                                  {keyLower.includes("coallocate") ? (
                                    <Image
                                      src={getCorrectImageUrl2(coAllocate)}
                                      alt="coAllocate"
                                    />
                                  ) : null}
                                </Flex>
                              );
                            }
                            return null;
                          })}
                        </Flex>
                      )}

                      <Accordion allowToggle>
                        <AccordionItem border="none">
                          <AccordionButton
                            borderRadius="full"
                            h="32px"
                            w="32px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            _hover={{ bg: "rgb(47, 76, 221)" }}
                            bg="rgb(47, 76, 221)"
                            color="white"
                            transition="all 0.2s"
                            onClick={e => {
                              e.stopPropagation();
                              toggleExpand(index);
                            }}
                          >
                            <AccordionIcon fontSize="20px" />
                          </AccordionButton>
                        </AccordionItem>
                      </Accordion>
                    </Flex>
                  )}
                </Card>
              );
            }}
          />
        ) : (
          <Text textAlign={"center"}>No Worklist Data</Text>
        )}
      </Box>
    </>
  );
});

export default WorkListTable;
