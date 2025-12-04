import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import En from "./en.json";
import Hi from "./hi.json";

export const lngs = ["en", "hi"] as const;
export const resources = {
  en: {
    translation: En,
  },
  hi: {
    translation: Hi,
  },
};

i18n.use(initReactI18next).init({
  lng: "en",
  supportedLngs: lngs,
  fallbackLng: "en",
  resources,
  keySeparator: ".",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
