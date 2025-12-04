import { addBaseUrl, ApiInterface } from "@mifin/utils/addBaseUrl";

// const baseUrl = `${import.meta.env.VITE_APP_BACKEND_API}${
//   import.meta.env.VITE_APP_PUBLIC_URL
// }`;

const baseUrl = `${import.meta.env.VITE_APP_BACKEND_API}`;

let api: ApiInterface = {
  login: "/miFINLeadManagement/logIn/loginAutentication.do",
  getMasterList: "/miFINLeadManagementWS/common/getMasters",
  getAllocateCase: "/miFINLeadManagementWS/searchAndAllocate/getcases",
  dailyActivity: "/miFINLeadManagementWS/travelSummary/dailyActivity",
  getLeadList: "/miFINLeadManagementWS/worklist1/getLeadsDetails",
  reallocation: "/miFINLeadManagementWS/worklist1/saveAllocatedLead",
  nextPrevLead: "/miFINLeadManagementWS/newLead/previousNextLead",
  contactRecord: "/miFINLeadManagementWS/contact/saveContact",
  contactDetail: "/miFINLeadManagementWS/contact/showcontact",
  customerDetails: "/miFINLeadManagementWS/customer/showCustomer",
  customerRecord: "/miFINLeadManagementWS/customer/saveCustomer",
  leadSearch: "/miFINLeadManagementWS/newLead/checkLeadAvail",
  productDetail: "/miFINLeadManagementWS/product/showProduct",
  saveProduct: "/miFINLeadManagementWS/product/productSaveAndExit",
  convertToCustomer: "/miFINLeadManagementWS/product/convertToCustomer",
  dailyReport: "/miFINLeadManagementWS/travelSummary/getActivity",
  searchDailyReport: "/miFINLeadManagementWS/travelSummary/getSummary",
  // collection module api different from lead module api's
  getDunning: "/miFINCollection/dunning/getDunning.do",
  getAllNewMasters: "/miFINLeadManagementWS/common/getAllNewMasters",
  manageNewLead: "/miFINLeadManagementWS/newLead/manageNewLead",
  getCitiesByState: "/miFINLeadManagementWS/newLead/getCitiesByState",
  help: "/miFINLeadManagementWS/contact/help",
  referCase: "/miFINLeadManagementWS/contact/referCase",
  leadEscalation: "/miFINLeadManagementWS/contact/leadEscalation",
  getNotififactionDetails: "/miFINLeadManagementWS/notification/getNotififactionDetails",
  getDependentMaster: "/miFINLeadManagementWS/customer/getDependentMaster",
  saveAllocatedSearched:"/miFINLeadManagementWS/searchAndAllocate/saveAllotedcases",
  // getAllNewMasters: "/common/getAllNewMasters.do",
  getNewTehsilByCity: "/miFINLeadManagementWS/newLead/getTehsilByCity",
  getNewPincodeByTehsil: "/miFINLeadManagementWS/newLead/getPincodeByTehsil",
  getDashboardMasters:"/miFINLeadManagementWS/dashboard/getDashboardMasters",
  getDashboardData: "/miFINLeadManagementWS/dashboard/getDashboardData",
};

api = addBaseUrl(api, baseUrl);

export { api };

export interface MifinResponse<T = any> {
  responseData?: T;
  leadList?: T;
  statusInfo: 0 | 1;
  status: number;
  message: string;
}
