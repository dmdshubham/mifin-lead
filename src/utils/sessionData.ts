import { useLocation } from "react-router";

export const getProspectId = () => sessionStorage.getItem("prospectId");

export const getProspectNo = () => sessionStorage.getItem("prospectNo");

export const getApplicantCode = () => sessionStorage.getItem("applicantCode");

export const getBusinessData = () => sessionStorage.getItem("BusinessDate");

export const getValuationId = () => sessionStorage.getItem("valuationId");
const getCurrentPageValue = () => {
  const location = useLocation();

  const appStageChangeOpts = JSON.parse(
    sessionStorage?.getItem("appChangeOptions") as string
  );

  // for applicant stage change
  const currentPageValue = appStageChangeOpts?.find(
    (x: any) => x?.urlLabel === location.pathname
  )?.value;

  return currentPageValue;
};

export default getCurrentPageValue;

export const getCustomerId = () =>
  JSON.parse(sessionStorage.getItem("customerId") as any);

export const getUserId = () =>
  JSON.parse(sessionStorage.getItem("userInfo") as any)?.userId || "";
export const getUserDetails = () =>
  JSON.parse(sessionStorage.getItem("userInfo") as any) || "";

export const getLastLoginDetails = () =>
  JSON.parse(sessionStorage.getItem("userInfo") as any)?.lastLoginInfo || "";

export const getUserLoginId= () =>
  JSON.parse(sessionStorage.getItem("userInfo") as any)?.userLoginId || "";

export const getCurrentUserInfo = () =>
  JSON.parse(sessionStorage.getItem("userInfo") as any)?.state || {};

export const getCurrentLoanAmount = () =>
  JSON.parse(sessionStorage.getItem("loanAmount") as any);

export const getAuditStatus = () => sessionStorage.getItem("isAuditActive");
