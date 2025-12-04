export interface IUserDetail {
  userId: string
  companyId: string
  actionId: string
}

export interface IDeviceDetail {
  platform: string
  OSName: string
  OSVers: string
  browserName: string
  browserVer: string
  IP: string
  city: string
  countrycode: string
  date: string
  time: string
}

// master api types
export interface IMasterApiPayload {
  userDetail: IUserDetail,
  deviceDetail: IDeviceDetail,
}

// manage new lead api types
export interface ListAddress {
  destinationAddress?: string
  mailingAddress?: string
  addressType: string
  address: string
  flatNo: string
  addressId?: string
  company_name: string
  floorNo: string
  state: string
  city: string
  zipcode: string
  locality: string
  landmark: string
  " mobile_no1"?: string
  mobile_no2: string
  email: string
  landLine1: string
  landLine2: string
  fax: string
  phone1: string
  phone2?: string
  occupancyStatus: string
  occupancyMm: string
  occupancyYr: string
  ext1: string
  ext2: string
  email_Id: string
  marketvalue: number
  currentareaYr: number
  gstinno: number
  oldaddress: string
  bussinessestbyr: string
  std1: string
  std2: string
  cityName: string
  mobile_no1?: string
}

export interface ListKeyContact {
  address: string
  buildingName: string
  caseId: string
  city: string
  contactTypeId: string
  createdBy: string
  createdDate: string
  createdSysDate: string
  email: string
  ext1: string
  ext2: string
  firmName: string
  flatNo: number
  floorNo: number
  fname: string
  keyContactId: string
  landmark: string
  lname: string
  locality: string
  mname: string
  mobile: string
  personalDtlId: string
  phone1: number
  phone2: number
  state: string
  zipcode: number
}

export interface NewLeadDetail {
  adhaarNumber: string
  affordableEmi: string
  allocateTo: string
  annualIncome: string
  annualSalesTurnOver: string
  authSignatoryFName: string
  authSignatoryLName: string
  authSignatoryMName: string
  bonusIncentive: string
  branch: string
  campaign: string
  cluster: string
  clusterForNI: string
  companyName: string
  constitution: string
  corpSalaryAcount: string
  dateOfIncorparation: string
  depreciation: string
  designation: string
  directorSalary: string
  dob: string
  entityType: string
  firstName: string
  gender: string
  grossMonthlyIncome: string
  grossProfit: string
  industry: string
  industryForNI: string
  interesrPaidOnLoan: string
  lastName: string
  listAddress: ListAddress[]
  listKeyContact: ListKeyContact[]
  loanAmount: string
  maritalStatus: string
  salutation: string
  middleName: string
  modeOfSalary: string
  monthlyRentalIncome: string
  nationality: string
  netMonthlyIncome: string
  netProfitAtTax: string
  netWorth: string
  noOfDependents: string
  occupationType: string
  otherAnnualIncome: string
  otherCompanyName: string
  pan: string
  productId: string
  purposeOfLoan: string
  queueId: string
  referenceName: string
  referenceNumber: string
  scheme: string
  sector: string
  sectorForNI: string
  source: string
  stage: string
  stageForNI: string
  tenure: string
  typeOfBusiness: string
  typeOfBusinessForNI: string
  userId: string
  workExperiance: string
  yearOfCurrJob: string
}

export interface IManageNewLeadRequestData {
  requestType: string
  newLeadDetail: NewLeadDetail
}
export interface IManageNewLeadApiPayload extends IMasterApiPayload {
  requestData: IManageNewLeadRequestData
}