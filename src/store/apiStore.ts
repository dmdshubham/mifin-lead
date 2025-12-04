import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IMasterData {
  userDetail: {
    userId: string;
    companyId: string;
    actionId: string;
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
}

const detectOperatingSystem = () => {
  let OSName = "unknown";

  if (window.navigator.userAgent.indexOf("Win") !== -1) {
    OSName = "Windows";
  }

  if (window.navigator.userAgent.indexOf("Mac") !== -1) {
    OSName = "MacOS";
  }

  if (window.navigator.userAgent.indexOf("Linux") !== -1) {
    OSName = "Linux";
  }

  if (window.navigator.userAgent.indexOf("X11") !== -1) {
    OSName = "UNIX";
  }

  return OSName;
};

const masterBody = {
  userDetail: {
    userId: "1100000421",
    companyId: "1000000001",
    actionId: "1000000002",
  },
  deviceDetail: {
    platform: detectOperatingSystem(),
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

const userInfo = {
  userDetail: {
    userId: "1100000420",
    companyId: "1000000001",
    actionId: "1000000002",
    actionId4: "1000000002",
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
  requestData: {
    leadDetail: null,
  },
};

const reallocation_body = {
  userDetail: {
    userId: "1100000400",
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

const useSearchStore = create<{
  // type of master api request body
  userDetails: any;
  searchDetails: any;
  reallocationDetails: any;
  updateSearchDetails: (data: any) => void;
  // type of get cases api request body (save allocate screen)
}>()(
  persist(
    set => ({
      userDetails: userInfo,
       reallocationDetails: reallocation_body,
      searchDetails: {
        ...userInfo,
        requestData: {
          iDisplayStart: "0",
          iDisplayLength: "10",
          sEcho: "1",
          leadsSearchDetail: {
            requestType: "search",
            mobile: "",
            email: "",
            name: "",
            caseId: "",
            leadState: "",
            escalationRef: "MYLEAD",
            queue: "",
            subqueue: "",
            disposition: "",
            actionId: "",
            allocate: "",
            amountTo: "",
            amountFrom: "",
            source: "",
            sort1: "-1",
            sort2: "-1",
            sort3: "-1",
            currentPosition: 10,
            maxResult: 0,
            sortOrder: "-1",
            caseCode: "",
            company: "",
            id: "",
            campaign: "",
            team: "",
            syncDate: "",
            branch: "",
          },
        },
      },
      updateSearchDetails: data =>
        set(state => ({
          userDetails: {
            ...state.userDetails,
          },
          searchDetails: {
            ...state.userDetails,
            requestData: {
              iDisplayStart: "0",
              iDisplayLength: "10",
              sEcho: "1",
              leadsSearchDetail: data,
            },
          },
        })),
    }),

    {
      name: "search-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const useApiStore = create<{
  // type of master api request body
  masterDetails: IMasterData;
  userDetails: any;

  // type of get cases api request body (save allocate screen)
  getCases: IMasterData & {
    requestData: {
      type: string;
      userId: string;
    };
  };

  // type of the save allocate api request body (save-Allocate screen)
  saveAllocate: IMasterData & {
    requestData: {
      flag: string;
      SearchAndAllocateForm: {
        searchAndAllocateDto: [
          {
            queueId: string;
            subQueueId: string;
            sourceId: string;
            campaignId: string;
            allotedList: string;
            dnd: string;
            noOfCase: string;
            allocate: string;
          }
        ];
      };
    };
  };
}>()(
  persist(
    set => ({
      masterDetails: masterBody,
      userDetails: userInfo,
      getCases: {
        ...masterBody,
        requestData: {
          type: "alloted",
          userId: "",
        },
      },

      saveAllocate: {
        ...masterBody,
        requestData: {
          flag: "A",
          SearchAndAllocateForm: {
            searchAndAllocateDto: [
              {
                queueId: "1000000282",
                subQueueId: "1000000001",
                sourceId: "6",
                campaignId: "1000000002",
                allotedList: "1100000421",
                dnd: "N",
                noOfCase: "1",
                allocate: "1100000423",
              },
            ],
          },
        },
      },
      searchDetails: {
        ...userInfo,
        requestData: {
          iDisplayStart: "0",
          iDisplayLength: "10",
          sEcho: "1",
          leadsSearchDetail: {
            requestType: "search",
            mobile: "",
            email: "",
            name: "",
            caseId: "",
            leadState: "",
            escalationRef: "MYLEAD",
            queue: "",
            subqueue: "",
            disposition: "",
            actionId: "",
            allocate: "",
            amountTo: "",
            amountFrom: "",
            source: "",
            sort1: "-1",
            sort2: "-1",
            sort3: "-1",
            currentPosition: 10,
            maxResult: 0,
            sortOrder: "-1",
            caseCode: "",
            company: "",
            id: "",
            campaign: "",
            team: "",
            syncDate: "",
            branch: "",
          },
        },
      },

      updateSearchAndAllocate: (data: string) =>
        set(state => ({
          masterDetails: {
            ...state.masterDetails,
          },
          getCases: {
            ...state.masterDetails,
            requestData: {
              type: "alloted",
              userId: data,
            },
          },
          saveAllocate: {
            ...state.masterDetails,
            requestData: {
              flag: "A",
              SearchAndAllocateForm: {
                searchAndAllocateDto: [
                  {
                    queueId: "1000000282",
                    subQueueId: "1000000001",
                    sourceId: "6",
                    campaignId: "1000000002",
                    allotedList: "1100000421",
                    dnd: "N",
                    noOfCase: "1",
                    allocate: "1100000423",
                  },
                ],
              },
            },
          },
        })),
    }),
    {
      name: "api-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useApiStore, useSearchStore };
