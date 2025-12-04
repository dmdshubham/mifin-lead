// import { IUserDetail, IDeviceDetail } from "@mifin/Interface/apiPayloadType";

/***
type saftey is added to avoid passed missing or mismated data type of object elements
****/
const getUserDetail = () => {
  const userDetail = sessionStorage.getItem("userInfo");
  if (userDetail) {
    const parsedUserDetail = JSON.parse(userDetail);
    // return JSON.parse(userDetail);
   return {
      ...parsedUserDetail,
      companyId: "1000000001",
    };
  }
  return {
    userId: "1100000421",
    companyId: "1000000001",
    actionId: "1000000002",
    userLoginId: "SALES_AGENT2",
    userName: "SALES_AGENT2",
  };
};
const getDeviceDetail = () => {
  const deviceDetail = sessionStorage.getItem("deviceDetail");
  if (deviceDetail) {
    return JSON.parse(deviceDetail);
  }
  return {
    platform: "win32",
    OSName: "",
    OSVers: "",
    browserName: "",
    browserVer: "",
    IP: "192.168.1.1",
    city: "1000000001",
    countrycode: "",
    date: "",
    time: "",
  };
};

const MASTER_PAYLOAD = {
  userDetail: getUserDetail(),
  deviceDetail: getDeviceDetail(),
};

export { MASTER_PAYLOAD };
