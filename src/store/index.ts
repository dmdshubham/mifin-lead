import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserInfo {
  userDetail: {
    userId: string;
    companyId: string;
    actionId: string;
    businessDate: string;
  };
  deviceDetail: {
    platform: string;
    OSName: string;
    OSVers: string;
    browserName: string;
    browserVer: string;
    IP: string;
    city: string;
    countrycode: string;
    date: string;
    time: string;
  };
  requestData?: {
    leadDetail: null | {
      caseId: string;
      prospectCode?: string;
      prospectId: string;
      productId?: string;
      customerId?: string;
      queueId?: string;
    };
  };
}

// let OSName = "Unknown OS";

// if (window.navigator.appVersion.indexOf("Win") !== -1) OSName = "Windows";
// if (window.navigator.appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
// if (window.navigator.appVersion.indexOf("X11") !== -1) OSName = "UNIX";
// if (window.navigator.appVersion.indexOf("Linux") !== -1) OSName = "Linux";

export const useUserList = create()(set => ({
  lists: [],
  updateList: (lists: any) => {
    return set((state: any) => {
      return (state.lists = lists);
    });
  },
}));

const userInfo = {
  userDetail: {
    userId: "1100000421",
    companyId: "1000000001",
    actionId: "1000000002",
  },
  deviceDetail: {
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
  },
};

export const useUserStore = create<{
  userInfo: UserInfo;
  downloadDocInfo: UserInfo & {
    requestData: {
      docTypeId: string;
      docId: string;
      lms: string;
    };
  };
  deleteDocInfo: UserInfo & {
    requestData: {
      documentForm: {
        documentList: [
          {
            documentTypeId: string;
            docId: string;
          }
        ];
      };
    };
  };
  updateUserLeadInfo: (info: UserInfo["requestData"]["leadDetail"]) => void;
}>()(
  persist(
    set => ({
      userInfo: userInfo,
      downloadDocInfo: {
        ...userInfo,
        requestData: {
          ...userInfo.requestData,
          docTypeId: "",
          docId: "",
          lms: "",
        },
      },
      deleteDocInfo: {
        ...userInfo,
        requestData: {
          ...userInfo.requestData,
          documentForm: {
            documentList: [
              {
                documentTypeId: "",
                docId: "",
              },
            ],
          },
        },
      },
      updateUserLeadInfo: info =>
        set(state => ({
          userInfo: {
            ...state.userInfo,
            requestData: { ...state.userInfo.requestData, leadDetail: info },
          },
          downloadDocInfo: {
            ...state.userInfo,
            requestData: {
              ...state.userInfo.requestData,
              docTypeId: "",
              docId: "",
              lms: "",
              leadDetail: null,
            },
          },
          deleteDocInfo: {
            ...state.userInfo,
            requestData: {
              ...state.userInfo.requestData,
              leadDetail: info,
              documentForm: {
                documentList: [
                  {
                    documentTypeId: "",
                    docId: "",
                  },
                ],
              },
            },
          },
        })),
    }),
    {
      name: "user-info",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
