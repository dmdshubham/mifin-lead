import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useSetCurrentPathName = () => {
  const location = useLocation();

  useEffect(() => {
    sessionStorage.setItem("location", location.pathname);
  }, [location]);
};

export default useSetCurrentPathName;
