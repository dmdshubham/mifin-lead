import {
  useAuthentication,
  useLogoutMutation,
} from "@mifin/service/mifin-auth";
import { useEffect } from "react";

/* hard coaded user and device details
   for the api payload 
*/
const defaultUserInfo = {
  userId: "1100000421",
  companyId: "1000000001",
  actionId: "1000000002",
  userLoginId: "SALES_AGENT2",
  userName: "SALES_AGENT2",
  userFirstName: "SALES_AGENT2",
  lastLoginInfo: "07.NOV.2023 12:58 PM",
};

const defaultDeviceDetail = {
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

const useSetDefaultUserInfo = () => {
  const { data: isAuthenticated } = useAuthentication();
  const { mutate: logoutUser } = useLogoutMutation();
  useEffect(() => {
    const getUserInfo = () => Boolean(sessionStorage.getItem("userInfo"));

    const getDeviceDetail = () =>
      Boolean(sessionStorage.getItem("deviceDetail"));
    if (!getDeviceDetail()) {
      sessionStorage.setItem(
        "deviceDetail",
        JSON.stringify(defaultDeviceDetail)
      );
    }
    if (!getUserInfo()) {
      sessionStorage.setItem("userInfo", JSON.stringify(defaultUserInfo));
    }
  }, [isAuthenticated, logoutUser]);
};

export default useSetDefaultUserInfo;
