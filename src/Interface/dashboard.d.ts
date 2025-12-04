export interface ISearchFormProps {
  searchData: string;
  setSearchData: Dispatch<SetStateAction<any>>;
  setAllID: Dispatch<SetStateAction<any>>;
  setDashboardMasterList: Dispatch<SetStateAction<any>>;
  dashboardMasterList: Dispatch<SetStateAction<any>>;
  setDashboarData: Dispatch<SetStateAction<any>>;
  setDashboardRequestBody: Dispatch<SetStateAction<any>>;
  setResetDropValue: Dispatch<SetStateAction<any>>;
  dashboardDataRefetch: MutableRefObject<(() => void) | undefined>;
  actionStage: string;
  sortOrderName: string;
  sortOrderId: string;
  sortByName: string;
  sortById: string;
  userName: string;
  userId: string;
  campaignName: string;
  campaignId: string;
  sourceName: string;
  sourceId: string;
  caseSourceId: string;
  subQueue: string;
  subQueueId: string;
  actionName: string;
  actionId: string;
  prodName: string;
  prodId: string;
  label: string;
  value: string;
  productName: string;
  productId: string;
  potencialName: string;
  potencialId: string;
  teamMemberName: string;
  teamMemberId: string;
  branchName: string;
  branchId: string;
}

export interface DashboardSearchFormProps {
  setSearchData: Dispatch<SetStateAction<any>>;
  setAllID: Dispatch<SetStateAction<any>>;
  setDashboardMasterList: Dispatch<SetStateAction<any>>;
  dashboardMasterList: Dispatch<SetStateAction<any>>;
  setDashboarData: Dispatch<SetStateAction<any>>;
  setDashboardRequestBody: Dispatch<SetStateAction<any>>;
  setResetDropValue: Dispatch<SetStateAction<any>>;
  dashboardDataRefetch: MutableRefObject<(() => void) | undefined>;
}

export interface IChartsProps {
  dashboardData: any;
  dashboardMasterList: any;
  resetDropValue: Dispatch<SetStateAction<any>>;

}