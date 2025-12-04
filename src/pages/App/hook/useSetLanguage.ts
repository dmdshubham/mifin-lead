import { useEffect } from "react";
import { useI18nLng } from "@mifin/store/i18n";
import i18n from "@mifin/translations";

const useSetLanguage = () => {
  const lng = useI18nLng(state => state.lng);
  
  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng]);
};

export default useSetLanguage;
