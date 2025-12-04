import { ThemingProps } from "@chakra-ui/react";
import { Control } from "react-hook-form";
import { Props } from "react-select";
import { FieldError } from "react-hook-form";
import { ReactNode } from "react";

export interface IButton {
  title: string;
  onClick?: (e: MouseEvent<HTMLElement>) => any;
  type?: "submit" | "reset" | "button";
  isLoading?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  height?: string;
  large?: string;
  small?: string;
  margin?: string;
  isDisabled?: boolean;
  form?: string;
  name?: string;
}

export interface ICollapse {
  title: string;
  progressbar?: React.ReactNode;
  children: React.ReactNode;
  cases?: number;
}

export interface IHeaderDetail {
  leadId?: string;
  queue?: string;
  allocatedToName?: string;
  customerName?: string;
  customerMobile?: string;
  allocatedTo?: string;
  product?: string;
  productId?: string;
  branch?: string;
  caseState?: string;
  odAmt?: string;
  prospectId?: string;
  prospectcode?: string;
  customerId?: string;
  customerCode?: string;
  disbursalDate?: string;
  schemeName?: string;
  schemeId?: string;
  branchId?: string;
  sactionAmt?: string;
  pos?: string;
  emi?: string;
  tenor?: string;
  dpd?: string;
  npaStage?: string;
  vipId?: string;
  maturity?: string;
  bucketString?: string;
  sizeOfList?: number;
  legal?: string;
  repossession?: string;
  legalAllocated?: string;
  emiPrincipal?: string;
  customerMobile2?: string;
  lastPaymentDate?: string;
  customerEntity?: string;
  netCapitalExposure?: string;
  sarfaesi?: string;
}

export interface IDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  header?: boolean;
  sidebarWidth?: string;
  position?: "left" | "right";
  children: React.ReactNode;
}

export interface IDrawerComponentsProps {
  children?: React.ReactNode;
  renderFooter?: React.ReactNode;
  title: string;
  width?: string;
  isModalOpen: boolean;
  closeModal: () => void;
  submitHandler?: () => void;
  resetForm?: () => void;
  setSelState?: (value: string) => void;
}

export interface IShowErrorProps {
  ErrorMessage: string[];
  error: Error | null;
}

export interface IErrorValidationProps {
  errors: FieldError;
}

export interface IAppBarProps {
  children?: React.ReactNode;
  variants?: ThemingProps;
}
export interface LeftHeaderProps {
  isDrawerOpen: boolean;
}

export type HeaderAnchor = null | Element | ((element: Element) => Element);

export interface IRightHeaderProps {
  mobileMoreAnchorEl: HeaderAnchor;
  isMobileMenuOpen: boolean;
  mobileMenuId: string;
  handleMobileMenuClose: () => void;
  caseCode: string;
  caseid: string;
  notificationDate: string;
  customerName: string;
  notification: string;
}

export interface IHeaderProps {
  isDrawerOpen: boolean;
  handleDrawerToggle: () => void;
}
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile_no2: string;
  queueId: { label: string; value: string } | null;
  source: { label: string; value: string } | null;
  campaign: { label: string; value: string } | null;
  allocateTo: { label: string; value: string } | null;
}

export interface ITextInputProps {
  name: string;
  control: Control<TFieldValues, TContext>;
  type: string;
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  startIcon?: React.ReactNode;
  endIcons?: React.ReactNode;
  disabled?: boolean;
  onIconClick?: () => void;
  variant?: string;
  noFloating?: boolean;
  onCustomChange?: () => void;
  regex?: string;
  maxLength?: number;
  isCommaSepratedRequired?: boolean;
  isSubmitClicked?: boolean;
  isRegexRequired?: boolean;
}

export interface ILayoutWrapper {
  children: React.ReactNode;
}

export interface IReallocationFormStateProp {
  toQueue?: string;
  allocateTo?: string;
  remark?: string;
}

export interface IReallocationProps {
  allLeadDetails: Array<any>;
}

export interface IModal {
  children?: ReactNode;
  renderFooter?: () => ReactNode;
  title: string;
  isModalOpen: boolean;
  closeModal: () => void;
  modalSize?: "modal-xl" | "modal-md" | "modal-sm";
  height?: string;
  width?: string;
  overflowY?: "auto" | "visible";
  submitHandler?: (e: React.FormEvent<HTMLFormElement>) => void;
  maxwidth?: boolean;
}
export interface Props<
  Option,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsMulti extends boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Group extends GroupBase<Option>
> {
  size?: "sm" | "md" | "lg";

  /** If the Select Component has Custom Label Component */

  register: UseFormRegister<TFieldValues>;
  hasInputAddon?: boolean;
  hideDropdownArrow?: boolean;
  hideSelectedValues?: boolean;
  hideContainerBorder?: boolean;
  isSingleTimeDropdown?: boolean;
  disableLeftPaddingInValueContainer?: boolean;
  isParticipantGroupContainer?: boolean;
  inheritMultiValueBG?: boolean;
  disableMultiValueRemove?: boolean;
  inheritControlBG?: boolean;
  rules?: RegistrationOptions;
  setValue: UseFormSetValue<TFieldValues>;

  isDisabled?: boolean;
}

export type ISelectProps = Props & {
  size?: "sm" | "md" | "lg";
  name: string;
  defaultValue?: null | any;
  control?: Control<TFieldValues, TContext>;
  hideError?: boolean;
  placeholder?: string;
  onCustomChange?: (e) => void;
  label?: string;
  isRequired?: boolean;
  helperText?: string;
  ref?: Ref;

  size?: "sm" | "md" | "lg";
};

export interface ISidebarProps {
  navSize: string;
  handleDrawerToggle: () => void;
}

export interface INavItemProps {
  icon: ReactNode | undefined;
  title: string;
  description?: string;
  active?: boolean;
  navSize: string;
  visible: boolean;
  to: string;
  click?: () => void;
  iconActive: any | undefined;
}

export interface INavItemProps2 {
  icon: ReactNode | undefined;
  title: string;
  description?: string;
  active?: boolean;
  navSize: string;
  visible: boolean;
  child: any[];
  iconChild: string;
  click?: () => void;
  iconActive: any | undefined;
}
export interface DatepickerStyleProps {
  noBorder?: boolean;
}
export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  hasError: boolean;
}
export interface IShowError {
  ErrorMessage: string;
  error: number;
  onInputNavigate?: () => void;
}
