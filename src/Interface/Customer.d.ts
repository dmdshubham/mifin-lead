import {
  Control,
  UseFormWatch,
  UseFormRegister,
  FieldError,
  UseFormSetValue,
} from "react-hook-form";
import { ReactNode } from "react";
// customer model types
export interface IContactDetailsState {
  helpType: string;
  initiatedTo: string;
  remarks: string;
}
//address
export interface AddressProps {
  tehsilMasterName: string;
  tehsilMasterId: string;
  tehsilCityId: string;
  displayName: string;
  stateMasterId: string;
  divisionName: string;
  pincode: string;
  pincodeMasterId: string;
  tehsilId: string;
  occupancyStName: string;
  cityMasterId: string;
  occupancyStId: string;
  stateId: string;
  setAllAddress: () => void;
  allAddress: Array<any>;
  allCities: string;
  state: string;
  prodName: string;
  prodId: string;
  subQueue: string;
  subQueueId: string;
  sourceName: string;
  caseSourceId: string;
  campaignName: string;
  campaignId: string;
  userName: string;
  userId: string;
  TEMPLATENAME: string;
  TEMPLATEID: string;
  MODEID: string;
  noteTypeName: string;
  noteTypeId: string;
  notecodeName: string;
  noteCodeId: string;
  addressType: string;
  mailingAddress: string;
  customerDetail: any;
}

export interface CustomerData {
  leadCode: string;
  customerName: string;
  customerMobile: string;
  customerResCity: string;
  leadId: string;
  queue: string;
  disposition: string;
  generationDate: string;
  allocatedTo: string;
  source: string;
  leadStage: string;
  campaign: string;
}
export interface TextInputProps {
  name: string;
  control?: Control<TFieldValues, TContext>;
  type: string;
  label?: string;
  isRequired?: boolean;
  startIcon?: ReactNode;
  endIcons?: ReactNode;
  disabled?: boolean;
  onIconClick?: () => void;
  variant?: string;
  noFloating?: boolean;
  onCustomChange?: () => void;
  hideError?: boolean;
  id?: string;
  regex?: string;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  customStyles?: any;
  InputConfig?: any;
  formatAsCommaSeparated?: any;
}

// action history table types
export interface IActionHistoryTableColumn {
  action: string;
  actionDate: string;
  followUpAction: string;
  followupActionDate: string;
  leadStage: string;
  potential: string;
  remarks: string;
}

export interface IActionHistoryTableProps {
  ContactDetail: Array<any>;
}

// allocation history table types
export interface IAllocationHistoryTableColumn {
  action: string;
  allocatedBy: string;
  allocatedTo: string;
  allocatedDate: string;
  remark: string;
}

// Escalation History Table types
export interface IEscalationHistoryTableColumn {
  actionName?: number;
  initiatedBy?: string;
  initiatedTo?: string;
  initiatedDateTime?: string;
  initialRemarks?: string;
  resolvedBy?: string;
  resolveDtTime?: string;
  resolvedRemarks?: string;
}

export interface IEscalationHistoryTableProps {
  ContactDetail?: any;
}
export interface IndexProps {
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  actionName: string;
  caseRefEscId: string;
  resolutionCheck: boolean;
  initialRemarks: string;
  initiatedDateTime: string;
  initiatedBy: string;
  resolvedRemarks: string;
  resolve: boolean;
  purposeOfLoanId: string;
  purposeOfLoanName: string;
  leadId: string;
}

export interface IDunningHistoryTableColumn {
  dunningTemplate?: string;
  dunningMode?: string;
  dunningDate?: string;
  dunningBy?: string;
  remarks?: string;
}
export interface DataItem {
  first_name: string;
  middle_name: string;
  last_name: string;
  user: {
    email: string;
  };
}
export interface MarkerData {
  markerOffset: number;
  name: string;
  coordinates: [number, number];
}

export interface IDunningHistoryTableProps {
  ContactDetail?: Array<any>;
}
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor?: string[];
  borderWidth?: number;
}

export interface CollectionChartData {
  datasets: ChartDataset[];
  labels?: string[];
}

export interface ILeadDetails {
  source?: string;
  employmentCode?: string;
  employmentName?: string;
}

export interface EscalatedLeadStatusProps {
  defaultValues: {
    actionName: string;
    initiatedBy: string;
    initiatedDateTime: string;
    initialRemarks: string;
    resolvedRemarks: string;

    control: Control<TFieldValues>;
    register: UseFormRegister<TFieldValues>;
  };
  control: Control<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
}

export interface IIncomeDetail {
  annualIncome?: string;
  grossMonthly?: string;
  netMonthly?: string;
  monthlyRent?: string;
  otherAnnual?: string;
  interestPaid?: string;
  mastersData?: Array<any>;
}

export interface IAddressDetails {
  addressType?: boolean;
  destinationAddress?: boolean;
  mailingAddress?: boolean;
  residentialAddress?: string;
  houseName?: string;
  streetName?: string;
  areaName?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  district?: string;
  landmark?: string;
  mobileNumber1?: string;
  mobileNumber2?: string;
  landline1?: string;
  landline2?: string;
  landline3?: string;
  livingSince?: string;
  oldAddress?: string;
  marketValue?: string;
  ownership?: string;
  mastersData?: Array<any>;
}

export interface IPropertyDetail {
  propertyType?: string;
  propertyStatus?: string;
  developer?: string;
  otherDeveloper?: string;
  estimatedValue?: string;
  propertyAdd?: string;
  landmark?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  occupancy?: string;
  remarks?: string;
}

