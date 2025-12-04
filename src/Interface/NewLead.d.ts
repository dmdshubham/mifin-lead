import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  UseFormTrigger,
  FieldName,
  FieldError,
} from "react-hook-form";

export interface IAddressProps {
  control: Control<TFieldValues>;
  register: UseFormRegister<any>;
  defaultValues: DeepPartial<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
}
export interface GridLayoutProps {
  columns?: { sm: number; md: number; lg: number;};
  rowGap?: string | number;
  px?: number | string;
  py?: number | string;
  gap?: string;
  mt?: number | string;
  mb?: number | string;
  children: ReactNode;
  spacing?: number | string | undefined;
  width?: number | string;
  sx?: number | string;
}
export interface IAddressDrawerProps {
  setValue: Dispatch<SetStateAction<any>>;
  editRecord: any;
  setEditRecord: Dispatch<SetStateAction<any>>;
  onClose: () => void;
  isOpen: boolean;
  dataSource1: string;
}

export interface IIncomeDetailsProps {
  control?: Control<TFieldValues>;
  defaultValues?: DeepPartial<TFieldValues>;
}

export interface IKeyContactsDrawerProps {
  setValue: UseFormSetValue<TFieldValues>;
  setFlag: Dispatch<SetStateAction<boolean>>;
  flag: boolean;
  onClose: () => void;
  isOpen: boolean;
  editRecord: any;
  contactType: Array<any>;
  setContactType: Dispatch<SetStateAction<any>>;
  keyContactData: Array<any>;
  drawerData: any;
  setUpdatedTableData: any;
}

export interface IKeyContactTableProps {
  setValue?: UseFormSetValue<TFieldValues>;
  defaultValues?: DeepPartial<TFieldValues>;
}

export interface ILeadDetailsProps {
  control?: Control<TFieldValues>;
  defaultValues?: DeepPartial<TFieldValues>;
  geoName: string;
  geoId: string;
  id: string;
  value: string;
  userId: string;
  userName: string;
  campaignId: string;
  campaignName: string;
  caseSourceId: string;
  sourceName: string;
  subQueueId: string;
  subQueue: string;
  purposeOfLoanId: string;
  purposeOfLoanName: string;
  prodId: string;
  prodName: string;
  purposeOfLoan: string;
  purposeOfLoanCode: string;
  purposeOfLoanName: string;
  navigateFocus: any;
}

export interface LoanItem {
  purposeOfLoanCode: string;
  purposeOfLoanName: string;
  purposeOfLoanId: string;
}

export interface LoginDetail {
  username: string;
  password: string;
  onSubmitHandler: () => void;
}
// =========== address types ==========
export interface IOfficeAddressProps {
  mastersData: Array<string>;
  officeAddressOfLead: string;
  setOfficeAddressOfLead: Dispatch<SetStateAction<any>>;
  setPersonalDetails: Dispatch<SetStateAction<any>>;
  PersonalDetails: string;
  values: string;
  handleChange: () => void;
  errors: FieldError | undefined;
  touched: FieldNames<TFieldValues>;
}

export interface IPermanentAddressProps {
  mastersData: Array<string>;
  permanentAddressOfLead: string;
  setPermanentAddressOfLead: Dispatch<SetStateAction<any>>;
  values: string;
  handleChange: () => void;
  errors: FieldError | undefined;
  touched: FieldNames<TFieldValues>;
}

export interface IPersonalDetailsProps {
  control?: Control<TFieldValues>;
  touchedFields?: FieldName<any>;
  Controller?: string;
  setValue?: UseFormSetValue<TFieldValues>;
  errors?: FieldError | undefined;
  watch?: UseFormWatch<TFieldValues>;
  trigger?: UseFormTrigger<TFieldValues>;
  isDirty?: boolean;
  navigateFocus: string;
  displayName: string;
  custEntityTypeId: string;
  Occupationname: string;
  Occupationid: string;
}

export interface IResidenceAddressProps {
  mastersData: Array<string>;
  resisdenceAddressOfLead: string;
  setResistenceAddressOfLead: Dispatch<SetStateAction<any>>;
  values: string;
  handleChange: () => void;
  errors: FieldError | undefined;
  touched: FieldNames<TFieldValues>;
}

export interface ITableLeadProps {
  setContactType: Dispatch<SetStateAction<any>>;
  contactType: string;
  mastersData: Array<string>;
}
