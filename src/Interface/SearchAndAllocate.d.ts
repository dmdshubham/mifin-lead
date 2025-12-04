// Allocate Table components types
export interface IAllocateTableColumn {
  id?: number;
  queue?: string;
  subQueue?: string;
  dnd?: string;
  source?: string;
  campaign?: string;
  noOfCase?: string | number;
  allocate?: string;
  addMore?: string;
}

export interface IAllocateTableProps {
  allocatedList: (string | number)[];
  setAllocatedList: Dispatch<SetStateAction<any>>;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setRemainingCase: Dispatch<SetStateAction<any>>;
  remainingCase: (string | number)[];
}
export interface IFormData {
  queueId: { label: string; value: string } | null;
  userName: string;
  userId: string;
  value: string;
}

// search and allocate Table components types
export interface ISearchAndAllocateColumn {
  queue?: string;
  subQueue?: string;
  dnd?: string;
  source?: string;
  campaign?: string;
  noOfCase?: string | number;
  allocate?: string;
  leftToAllocate?: string;
}

export interface ISearchAndAllocateTableProps {
  drawerFormData: Array<string>;
  setDrawerFormData: Dispatch<SetStateAction<any>>;
  data: Array<any>;
  showAllocateTable: boolean;
  setShowAllocateTable: Dispatch<SetStateAction<boolean>>;
  setTotalCase: Dispatch<SetStateAction<string>>;
  setRemainingCase: Dispatch<SetStateAction<string>>;
  remainingCase: string;
  totalCase: string;
  onOpen: () => void;
}

export interface IAllocatedCaseList {
  campaign: string;
  campaignId: string | number;
  dnd: string;
  noOfCase: string | number;
  queue: string;
  queueId: string | number;
  rowNo: string | number;
  source: string;
  sourceId: string | number;
  subQueueId: string | number;
}

// side drawer components types
export interface ISideDrawerProps {
  drawerFormData: (string | number)[];
  allocatedList: Array<any>;
  setAllocatedList: Dispatch<SetStateAction<any>>;
  setShowAllocateTable: Dispatch<SetStateAction<boolean>>;
  remainingCase: string;
  setRemainingCase: Dispatch<SetStateAction<string>>;
  totalCase: string;
  allocateList: Array<any>;
  showAllocateTable: boolean;
  selectedUser: string;
  setDrawerFormData: Dispatch<SetStateAction<any>>;
  allocatedCaseList: Array<IAllocatedCaseList>;
  setTotalCase: Dispatch<SetStateAction<string>>;
  setIsEditClicked: Dispatch<SetStateAction<boolean>>;
  isEditClicked: boolean;
  handleReset: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  userId: string;
  userName: string;
  label: string;
  value: string;
}