export interface ILeadStatusProps {
  defaultValues: DeepPartial<TFieldValues>;
  control: Control<TFieldValues, TContext>;
  watch: UseFormWatch<TFieldValues>;
  action: { label: string; value: string } | null;
  actionDate: Date;
  actionTime: Date;
  followupAction: { label: string; value: string } | null;
  followupDate: Date;
  followupTime: Date;
  leadStage: { label: string; value: string } | null;
  potential: { label: string; value: string } | null;
  remarks: string;
  actionName: string;
  actionId;
  string;
  subQueue: string;
  subQueueId: string;
  stageName: string;
  stageId: string;
  value: string;
  id: string;
  sectorName: string;
  sectorId: string;
  displayName: string;
  industryId: string;
  nationName: string;
  nationalityId: string;
  genderName: string;
  genderId: string;
  maritalStatusid: string;
  maritalStatusname: string;
  clusterName: string;
  clusterId: string;
  typeOfBusiness: string;
  isConvertedToCustomer: boolean;
}
export interface AllMastersData {
  stageMaster?: ILeadStatusProps[];
  sectorMaster?: ILeadStatusProps[];
  industryMaster?: ILeadStatusProps[];
  typeOfBusinessMaster?: ILeadStatusProps[];
  clusterMaster?: ILeadStatusProps[];
  maritalStatus?: ILeadStatusProps[];
  gender?: ILeadStatusProps[];
  nationality?: ILeadStatusProps[];
}
export interface IndividualDetailsProps {
  allMastersData: {
    stageMaster: string;
    sectorMaster: string;
    industryMaster: string;
    typeOfBusinessMaster: string;
    clusterMaster: string;
    maritalStatus: string;
    gender: string;
    nationality: string;
  };
  age: number;
  errors: FieldErrors<TFieldValues>;
}
export interface NonIndividualDetailsProps {
  allMastersData: {
    stageMaster: string;
    sectorMaster: string;
    industryMaster: string;
    typeOfBusinessMaster: string;
    clusterMaster: string;
    constitutionList: string;
  };
}

export interface ILeadDetailsProps {
  control: Control<TFieldValues, TContext>;
  register?: UseFormRegister<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  defaultValues: DeepPartial<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  sourceName: string;
  caseSourceId: string;
  value: string;
  id: string;
  geoName: string;
  prodName: string;
  branchId: string;
  geoId: string;
  purposeOfLoanName: string;
}

export interface IPersonalDetailProps {
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  defaultValues: DeepPartial<TFieldValues>;
  control: Control<TFieldValues, TContext>;
  setValue: UseFormSetValue<TFieldValues>;
  displayName: string;
  custEntityTypeId: string;
  Occupationid: string;
  Occupationname: string;
  titleName: string;
  titleId: string;
  industryId: string;
  typeOfBusiness: string;
  id: string;
  clusterName: string;
  clusterId: string;
  maritalStatusname: string;
  maritalStatusid: string;
  genderName: string;
  genderId: string;
  nationName: string;
  nationalityId: string;
  customerDetail: any;
}

export interface IPropertyDetailProps {
  defaultValues: DeepPartial<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  developerType: Array<any>;
  errors: FieldErrors<TFieldValues>;
  control: Control<TFieldValues, TContext>;
  defaultValues: {
    listProperty?: string;
    state?: string;
    city?: string;
  };
  setValue: (
    name: string,
    value: string,
    options?: { shouldDirty: boolean }
  ) => void;
  developerType?: any[];
  propertCollateralDetails: Array<any>;
}
export interface PropertyDetailItem {
  address: string;
  city: string;
  devloperId: string;
  estimatedValue: string;
  landMark: string;
  occupancyStatus: string;
  otherDeploperName: string;
  projectId: string;
  propStatus: string;
  propTypeId: string;
  state: string;
  zipcode: string;
  remarks: string;
  propTypeName: string;
  propStatusId: string;
  propStatusName: string;
  devloperName: string;
  projectName: string;
  otherProjectName: string;
  stateMasterId: string;
  displayName: string;
  stateId: string;
  cityMasterId: string;
  cityMasterId: string;
  cityName: string;
  pincode: string;
  divisionName: string;
  occupancyStId: string;
  occupancyStName: string;
}
export interface AllocatedUser {
  label: string;
  value: string;
  userName: string;
  userId: string;
  err: FieldError;
}
export interface buttonStatus {
  save: boolean;
  saveAndContinue: boolean;
  saveAndExit: boolean;
  cancel: boolean;
}

export interface validationComponentPeops {
  tabKey?: boolean;
  onClick: () => Promise<T>;
  isError?: boolean;
  onCancel?: () => void;
  isSubmitting?: boolean;
  onInputNavigate?: (fieldName: string) => void;
  showActionButtons?: boolean;
  pathName?: string;
  setClickedButtonName?: SetStateAction<Dispatch<string>> | undefined;
  setAddressData?: SetStateAction<Dispatch<any>>;
  setEmailArray?: SetStateAction<Dispatch<Array<any>>>;
  setMobileArray?: SetStateAction<Dispatch<any>>;
  buttonClickStatus?: (status: { saveAndExit: boolean; save: boolean }) => void;
  setButtonClickStatus: (status: {
    saveAndExit: boolean;
    save: boolean;
  }) => void;
  setresetAddress?: SetStateAction<Dispatch<boolean>>;
  isSaveButtonVisible?: boolean;
  isSaveAndExitButtonVisible?: boolean;
}
