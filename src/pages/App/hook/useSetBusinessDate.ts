import {
  useAuthentication,
  useLogoutMutation,
} from "@mifin/service/mifin-auth";
import { getBusinessData } from "@mifin/utils/sessionData";
import { useEffect, useState } from "react";

/* hard coaded business date in case
   business date is missing in session storage
*/
const BUSINESS_DATE = "08-JUN-2026";

const useSetBusinessDate = () => {
  const { data: isAuthenticated } = useAuthentication();
  const { mutate: logoutUser } = useLogoutMutation();
  const [businessDataState] = useState(true);
  const getBusinessDate = () => Boolean(sessionStorage.getItem("BusinessDate"));

  const setBusinessDate = () => {
    const date = JSON.stringify(BUSINESS_DATE);
    if (!getBusinessDate()) {
      sessionStorage.setItem("BusinessDate", date);
    }
  };

  useEffect(() => {
    if (businessDataState) {
      setBusinessDate();
    }
  }, [businessDataState]);

  useEffect(() => {
    if (getBusinessData()) {
      setBusinessDate();
    }
  }, [isAuthenticated, logoutUser]);
};

export default useSetBusinessDate;
