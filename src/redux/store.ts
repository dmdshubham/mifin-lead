import { configureStore } from "@reduxjs/toolkit";
import storageSession from "reduxjs-toolkit-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import helpReducer from "@mifin/redux/service/help/helpSlice";
import leadEscalationReducer from "@mifin/redux/service/leadEscalation";
import getNotificationDetailsReducer from "@mifin/redux/service/getNotificationDetails";
import languageReducer from "@mifin/redux/features/languageSlice";
import manageNewLeadReducer from "@mifin/redux/service/manageNewLead";
import referCaseReducer from "@mifin/redux/service/referCase";
import saveContactReducer from "@mifin/redux/service/saveContact";
import showContactReducer from "@mifin/redux/service/showContact";
import showCustomerReducer from "@mifin/redux/service/showCustomer";
import getWorkListLeadDetailsReducer from "@mifin/redux/service/worklistGetLeadDetails";
import workListLeadDetailsReducer from "@mifin/redux/service/worklistLeadDetails";
import updateLeadIdReducer from "@mifin/redux/features/updateLeadIdSlice";
import saveAllocatedReducer from "@mifin/redux/service/saveAllocated";
import convertToCustomerReducer from "@mifin/redux/service/convertToCustomer";
import showProductReducer from "@mifin/redux/service/showProduct";
import getDependentMasterReducer from "@mifin/redux/service/getDependentMaster";
import getCitiesByStateReducer from "@mifin/redux/service/getCitiesByState";
import getPincodeByCityReducer from "@mifin/redux/service/getPinCodeByCity";
import productSaveandExitReducer from "@mifin/redux/service/productSaveAndExit";
import saveCustomerReducer from "@mifin/redux/service/saveCustomer";
import setAgeReducer from "@mifin/redux/features/setAgeSlice";
import nextPrevLeadReducer from "@mifin/redux/service/nextPrevLead";
import leadSearchReducer from "@mifin/redux/service/leadSearch";
import applicantInfoReducer from "@mifin/redux/features/applicantInfoSlice";
import saveAllocateSearched from "@mifin/redux/service/saveAllocatedSearch";
import leadHeaderDetailSliceReducer from "@mifin/redux/features/leadHeaderDetailSlice";
import isEscalatedScreenReducer from "@mifin/redux/features/isEscalatedScreen";
import contactDataReducer from "@mifin/redux/features/contactDataSlice";
import saveEscalatedLeadReducer from "./service/saveEscalatedLead";
import getTehsilByCityReducer from "@mifin/redux/service/getTehsilByCity";
import getPincodeByTehsilReducer from "@mifin/redux/service/getPincodeByTehsil";
import isReferedScreenReducer from "@mifin/redux/features/isReferedScreen";
const persistStoreConfig = {
  updateLeadId: {
    key: "updateLeadId",
    storage: storageSession,
  },
  updateLeadHeaders: {
    key: "leadHeaderDetail",
    storage: storageSession,
  },
  isEscalated: {
    key: "isEsclated",
    storage: storageSession,
  },
  isRefered: {
    key: "isRefered",
    storage: storageSession,
  },
  contactData: {
    key: "contactData",
    storage: storageSession,
  },
};



export const store = configureStore({
  reducer: {
    leadDetails: workListLeadDetailsReducer,
    getLeadDetails: getWorkListLeadDetailsReducer,
    manageNewLead: manageNewLeadReducer,
    localisation: languageReducer,
    saveContact: saveContactReducer,
    showContact: showContactReducer,
    help: helpReducer,
    leadEscalation: leadEscalationReducer,
    referCase: referCaseReducer,
    showCustomer: showCustomerReducer,
    saveCustomer: saveCustomerReducer,
    getNotificationDetails: getNotificationDetailsReducer,
    saveAllocated: saveAllocatedReducer,
    convertToCustomer: convertToCustomerReducer,
    showProduct: showProductReducer,
    getDependentMaster: getDependentMasterReducer,
    getCitiesByState: getCitiesByStateReducer,
    getPincodeByCity: getPincodeByCityReducer,
    productSaveandExit: productSaveandExitReducer,
    setAge: setAgeReducer,
    nextPrevLead: nextPrevLeadReducer,
    leadSearch: leadSearchReducer,
    applicantInfo: applicantInfoReducer,
    saveAllocatedCase: saveAllocateSearched,
    saveEscalatedLead: saveEscalatedLeadReducer,
    getTehsilByCity: getTehsilByCityReducer,
    getPincodeByTehsil: getPincodeByTehsilReducer,
    // redux slice persisted into session storage to avoid deleting on refresh
    getLeadId: persistReducer<any, any>(
      persistStoreConfig.updateLeadId,
      updateLeadIdReducer
    ),
    leadHeaderDetails: persistReducer<any, any>(
      persistStoreConfig.updateLeadHeaders,
      leadHeaderDetailSliceReducer
    ),
    isEscalated: persistReducer<any, any>(
      persistStoreConfig.isEscalated,
      isEscalatedScreenReducer
    ),
    isRefered: persistReducer<any, any>(
      persistStoreConfig.isRefered,
      isReferedScreenReducer
    ),
    contactData: persistReducer<any, any>(
      persistStoreConfig.contactData,
      contactDataReducer
    ),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
