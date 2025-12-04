export interface IReallocationPopoverProps {
  allID: Array<string>;
  setAllID: Dispatch<SetStateAction<any>>;
  searchData: Array<any>;
  userName: string;
  userId: string;
  prodName: string;
  prodId: string;
  onReAllocation: any;
  allocateMaster?: any;
}
export interface FormValues {
  queueId: { label: string; value: string } | null;
  allocatedId: { label: string; value: string } | null;
  remark: string;
}

export interface IReallocationProps {
  allID: Array<string>;
  setAllID: Dispatch<SetStateAction<Array<string>>>;
  onReAllocation: any;
  searchData: string;
}
export interface cardTableProps {
  data: Array<any>;
  leadCode: number;
  customerName: string;
  applicantCode: string;
  odAmt: string;
  product: string;
  allocatedTo: string;
  ptpAmt: number;
  escalated: string;
  followUp_Flag: string;
  allocated: string;
}
export interface IDataTableProps {
  data: Record<string, any>[];
  columns: ColumnDef<any, any>[];
  isLoading?: boolean;
  pagination?: {
    manual: boolean;
    pageCount: number;
    pageIndex: number;
    pageSize: number;
    onChangePagination: (paginationData: Updater<PaginationState>) => void;
  };

  setTable?: (table: any) => void;
}
export interface IPagination {
  isBackendPaginated?: boolean;
  pageIndex?: number;
  table: Table<any>;
  pageCount?: number;
}

export interface IDateRangeProps
  extends Omit<ReactDatePickerProps, "selected" | "onChange"> {
  date: Date | null;

  setDate: (date: Date) => void;

  placeholder: string;

  is24HrFormat?: boolean;

  showYear?: boolean;

  showMonth?: boolean;

  onChange?: () => void;
}

export interface IWorklistTableColumnType {
  key: React.Key;
  leadId?: string;
  leadCode: string | number;
  queue: string;
  customerName?: string;
  subQueue?: string;
  amount?: string | number;
  allocatedTo?: string;
  bankName?: string;
  escalated?: string;
  refer?: string;
  coAllocate?: string;
  actionName?: string;
  imageTag?: string;
  temp?: string;
  followUpAction?: string;
  followDate?: string;
}

export interface IWorklistTableProps {
  leadData?: Array<any> | undefined;
  allID?: Array<any> | undefined;
  setAllID?: Dispatch<SetStateAction<any>> | undefined;
  searchData: string;
  setSearchData: Dispatch<SetStateAction<any>>;
  leadId: string;
  leadCode: string;
  queue: string;
  subQueue: string;
  refer: string;
  customerName: string;
  amount: string;
  actionName: string;
  allocatedToName: string;
  followUpAction: string;
  escalated: string;
  coAllocate: string;
  setAllocatedId?: any;
  onSyncPending?: () => void;
  onRefreshData?: () => void;
}

export interface ISearchFormProps {
  searchData: string;
  setSearchData: Dispatch<SetStateAction<any>>;
  setAllID: Dispatch<SetStateAction<any>>;
  actionStage: string;
  sortOrderName: string;
  sortOrderId: string;
  sortByName: string;
  sortById: string;
  userName: string;
  userId: string;
  campaignName: string;
  campaignId: string;
  sourceName: string;
  caseSourceId: string;
  subQueue: string;
  subQueueId: string;
  actionName: string;
  actionId: string;
  prodName: string;
  prodId: string;
  label: string;
  value: string;
}

export interface ILMSWorklistTabsProps {
  searchData: string;
}
